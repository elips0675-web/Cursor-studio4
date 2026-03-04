
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  Sparkles, 
  Camera, 
  Target
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

export default function EditProfilePage() {
  const router = useRouter();
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);

  const [profile, setProfile] = useState({
    name: "Анна",
    age: 24,
    city: "Москва",
    height: 172,
    datingGoal: "Серьезные отношения",
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
    <div className="flex flex-col min-h-svh bg-white">
      <header className="flex items-center gap-3 px-4 py-4 border-b border-border sticky top-0 bg-white z-10">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ChevronLeft size={24} />
        </Button>
        <h1 className="text-xl font-bold font-headline">Редактировать</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="flex flex-col items-center gap-4">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-muted overflow-hidden relative shadow-md">
              <Image src={PlaceHolderImages[0].imageUrl} alt="Profile" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="text-white" size={24} />
              </div>
            </div>
            <button className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full shadow-lg border-2 border-white">
              <Camera size={14} />
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Сменить фото</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Имя</Label>
            <Input 
              value={profile.name} 
              onChange={e => setProfile({...profile, name: e.target.value})}
              className="rounded-2xl bg-muted/50 border-0 h-12 focus-visible:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Возраст</Label>
              <Input 
                type="number"
                value={profile.age} 
                onChange={e => setProfile({...profile, age: parseInt(e.target.value) || 0})}
                className="rounded-2xl bg-muted/50 border-0 h-12 focus-visible:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Рост (см)</Label>
              <Input 
                type="number"
                value={profile.height} 
                onChange={e => setProfile({...profile, height: parseInt(e.target.value) || 0})}
                className="rounded-2xl bg-muted/50 border-0 h-12 focus-visible:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Цель знакомства</Label>
            <Select 
              value={profile.datingGoal} 
              onValueChange={(val) => setProfile({...profile, datingGoal: val})}
            >
              <SelectTrigger className="rounded-2xl bg-muted/50 border-0 h-12 focus:ring-primary/20">
                <SelectValue placeholder="Выберите цель" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-0 shadow-xl">
                {DATING_GOALS.map(goal => (
                  <SelectItem key={goal} value={goal} className="font-medium text-sm rounded-xl py-3">{goal}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Город</Label>
            <Input 
              value={profile.city} 
              onChange={e => setProfile({...profile, city: e.target.value})}
              className="rounded-2xl bg-muted/50 border-0 h-12 focus-visible:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">О себе</Label>
              <button 
                onClick={handleGenerateBio}
                disabled={isGeneratingBio}
                className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline disabled:opacity-50"
              >
                <Sparkles size={12} /> {isGeneratingBio ? "Улучшаем..." : "Улучшить с ИИ"}
              </button>
            </div>
            <Textarea 
              value={profile.bio} 
              onChange={e => setProfile({...profile, bio: e.target.value})}
              placeholder="Расскажите о себе..."
              className="rounded-2xl bg-muted/50 border-0 min-h-[120px] text-sm resize-none focus-visible:ring-primary/20"
            />
          </div>

          <div className="space-y-4">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Интересы, питомцы и режим</Label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map(interest => (
                <Badge 
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  variant={profile.interests.includes(interest) ? "default" : "secondary"}
                  className={`cursor-pointer px-4 py-2 rounded-full transition-all border-0 font-bold text-[10px] ${
                    profile.interests.includes(interest) 
                      ? "gradient-bg text-white shadow-sm" 
                      : "bg-muted text-muted-foreground hover:bg-border"
                  }`}
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button onClick={handleSave} className="w-full h-14 rounded-full gradient-bg text-white font-bold shadow-xl shadow-primary/20 active:scale-[0.98] transition-all">
            Сохранить изменения
          </Button>
        </div>
      </main>
    </div>
  );
}
