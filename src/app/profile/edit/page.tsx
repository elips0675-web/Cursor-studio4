'use client';

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser, useFirestore } from "@/firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { Sparkles, Camera, User, MapPin, Info, GraduationCap, Dog, Briefcase, Bed, Target, Heart, Users, Trash2, Maximize2, Loader2, Plus } from "lucide-react";
import Image from "next/image";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { generateProfileBio } from "@/ai/flows/ai-generate-profile-bio";
import { toast } from "@/hooks/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { INTEREST_OPTIONS, DATING_GOALS, ZODIAC_SIGNS, EDUCATION_OPTIONS } from "@/lib/constants";
import { GROUP_CATEGORIES } from "@/lib/demo-data";
import { useLanguage } from "@/context/language-context";

const defaultProfile = {
    displayName: "Анна",
    age: 24,
    city: "Москва",
    height: 172,
    datingGoal: "Серьезные отношения",
    zodiac: "Лев",
    bio: "Люблю закаты, хороший кофе и интересные разговоры.",
    interests: ["Фотография", "Путешествия", "Кофе", "Музыка", "Спорт"],
    pets: "Есть собака",
    education: "Высшее",
    sleepSchedule: "Сова",
    work: "Дизайнер",
    gender: "female",
    lookingFor: "male",
    joinedGroups: ["Хип-хоп", "Бег", "UI/UX Дизайн"],
};

