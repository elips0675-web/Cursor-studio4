
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  User, 
  Heart, 
  Camera,
  CheckCircle2,
  ChevronLeft
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { generateProfileBio } from "@/ai/flows/ai-generate-profile-bio";
import { cn } from "@/lib/utils";

const INTEREST_OPTIONS = [
  "Фотография", "Путешествия", "Кофе", "Музыка", "Спорт", "Искусство", "Кино", "Йога", "Бизнес", "Игры",
  "Собаки", "Кошки", "Жаворонок", "Сова"
];

const GENDER_OPTIONS = [
  { id: 'male', label: 'Мужчина' },
  { id: 'female', label: 'Женщина' },
  { id: 'other', label: 'Другое' }
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    gender: "",
    name: "",
    age: "",
    city: "",
    interests: [] as string[],
    bio: "",
    photo: PlaceHolderImages[10].imageUrl
  });

  const [isGeneratingBio, setIsGeneratingBio] = useState(false);

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
    else handleFinish();
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

  const handleGenerateBio = async () => {
    if (formData.interests.length === 0) {
      toast({ title: "Выберите хотя бы один интерес" });
      return;
    }
    setIsGeneratingBio(true);
    try {
      const result = await generateProfileBio({ keywords: formData.interests });
      setFormData(prev => ({ ...prev, bio: result.bio }));
      toast({ title: "Био создано AI" });
    } catch (error) {
      toast({ variant: "destructive", title: "Ошибка генерации" });
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const handleFinish = () => {
    toast({
      title: "Профиль готов!",
      description: "Добро пожаловать в SwiftMatch.",
    });
    router.push("/");
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-black font-headline tracking-tight">Как тебя зовут?</h2>
              <p className="text-muted-foreground text-sm">Имя будет отображаться в твоем профиле.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Имя</Label>
                <Input 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Твое имя"
                  className="h-14 rounded-2xl bg-muted/30 border-0 focus-visible:ring-primary/20 font-bold px-6"
                />
              </div>
              <div className="space-y-2 pt-4">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Твой пол</Label>
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
                      {opt.label}
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
              <h2 className="text-3xl font-black font-headline tracking-tight">Немного деталей</h2>
              <p className="text-muted-foreground text-sm">Это поможет нам найти людей поблизости.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Возраст</Label>
                <Input 
                  type="number"
                  value={formData.age} 
                  onChange={e => setFormData({...formData, age: e.target.value})}
                  placeholder="Например, 25"
                  className="h-14 rounded-2xl bg-muted/30 border-0 focus-visible:ring-primary/20 font-bold px-6"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Город</Label>
                <div className="relative">
                  <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" size={20} />
                  <Input 
                    value={formData.city} 
                    onChange={e => setFormData({...formData, city: e.target.value})}
                    placeholder="Где ты находишься?"
                    className="h-14 pl-14 rounded-2xl bg-muted/30 border-0 focus-visible:ring-primary/20 font-bold pr-6"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-black font-headline tracking-tight">Твои интересы</h2>
              <p className="text-muted-foreground text-sm">Выбери минимум 3, чтобы AI составил крутое био.</p>
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
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-2 text-center">
              <div className="relative inline-block mx-auto mb-4">
                <div className="w-32 h-32 rounded-[2.5rem] border-4 border-white shadow-2xl overflow-hidden relative group">
                  <Image src={formData.photo} alt="Me" fill className="object-cover" />
                  <button className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" size={24} />
                  </button>
                </div>
              </div>
              <h2 className="text-3xl font-black font-headline tracking-tight">Почти готово!</h2>
              <p className="text-muted-foreground text-sm">Добавь немного о себе или позволь AI помочь.</p>
            </div>
            
            <div className="bg-white rounded-[2rem] p-6 app-shadow border border-border/40 space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">О себе</Label>
                <button 
                  onClick={handleGenerateBio}
                  disabled={isGeneratingBio}
                  className="text-[9px] font-black text-primary flex items-center gap-1.5 uppercase tracking-widest bg-primary/5 px-3 py-1.5 rounded-full hover:bg-primary/10 transition-colors"
                >
                  <Sparkles size={12} className={cn(isGeneratingBio && "animate-spin")} /> AI Создать
                </button>
              </div>
              <Textarea 
                value={formData.bio}
                onChange={e => setFormData({...formData, bio: e.target.value})}
                placeholder="Расскажи о своих увлечениях..."
                className="min-h-[120px] rounded-2xl bg-muted/30 border-0 text-sm font-medium p-4 resize-none"
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
    if (step === 2) return formData.age !== "" && formData.city.length > 2;
    if (step === 3) return formData.interests.length >= 1;
    if (step === 4) return formData.bio.length > 5;
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

      <header className="p-6 flex items-center justify-between">
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
        <div className="w-10"></div>
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
          {step === totalSteps ? "Начать знакомства" : "Продолжить"} <ArrowRight size={20} className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
