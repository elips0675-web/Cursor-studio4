
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Settings, CheckCircle2, Camera, Coffee, Music, Globe, Dumbbell, Edit2, Palette, Film, Flower2, Briefcase, Gamepad2, Dog, Ruler, Target, User, Info, Trophy, Heart, VenetianMask, Search
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { AppHeader } from "@/components/layout/app-header";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/language-context";
import { cn, getUserTitles } from "@/lib/utils";
import { ZodiacIcon } from "@/components/shared/zodiac-icon";
import { Skeleton } from "@/components/ui/skeleton";

const interestIconsMap: Record<string, any> = {
  "Фотография": Camera, "Путешествия": Globe, "Кофе": Coffee, "Музыка": Music, "Спорт": Dumbbell, "Искусство": Palette, "Кино": Film, "Йога": Flower2, "Бизнес": Briefcase, "Игры": Gamepad2, "Кошки": Dog,
  "Photography": Camera, "Travel": Globe, "Sports": Dumbbell, "Art": Palette, "Movies": Film, "Yoga": Flower2, "Business": Briefcase, "Gaming": Gamepad2, "Cats": Dog
};

export default function ProfilePage() {
  const { t, language } = useLanguage();
  const [profile, setProfile] = useState<any>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfile({
        ...parsed,
        displayName: parsed.displayName || parsed.name || "Пользователь"
      });
    } else {
      setProfile({
        displayName: "Анна",
        age: 24,
        city: "Москва",
        height: 172,
        gender: "female",
        lookingFor: "male",
        datingGoal: "Серьезные отношения",
        zodiac: "Лев",
        bio: "Люблю закаты, хороший кофе и интересные разговоры.",
        interests: ["Фотография", "Путешествия", "Кофе", "Музыка", "Спорт"],
        match: 87
      });
    }
    const savedPhotos = localStorage.getItem('userProfileGallery');
    if (savedPhotos) {
      setPhotos(JSON.parse(savedPhotos));
    } else {
      setPhotos([PlaceHolderImages[0].imageUrl, PlaceHolderImages[2].imageUrl, PlaceHolderImages[4].imageUrl]);
    }
  }, []);

  const earnedTitles = useMemo(() => getUserTitles(profile, language), [profile, language]);

  if (!isMounted || !profile) return (
    <div className="flex flex-col h-svh bg-[#f8f9fb]">
      <AppHeader />
      <main className="flex-1 p-6"><Skeleton className="h-64 w-full rounded-2xl" /></main>
      <BottomNav />
    </div>
  );

  return (
    <div className="flex flex-col min-h-svh bg-[#f8f9fb]">
      <AppHeader />
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="h-24 gradient-bg relative">
          <Link href="/settings" className="absolute top-4 right-6 text-white/90 p-2 bg-black/10 rounded-full backdrop-blur-md"><Settings size={18} /></Link>
        </div>
        <div className="px-5 -mt-10">
          <div className="text-center mb-6">
            <div className="relative inline-block mb-4">
              <div className="relative w-32 h-32 rounded-2xl border-[6px] border-white app-shadow overflow-hidden bg-muted">
                <Image src={photos[0] || PlaceHolderImages[0].imageUrl} alt="Profile" fill className="object-cover" />
              </div>
              <Link href="/profile/edit" className="absolute -bottom-2 -right-2 gradient-bg text-white p-3 rounded-2xl shadow-xl border-4 border-white hover:scale-110 transition-transform active:scale-90"><Edit2 size={18} /></Link>
            </div>
            <h3 className="text-2xl font-black font-headline tracking-tight flex items-center justify-center gap-2">{profile.displayName}, {profile.age} <CheckCircle2 size={20} className="text-primary" fill="currentColor" /></h3>
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest opacity-80 mt-1">{profile.city}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 app-shadow border border-border/40 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><User size={14} /></div>
                <h4 className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Данные и Интересы</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase text-muted-foreground ml-1">Мой пол</span>
                  <Badge variant="secondary" className="w-full justify-start py-2 px-3 rounded-lg bg-muted/40 border-0 font-bold text-[10px] gap-2">
                    <VenetianMask size={12} className="text-primary" />
                    {profile.gender === 'female' ? 'Женщина' : 'Мужчина'}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase text-muted-foreground ml-1">Ищу</span>
                  <Badge variant="secondary" className="w-full justify-start py-2 px-3 rounded-lg bg-muted/40 border-0 font-bold text-[10px] gap-2">
                    <Search size={12} className="text-primary" />
                    {profile.lookingFor === 'male' ? 'Мужчину' : profile.lookingFor === 'female' ? 'Женщину' : 'Всех'}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase text-muted-foreground ml-1">Зодиак</span>
                  <Badge variant="secondary" className="w-full justify-start py-2 px-3 rounded-lg bg-muted/40 border-0 font-bold text-[10px] gap-2">
                    <ZodiacIcon sign={profile.zodiac} />
                    {profile.zodiac}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase text-muted-foreground ml-1">Рост</span>
                  <Badge variant="secondary" className="w-full justify-start py-2 px-3 rounded-lg bg-muted/40 border-0 font-bold text-[10px] gap-2">
                    <Ruler size={12} className="text-primary" />
                    {profile.height} см
                  </Badge>
                </div>
                <div className="col-span-2 space-y-1">
                  <span className="text-[8px] font-black uppercase text-muted-foreground ml-1">Цель</span>
                  <Badge variant="secondary" className="w-full justify-start py-2 px-3 rounded-lg bg-primary/5 border-0 font-bold text-[10px] gap-2 text-primary">
                    <Target size={12} />
                    {profile.datingGoal}
                  </Badge>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2">
                {profile.interests?.map((interest: string) => {
                  const Icon = interestIconsMap[interest] || Heart;
                  return (
                    <Badge key={interest} variant="secondary" className="bg-muted/50 text-foreground/80 border-0 gap-2 py-2 px-3 font-bold text-[10px] rounded-lg transition-all hover:bg-muted/70 shadow-sm">
                      <Icon size={12} className="text-primary" /> {interest}
                    </Badge>
                  );
                })}
              </div>
            </div>

            <div className="h-px bg-border/50"></div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"><Info size={14} /></div>
                <h4 className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">{t('profile.about')}</h4>
              </div>
              <p className="text-xs text-foreground/80 leading-relaxed font-medium italic">"{profile.bio}"</p>
            </div>
          </div>

          <div className="mt-6 bg-white rounded-2xl p-6 app-shadow border border-border/40 mb-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Camera size={18} className="text-primary" />
                <h4 className="font-black text-[11px] uppercase tracking-widest text-muted-foreground">{t('profile.gallery')}</h4>
              </div>
              <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[9px] font-black uppercase tracking-widest">Добавить</Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {photos.map((url, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-muted border border-border/10">
                  <Image src={url} alt={`Gallery ${idx}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