export default function EditProfilePage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const firestore = useFirestore();
  const { user } = useUser();

  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [mainPhoto, setMainPhoto] = useState(PlaceHolderImages[0].imageUrl);
  const [profile, setProfile] = useState(defaultProfile as any);
  
  // Dynamic config from Firestore
  const [dynamicInterests, setDynamicInterests] = useState<string[]>(INTEREST_OPTIONS);
  const [dynamicGoals, setDynamicGoals] = useState<string[]>(DATING_GOALS);
  const [dynamicEducation, setDynamicEducation] = useState<string[]>(EDUCATION_OPTIONS);
  const [customInterest, setCustomInterest] = useState("");
  const [isAddingInterest, setIsAddingInterest] = useState(false);

  useEffect(() => {
    if (!firestore) return;
    const configRef = doc(firestore, 'config', 'content');
    const unsubscribe = onSnapshot(configRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.interests) setDynamicInterests(data.interests);
        if (data.datingGoals) setDynamicGoals(data.datingGoals);
        if (data.educationLevels) setDynamicEducation(data.educationLevels);
        
        // SYNC: If items were deleted globally, remove them from user selection
        setProfile((prev: any) => {
            const validInterests = prev.interests.filter((i: string) => !data.interests || data.interests.includes(i));
            return { ...prev, interests: validInterests };
        });
      }
    });
    return () => unsubscribe();
  }, [firestore]);

  const groupDataMap = useMemo(() => {
    const map = new Map<string, { ru: string; en: string; id: number }>();
    GROUP_CATEGORIES.forEach(category => {
      category.subgroups.forEach(subgroup => {
        map.set(subgroup.name_ru, { ru: subgroup.name_ru, en: subgroup.name_en, id: subgroup.id });
        map.set(subgroup.name_en, { ru: subgroup.name_ru, en: subgroup.name_en, id: subgroup.id });
      });
    });
    return map;
  }, []);

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const loadedProfile = JSON.parse(savedProfile);
        setProfile((prev: any) => ({ 
          ...prev, 
          ...loadedProfile,
          displayName: loadedProfile.displayName || loadedProfile.name || prev.displayName 
        }));
        if(loadedProfile.photoURL) {
          setMainPhoto(loadedProfile.photoURL);
        }
      } catch(e) {}
    }
  }, []);

  const handleChangeMainPhoto = () => {
    const randomIdx = Math.floor(Math.random() * PlaceHolderImages.length);
    setMainPhoto(PlaceHolderImages[randomIdx].imageUrl);
    toast({ title: "Главное фото обновлено" });
  };

  const handleGenerateBio = async () => {
    setIsGeneratingBio(true);
    try {
      const result = await generateProfileBio({ keywords: profile.interests, description: profile.bio });
      setProfile((prev: any) => ({ ...prev, bio: result.bio }));
      toast({ title: "Био улучшено AI" });
    } catch (error) {
      toast({ variant: "destructive", title: "Ошибка AI" });
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const handleAddCustomInterest = async () => {
    if (!customInterest.trim() || !firestore) return;
    if (dynamicInterests.includes(customInterest.trim())) {
        if (!profile.interests.includes(customInterest.trim())) {
            toggleInterest(customInterest.trim());
        }
        setCustomInterest("");
        return;
    }

    setIsAddingInterest(true);
    try {
        const updatedList = [...dynamicInterests, customInterest.trim()];
        const configRef = doc(firestore, 'config', 'content');
        await setDoc(configRef, { interests: updatedList }, { merge: true });
        
        setProfile((prev: any) => ({
            ...prev,
            interests: [...prev.interests, customInterest.trim()]
        }));
        
        setCustomInterest("");
        toast({ title: "Интерес добавлен и выбран" });
    } catch (e) {
        toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось добавить интерес' });
    } finally {
        setIsAddingInterest(false);
    }
  };

  const handleSave = async () => {
    const updatedProfile = {
      ...profile,
      photoURL: mainPhoto,
    };

    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));

    if (user && firestore) {
      try {
        const userDocRef = doc(firestore, 'users', user.uid);
        await setDoc(userDocRef, updatedProfile, { merge: true });
      } catch (error) {
        console.error("Error saving to Firestore:", error);
      }
    }
    
    toast({ title: "Профиль сохранен" });
    router.push("/profile");
  };

  const toggleInterest = (interest: string) => {
    setProfile((prev: any) => ({
      ...prev,
      interests: prev.interests.includes(interest) ? prev.interests.filter((i: string) => i !== interest) : [...prev.interests, interest]
    }));
  };
  
  const handleRemoveGroup = (groupName: string) => {
    const groupInfo = groupDataMap.get(groupName);
    if (!groupInfo) return;

    const updatedGroups = profile.joinedGroups.filter(
        (g: string) => g !== groupInfo.ru && g !== groupInfo.en
    );

    setProfile((prev: any) => ({ ...prev, joinedGroups: updatedGroups }));

    toast({
        title: `${t('toast.left_group')} "${language === 'RU' ? groupInfo.ru : groupInfo.en}"`,
    });
  };

  return (
    <div className="flex flex-col min-h-svh bg-[#f8f9fb]">
      <AppHeader />
      <main className="flex-1 overflow-y-auto p-4 space-y-5 pb-24">
        <div className="flex flex-col items-center gap-2 pt-2">
          <div className="relative group cursor-pointer" onClick={handleChangeMainPhoto}>
            <div className="w-40 h-40 rounded-2xl border-4 border-white overflow-hidden relative shadow-lg transform transition-transform group-hover:scale-[1.02]">
              <Image src={mainPhoto} alt="Profile" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]"><Camera className="text-white" size={24} /></div>
            </div>
            <button className="absolute bottom-1 right-1 bg-primary text-white p-2.5 rounded-xl shadow-md border-2 border-white active:scale-95 transition-transform"><Camera size={16} /></button>
          </div>
          <p className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest mt-1">Основное фото профиля</p>
        </div>

        <div className="bg-white rounded-2xl p-6 app-shadow space-y-6 border border-border/40">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"><Info size={14} /></div>
                <h3 className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">О себе</h3>
              </div>
              <button onClick={handleGenerateBio} disabled={isGeneratingBio} className="text-[9px] font-black text-primary flex items-center gap-1.5 uppercase tracking-tight bg-muted/50 px-3 py-1.5 rounded-full hover:bg-muted transition-colors shadow-sm">
                <Sparkles size={11} className={isGeneratingBio ? "animate-spin" : ""} /> AI Улучшить
              </button>
            </div>
            <Textarea value={profile.bio || ''} onChange={e => setProfile({...profile, bio: e.target.value})} className="rounded-xl bg-muted/30 border-0 min-h-[90px] text-xs resize-none font-medium p-4" />
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><User size={14} /></div>
            <h3 className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Основные данные</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Имя</Label>
              <Input value={profile.displayName || ''} onChange={e => setProfile({...profile, displayName: e.target.value})} className="rounded-xl bg-muted/30 border-0 h-11 font-bold px-4 focus-visible:ring-primary/20" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Ваш пол</Label>
                <Select value={profile.gender || ''} onValueChange={(val) => setProfile({...profile, gender: val})}>
                  <SelectTrigger className="rounded-xl bg-muted/30 border-0 h-11 font-bold px-4"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-xl border-0 shadow-2xl">
                    <SelectItem value="male" className="font-bold text-xs">Мужчина</SelectItem>
                    <SelectItem value="female" className="font-bold text-xs">Женщина</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-primary ml-1 flex items-center gap-1">Кого ищу</Label>
                <Select value={profile.lookingFor || ''} onValueChange={(val) => setProfile({...profile, lookingFor: val})}>
                  <SelectTrigger className="rounded-xl bg-muted/30 border-0 h-11 font-bold px-4"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-xl border-0 shadow-2xl">
                    <SelectItem value="male" className="font-bold text-xs">Мужчину</SelectItem>
                    <SelectItem value="female" className="font-bold text-xs">Женщину</SelectItem>
                    <SelectItem value="all" className="font-bold text-xs">Всех</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-1.5 p-4 bg-primary/5 rounded-xl border border-primary/10">
              <Label className="text-[9px] font-black uppercase tracking-widest text-primary ml-1 flex items-center gap-1.5"><Target size={12} /> Цель знакомства</Label>
              <Select value={profile.datingGoal || ''} onValueChange={(val) => setProfile({...profile, datingGoal: val})}>
                <SelectTrigger className="rounded-xl bg-white border-0 h-11 font-bold px-4 shadow-sm">
                    <SelectValue placeholder={t('onboarding.step3.goal_placeholder')} />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-0 shadow-2xl">
                    {dynamicGoals.map(goal => <SelectItem key={goal} value={goal} className="font-bold text-xs">{goal}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Возраст</Label>
                <Input type="number" value={profile.age || ''} onChange={e => setProfile({...profile, age: parseInt(e.target.value) || 0})} className="rounded-xl bg-muted/30 border-0 h-11 font-bold px-4 focus-visible:ring-primary/20" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Рост</Label>
                <Input type="number" value={profile.height || ''} onChange={e => setProfile({...profile, height: parseInt(e.target.value) || 0})} className="rounded-xl bg-muted/30 border-0 h-11 font-bold px-4 focus-visible:ring-primary/20" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Город</Label>
              <div className="relative"><MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" /><Input value={profile.city || ''} onChange={e => setProfile({...profile, city: e.target.value})} className="rounded-xl bg-muted/30 border-0 h-11 font-bold pl-10 pr-4 focus-visible:ring-primary/20" /></div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Профессия</Label>
              <div className="relative"><Briefcase size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" /><Input value={profile.work || ''} onChange={e => setProfile({...profile, work: e.target.value})} className="rounded-xl bg-muted/30 border-0 h-11 font-bold pl-10 pr-4 focus-visible:ring-primary/20" placeholder="Напр. Дизайнер" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Знак зодиака</Label>
                <Select value={profile.zodiac || ''} onValueChange={(val) => setProfile({...profile, zodiac: val})}><SelectTrigger className="rounded-xl bg-muted/30 border-0 h-11 font-bold px-4"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl border-0 shadow-2xl">{ZODIAC_SIGNS.map(sign => <SelectItem key={sign} value={sign} className="font-bold text-xs">{t(sign)}</SelectItem>)}</SelectContent></Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-1"><GraduationCap size={12}/> Образование</Label>
                <Select value={profile.education || ''} onValueChange={(val) => setProfile({...profile, education: val})}>
                    <SelectTrigger className="rounded-xl bg-muted/30 border-0 h-11 font-bold px-4">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-0 shadow-2xl">
                        {dynamicEducation.map(opt => <SelectItem key={opt} value={opt} className="font-bold text-xs">{opt}</SelectItem>)}
                    </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Интересы</Label>
            <div className="flex flex-wrap gap-2">
              {dynamicInterests.map(interest => (
                  <Badge 
                      key={interest} 
                      onClick={() => toggleInterest(interest)} 
                      variant={profile.interests.includes(interest) ? "default" : "secondary"} 
                      className={cn(
                          "cursor-pointer px-3 py-1.5 rounded-lg transition-all border-0 font-bold text-[10px] uppercase tracking-tight shadow-sm", 
                          profile.interests.includes(interest) ? "gradient-bg text-white shadow-md hover:brightness-110" : "bg-muted text-muted-foreground hover:bg-border"
                      )}
                  >
                      {t(interest)}
                  </Badge>
              ))}
            </div>
            
            {/* Quick Add Custom Interest */}
            <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                <Input 
                    value={customInterest}
                    onChange={(e) => setCustomInterest(e.target.value)}
                    placeholder="Свой вариант..."
                    className="h-9 rounded-lg bg-muted/30 border-0 text-[10px] font-bold"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCustomInterest()}
                />
                <Button 
                    onClick={handleAddCustomInterest} 
                    disabled={isAddingInterest || !customInterest.trim()}
                    className="h-9 w-9 shrink-0 rounded-lg gradient-bg text-white shadow-lg border-0"
                >
                    {isAddingInterest ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                </Button>
            </div>
          </div>

          <div className="h-px bg-border/50 my-6"></div>

            <div className="space-y-3">
                <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-1.5"><Users size={12}/> Мои группы</Label>
                <div className="flex flex-wrap gap-2">
                {(profile.joinedGroups && profile.joinedGroups.length > 0) ? (
                    profile.joinedGroups.map((groupName: string) => {
                    const groupInfo = groupDataMap.get(groupName);
                    if (!groupInfo) return null;
                    const displayName = language === 'RU' ? groupInfo.ru : groupInfo.en;

                    return (
                        <Badge key={groupName} variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 border gap-2 py-1.5 px-3 font-bold text-[10px] rounded-lg shadow-sm hover:bg-blue-200 transition-colors">
                        <Users size={12} />
                        <span>{displayName}</span>
                        <button
                            onClick={() => handleRemoveGroup(groupName)}
                            className="-mr-1 text-blue-500/50 hover:text-blue-700 transition-colors"
                        >
                            <Trash2 size={13} />
                        </button>
                        </Badge>
                    );
                    })
                ) : (
                    <p className="text-xs text-muted-foreground p-2">{language === 'RU' ? 'Вы не состоите в группах' : 'You are not in any groups'}</p>
                )}
                </div>
            </div>
        </div>

        <div className="mt-8 px-2">
            <Button onClick={handleSave} className="w-full h-14 rounded-2xl gradient-bg text-white font-black uppercase tracking-widest shadow-xl shadow-primary/30 border-0 hover:brightness-110 active:scale-95 transition-all">
                Сохранить все изменения
            </Button>
        </div>
      </main>
    </div>
  );
}
