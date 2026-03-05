
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  Camera,
  ChevronLeft,
  Navigation,
  Target,
  Stars,
  Upload
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { generateProfileBio } from "@/ai/flows/ai-generate-profile-bio";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";

const INTEREST_OPTIONS = [
  "Фотография", "Путешествия", "Кофе", "Музыка", "Спорт", "Искусство", "Кино", "Йога", "Бизнес", "Игры",
  "Собаки", "Кошки", "Жаворонок", "Сова"
];

const GENDER_OPTIONS = [
  { id: 'male', labelKey: 'onboarding.step1.male' },
  { id: 'female', labelKey: 'onboarding.step1.female' }
];

const DATING_GOALS = [
  "Серьезные отношения",
  "Свидания",
  "Новые друзья",
  "Просто общение",
  "Пока не знаю"
];

const ZODIAC_SIGNS = [
  "Овен", "Телец", "Близнецы", "Рак", "Лев", "Дева", 
  "Весы", "Скорпион", "Стрелец", "Козерог", "Водолей", "Рыбы"
];

export default function OnboardingPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState({
    gender: "",
    name: "",
    age: "",
    city: "",
    height: "",
    datingGoal: "",
    zodiac: "",
    interests: [] as string[],
    bio: "",
    photo: PlaceHolderImages[10].imageUrl
  });

  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
    else handleFinish();
  };

  const skipStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: t('onboarding.loc.fail'), variant: "destructive" });
      return;
    }

    setIsDetectingLocation(true);
    toast({ title: t('onboarding.loc.detecting') });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=10`
          );
          const data = await response.json();
          const city = data.address.city || data.address.town || data.address.village || data.address.state || "";
          
          if (city) {
            setFormData(prev => ({ ...prev, city }));
            toast({ title: `${t('onboarding.loc.success')}${city}` });
          } else {
            toast({ title: t('onboarding.loc.fail'), variant: "destructive" });
          }
        } catch (error) {
          toast({ title: t('onboarding.loc.fail'), variant: "destructive" });
        } finally {
          setIsDetectingLocation(false);
        }
      },
      () => {
        setIsDetectingLocation(false);
        toast({ title: t('onboarding.loc.denied'), variant: "destructive" });
      }
    );
  };

  const handleGenerateBio = async () => {
    if (formData.interests.length === 0) {
      toast({ title: t('onboarding.step4.desc') });
      return;
    }
    setIsGeneratingBio(true);
    try {
      const result = await generateProfileBio({ keywords: formData.interests });
      setFormData(prev => ({ ...prev, bio: result.bio }));
      toast({ title: t('onboarding.toast.bio_ai') });
    } catch (error) {
      toast({ variant: "destructive", title: "AI Error" });
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
        setIsUploading(false);
        toast({
          title: t('onboarding.toast.photo_added'),
          description: t('onboarding.toast.photo_desc'),
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinish = () => {
    toast({
      title: t('onboarding.toast.finish_title'),
      description: t('onboarding.toast.finish_desc'),
    });
    router.push("/");
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-black font-headline tracking-tight">{t('onboarding.step1.title')}</h2>
              <p className="text-muted-foreground text-sm">{t('onboarding.step1.desc')}</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('onboarding.step1.label')}</Label>
                <Input 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder={t('onboarding.step1.placeholder')}
                  className="h-14 rounded-2xl bg-muted/30 border-0 focus-visible:ring-primary/20 font-bold px-6"
                />
              </div>
              <div className="space-y-2 pt-4">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('onboarding.step1.gender_label')}</Label>
                <div className="grid grid-cols-1 gap-3">
                  {GENDER_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setFormData({...formData, gender: opt.id})}
                      className={cn(
                        "h-14 rounded-2xl border-2 transition-all font-bold flex items-center px-6 gap-3",
                        formData.gender === opt.id 
                          ? "border-primary bg-primary/5 text-primary" 
                          : "border-muted text-muted-foreground bg-transparent"
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                        formData.gender === opt.id ? "border-primary bg-primary" : "border-muted"
                      )}>
                        {formData.gender === opt.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                      {t(opt.labelKey)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-black font-headline tracking-tight">{t('onboarding.step2.title')}</h2>
              <p className="text-muted-foreground text-sm">{t('onboarding.step2.desc')}</p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('onboarding.step2.age')}</Label>
                  <Input 
                    type="number"
                    value={formData.age} 
                    onChange={e => setFormData({...formData, age: e.target.value})}
                    placeholder="25"
                    className="h-14 rounded-2xl bg-muted/30 border-0 focus-visible:ring-primary/20 font-bold px-6"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('onboarding.step2.height')}</Label>
                  <Input 
                    type="number"
                    value={formData.height} 
                    onChange={e => setFormData({...formData, height: e.target.value})}
                    placeholder="175"
                    className="h-14 rounded-2xl bg-muted/30 border-0 focus-visible:ring-primary/20 font-bold px-6"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('onboarding.step2.city')}</Label>
                </div>
                <div className="relative">
                  <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" size={20} />
                  <Input 
                    value={formData.city} 
                    onChange={e => setFormData({...formData, city: e.target.value})}
                    placeholder={t('onboarding.step2.city_placeholder')}
                    className="h-14 pl-14 pr-16 rounded-2xl bg-muted/30 border-0 focus-visible:ring-primary/20 font-bold"
                  />
                  <button 
                    onClick={handleDetectLocation}
                    disabled={isDetectingLocation}
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-primary hover:bg-primary/5 p-2 rounded-xl transition-colors active:scale-90"
                    title="Detect City"
                  >
                    <Navigation size={20} className={cn(isDetectingLocation && "animate-pulse")} fill={isDetectingLocation ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-black font-headline tracking-tight">{t('onboarding.step3.title')}</h2>
              <p className="text-muted-foreground text-sm">{t('onboarding.step3.desc')}</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                  <Target size={14} className="text-primary" /> {t('onboarding.step3.goal_label')}
                </Label>
                <Select value={formData.datingGoal} onValueChange={(val) => setFormData({...formData, datingGoal: val})}>
                  <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-0 font-bold px-6">
                    <SelectValue placeholder={t('onboarding.step3.goal_placeholder')} />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-0 shadow-2xl">
                    {DATING_GOALS.map(goal => (
                      <SelectItem key={goal} value={goal} className="font-bold py-3">
                        {t(goal)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                  <Stars size={14} className="text-primary" /> {t('onboarding.step3.zodiac_label')}
                </Label>
                <Select value={formData.zodiac} onValueChange={(val) => setFormData({...formData, zodiac: val})}>
                  <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-0 font-bold px-6">
                    <SelectValue placeholder={t('onboarding.step3.zodiac_placeholder')} />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-0 shadow-2xl">
                    {ZODIAC_SIGNS.map(sign => (
                      <SelectItem key={sign} value={sign} className="font-bold py-3">
                        {t(sign)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-black font-headline tracking-tight">{t('onboarding.step4.title')}</h2>
              <p className="text-muted-foreground text-sm">{t('onboarding.step4.desc')}</p>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {INTEREST_OPTIONS.map(interest => (
                <Badge 
                  key={interest} 
                  onClick={() => toggleInterest(interest)}
                  variant={formData.interests.includes(interest) ? "default" : "secondary"}
                  className={cn(
                    "cursor-pointer px-4 py-2.5 rounded-xl transition-all border-0 font-bold text-[10px] uppercase tracking-tight shadow-sm",
                    formData.interests.includes(interest) 
                      ? "gradient-bg text-white shadow-md" 
                      : "bg-muted text-muted-foreground hover:bg-border"
                  )}
                >
                  {t(interest)}
                </Badge>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-2 text-center">
              <div className="relative inline-block mx-auto mb-4">
                <div 
                  onClick={handleTriggerFileInput}
                  className="w-40 h-40 rounded-[2.5rem] border-[6px] border-white shadow-2xl overflow-hidden relative group cursor-pointer transition-transform active:scale-95"
                >
                  <Image src={formData.photo} alt="Me" fill className={cn("object-cover transition-all", isUploading && "blur-sm grayscale")} />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                    <Camera className="text-white mb-1" size={32} />
                    <span className="text-white text-[9px] font-black uppercase tracking-widest">{t('onboarding.step5.photo_label')}</span>
                  </div>
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/20">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleTriggerFileInput}
                  className="absolute -bottom-1 -right-1 bg-primary text-white p-3 rounded-2xl shadow-xl border-2 border-white hover:scale-110 transition-transform active:scale-90"
                >
                  <Upload size={18} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              <h2 className="text-3xl font-black font-headline tracking-tight">{t('onboarding.step5.title')}</h2>
              <p className="text-muted-foreground text-sm px-4">{t('onboarding.step5.desc')}</p>
            </div>
            
            <div className="bg-white rounded-[2rem] p-6 app-shadow border border-border/40 space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('onboarding.step5.bio_label')}</Label>
                <button 
                  onClick={handleGenerateBio}
                  disabled={isGeneratingBio}
                  className="text-[9px] font-black text-primary flex items-center gap-1.5 uppercase tracking-widest bg-primary/5 px-3 py-1.5 rounded-full hover:bg-primary/10 transition-colors shadow-sm"
                >
                  <Sparkles size={12} className={cn(isGeneratingBio && "animate-spin")} /> AI {t('button.save')}
                </button>
              </div>
              <Textarea 
                value={formData.bio}
                onChange={e => setFormData({...formData, bio: e.target.value})}
                placeholder={t('onboarding.step5.bio_placeholder')}
                className="min-h-[120px] rounded-2xl bg-muted/30 border-0 text-sm font-medium p-4 resize-none focus-visible:ring-primary/10"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const isStepValid = () => {
    if (step === 1) return formData.name.length > 1 && formData.gender !== "";
    if (step === 2) return formData.age !== "";
    if (step === 3) return formData.datingGoal !== "" || formData.zodiac !== "";
    if (step === 4) return formData.interests.length >= 1;
    if (step === 5) return formData.bio.length > 5;
    return true;
  };

  return (
    <div className="flex flex-col min-h-svh bg-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-muted z-50">
        <div 
          className="h-full gradient-bg transition-all duration-500 ease-out"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        ></div>
      </div>

      <header className="p-6 flex items-center justify-between h-20">
        <Button variant="ghost" size="icon" onClick={prevStep} disabled={step === 1} className="rounded-full">
          <ChevronLeft size={24} />
        </Button>
        <div className="flex gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                step === i + 1 ? "w-6 bg-primary" : "bg-muted"
              )}
            ></div>
          ))}
        </div>
        <Button 
          onClick={skipStep}
          className="rounded-2xl gradient-bg text-white h-10 px-6 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all border-0"
        >
          {t('button.skip')}
        </Button>
      </header>

      <main className="flex-1 px-8 pt-4 pb-24 max-w-md mx-auto w-full">
        {renderStep()}
      </main>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-6 bg-white/80 backdrop-blur-md">
        <Button 
          onClick={nextStep}
          disabled={!isStepValid()}
          className="w-full h-16 rounded-full gradient-bg text-white font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 active:scale-95 transition-all"
        >
          {step === totalSteps ? t('button.start') : t('button.continue')} <ArrowRight size={20} className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
