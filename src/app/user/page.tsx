
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import { 
  MapPin, 
  CheckCircle2, 
  Star, 
  Camera, 
  Coffee, 
  Music, 
  Globe, 
  Dumbbell,
  Palette,
  Film,
  Flower2,
  Briefcase,
  Gamepad2,
  Maximize2,
  X,
  Dog,
  Ruler,
  Target,
  Sparkles,
  Heart,
  MessageCircle,
  ChevronLeft,
  Cpu,
  Anchor,
  Map,
  Sprout,
  BookOpen,
  Scissors,
  FlaskConical,
  Car,
  ChefHat,
  Brush,
  Mountain,
  Wine,
  MoreVertical,
  Flag,
  Sun,
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
import { motion } from "framer-motion";
import { generateMatchCompatibilityInsight } from "@/ai/flows/ai-match-compatibility-insight";
import { useFeatureFlags } from "@/context/feature-flags-context";
import { ALL_DEMO_USERS } from "@/lib/demo-data";
import { ZodiacIcon } from "@/components/shared/zodiac-icon";

// Динамические импорты для тяжелых UI
const Carousel = dynamic(() => import("@/components/ui/carousel").then(mod => mod.Carousel));
const CarouselContent = dynamic(() => import("@/components/ui/carousel").then(mod => mod.CarouselContent));
const CarouselItem = dynamic(() => import("@/components/ui/carousel").then(mod => mod.CarouselItem));
const CarouselPrevious = dynamic(() => import("@/components/ui/carousel").then(mod => mod.CarouselPrevious));
const CarouselNext = dynamic(() => import("@/components/ui/carousel").then(mod => mod.CarouselNext));
const Dialog = dynamic(() => import("@/components/ui/dialog").then(mod => mod.Dialog));
const DialogContent = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogContent));
const DialogTitle = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogTitle));
const DialogHeader = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogHeader));
const DialogFooter = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogFooter));
const DialogDescription = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogDescription));
const DropdownMenu = dynamic(() => import("@/components/ui/dropdown-menu").then(mod => mod.DropdownMenu));
const DropdownMenuContent = dynamic(() => import("@/components/ui/dropdown-menu").then(mod => mod.DropdownMenuContent));
const DropdownMenuItem = dynamic(() => import("@/components/ui/dropdown-menu").then(mod => mod.DropdownMenuItem));
const DropdownMenuTrigger = dynamic(() => import("@/components/ui/dropdown-menu").then(mod => mod.DropdownMenuTrigger));
const RadioGroup = dynamic(() => import("@/components/ui/radio-group").then(mod => mod.RadioGroup));
const RadioGroupItem = dynamic(() => import("@/components/ui/radio-group").then(mod => mod.RadioGroupItem));
const Label = dynamic(() => import("@/components/ui/label").then(mod => mod.Label));
const Textarea = dynamic(() => import("@/components/ui/textarea").then(mod => mod.Textarea));
const HeartConfetti = dynamic(() => import("@/components/animations/heart-confetti").then(mod => mod.HeartConfetti), { ssr: false });

const interestIcons: Record<string, any> = {
    "Фотография": Camera,
    "Путешествия": Globe,
    "Кофе": Coffee,
    "Музыка": Music,
    "Спорт": Dumbbell,
    "Искусство": Palette,
    "Кино": Film,
    "Йога": Flower2,
    "Бизнес": Briefcase,
    "Игры": Gamepad2,
    "IT технологии": Cpu,
    "Рыбалка": Anchor,
    "Туризм": Map,
    "Садоводство": Sprout,
    "Чтение": BookOpen,
    "Книги": BookOpen,
    "Рукоделие": Scissors,
    "Наука": FlaskConical,
    "Авто": Car,
    "Животные": Dog,
    "Кулинария": ChefHat,
    "Творчество": Brush,
    "Природа": Sun,
    "Собаки": Dog,
    "Кошки": Dog,
    "IT": Cpu,
    "Дизайн": Palette,
    "Горы": Mountain,
    "Мода": Sparkles,
    "Вино": Wine,
};

const REPORT_REASONS = [
    'report.reason.spam',
    'report.reason.abuse',
    'report.reason.fake',
    'report.reason.scam',
    'report.reason.content'
];

function UserProfileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get('id');
  const { t, language } = useLanguage();
  const { aiCompatibilityEnabled } = useFeatureFlags();

  const user = ALL_DEMO_USERS.find(u => u.id === Number(userId)) || ALL_DEMO_USERS[0];
  
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);

  const [matchUser, setMatchUser] = useState<any>(null);
  const [compatibility, setCompatibility] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');

  const handleReportSubmit = () => {
    if (!reportReason) {
      toast({ variant: 'destructive', title: t('report.toast.no_reason_title'), description: t('report.toast.no_reason_desc') });
      return;
    }
    toast({ title: t('report.toast.success_title'), description: `${t('report.toast.success_desc')} ${user.name}.` });
    setIsReportDialogOpen(false);
    setReportReason('');
    setReportDescription('');
  };

  useEffect(() => {
    setPhotos([
      user.img,
      PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)].imageUrl,
      PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)].imageUrl,
    ]);
  }, [user.img]);

  const getAiInsight = async (targetUser: any) => {
    if (!aiCompatibilityEnabled) {
      setCompatibility(t('match.insight_default'));
      setLoadingAi(false);
      return;
    }
    setLoadingAi(true);
    try {
      const res = await generateMatchCompatibilityInsight({
        currentUser: { name: "Вы", age: 25, interests: ["Спорт", "Кино", "Кофе"], bio: "Активный пользователь SwiftMatch, люблю общение и новые открытия." },
        matchUser: { name: targetUser.name, age: targetUser.age, interests: targetUser.interests, bio: targetUser.bio || "" }
      });
      setCompatibility(res.explanation);
    } catch (e) {
      setCompatibility(t('match.insight_default') || "Вы отлично подходите друг другу!");
    } finally {
      setLoadingAi(false);
    }
  };

  const handleLike = () => {
    toast({ title: language === 'RU' ? `Вы лайкнули ${user.name}!` : `You liked ${user.name}!` });
    if (Math.random() > 0.7) {
      setMatchUser(user);
      getAiInsight(user);
    }
  };

  return (
    <div className="flex flex-col min-h-svh bg-[#f8f9fb]">
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 p-4 flex items-center justify-between">
         <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()} 
            className="rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 border border-white/20"
          >
            <ChevronLeft size={24} />
          </Button>
          <div className="flex items-center gap-2">
            <Badge className="bg-white/20 backdrop-blur-md text-white border-white/20 px-3 py-1 font-black uppercase text-[9px] tracking-widest">
              {user.match}% {language === 'RU' ? 'Совпадение' : 'Match'}
            </Badge>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 border border-white/20">
                    <MoreVertical size={20} />
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl border-0 app-shadow p-1.5 min-w-[160px] bg-white">
                  <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setIsReportDialogOpen(true); }} className="rounded-xl font-bold text-[10px] uppercase tracking-wider cursor-pointer py-2 text-destructive focus:text-destructive focus:bg-destructive/10">
                    <Flag size={14} className="mr-2" />
                    {t('button.report')}
                  </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        <div className="relative aspect-square w-full">
          <Image src={user.img} alt={user.name} fill sizes="100vw" className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9fb] via-transparent to-black/30"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
             <div className="flex items-center gap-2">
                <h3 className="text-3xl font-black font-headline text-foreground tracking-tight flex items-center gap-2">
                  {user.name}, {user.age} <CheckCircle2 size={24} className="text-primary" fill="currentColor" />
                </h3>
             </div>
             <p className="text-muted-foreground text-sm font-bold flex items-center gap-1.5 uppercase tracking-widest">
                <MapPin size={14} className="text-primary" /> {language === 'RU' ? user.city : 'Moscow'} • {user.distance} км {language === 'RU' ? 'от вас' : 'from you'}
             </p>
          </div>
        </div>

        <div className="px-5 space-y-6 -mt-2 relative z-10">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <Badge variant="secondary" className="bg-orange-50 text-orange-600 border-0 gap-1.5 py-2 px-4 font-bold text-[11px] rounded-xl shadow-sm whitespace-nowrap">
              <ZodiacIcon sign={user.zodiac} /> {user.zodiac}
            </Badge>
            <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-0 gap-1.5 py-2 px-4 font-bold text-[11px] rounded-xl shadow-sm whitespace-nowrap">
              <Ruler size={14} /> {user.height} {language === 'RU' ? 'см' : 'cm'}
            </Badge>
            <Badge variant="secondary" className="bg-primary/5 text-primary border-0 gap-1.5 py-2 px-4 font-bold text-[11px] rounded-xl shadow-sm whitespace-nowrap">
              <Target size={14} /> {language === 'RU' ? user.goal : 'Serious relations'}
            </Badge>
          </div>

          <div className="bg-white rounded-[2.5rem] p-6 app-shadow border border-border/40">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-primary" />
              <h4 className="font-black text-[11px] uppercase tracking-widest text-muted-foreground">{t('profile.about')}</h4>
            </div>
            <p className="text-[14px] text-foreground/80 leading-relaxed font-medium italic">
              "{user.bio}"
            </p>
          </div>

          <div className="bg-white rounded-[2.5rem] p-6 app-shadow border border-border/40 space-y-4">
            <div className="flex items-center gap-2">
               <Star size={16} className="text-primary" />
               <h4 className="font-black text-[11px] uppercase tracking-widest text-muted-foreground">{t('profile.interests')}</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest) => {
                const Icon = interestIcons[interest] || Heart;
                return (
                  <Badge key={interest} variant="secondary" className="bg-muted/50 text-foreground/80 border-0 gap-2 py-2 px-4 font-bold text-[11px] rounded-xl">
                    <Icon size={14} className="text-primary" /> {interest}
                  </Badge>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-6 app-shadow border border-border/40 space-y-4">
            <div className="flex items-center gap-2">
               <Camera size={16} className="text-primary" />
               <h4 className="font-black text-[11px] uppercase tracking-widest text-muted-foreground">{t('profile.gallery')}</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {photos.map((url, idx) => (
                <div key={idx} onClick={() => { setActivePhotoIndex(idx); setIsViewerOpen(true); }} className="relative aspect-square rounded-2xl overflow-hidden bg-muted cursor-pointer group">
                  <Image src={url} alt={`Photo ${idx}`} fill sizes="50vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <Maximize2 size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-6 flex gap-4 bg-white/80 backdrop-blur-md z-40 safe-pb">
          <Button onClick={() => router.back()} variant="outline" className="w-16 h-16 rounded-full border-2 border-muted hover:bg-muted text-muted-foreground flex items-center justify-center transition-all active:scale-90">
            <X size={28} />
          </Button>
          <Button onClick={handleLike} className="flex-1 h-16 rounded-full gradient-bg text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-primary/30 flex items-center justify-center gap-2 active:scale-95 transition-all">
            {t('button.like')} <Heart size={20} fill="currentColor" />
          </Button>
          <Button asChild variant="outline" className="w-16 h-16 rounded-full border-2 border-primary/20 text-primary hover:bg-primary/5 flex items-center justify-center transition-all active:scale-90">
            <Link href={`/chats?matchId=${user.id}`}>
              <MessageCircle size={28} />
            </Link>
          </Button>
        </div>
      </main>

      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-[440px] w-[95vw] h-[85vh] p-0 border-0 bg-transparent shadow-none flex flex-col items-center justify-center">
          <DialogTitle className="sr-only">Viewer</DialogTitle>
          <Carousel className="w-full h-full" opts={{ startIndex: activePhotoIndex }}>
            <CarouselContent className="h-full ml-0">
              {photos.map((url, idx) => (
                <CarouselItem key={idx} className="h-[80vh] flex items-center justify-center p-4 pl-4">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden app-shadow">
                    <Image src={url} alt={`Gallery view ${idx}`} fill sizes="(max-width: 480px) 100vw, 440px" className="object-cover" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-black/50 border-0 text-white hover:bg-black/70" />
            <CarouselNext className="right-4 bg-black/50 border-0 text-white hover:bg-black/70" />
          </Carousel>
        </DialogContent>
      </Dialog>
      
      <Dialog open={!!matchUser} onOpenChange={(open) => !open && setMatchUser(null)}>
        <DialogContent className="max-w-[400px] rounded-3xl border-0 p-0 overflow-hidden bg-white app-shadow">
          <div className="relative">
            <HeartConfetti />
            <div className="relative h-56 flex items-center justify-center p-6 gradient-bg">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="flex items-center justify-center gap-0 relative">
                    <motion.div initial={{ x: -60, opacity: 0, rotate: -15, scale: 0.8 }} animate={{ x: 0, opacity: 1, rotate: -8, scale: 1 }} transition={{ type: "spring", damping: 12, delay: 0.2 }} className="w-36 h-36 rounded-3xl border-4 border-white shadow-2xl overflow-hidden relative z-10 -mr-8 bg-muted">
                        <Image src={PlaceHolderImages[10].imageUrl} alt="Вы" fill sizes="144px" data-ai-hint={PlaceHolderImages[10].imageHint} className="object-cover" />
                    </motion.div>
                    <motion.div initial={{ x: 60, opacity: 0, rotate: 15, scale: 0.8 }} animate={{ x: 0, opacity: 1, rotate: 8, scale: 1 }} transition={{ type: "spring", damping: 12, delay: 0.3 }} className="w-36 h-36 rounded-3xl border-4 border-white shadow-2xl overflow-hidden relative z-0 bg-muted">
                        <Image src={matchUser?.img || PlaceHolderImages[0].imageUrl} alt={matchUser?.name} fill sizes="144px" data-ai-hint={matchUser?.hint || PlaceHolderImages[0].imageHint} className="object-cover" />
                    </motion.div>
                </div>
            </div>

            <div className="px-8 pt-8 pb-8 text-center">
              <DialogTitle className="text-3xl font-black font-headline mb-3 gradient-text uppercase tracking-tight">{t('match.title')}</DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm mb-8 px-6 leading-relaxed font-medium">
                {language === 'RU' ? 'Вы с ' : 'You and '} <span className="font-bold text-foreground">{matchUser?.name}</span> {language === 'RU' ? 'понравились друг другу.' : 'liked each other.'}
              </DialogDescription>
              
              {aiCompatibilityEnabled && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="relative p-6 rounded-[2.5rem] mb-8 text-left border border-primary/20 bg-gradient-to-br from-white via-primary/[0.02] to-orange-500/[0.02] shadow-xl shadow-primary/5 overflow-hidden group">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                  <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl opacity-40"></div>
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <Cpu size={14} className="animate-pulse" />
                      </div>
                      <h4 className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">{t('match.insight')}</h4>
                    </div>
                    <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
                      <Sparkles size={20} className="text-orange-400 opacity-60" />
                    </motion.div>
                  </div>
                  {loadingAi ? (
                    <div className="flex items-center gap-3 text-xs text-muted-foreground py-2 relative z-10">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span className="animate-pulse font-bold uppercase tracking-widest text-[10px]">{t('home.searching')}</span>
                    </div>
                  ) : (
                    <div className="relative z-10">
                      <p className="text-[13px] leading-relaxed text-foreground/90 font-semibold italic border-l-4 border-primary/30 pl-4 py-1">"{compatibility}"</p>
                    </div>
                  )}
                  <div className="absolute bottom-2 right-4 text-primary/5 group-hover:text-primary/10 transition-colors">
                    <Sparkles size={48} />
                  </div>
                </motion.div>
              )}

              <div className="flex flex-col gap-4 w-full">
                <Button onClick={() => router.push(`/chats?matchId=${matchUser.id}`)} className="w-full h-16 rounded-full gradient-bg text-white font-black app-shadow hover:scale-[1.02] active:scale-95 transition-all border-0 uppercase tracking-[0.2em] text-[11px] shadow-primary/30">
                  {t('button.write_first')}
                </Button>
                <Button variant="ghost" onClick={() => setMatchUser(null)} className="w-full rounded-full h-12 text-muted-foreground font-black hover:bg-muted transition-all uppercase tracking-[0.1em] text-[10px]">
                  {t('button.continue')}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="max-w-[400px] rounded-3xl border-0 p-0 bg-white app-shadow">
          <DialogHeader className="p-6 pb-4 text-left">
              <DialogTitle className="flex items-center gap-2 font-black tracking-tight">
                  <Flag size={20} className="text-destructive" />
                  {t('report.title')}
              </DialogTitle>
              <DialogDescription className="pt-2">
                  {t('report.description')}
              </DialogDescription>
          </DialogHeader>
          <div className="px-6 space-y-4">
              <RadioGroup value={reportReason} onValueChange={setReportReason} className="space-y-2">
                  {REPORT_REASONS.map(reasonKey => (
                      <div key={reasonKey} className="flex items-center space-x-3 bg-muted/40 p-3 rounded-lg">
                          <RadioGroupItem value={t(reasonKey)} id={reasonKey} />
                          <Label htmlFor={reasonKey} className="font-bold text-sm cursor-pointer">{t(reasonKey)}</Label>
                      </div>
                  ))}
              </RadioGroup>
              <Textarea placeholder={t('report.details_placeholder')} value={reportDescription} onChange={(e) => setReportDescription(e.target.value)} className="min-h-[80px] rounded-xl bg-muted/40 border-0 focus-visible:ring-primary/20" />
          </div>
          <DialogFooter className="p-6 flex-row gap-2 justify-end bg-muted/20 rounded-b-3xl">
              <Button variant="ghost" onClick={() => setIsReportDialogOpen(false)}>{t('report.button.cancel')}</Button>
              <Button className="bg-destructive hover:bg-destructive/90 text-destructive-foreground" onClick={handleReportSubmit}>{t('report.button.send')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function UserProfilePage() {
  const { language } = useLanguage();
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-svh font-black">{language === 'RU' ? 'Загрузка...' : 'Loading...'}</div>}>
      <UserProfileContent />
    </Suspense>
  );
}
