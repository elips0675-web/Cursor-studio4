
"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Settings, 
  MapPin, 
  CheckCircle2, 
  Star, 
  Camera, 
  Coffee, 
  Music, 
  Globe, 
  Dumbbell,
  Edit2,
  Palette,
  Plus,
  Trash2,
  Film,
  Flower2,
  Briefcase,
  Gamepad2,
  Maximize2,
  X,
  Dog,
  Ruler,
  Moon,
  Sun,
  Target,
  Sparkles,
  Heart,
  Upload,
  Info,
  User,
  GraduationCap,
  Bed,
  Trophy,
  Users,
  Crown,
  Compass
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { AppHeader } from "@/components/layout/app-header";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const ZodiacIcon = ({ sign }: { sign: string }) => {
  const signs: Record<string, string> = {
    "Овен": "♈", "Телец": "♉", "Близнецы": "♊", "Рак": "♋", "Лев": "♌", "Дева": "♍",
    "Весы": "♎", "Скорпион": "♏", "Стрелец": "♐", "Козерог": "♑", "Водолей": "♒", "Рыбы": "♓",
    "Aries": "♈", "Taurus": "♉", "Gemini": "♊", "Cancer": "♋", "Leo": "♌", "Virgo": "♍",
    "Libra": "♎", "Scorpio": "♏", "Sagittarius": "♐", "Capricorn": "♑", "Aquarius": "♒", "Pisces": "♓"
  };
  return <span className="text-xl leading-none">{signs[sign] || "✨"}</span>;
};

