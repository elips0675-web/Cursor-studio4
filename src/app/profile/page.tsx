
"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { 
  Settings, MapPin, CheckCircle2, Star, Camera, Coffee, Music, Globe, Dumbbell, Edit2, Palette, Trash2, Film, Flower2, Briefcase, Gamepad2, Maximize2, X, Dog, Ruler, Moon, Sun, Target, Sparkles, Heart, Upload, Info, User, GraduationCap, Bed, Trophy, RotateCcw, Zap, Play, CreditCard, MoreVertical
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import dynamic from 'next/dynamic';
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

const Dialog = dynamic(() => import("@/components/ui/dialog").then(mod => mod.Dialog));
const DialogContent = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogContent));
const DialogTitle = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogTitle));
const DialogDescription = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogDescription));
const DialogHeader = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogHeader));
const DialogFooter = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogFooter));

const AlertDialog = dynamic(() => import("@/components/ui/alert-dialog").then(mod => mod.AlertDialog), { ssr: false });
const AlertDialogAction = dynamic(() => import("@/components/ui/alert-dialog").then(mod => mod.AlertDialogAction), { ssr: false });
const AlertDialogCancel = dynamic(() => import("@/components/ui/alert-dialog").then(mod => mod.AlertDialogCancel), { ssr: false });
const AlertDialogContent = dynamic(() => import("@/components/ui/alert-dialog").then(mod => mod.AlertDialogContent), { ssr: false });
const AlertDialogDescription = dynamic(() => import("@/components/ui/alert-dialog").then(mod => mod.AlertDialogDescription), { ssr: false });
const AlertDialogFooter = dynamic(() => import("@/components/ui/alert-dialog").then(mod => mod.AlertDialogFooter), { ssr: false });
const AlertDialogHeader = dynamic(() => import("@/components/ui/alert-dialog").then(mod => mod.AlertDialogHeader), { ssr: false });
const AlertDialogTitle = dynamic(() => import("@/components/ui/alert-dialog").then(mod => mod.AlertDialogTitle), { ssr: false });


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
  };

  const [profile, setProfile] = useState(defaultProfile);
  const [photos, setPhotos] = useState([
    PlaceHolderImages[0].imageUrl, PlaceHolderImages[2].imageUrl, PlaceHolderImages[4].imageUrl, PlaceHolderImages[6].imageUrl, PlaceHolderImages[8].imageUrl,
  ]);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [showBoostDialog, setShowBoostDialog] = useState(false);
  const [isBoostLoading, setIsBoostLoading] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [photoToDeleteIndex, setPhotoToDeleteIndex] = useState<number | null>(null);

  const stats = { likes: 124, matches: 15 };
  const earnedTitles = useMemo(() => getUserTitles(profile, language), [profile, language]);

  useEffect(() => {
    try {
      const savedProfileData = localStorage.getItem('userProfile');
      if (savedProfileData) {
        const loadedProfile = JSON.parse(savedProfileData);
        setProfile({ ...defaultProfile, ...loadedProfile });
      } else setProfile(defaultProfile);
      
      const savedPhotos = localStorage.getItem('userProfileGallery');
      if (savedPhotos) setPhotos(JSON.parse(savedPhotos));
    } catch (error) { setProfile(defaultProfile); }
  }, [language, t]);

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

  const requestDeletePhoto = (index: number) => {
    setPhotoToDeleteIndex(index);
    setShowDeleteConfirm(true);
  };

  const executeDeletePhoto = () => {
    if (photoToDeleteIndex === null) return;

    if (photos.length <= 1) {
        toast({
            variant: "destructive",
            title: t('delete_photo_error.title'),
            description: t('delete_photo_error.description'),
        });
        setShowDeleteConfirm(false);
        setPhotoToDeleteIndex(null);
        return;
    }

    const newPhotos = photos.filter((_, i) => i !== photoToDeleteIndex);
    setPhotos(newPhotos);
    localStorage.setItem('userProfileGallery', JSON.stringify(newPhotos));
    toast({ title: language === 'RU' ? "Фото удалено" : "Photo deleted" });
    
    setShowDeleteConfirm(false);
    setPhotoToDeleteIndex(null);
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

  const openPhotoViewer = (index: number) => { setActivePhotoIndex(index); setIsViewerOpen(true); };

  const interestIconsMap: Record<string, any> = {
    "Фотография": Camera, "Путешествия": Globe, "Кофе": Coffee, "Музыка": Music, "Спорт": Dumbbell, "Искусство": Palette, "Кино": Film, "Йога": Flower2, "Бизнес": Briefcase, "Игры": Gamepad2, "Кошки": Dog,
    "Photography": Camera, "Travel": Globe, "Sports": Dumbbell, "Art": Palette, "Movies": Film, "Yoga": Flower2, "Business": Briefcase, "Gaming": Gamepad2, "Cats": Dog
  };
  
  const getSleepIcon = () => profile.sleepSchedule === 'Сова' ? Moon : profile.sleepSchedule === 'Жаворонок' ? Sun : Bed;

  const LifestyleItem = ({ label, value, icon: Icon, className }: { label: string, value: any, icon?: any, className?: string }) => (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">{label}</span>
      <Badge variant="secondary" className="bg-muted/40 text-foreground border-0 gap-1.5 py-2 px-3 font-bold text-[10px] rounded-lg shadow-sm justify-start w-full transition-all hover:bg-muted/60">
        {Icon && (typeof Icon === 'string' ? <ZodiacIcon sign={Icon} /> : <Icon size={12} className="text-primary/70" />)}
        <span className="truncate">{value}</span>
      </Badge>
    </div>
  );

  return (
    <>
      <AppHeader />
      <main className="flex-1 overflow-y-auto pb-24 bg-[#f8f9fb]">
        <div className="h-24 gradient-bg relative shadow-sm">
          <Link href="/settings" className="absolute top-4 right-6 text-white/90 p-2 bg-black/15 rounded-full hover:bg-black/25 transition-all backdrop-blur-md"><Settings size={18} /></Link>
        </div>
        <div className="px-5 -mt-10">
          <div className="text-center mb-6">
            <div className="relative inline-block mb-4">
              <div className="relative w-32 h-32 rounded-[2.5rem] border-[6px] border-white app-shadow overflow-hidden bg-muted"><Image src={photos[0] || PlaceHolderImages[0].imageUrl} alt={profile.name} fill className="object-cover" priority /></div>
              <Link href="/profile/edit" className="absolute -bottom-2 -right-2 gradient-bg text-white p-3 rounded-2xl shadow-xl border-4 border-white hover:scale-110 transition-transform active:scale-90"><Edit2 size={18} /></Link>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black font-headline tracking-tight flex items-center justify-center gap-2">{profile.name}, {profile.age} <CheckCircle2 size={20} className="text-primary" fill="currentColor" /></h3>
              <p className="text-muted-foreground text-[10px] font-black flex items-center justify-center gap-1.5 uppercase tracking-widest opacity-80"><MapPin size={12} className="text-primary" /> {profile.city}</p>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-6 max-w-sm mx-auto">
              <div className="bg-white rounded-2xl p-3 shadow-sm border border-border/40">
                <p className="text-lg font-black tracking-tight">{stats.likes}</p>
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{t('profile.likes')}</p>
              </div>
              <div className="bg-white rounded-2xl p-3 shadow-sm border border-border/40">
                <p className="text-lg font-black tracking-tight">{stats.matches}</p>
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{t('profile.matches')}</p>
              </div>
              <button 
                onClick={() => setShowBoostDialog(true)}
                className="gradient-bg rounded-2xl p-3 shadow-lg shadow-primary/20 text-white flex flex-col items-center justify-center group active:scale-95 transition-all"
              >
                <Zap size={18} className="animate-pulse" fill="currentColor" />
                <p className="text-[8px] font-black uppercase tracking-widest mt-1">Boost</p>
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-[1.5rem] p-6 app-shadow border border-border/40 mb-6 text-left space-y-6 overflow-hidden">
            {earnedTitles.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4"><Trophy size={16} className="text-primary" /><h4 className="font-black text-[11px] uppercase tracking-widest text-muted-foreground">Мое звание</h4></div>
                <div className="flex flex-wrap gap-2">
                  {earnedTitles.map((title) => (
                    <Badge key={title.id} variant="secondary" className={cn("border-0 gap-2 py-2 px-3.5 font-bold text-[10px] rounded-lg shadow-sm transition-all hover:scale-105", title.color)}>
                      <Star size={14} fill="currentColor" className="opacity-70" /> {title.displayName}
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
              <div className="flex flex-wrap gap-2">{profile.interests.map((interest) => { const Icon = interestIconsMap[interest] || Heart; return <Badge key={interest} variant="secondary" className="bg-muted/40 text-foreground/80 border-0 gap-2 py-2 px-3.5 font-bold text-[10px] rounded-lg transition-all hover:scale-105"><Icon size={14} className="text-primary" /> {interest}</Badge>; })}</div>
            </div>
          </div>

          <div className="bg-white rounded-[1.5rem] p-6 app-shadow border border-border/40 mb-12 text-left">
            <div className="flex justify-between items-center mb-6"><div className="flex items-center gap-2"><Camera size={18} className="text-primary" /><h4 className="font-black text-[11px] uppercase tracking-widest text-muted-foreground">{t('profile.gallery')}</h4></div><input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" /></div>
            <div className="grid grid-cols-2 gap-3">{photos.map((url, idx) => (<div key={idx} onClick={() => openPhotoViewer(idx)} className="relative aspect-square rounded-xl overflow-hidden bg-muted group shadow-sm border border-border/10 cursor-pointer"><Image src={url} alt={`Photo ${idx}`} fill className="object-cover" /><div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Maximize2 size={24} className="text-white/80 drop-shadow-md" /></div>
              <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    variant="destructive"
                    size="icon"
                    onClick={(e) => { e.stopPropagation(); requestDeletePhoto(idx); }}
                    className="h-8 w-8 rounded-full bg-destructive/80 text-destructive-foreground hover:bg-destructive backdrop-blur-sm border-white/20"
                >
                    <Trash2 size={16} />
                </Button>
              </div>
            </div>))}{photos.length < 10 && (<div onClick={handleTriggerFileInput} className="relative aspect-square rounded-2xl border-2 border-dashed border-muted flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 hover:border-primary/50 hover:text-primary cursor-pointer transition-colors group"><div className="p-4 bg-muted/60 rounded-full group-hover:bg-primary/10 transition-colors"><Upload size={24} /></div><span className="mt-3 text-[9px] font-black uppercase tracking-widest">{t('profile.add')}</span></div>)}</div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showBoostDialog && (
          <Dialog open={showBoostDialog} onOpenChange={setShowBoostDialog}>
            <DialogContent className="max-w-[340px] rounded-[2.5rem] p-0 overflow-hidden border-0 bg-white app-shadow">
              <div className="relative h-40 gradient-bg flex flex-col items-center justify-center text-white p-6 overflow-hidden">
                 <div className="absolute inset-0 bg-black/5"></div>
                 <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute"><Zap size={160} fill="currentColor" /></motion.div>
                 <Zap className="text-yellow-300 mb-2 drop-shadow-lg relative z-10 animate-pulse" size={48} fill="currentColor" />
                 <DialogTitle className="text-2xl font-black uppercase tracking-tighter relative z-10">{t('boost.title')}</DialogTitle>
                 <p className="text-[10px] text-white/90 font-bold uppercase tracking-[0.1em] relative z-10 mt-1 text-center px-4 leading-relaxed">{t('boost.desc')}</p>
              </div>
              <div className="p-6 space-y-4">
                <Button onClick={handleBoostAd} disabled={isBoostLoading} variant="outline" className="w-full h-16 rounded-2xl border-2 border-primary/20 bg-primary/5 flex flex-col items-center justify-center gap-1 group hover:bg-primary/10 transition-all border-dashed">
                  {isBoostLoading ? (<div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div><span className="text-[10px] font-black uppercase tracking-widest text-primary">{language === 'RU' ? 'Загрузка...' : 'Loading...'}</span></div>) : (<><div className="flex items-center gap-2 text-primary"><Play size={14} fill="currentColor" /><span className="text-[11px] font-black uppercase tracking-widest">{t('boost.free')}</span></div><span className="text-[8px] text-muted-foreground font-bold uppercase tracking-tighter opacity-60">{language === 'RU' ? '1 Буст за видео' : '1 Boost for 1 Video'}</span></>)}
                </Button>
                <div className="relative py-2"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-muted"></span></div><div className="relative flex justify-center text-[8px] uppercase font-black tracking-widest text-muted-foreground bg-white px-4">или</div></div>
                <Button onClick={handleBoostPaid} className="w-full h-16 rounded-2xl gradient-bg text-white shadow-xl shadow-primary/20 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all border-0">
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

      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-[440px] w-[95vw] h-[85vh] p-0 border-0 bg-transparent shadow-none flex flex-col items-center justify-center [&>button]:hidden">
          <DialogTitle className="sr-only">Viewer</DialogTitle>
          <Carousel className="w-full h-full" opts={{ startIndex: activePhotoIndex }}>
            <CarouselContent className="h-full ml-0">
              {photos.map((url, idx) => (
                <CarouselItem key={idx} className="h-[80vh] flex items-center justify-center p-4 pl-4">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden app-shadow">
                    <Image src={url} alt={`Photo ${idx}`} fill sizes="(max-width: 480px) 100vw, 440px" className="object-cover" />
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
        <AlertDialogContent className="rounded-3xl">
            <AlertDialogHeader>
            <AlertDialogTitle>{t('dialog.delete_photo.title')}</AlertDialogTitle>
            <AlertDialogDescription>
                {t('dialog.delete_photo.description')}
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPhotoToDeleteIndex(null)}>{t('dialog.delete_photo.cancel')}</AlertDialogCancel>
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
