
"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { 
  Settings, MapPin, CheckCircle2, Star, Camera, Coffee, Music, Globe, Dumbbell, Edit2, Palette, Trash2, Film, Flower2, Briefcase, Gamepad2, Maximize2, X, Ruler, Target, Zap, Play, CreditCard, Users, Upload, Info, User, GraduationCap, Trophy, Dog, ChevronRight, Heart, Clock, Flame, Check, Gift, Loader2
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
import { cn, getUserTitles } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { ZodiacIcon } from "@/components/shared/zodiac-icon";
import { motion, AnimatePresence } from "framer-motion";
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
import { GROUP_CATEGORIES } from "@/lib/demo-data";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

const defaultJoinedGroups = ["Хип-хоп", "Бег", "UI/UX Дизайн"];

const DAILY_QUESTS = [
  { id: 1, title_ru: 'Поставить 5 лайков', title_en: 'Give 5 likes', progress: 3, total: 5, icon: Heart, color: 'text-pink-500' },
  { id: 2, title_ru: 'Посмотреть 3 анкеты', title_en: 'View 3 profiles', progress: 3, total: 3, icon: User, color: 'text-blue-500' },
  { id: 3, title_ru: 'Написать сообщение', title_en: 'Send a message', progress: 0, total: 1, icon: Zap, color: 'text-amber-500' },
];

function ProfileLoadingSkeleton() {
  return (
    <>
      <AppHeader />
      <main className="flex-1 overflow-y-auto pb-24 bg-[#f8f9fb]">
        <div className="h-24 gradient-bg relative shadow-sm"></div>
        <div className="px-5 -mt-10">
          <div className="text-center mb-6">
            <div className="relative inline-block mb-4">
              <Skeleton className="w-32 h-32 rounded-xl border-[6px] border-white app-shadow" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-48 mx-auto" />
              <Skeleton className="h-4 w-32 mx-auto" />
            </div>
            <div className="grid grid-cols-3 gap-2 mt-6 max-w-sm mx-auto">
              <Skeleton className="h-[76px] rounded-xl" />
              <Skeleton className="h-[76px] rounded-xl" />
              <Skeleton className="h-[76px] rounded-xl" />
            </div>
          </div>
          <Skeleton className="h-48 w-full rounded-xl mb-6" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </main>
      <BottomNav />
    </>
  )
}

