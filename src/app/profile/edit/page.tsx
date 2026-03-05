
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  Sparkles, 
  Camera, 
  User,
  MapPin,
  Info
} from "lucide-react";
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

const INTEREST_OPTIONS = [
  "Фотография", "Путешествия", "Кофе", "Музыка", "Спорт", "Искусство", "Кино", "Йога", "Бизнес", "Игры",
  "Собаки", "Кошки", "Жаворонок", "Сова"
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

export default function EditProfilePage() {
  const router = useRouter();
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [mainPhoto, setMainPhoto] = useState(PlaceHolderImages[0].imageUrl);

  const [profile, setProfile] = useState({
    name: "Анна",
    age: 24,
    city: "Москва",
    height: 172,
    datingGoal: "Серьезные отношения",
    zodiac: "Лев",
    bio: "Люблю закаты, хороший кофе и интересные разговоры.",
    interests: ["Фотография", "Путешествия", "Кофе", "Музыка", "Спорт", "Собаки", "Сова"]
  });

  const handleChangeMainPhoto = () => {
    const randomIdx = Math.floor(Math.random() * PlaceHolderImages.length);
    setMainPhoto(PlaceHolderImages[randomIdx].imageUrl);
    toast({ title: "Фото обновлено" });
  };

  const handleGenerateBio = async () => {
    setIsGeneratingBio(true);
    try {
      const result = await generateProfileBio({ keywords: profile.interests, description: profile.bio });
      setProfile(prev => ({ ...prev, bio: result.bio }));
      toast({ title: "Био улучшено" });
    } catch (error) {
      toast({ variant: "destructive", title: "Ошибка" });
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const handleSave = () => {
    toast({ title: "Профиль сохранен" });
    router.push("/profile");
  };

  const toggleInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <div className="flex flex-col min-h-svh bg-[#f8f9fb]">
      <AppHeader />
      <header className="flex items-center gap-3 px-4 py-3 border-b border-border sticky top-0 bg-white/95 backdrop-blur-md z-20">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full h-9 w-9">
          <ChevronLeft size={20} />
        </Button>
        <h1 className="text-lg font-black font-headline tracking-tight uppercase">Изменить профиль</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-5 pb-6">
        <div className="flex flex-col items-center gap-2 pt-2">
          <div className="relative group cursor-pointer" onClick={handleChangeMainPhoto}>
            <div className="w-40 h-40 rounded-[2.5rem] border-4 border-white overflow-hidden relative shadow-lg transform transition-transform group-hover:scale-[1.02]">
              <Image src={mainPhoto} alt="Profile" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                <Camera className="text-white" size={24} />
              </div>
            </div>
            <button className="absolute bottom-1 right-1 bg-primary text-white p-2.5 rounded-2xl shadow-md border-2 border-white">
              <Camera size={16} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 app-shadow space-y-6 border border-border/40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><User size={14} /></div>
            <h3 className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Основные данные</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Имя</Label>
              <Input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="rounded-xl bg-muted/30 border-0 h-11 font-bold px-4" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Возраст</Label>
                <Input type="number" value={profile.age} onChange={e => setProfile({...profile, age: parseInt(e.target.value) || 0})} className="rounded-xl bg-muted/30 border-0 h-11 font-bold px-4" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Рост</Label>
                <Input type="number" value={profile.height} onChange={e => setProfile({...profile, height: parseInt(e.target.value) || 0})} className="rounded-xl bg-muted/30 border-0 h-11 font-bold px-4" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Город</Label>
              <div className="relative">
                <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" />
                <Input value={profile.city} onChange={e => setProfile({...profile, city: e.target.value})} className="rounded-xl bg-muted/30 border-0 h-11 font-bold pl-10 pr-4" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Знак зодиака</Label>
                <Select value={profile.zodiac} onValueChange={(val) => setProfile({...profile, zodiac: val})}>
                  <SelectTrigger className="rounded-xl bg-muted/30 border-0 h-11 font-bold px-4"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-xl border-0 shadow-2xl">
                    {ZODIAC_SIGNS.map(sign => <SelectItem key={sign} value={sign} className="font-bold text-xs">{sign}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Цель</Label>
                <Select value={profile.datingGoal} onValueChange={(val) => setProfile({...profile, datingGoal: val})}>
                  <SelectTrigger className="rounded-xl bg-muted/30 border-0 h-11 font-bold px-4"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-xl border-0 shadow-2xl">
                    {DATING_GOALS.map(goal => <SelectItem key={goal} value={goal} className="font-bold text-xs">{goal}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"><Info size={14} /></div>
                <h3 className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">О себе</h3>
              </div>
              <button onClick={handleGenerateBio} disabled={isGeneratingBio} className="text-[9px] font-black text-primary flex items-center gap-1.5 uppercase tracking-tight bg-primary/5 px-3 py-1.5 rounded-full">
                <Sparkles size={11} className={isGeneratingBio ? "animate-spin" : ""} /> AI Улучшить
              </button>
            </div>
            <Textarea value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} className="rounded-2xl bg-muted/30 border-0 min-h-[90px] text-xs resize-none font-medium p-4" />
          </div>

          <div className="space-y-3">
            <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Интересы</Label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map(interest => (
                <Badge key={interest} onClick={() => toggleInterest(interest)} variant={profile.interests.includes(interest) ? "default" : "secondary"} className={cn("cursor-pointer px-3 py-1.5 rounded-lg transition-all border-0 font-bold text-[10px] uppercase tracking-tight", profile.interests.includes(interest) ? "gradient-bg text-white shadow-md" : "bg-muted text-muted-foreground")}>{interest}</Badge>
              ))}
            </div>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full h-14 rounded-2xl gradient-bg text-white font-black uppercase tracking-widest shadow-lg shadow-primary/20 border-0">Сохранить</Button>
      </main>
    </div>
  );
}
