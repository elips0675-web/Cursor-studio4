"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  Sparkles, 
  Camera, 
  User,
  MapPin,
  Target,
  Info
} from "lucide-react";
import Image from "next/image";
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

  const [profile, setProfile] = useState({
    name: "Анна",
    age: 24,
    city: "Москва",
    height: 172,
    datingGoal: "Серьезные отношения",
    zodiac: "Лев",
    bio: "Люблю закаты, хороший кофе и интересные разговоры. Ищу человека, с которым можно разделить эти моменты.",
    interests: ["Фотография", "Путешествия", "Кофе", "Музыка", "Спорт", "Собаки", "Сова"]
  });

  const handleGenerateBio = async () => {
    setIsGeneratingBio(true);
    try {
      const result = await generateProfileBio({
        keywords: profile.interests,
        description: profile.bio
      });
      setProfile(prev => ({ ...prev, bio: result.bio }));
      toast({
        title: "Био улучшено",
        description: "ИИ создал новый текст для вашего профиля.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось сгенерировать био.",
      });
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const handleSave = () => {
    toast({
      title: "Профиль сохранен",
      description: "Ваши изменения успешно применены.",
    });
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
      <header className="flex items-center gap-3 px-4 py-4 border-b border-border sticky top-0 bg-white/95 backdrop-blur-md z-20">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-muted">
          <ChevronLeft size={24} />
        </Button>
        <h1 className="text-xl font-black font-headline tracking-tight">Редактировать профиль</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-5 space-y-8 pb-24">
        {/* Photo Section */}
        <div className="flex flex-col items-center gap-4 mt-2">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[2.5rem] border-4 border-white overflow-hidden relative shadow-xl transform transition-transform group-hover:scale-[1.02]">
              <Image src={PlaceHolderImages[0].imageUrl} alt="Profile" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-[2px]">
                <Camera className="text-white" size={24} />
              </div>
            </div>
            <button className="absolute bottom-0 right-0 bg-primary text-white p-2.5 rounded-2xl shadow-lg border-2 border-white active:scale-90 transition-transform">
              <Camera size={16} />
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.15em]">Главное фото</p>
        </div>

        {/* Main Data Card with Shadow */}
        <div className="bg-white rounded-[2.5rem] p-8 app-shadow space-y-8 border border-border/40">
          
          {/* Section Heading */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <User size={16} />
            </div>
            <h3 className="font-black text-xs uppercase tracking-widest">Основная информация</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Имя</Label>
              <Input 
                value={profile.name} 
                onChange={e => setProfile({...profile, name: e.target.value})}
                className="rounded-2xl bg-muted/30 border-0 h-14 focus-visible:ring-primary/20 font-bold px-5"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Возраст</Label>
                <Input 
                  type="number"
                  value={profile.age} 
                  onChange={e => setProfile({...profile, age: parseInt(e.target.value) || 0})}
                  className="rounded-2xl bg-muted/30 border-0 h-14 focus-visible:ring-primary/20 font-bold px-5"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Рост (см)</Label>
                <Input 
                  type="number"
                  value={profile.height} 
                  onChange={e => setProfile({...profile, height: parseInt(e.target.value) || 0})}
                  className="rounded-2xl bg-muted/30 border-0 h-14 focus-visible:ring-primary/20 font-bold px-5"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Город</Label>
              <div className="relative">
                <MapPin size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/60" />
                <Input 
                  value={profile.city} 
                  onChange={e => setProfile({...profile, city: e.target.value})}
                  className="rounded-2xl bg-muted/30 border-0 h-14 focus-visible:ring-primary/20 font-bold pl-12 pr-5"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-muted" />

          {/* Dating Section */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
              <Target size={16} />
            </div>
            <h3 className="font-black text-xs uppercase tracking-widest">Знакомства</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Знак зодиака</Label>
              <Select 
                value={profile.zodiac} 
                onValueChange={(val) => setProfile({...profile, zodiac: val})}
              >
                <SelectTrigger className="rounded-2xl bg-muted/30 border-0 h-14 focus:ring-primary/20 font-bold px-5">
                  <SelectValue placeholder="Знак" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-0 shadow-2xl max-h-[250px]">
                  {ZODIAC_SIGNS.map(sign => (
                    <SelectItem key={sign} value={sign} className="font-bold text-sm rounded-xl py-3 cursor-pointer">{sign}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Цель</Label>
              <Select 
                value={profile.datingGoal} 
                onValueChange={(val) => setProfile({...profile, datingGoal: val})}
              >
                <SelectTrigger className="rounded-2xl bg-muted/30 border-0 h-14 focus:ring-primary/20 font-bold px-5">
                  <SelectValue placeholder="Цель" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-0 shadow-2xl max-h-[250px]">
                  {DATING_GOALS.map(goal => (
                    <SelectItem key={goal} value={goal} className="font-bold text-sm rounded-xl py-3 cursor-pointer">{goal}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="h-px bg-muted" />

          {/* AI Bio Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Info size={16} />
                </div>
                <h3 className="font-black text-xs uppercase tracking-widest">О себе</h3>
              </div>
              <button 
                onClick={handleGenerateBio}
                disabled={isGeneratingBio}
                className="text-[10px] font-black text-primary flex items-center gap-1.5 hover:underline disabled:opacity-50 uppercase tracking-tight bg-primary/5 px-3 py-1.5 rounded-full"
              >
                <Sparkles size={12} className={isGeneratingBio ? "animate-spin" : ""} /> {isGeneratingBio ? "Улучшаем..." : "AI Улучшить"}
              </button>
            </div>
            <Textarea 
              value={profile.bio} 
              onChange={e => setProfile({...profile, bio: e.target.value})}
              placeholder="Расскажите о себе что-нибудь интересное..."
              className="rounded-[1.75rem] bg-muted/30 border-0 min-h-[160px] text-sm resize-none focus-visible:ring-primary/20 leading-relaxed font-medium p-6"
            />
          </div>

          {/* Interests Section */}
          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Интересы и стиль жизни</Label>
            <div className="flex flex-wrap gap-2.5">
              {INTEREST_OPTIONS.map(interest => (
                <Badge 
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  variant={profile.interests.includes(interest) ? "default" : "secondary"}
                  className={cn(
                    "cursor-pointer px-4 py-2.5 rounded-xl transition-all border-0 font-bold text-[9px] uppercase tracking-tight shadow-sm",
                    profile.interests.includes(interest) 
                      ? "gradient-bg text-white shadow-md scale-105" 
                      : "bg-muted text-muted-foreground hover:bg-border"
                  )}
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Button onClick={handleSave} className="w-full h-16 rounded-[2rem] gradient-bg text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-[0.98] transition-all border-0 text-base">
            Сохранить изменения
          </Button>
        </div>
      </main>
    </div>
  );
}