export default function ProfilePage() {
  const { t, language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const defaultProfile = useMemo(() => ({
    name: "Анна",
    age: 24,
    city: t('profile.city'),
    height: 172,
    work: "Дизайнер",
    education: "Высшее",
    pets: "Есть собака",
    sleepSchedule: "Сова",
    datingGoal: t('profile.goal_value'),
    match: 87,
    zodiac: language === 'RU' ? "Лев" : "Leo",
    gender: "female",
    lookingFor: "male",
    bio: language === 'RU' 
      ? "Люблю закаты, хороший кофе и интересные разговоры. Ищу человека, с которым можно разделить эти моменты."
      : "I love sunsets, good coffee, and interesting conversations. Looking for someone to share these moments with.",
    interests: language === 'RU' 
      ? ["Фотография", "Путешествия", "Кофе", "Музыка", "Спорт", "Искусство"]
      : ["Photography", "Travel", "Coffee", "Music", "Sports", "Art"],
    joinedGroups: defaultJoinedGroups,
  }), [language, t]);

  const [profile, setProfile] = useState(defaultProfile as any);
  const [photos, setPhotos] = useState([
    PlaceHolderImages[0].imageUrl, PlaceHolderImages[2].imageUrl, PlaceHolderImages[4].imageUrl, PlaceHolderImages[6].imageUrl, PlaceHolderImages[8].imageUrl,
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [showBoostDialog, setShowBoostDialog] = useState(false);
  const [isBoostLoading, setIsBoostLoading] = useState(false);
  const [showContestDialog, setShowContestDialog] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [photoToDeleteUrl, setPhotoToDeleteUrl] = useState<string | null>(null);

  const stats = { likes: 124, matches: 15 };
  const earnedTitles = useMemo(() => getUserTitles(profile, language), [profile, language]);
  
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
    try {
      const savedProfileData = localStorage.getItem('userProfile');
      if (savedProfileData) {
        const loadedProfile = JSON.parse(savedProfileData);
        if (loadedProfile.joinedGroups === undefined) {
             loadedProfile.joinedGroups = defaultJoinedGroups;
             localStorage.setItem('userProfile', JSON.stringify(loadedProfile));
        }
        setProfile({ ...defaultProfile, ...loadedProfile });
      } else {
        localStorage.setItem('userProfile', JSON.stringify(defaultProfile));
        setProfile(defaultProfile);
      }
      
      const savedPhotos = localStorage.getItem('userProfileGallery');
      if (savedPhotos) setPhotos(JSON.parse(savedPhotos));

    } catch (error) { 
      localStorage.setItem('userProfile', JSON.stringify(defaultProfile));
      setProfile(defaultProfile);
    }
    setIsLoading(false);
  }, [defaultProfile]);


  const handleTriggerFileInput = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (photos.length >= 10) {
        toast({ variant: "destructive", title: language === 'RU' ? "Лимит достигнут" : "Limit reached" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhotos = [...photos, reader.result as string];
        setPhotos(newPhotos);
        localStorage.setItem('userProfileGallery', JSON.stringify(newPhotos));
        toast({ title: language === 'RU' ? "Фото добавлено" : "Photo added" });
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const requestDeletePhoto = (url: string) => {
    setPhotoToDeleteUrl(url);
    setShowDeleteConfirm(true);
  };

  const executeDeletePhoto = () => {
    if (photoToDeleteUrl === null) return;

    if (photos.length <= 1) {
        toast({
            variant: "destructive",
            title: t('delete_photo_error.title'),
            description: t('delete_photo_error.description'),
        });
        setShowDeleteConfirm(false);
        setPhotoToDeleteUrl(null);
        return;
    }

    const newPhotos = photos.filter((p) => p !== photoToDeleteUrl);
    setPhotos(newPhotos);
    localStorage.setItem('userProfileGallery', JSON.stringify(newPhotos));
    toast({ title: language === 'RU' ? "Фото удалено" : "Photo deleted" });
    
    setShowDeleteConfirm(false);
    setPhotoToDeleteUrl(null);
  };

  const handleBoostAd = () => {
    setIsBoostLoading(true);
    setTimeout(() => {
      setIsBoostLoading(false);
      setShowBoostDialog(false);
      toast({ title: t('boost.success_ad') });
    }, 3000);
  };

  const handleBoostPaid = () => {
    setShowBoostDialog(false);
    toast({ title: t('boost.success_paid') });
  };

  const handleOpenContestDialog = () => {
    setShowContestDialog(true);
  };

  const handleSubmitToContest = (photoUrl: string) => {
    setShowContestDialog(false);
    toast({
      title: t('contest.submit_success'),
    });
  };

  const openPhotoViewer = (index: number) => { setActivePhotoIndex(index); setIsViewerOpen(true); };

  const interestIconsMap: Record<string, any> = {
    "Фотография": Camera, "Путешествия": Globe, "Кофе": Coffee, "Музыка": Music, "Спорт": Dumbbell, "Искусство": Palette, "Кино": Film, "Йога": Flower2, "Бизнес": Briefcase, "Игры": Gamepad2, "Кошки": Dog,
    "Photography": Camera, "Travel": Globe, "Sports": Dumbbell, "Art": Palette, "Movies": Film, "Yoga": Flower2, "Business": Briefcase, "Gaming": Gamepad2, "Cats": Dog
  };
  
  const LifestyleItem = ({ label, value, icon: Icon, className }: { label: string, value: any, icon?: any, className?: string }) => (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">{label}</span>
      <Badge variant="secondary" className="bg-muted/40 text-foreground border-0 gap-1.5 py-2 px-3 font-bold text-[10px] rounded-lg shadow-sm justify-start w-full transition-all hover:bg-muted/60">
        {Icon && (typeof Icon === 'string' ? <ZodiacIcon sign={Icon} /> : <Icon size={12} className="text-primary/70" />)}
        <span className="truncate">{value}</span>
      </Badge>
    </div>
  );

  const totalQuestProgress = useMemo(() => {
    const total = DAILY_QUESTS.reduce((acc, q) => acc + q.total, 0);
    const progress = DAILY_QUESTS.reduce((acc, q) => acc + q.progress, 0);
    return Math.round((progress / total) * 100);
  }, []);

  if (isLoading) {
    return <ProfileLoadingSkeleton />;
  }

  return (
    <>
      <AppHeader />
      <main className="flex-1 overflow-y-auto pb-24 bg-[#f8f9fb]">
        <div className="h-24 gradient-bg relative shadow-sm">
          <Link href="/settings" prefetch={true} className="absolute top-4 right-6 text-white/90 p-2 bg-black/15 rounded-full hover:bg-black/25 transition-all backdrop-blur-md"><Settings size={18} /></Link>
        </div>
        <div className="px-5 -mt-10">
          <div className="text-center mb-6">
            <div className="relative inline-block mb-4">
              <div className="relative w-32 h-32 rounded-xl border-[6px] border-white app-shadow overflow-hidden bg-muted">
                <Image 
                  src={photos[0] || PlaceHolderImages[0].imageUrl} 
                  alt={profile.name} 
                  fill 
                  sizes="128px" 
                  className="object-cover" 
                  priority 
                />
              </div>
              <Link href="/profile/edit" prefetch={true} className="absolute -bottom-2 -right-2 gradient-bg text-white p-3 rounded-xl shadow-xl border-4 border-white hover:scale-110 transition-transform active:scale-90"><Edit2 size={18} /></Link>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black font-headline tracking-tight flex items-center justify-center gap-2">{profile.name}, {profile.age} <CheckCircle2 size={20} className="text-primary" fill="currentColor" /></h3>
              <p className="text-muted-foreground text-[10px] font-black flex items-center justify-center gap-1.5 uppercase tracking-widest opacity-80"><MapPin size={12} className="text-primary" /> {profile.city}</p>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-6 max-w-sm mx-auto">
              <div className="bg-white rounded-xl p-3 shadow-sm border border-border/40">
                <p className="text-lg font-black tracking-tight">{stats.likes}</p>
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{t('profile.likes')}</p>
              </div>
              <div className="bg-white rounded-xl p-3 shadow-sm border border-border/40">
                <p className="text-lg font-black tracking-tight">{stats.matches}</p>
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{t('profile.matches')}</p>
              </div>
              <button 
                onClick={() => setShowBoostDialog(true)}
                className="gradient-bg rounded-xl p-3 shadow-lg shadow-primary/20 text-white flex flex-col items-center justify-center group active:scale-95 transition-all"
              >
                <Zap size={18} className="animate-pulse" fill="currentColor" />
                <p className="text-[8px] font-black uppercase tracking-widest mt-1">Boost</p>
              </button>
            </div>
          </div>

          {/* Gamification Tasks Accordion */}
          <div className="mb-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="tasks" className="border-0">
                <AccordionTrigger className="bg-white text-foreground rounded-xl px-6 py-4 hover:no-underline hover:bg-muted/30 transition-all app-shadow border border-border/40 [&[data-state=open]]:rounded-b-none [&[data-state=open]]:shadow-none">
                  <div className="flex items-center gap-3 w-full text-left">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shadow-sm border border-amber-200">
                      <Target size={16} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-black uppercase tracking-tight">Задания</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-[60px]">
                          <div className="h-full gradient-bg" style={{ width: `${totalQuestProgress}%` }}></div>
                        </div>
                        <span className="text-[9px] font-black text-primary">{totalQuestProgress}%</span>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="bg-white text-foreground rounded-b-xl px-6 pb-6 pt-2 border-x border-b border-border/40 app-shadow space-y-6">
                  {/* Daily Rewards */}
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-blue-500" />
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Ежедневная награда</h5>
                      </div>
                      <Badge className="bg-blue-50 text-blue-600 border border-blue-100 text-[8px] font-black uppercase px-2">День 3</Badge>
                    </div>
                    <div className="grid grid-cols-7 gap-1.5">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className={cn(
                          "aspect-square rounded-lg flex flex-col items-center justify-center gap-1 border transition-all",
                          i < 2 ? "bg-green-50 border-green-200 text-green-600" : 
                          i === 2 ? "gradient-bg border-0 text-white scale-110 shadow-lg shadow-primary/20" : 
                          "bg-muted/30 border-transparent text-muted-foreground/40"
                        )}>
                          {i < 2 ? <Check size={12} strokeWidth={4} /> : <Gift size={12} />}
                          <span className="text-[7px] font-black">{i + 1}</span>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full h-10 rounded-xl gradient-bg hover:opacity-90 text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 border-0">
                      Забрать бонус
                    </Button>
                  </div>

                  <div className="h-px bg-border/50"></div>

                  {/* Daily Quests */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Flame size={14} className="text-orange-500" />
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Квесты дня</h5>
                    </div>
                    <div className="space-y-3">
                      {DAILY_QUESTS.map((quest) => {
                        const Icon = quest.icon;
                        const isDone = quest.progress >= quest.total;
                        return (
                          <div key={quest.id} className="bg-muted/30 rounded-xl p-3 border border-transparent">
                            <div className="flex items-center gap-3 mb-2.5">
                              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center bg-white shadow-sm", quest.color)}>
                                <Icon size={16} fill={isDone ? "currentColor" : "none"} />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                  <p className="text-[11px] font-bold leading-none text-foreground">{language === 'RU' ? quest.title_ru : quest.title_en}</p>
                                  <span className="text-[9px] font-black text-muted-foreground">{quest.progress}/{quest.total}</span>
                                </div>
                                <Progress value={(quest.progress / quest.total) * 100} className="h-1.5 bg-white" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div 
            onClick={handleOpenContestDialog}
            className="bg-white rounded-xl p-4 border border-amber-500/20 app-shadow mb-6 flex items-center justify-between cursor-pointer hover:bg-amber-50/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                <Trophy size={20} fill="currentColor" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-tight">{t('contest.title')}</h4>
                <p className="text-[9px] text-muted-foreground font-bold">{t('contest.participate_banner')}</p>
              </div>
            </div>
            <ChevronRight className="text-muted-foreground/40" size={18} />
          </div>
          
          <div className="bg-white rounded-xl p-6 app-shadow border border-border/40 mb-6 text-left space-y-6 overflow-hidden">
            {earnedTitles.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4"><Trophy size={16} className="text-primary" /><h4 className="font-black text-[11px] uppercase tracking-widest text-muted-foreground">Мое звание</h4></div>
                <div className="flex flex-wrap gap-2">
                  {earnedTitles.map((title) => (
                    <Badge key={title.id} variant="secondary" className={cn("border-0 gap-2 py-2 px-3.5 font-bold text-[10px] rounded-lg shadow-sm transition-all hover:scale-105", title.color)}>
                      <Star size={12} fill="currentColor" className="opacity-70" /> {title.displayName}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="h-px bg-border/50"></div>

            <div>
              <div className="flex items-center gap-2 mb-3"><Info size={16} className="text-primary" /><h4 className="font-black text-[11px] uppercase tracking-widest text-muted-foreground">{t('profile.about')}</h4></div>
              <p className="text-[14px] text-foreground/80 leading-relaxed font-medium">{profile.bio}</p>
            </div>
            
            <div className="h-px bg-border/50"></div>
            
            <div>
              <div className="flex items-center gap-2 mb-4"><User size={16} className="text-primary" /><h4 className="font-black text-[11px] uppercase tracking-widest text-muted-foreground">{t('profile.lifestyle')}</h4></div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-4">
                <LifestyleItem label={t('profile.label.gender')} value={profile.gender === 'male' ? 'Мужчина' : 'Женщина'} icon={User} />
                <LifestyleItem label={t('profile.label.looking_for')} value={profile.lookingFor === 'male' ? 'Мужчину' : profile.lookingFor === 'female' ? 'Женщину' : 'Всех'} icon={Target} />
                <LifestyleItem label={t('profile.label.zodiac')} value={profile.zodiac} icon={profile.zodiac} />
                {profile.height && <LifestyleItem label={t('profile.label.height')} value={`${profile.height} см`} icon={Ruler} />}
                <LifestyleItem label={t('profile.label.goal')} value={profile.datingGoal} icon={Heart} className="col-span-2" />
              </div>
            </div>
            
            <div className="h-px bg-border/50"></div>
            
            <div>
              <div className="flex items-center gap-2 mb-4"><Star size={16} className="text-primary" /><h4 className="font-black text-[11px] uppercase tracking-widest text-muted-foreground">{t('profile.interests')}</h4></div>
              <div className="flex flex-wrap gap-2">{profile.interests.map((interest: string) => { const Icon = interestIconsMap[interest] || Heart; return <Badge key={interest} variant="secondary" className="bg-muted/50 text-foreground/80 border-0 gap-2 py-2 px-4 font-bold text-[11px] rounded-lg transition-all hover:bg-muted/70"><Icon size={14} className="text-primary" /> {interest}</Badge>; })}</div>
            </div>

            <div className="h-px bg-border/50"></div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <label className="flex items-center gap-2">
                  <Users size={16} className="text-primary" />
                  <h4 className="font-black text-[11px] uppercase tracking-widest text-muted-foreground">{t('profile.groups')}</h4>
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.joinedGroups && (profile.joinedGroups as string[]).map((groupName: string) => {
                  const groupInfo = groupDataMap.get(groupName);
                  if (!groupInfo) return null;

                  const displayName = language === 'RU' ? groupInfo.ru : groupInfo.en;
                  const linkHref = groupInfo.id ? `/chats?groupId=${groupInfo.id}` : '#';
                  
                  return (
                    <Link href={linkHref} key={groupName} prefetch={true}>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 border gap-2 py-2 px-4 font-bold text-[11px] rounded-lg transition-all hover:scale-105 shadow-sm cursor-pointer">
                        <Users size={14} /> {displayName}
                      </Badge>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 app-shadow border border-border/40 mb-6 text-left">
            <div className="flex justify-between items-center mb-6"><div className="flex items-center gap-2"><Camera size={18} className="text-primary" /><h4 className="font-black text-[11px] uppercase tracking-widest text-muted-foreground">{t('profile.gallery')}</h4></div><input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" /></div>
            <div className="grid grid-cols-2 gap-3">
              {photos.map((url, idx) => (
                <div key={`${url}-${idx}`} className="relative aspect-square rounded-lg overflow-hidden bg-muted group shadow-sm border border-border/10">
                  <Image src={url} alt={`Photo ${idx}`} fill sizes="(max-width: 480px) 50vw, 240px" className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                          variant="outline"
                          size="icon"
                          aria-label="Expand photo"
                          onClick={() => openPhotoViewer(idx)}
                          className="h-12 w-12 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border-white/30 transition-transform active:scale-90"
                      >
                          <Maximize2 size={24} />
                      </Button>
                      <Button
                          variant="destructive"
                          size="icon"
                          aria-label="Delete photo"
                          onClick={(e) => { e.stopPropagation(); requestDeletePhoto(url); }}
                          className="absolute top-2 right-2 h-9 w-9 rounded-full bg-destructive/80 text-destructive-foreground hover:bg-destructive backdrop-blur-sm border-white/20 shadow-lg"
                      >
                          <Trash2 size={16} />
                      </Button>
                  </div>
                </div>
              ))}
              {photos.length < 10 && (
                <div onClick={handleTriggerFileInput} className="relative aspect-square rounded-lg border-2 border-dashed border-muted flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 hover:border-primary/50 hover:text-primary cursor-pointer transition-colors group">
                  <div className="p-4 bg-muted/60 rounded-full group-hover:bg-primary/10 transition-colors"><Upload size={24} /></div>
                  <span className="mt-3 text-[9px] font-black uppercase tracking-widest">{t('profile.add')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showBoostDialog && (
          <Dialog open={showBoostDialog} onOpenChange={setShowBoostDialog}>
            <DialogContent className="max-w-[340px] rounded-xl p-0 overflow-hidden border-0 bg-white app-shadow">
              <div className="relative h-40 gradient-bg flex flex-col items-center justify-center text-white p-6 overflow-hidden">
                 <div className="absolute inset-0 bg-black/5"></div>
                 <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute"><Zap size={160} fill="currentColor" /></motion.div>
                 <Zap className="text-yellow-300 mb-2 drop-shadow-lg relative z-10 animate-pulse" size={48} fill="currentColor" />
                 <DialogTitle className="text-2xl font-black uppercase tracking-tighter relative z-10">{t('boost.title')}</DialogTitle>
                 <p className="text-[10px] text-white/90 font-bold uppercase tracking-[0.1em] relative z-10 mt-1 text-center px-4 leading-relaxed">{t('boost.desc')}</p>
              </div>
              <div className="p-6 space-y-4">
                <Button onClick={handleBoostAd} disabled={isBoostLoading} variant="outline" className="w-full h-16 rounded-xl border-2 border-primary/20 bg-primary/5 flex flex-col items-center justify-center gap-1 group hover:bg-primary/10 transition-all border-dashed">
                  {isBoostLoading ? (<div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div><span className="text-[10px] font-black uppercase tracking-widest text-primary">{language === 'RU' ? 'Загрузка...' : 'Loading...'}</span></div>) : (<><div className="flex items-center gap-2 text-primary"><Play size={14} fill="currentColor" /><span className="text-[11px] font-black uppercase tracking-widest">{t('boost.free')}</span></div><span className="text-[8px] text-muted-foreground font-bold uppercase tracking-tighter opacity-60">{language === 'RU' ? '1 Буст за видео' : '1 Boost for 1 Video'}</span></>)}
                </Button>
                <div className="relative py-2"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-muted"></span></div><div className="relative flex justify-center text-[8px] uppercase font-black tracking-widest text-muted-foreground bg-white px-4">или</div></div>
                <Button onClick={handleBoostPaid} className="w-full h-16 rounded-xl gradient-bg text-white shadow-xl shadow-primary/20 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all border-0">
                  <div className="flex items-center gap-2">
                    <CreditCard size={16} />
                    <span className="text-xs font-black uppercase tracking-widest">{t('boost.paid')}</span>
                  </div>
                  <span className="text-[10px] text-white/80 font-bold uppercase tracking-tighter">{language === 'RU' ? 'Всего за 99 ₽' : 'Just $1.99'}</span>
                </Button>
              </div>
              <DialogFooter className="p-6 pt-0"><Button variant="ghost" onClick={() => setShowBoostDialog(false)} className="w-full text-muted-foreground text-[9px] font-black uppercase tracking-widest h-10">{t('button.not_now')}</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showContestDialog && (
          <Dialog open={showContestDialog} onOpenChange={setShowContestDialog}>
            <DialogContent className="max-w-[360px] rounded-xl p-0 overflow-hidden border-0 bg-white app-shadow">
              <div className="relative h-32 bg-gradient-to-r from-amber-500 to-orange-600 flex flex-col items-center justify-center text-white p-6">
                 <Trophy className="text-white/40 absolute -right-4 -bottom-4" size={100} fill="currentColor" />
                 <DialogTitle className="text-xl font-black uppercase tracking-tighter relative z-10">{t('contest.select_photo')}</DialogTitle>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-3 gap-2">
                  {photos.map((url, idx) => (
                    <div 
                      key={`contest-select-${url}-${idx}`} 
                      onClick={() => handleSubmitToContest(url)}
                      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:ring-4 ring-primary/20 transition-all bg-muted"
                    >
                      <Image src={url} alt={`Gallery photo ${idx}`} fill sizes="100px" className="object-cover" />
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-muted/30 rounded-xl">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{t('contest.rules')}</p>
                  <p className="text-[10px] text-muted-foreground leading-snug">{t('contest.rules_desc')}</p>
                </div>
              </div>
              <DialogFooter className="p-5 pt-0">
                <Button variant="ghost" onClick={() => setShowContestDialog(false)} className="w-full text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                  {t('button.not_now')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-[440px] w-[95vw] h-[85vh] p-0 border-0 bg-transparent shadow-none flex flex-col items-center justify-center [&>button]:hidden">
          <DialogTitle className="sr-only">Viewer</DialogTitle>
          <Carousel className="w-full h-full" opts={{ startIndex: activePhotoIndex }}>
            <CarouselContent className="h-full ml-0">
              {photos.map((url, idx) => (
                <CarouselItem key={`viewer-full-${url}-${idx}`} className="h-[80vh] flex items-center justify-center p-4 pl-4">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden app-shadow">
                    <Image src={url} alt={`Photo viewer`} fill sizes="(max-width: 480px) 100vw, 440px" className="object-cover" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-black/50 border-0 text-white hover:bg-black/70 z-50" />
            <CarouselNext className="right-4 bg-black/50 border-0 text-white hover:bg-black/70 z-50" />
          </Carousel>
          <div className="absolute top-6 right-6 z-50">
            <Button variant="outline" size="icon" onClick={() => setIsViewerOpen(false)} className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border-white/20 text-white hover:bg-black/40 transition-all active:scale-90 shadow-lg"><X size={20} /></Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
            <AlertDialogTitle>{t('dialog.delete_photo.title')}</AlertDialogTitle>
            <AlertDialogDescription>
                {t('dialog.delete_photo.description')}
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPhotoToDeleteUrl(null)}>{t('dialog.delete_photo.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={executeDeletePhoto} className="bg-destructive hover:bg-destructive/90">
                {t('dialog.delete_photo.confirm')}
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNav />
    </>
  );
}
