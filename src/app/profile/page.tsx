
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Settings, CheckCircle2, Camera, Coffee, Music, Globe, Dumbbell, Edit2, Palette, Film, Flower2, Briefcase, Gamepad2, Dog, Ruler, Target, User, Info, Trophy, Heart, VenetianMask, Search, Maximize2, Trash2, X
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
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

const interestIconsMap: Record<string, any> = {
  "Фотография": Camera, "Путешествия": Globe, "Кофе": Coffee, "Музыка": Music, "Спорт": Dumbbell, "Искусство": Palette, "Кино": Film, "Йога": Flower2, "Бизнес": Briefcase, "Игры": Gamepad2, "Кошки": Dog,
  "Photography": Camera, "Travel": Globe, "Sports": Dumbbell, "Art": Palette, "Movies": Film, "Yoga": Flower2, "Business": Briefcase, "Gaming": Gamepad2, "Cats": Dog
};

export default function ProfilePage() {
  const { t, language } = useLanguage();
  const [profile, setProfile] = useState<any>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  
  // States for Gallery Management
  const [photoToDelete, setPhotoToDelete] = useState<number | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

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
      const defaultPhotos = [PlaceHolderImages[0].imageUrl, PlaceHolderImages[2].imageUrl, PlaceHolderImages[4].imageUrl];
      setPhotos(defaultPhotos);
      localStorage.setItem('userProfileGallery', JSON.stringify(defaultPhotos));
    }
  }, []);

  const earnedTitles = useMemo(() => getUserTitles(profile, language), [profile, language]);

  const handleDeletePhoto = () => {
    if (photoToDelete === null) return;
    
    if (photos.length <= 1) {
      toast({
        variant: "destructive",
        title: t('delete_photo_error.title'),
        description: t('delete_photo_error.description'),
      });
      setPhotoToDelete(null);
      return;
    }

    const newPhotos = photos.filter((_, i) => i !== photoToDelete);
    setPhotos(newPhotos);
    localStorage.setItem('userProfileGallery', JSON.stringify(newPhotos));
    toast({ title: "Фото удалено" });
    setPhotoToDelete(null);
  };

  const openViewer = (index: number) => {
    setActivePhotoIndex(index);
    setIsViewerOpen(true);
  };

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

          {/* GALLERY SECTION (Transferred from Edit with Slider added) */}
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
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden bg-muted border border-border/10 group shadow-sm">
                  <Image src={url} alt={`Gallery ${idx}`} fill className="object-cover transition-transform group-hover:scale-105 duration-500" />
                  
                  {/* Center Reveal Button */}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <button 
                      onClick={() => openViewer(idx)}
                      className="bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full px-4 py-1.5 flex items-center gap-1.5 scale-90 hover:scale-100 transition-transform active:scale-95"
                    >
                      <Maximize2 size={12} />
                      <span className="text-[9px] font-black uppercase tracking-widest">{t('button.reveal')}</span>
                    </button>
                  </div>

                  {/* Top Right Trash Icon (Editable feature transferred) */}
                  <button 
                    onClick={() => setPhotoToDelete(idx)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-xl bg-white shadow-lg flex items-center justify-center text-destructive hover:scale-110 active:scale-95 transition-all z-20 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={photoToDelete !== null} onOpenChange={(open) => !open && setPhotoToDelete(null)}>
        <AlertDialogContent className="rounded-2xl border-0 p-6 bg-white app-shadow">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black tracking-tight">{t('dialog.delete_photo.title')}</AlertDialogTitle>
            <AlertDialogDescription className="font-medium text-muted-foreground">
              {t('dialog.delete_photo.description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-3 sm:gap-0 sm:justify-end mt-4">
            <AlertDialogCancel className="rounded-xl border-muted font-bold text-xs uppercase tracking-widest h-11 flex-1 sm:flex-none">
              {t('dialog.delete_photo.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeletePhoto}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold text-xs uppercase tracking-widest h-11 flex-1 sm:flex-none"
            >
              {t('dialog.delete_photo.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Photo Slider Viewer */}
      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-[440px] w-[95vw] h-[85vh] p-0 border-0 bg-transparent shadow-none flex flex-col items-center justify-center [&>button]:hidden">
          <DialogTitle className="sr-only">Галерея</DialogTitle>
          <Carousel className="w-full h-full" opts={{ startIndex: activePhotoIndex }}>
            <CarouselContent className="h-full ml-0">
              {photos.map((url, idx) => (
                <CarouselItem key={`viewer-${url}-${idx}`} className="h-[80vh] flex items-center justify-center p-4 pl-4">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden app-shadow border-4 border-white bg-black/20">
                    <Image src={url} alt={`Gallery view`} fill sizes="(max-width: 480px) 100vw, 440px" className="object-cover" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-black/50 border-0 text-white hover:bg-black/70 z-50 rounded-full" />
            <CarouselNext className="right-4 bg-black/50 border-0 text-white hover:bg-black/70 z-50 rounded-full" />
          </Carousel>
          <div className="absolute top-6 right-6 z-50">
              <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setIsViewerOpen(false)}
                  className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border-white/20 text-white hover:bg-black/40 transition-all active:scale-90 shadow-lg"
              >
                  <X size={20} />
              </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