export default function ProfilePage() {
  const { t, language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const defaultProfile = {
    name: "Анна",
    age: 24,
    city: t('profile.city'),
    height: 172,
    work: "Дизайнер",
    education: "Высшее",
    pets: "Есть собака",
    sleepSchedule: "Сова",
    datingGoal: t('profile.goal_value'),
    zodiac: language === 'RU' ? "Лев" : "Leo",
    bio: language === 'RU' 
      ? "Люблю закаты, хороший кофе и интересные разговоры. Ищу человека, с которым можно разделить эти моменты."
      : "I love sunsets, good coffee, and interesting conversations. Looking for someone to share these moments with.",
    interests: language === 'RU' 
      ? ["Фотография", "Путешествия", "Кофе", "Музыка", "Спорт", "Искусство", "Собаки"]
      : ["Photography", "Travel", "Coffee", "Music", "Sports", "Art", "Dogs"],
    titles: [] as {id: string, name: string}[]
  };

  const [profile, setProfile] = useState(defaultProfile);

  const [photos, setPhotos] = useState([
    PlaceHolderImages[0].imageUrl,
    PlaceHolderImages[2].imageUrl,
    PlaceHolderImages[4].imageUrl,
    PlaceHolderImages[6].imageUrl,
    PlaceHolderImages[8].imageUrl,
  ]);

  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  useEffect(() => {
    try {
      const savedProfileData = localStorage.getItem('userProfile');
      if (savedProfileData) {
        setProfile(prev => ({ ...prev, ...JSON.parse(savedProfileData) }));
      } else {
        setProfile(defaultProfile);
      }
      
      const savedPhotos = localStorage.getItem('userProfileGallery');
      if (savedPhotos) {
        setPhotos(JSON.parse(savedPhotos));
      }
    } catch (error) {
      console.error("Failed to parse profile from localStorage", error);
      setProfile(defaultProfile);
    }
  }, [language, t]);

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (photos.length >= 10) {
        toast({
          variant: "destructive",
          title: language === 'RU' ? "Лимит достигнут" : "Limit reached",
          description: language === 'RU' ? "Максимум 10 фотографий в профиле." : "Maximum 10 photos in profile.",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhotos = [...photos, reader.result as string];
        setPhotos(newPhotos);
        localStorage.setItem('userProfileGallery', JSON.stringify(newPhotos));
        toast({
          title: language === 'RU' ? "Фото добавлено" : "Photo added",
          description: language === 'RU' ? "Ваша галерея обновлена." : "Your gallery has been updated.",
        });
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handleDeletePhoto = (index: number) => {
    if (photos.length <= 1) {
      toast({
        variant: "destructive",
        title: language === 'RU' ? "Ошибка" : "Error",
        description: language === 'RU' ? "В профиле должно быть хотя бы одно фото." : "At least one photo must be in profile.",
      });
      return;
    }
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    localStorage.setItem('userProfileGallery', JSON.stringify(newPhotos));
    toast({
      title: language === 'RU' ? "Фото удалено" : "Photo deleted",
    });
  };

  const openPhotoViewer = (index: number) => {
    setActivePhotoIndex(index);
    setIsViewerOpen(true);
  };

  const interestMap: Record<string, React.ElementType> = {
    "Фотография": Camera, "Путешествия": Globe, "Кофе": Coffee, "Музыка": Music, "Спорт": Dumbbell,
    "Искусство": Palette, "Кино": Film, "Йога": Flower2, "Бизнес": Briefcase, "Игры": Gamepad2,
    "Собаки": Dog, "Кошки": Dog,
    "Photography": Camera, "Travel": Globe, "Sports": Dumbbell, "Art": Palette, "Movies": Film,
    "Yoga": Flower2, "Business": Briefcase, "Gaming": Gamepad2, "Dogs": Dog, "Cats": Dog
  };
  
  const titleMap: Record<string, React.ElementType> = {
    'party': Users,
    'romantic': Heart,
    'king': Crown,
    'explorer': Compass,
  };

  const getSleepIcon = () => {
    if (profile.sleepSchedule === 'Сова') return Moon;
    if (profile.sleepSchedule === 'Жаворонок') return Sun;
    return Bed;
  };

  return (
    <>
      <AppHeader />
      <main className="flex-1 overflow-y-auto pb-24 bg-[#f8f9fb]">
        <div className="h-24 gradient-bg relative shadow-sm">
          <Link href="/settings" className="absolute top-4 right-6 text-white/90 p-2 bg-black/15 rounded-full hover:bg-black/25 transition-all backdrop-blur-md">
            <Settings size={18} />
          </Link>
        </div>

        <div className="px-5 -mt-10">
          <div className="text-center mb-6">
            <div className="relative inline-block mb-4">
              <div 
                className="relative w-32 h-32 rounded-[2.5rem] border-[6px] border-white app-shadow overflow-hidden bg-muted"
              >
                <Image src={photos[0] || PlaceHolderImages[0].imageUrl} alt={profile.name} fill className="object-cover" priority />
              </div>
              <Link 
                href="/profile/edit" 
                className="absolute -bottom-2 -right-2 gradient-bg text-white p-3 rounded-2xl shadow-xl border-4 border-white hover:scale-110 transition-transform active:scale-90"
              >
                 <Edit2 size={18} />
              </Link>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black font-headline tracking-tight flex items-center justify-center gap-2">
                {profile.name}, {profile.age} <CheckCircle2 size={20} className="text-primary" fill="currentColor" />
              </h3>
              <p className="text-muted-foreground text-[10px] font-black flex items-center justify-center gap-1.5 uppercase tracking-widest opacity-80">
                <MapPin size={12} className="text-primary" /> {profile.city}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 app-shadow border border-border/40 mb-6 text-left space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Info size={16} className="text-primary" />
                <h4 className="font-black text-[11px] uppercase tracking-widest text-muted-foreground">{t('profile.about')}</h4>
              </div>
              <p className="text-[14px] text-foreground/80 leading-relaxed font-medium">
                {profile.bio}
              </p>
            </div>
            
            <div className="h-px bg-border/50"></div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <User size={16} className="text-primary" />
                <h4 className="font-black text-[11px] uppercase tracking-widest text-muted-foreground">{t('profile.lifestyle')}</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-orange-50 text-orange-600 border-0 gap-1.5 py-2 px-3.5 font-bold text-[10px] rounded-xl shadow-sm">
                  <ZodiacIcon sign={profile.zodiac} /> {profile.zodiac}
                </Badge>
                {profile.height && (
                  <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-0 gap-1.5 py-2 px-3.5 font-bold text-[10px] rounded-xl shadow-sm">
                    <Ruler size={12} /> {profile.height} см
                  </Badge>
                )}
                <Badge variant="secondary" className="bg-primary/5 text-primary border-0 gap-1.5 py-2 px-3.5 font-bold text-[10px] rounded-xl shadow-sm">
                  <Target size={12} /> {profile.datingGoal}
                </Badge>
                {profile.education && (
                  <Badge variant="secondary" className="bg-purple-50 text-purple-600 border-0 gap-1.5 py-2 px-3.5 font-bold text-[10px] rounded-xl shadow-sm">
                    <GraduationCap size={12} /> {profile.education}
                  </Badge>
                )}
                {profile.work && (
                  <Badge variant="secondary" className="bg-green-50 text-green-600 border-0 gap-1.5 py-2 px-3.5 font-bold text-[10px] rounded-xl shadow-sm">
                    <Briefcase size={12} /> {profile.work}
                  </Badge>
                )}
                {profile.pets && (
                   <Badge variant="secondary" className="bg-amber-50 text-amber-600 border-0 gap-1.5 py-2 px-3.5 font-bold text-[10px] rounded-xl shadow-sm">
                    <Dog size={12} /> {profile.pets}
                  </Badge>
                )}
                {profile.sleepSchedule && (
                   <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-0 gap-1.5 py-2 px-3.5 font-bold text-[10px] rounded-xl shadow-sm">
                    {React.createElement(getSleepIcon(), { size: 12 })} {profile.sleepSchedule}
                  </Badge>
                )}
              </div>
            </div>

            <div className="h-px bg-border/50"></div>
            
            <div>
              <div className="flex items-center gap-2 mb-4">
                 <Star size={16} className="text-primary" />
                 <h4 className="font-black text-[11px] uppercase tracking-widest text-muted-foreground">{t('profile.interests')}</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest) => {
                  const Icon = interestMap[interest] || Heart;
                  return (
                    <Badge key={interest} variant="secondary" className="bg-muted/40 text-foreground/80 border-0 gap-2 py-2 px-3.5 font-bold text-[10px] rounded-xl">
                      <Icon size={14} className="text-primary" /> {interest}
                    </Badge>
                  );
                })}
              </div>
            </div>
            
            {profile.titles && profile.titles.length > 0 && (
              <>
                <div className="h-px bg-border/50"></div>
                <div>
                  <div className="flex items-center gap-2 mb-4">
                     <Trophy size={16} className="text-primary" />
                     <h4 className="font-black text-[11px] uppercase tracking-widest text-muted-foreground">Звания</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.titles.map((title) => {
                      const Icon = titleMap[title.id] || Trophy;
                      return (
                        <Badge key={title.id} variant="secondary" className="bg-yellow-50 text-yellow-700 border border-yellow-200/50 gap-2 py-2 px-3.5 font-bold text-[10px] rounded-xl shadow-sm">
                          <Icon size={14} /> {title.name}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="bg-white rounded-[2rem] p-6 app-shadow border border-border/40 mb-12 text-left">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <Camera size={18} className="text-primary" />
                    <h4 className="font-black text-[11px] uppercase tracking-widest text-muted-foreground">{t('profile.gallery')}</h4>
                </div>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                {photos.map((url, idx) => (
                <div key={idx} onClick={() => openPhotoViewer(idx)} className="relative aspect-square rounded-xl overflow-hidden bg-muted group shadow-sm border border-border/10 cursor-pointer">
                    <Image src={url} alt={`Photo ${idx}`} fill className="object-cover" />
                    
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 size={24} className="text-white/80 drop-shadow-md" />
                    </div>

                    <button 
                        onClick={(e) => { e.stopPropagation(); handleDeletePhoto(idx); }} 
                        className="absolute top-2 right-2 p-2 bg-white text-destructive rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white hover:scale-110 z-10 shadow-md"
                    >
                        <Trash2 size={12} strokeWidth={2.5} />
                    </button>
                </div>
                ))}
                {photos.length < 10 && (
                    <div 
                        onClick={handleTriggerFileInput} 
                        className="relative aspect-square rounded-xl border-2 border-dashed border-muted flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 hover:border-primary/50 hover:text-primary cursor-pointer transition-colors group"
                    >
                        <div className="p-4 bg-muted/60 rounded-full group-hover:bg-primary/10 transition-colors">
                            <Upload size={24} />
                        </div>
                        <span className="mt-3 text-[9px] font-black uppercase tracking-widest">{t('profile.add')}</span>
                    </div>
                )}
            </div>
          </div>
        </div>
      </main>

      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-[440px] w-[95vw] h-[85vh] p-0 border-0 bg-transparent shadow-none flex flex-col items-center justify-center">
          <DialogTitle className="sr-only">Viewer</DialogTitle>
          <button onClick={() => setIsViewerOpen(false)} className="absolute top-6 right-6 z-50 p-2 bg-black/50 text-white rounded-full">
            <X size={24} />
          </button>
          
          <Carousel className="w-full h-full" opts={{ startIndex: activePhotoIndex }}>
            <CarouselContent className="h-full ml-0">
              {photos.map((url, idx) => (
                <CarouselItem key={idx} className="h-[80vh] flex items-center justify-center p-4 pl-4">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden app-shadow">
                    <Image src={url} alt={`Gallery view ${idx}`} fill className="object-cover" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-black/50 border-0 text-white hover:bg-black/70" />
            <CarouselNext className="right-4 bg-black/50 border-0 text-white hover:bg-black/70" />
          </Carousel>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </>
  );
}
