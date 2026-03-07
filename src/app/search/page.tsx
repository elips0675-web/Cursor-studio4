
"use client";

import { useState, useMemo, useCallback, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MapPin, User, ChevronLeft, ChevronRight, X, Heart, MessageCircle, Flag, Sparkles, Zap, Cpu } from "lucide-react";
import Image from "next/image";
import dynamic from 'next/dynamic';
import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import { toast } from "@/hooks/use-toast";
import { generateMatchCompatibilityInsight } from "@/ai/flows/ai-match-compatibility-insight";
import { ALL_DEMO_USERS } from "@/lib/demo-data";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const HeartConfetti = dynamic(() => import("@/components/animations/heart-confetti").then(mod => mod.HeartConfetti), { ssr: false });
const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), { ssr: false });
const AnimatePresence = dynamic(() => import('framer-motion').then(mod => mod.AnimatePresence), { ssr: false });

const cardVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction < 0 ? 300 : -300, opacity: 0 }),
};

const REPORT_REASONS = ['report.reason.spam', 'report.reason.abuse', 'report.reason.fake', 'report.reason.scam', 'report.reason.content'];

function performAutosearch(filters: any, allUsers: any[], currentUser: any) {
    if (!filters) return [];
    const { ageRange, selectedCity, distance, genderPref, selectedDatingGoal, selectedInterests } = filters;
    return allUsers
        .filter(user => {
          if (user.id === (currentUser?.id || 1) || user.isSystem) return false;
          const matchesAge = user.age >= ageRange[0] && user.age <= ageRange[1];
          const matchesCity = selectedCity === "Все" || user.city === selectedCity;
          const matchesGender = genderPref === "all" || user.gender === genderPref;
          return matchesAge && matchesCity && matchesGender;
        })
        .map(user => {
          let score = 0;
          const common = user.interests.filter((i: string) => selectedInterests.includes(i)).length;
          if (user.goal === selectedDatingGoal) score += 1000;
          score += common * 100;
          return { ...user, score, isCandidate: score > 0 || user.goal === selectedDatingGoal };
        })
        .filter(user => user.isCandidate)
        .sort((a, b) => b.score - a.score);
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, language } = useLanguage();
  const [userList, setUserList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [matchUser, setMatchUser] = useState<any>(null);
  const [compatibility, setCompatibility] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('userProfile');
    if (saved) setCurrentUser(JSON.parse(saved));
    else setCurrentUser(ALL_DEMO_USERS[1]);
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const mode = searchParams.get('mode');
    let initialUsers: any[] = [];
    setIsLoading(true);
    if (mode === 'autosearch') {
        setPageTitle(t('button.autosearch'));
        const filters = JSON.parse(sessionStorage.getItem('autosearchFilters') || 'null');
        initialUsers = filters ? performAutosearch(filters, ALL_DEMO_USERS, currentUser) : ALL_DEMO_USERS.slice(1, 11);
    } else {
        setPageTitle(t('home.nearby'));
        initialUsers = ALL_DEMO_USERS.filter(u => u.id !== currentUser.id && !u.isSystem).slice(0, 10);
    }
    setUserList(initialUsers);
    setCurrentIndex(0);
    setIsLoading(false);
  }, [searchParams, currentUser, t]);
  
  const user = userList[currentIndex] || null;

  const handleNext = useCallback(() => { setDirection(1); setCurrentIndex(prev => prev + 1); }, []);
  const handlePrev = useCallback(() => { if (currentIndex > 0) { setDirection(-1); setCurrentIndex(prev => prev - 1); } }, [currentIndex]);

  const handleLike = async () => {
    if (!user) return;
    toast({ title: "Лайк!", description: `${language === 'RU' ? 'Вы лайкнули' : 'You liked'} ${user.name}` });
    if (Math.random() > 0.7) {
      setMatchUser(user);
      setLoadingAi(true);
      try {
        const res = await generateMatchCompatibilityInsight({
          currentUser: { name: "Вы", age: 25, interests: ["Спорт"], bio: "Активный пользователь." },
          matchUser: { name: user.name, age: user.age, interests: user.interests, bio: user.bio || "" }
        });
        setCompatibility(res.explanation);
      } catch (e) { setCompatibility(t('match.insight_default')); }
      finally { setLoadingAi(false); }
    } else handleNext();
  };

  const handleReportSubmit = () => {
    if (!reportReason) {
      toast({ variant: 'destructive', title: t('report.toast.no_reason_title'), description: t('report.toast.no_reason_desc') });
      return;
    }
    toast({ title: t('report.toast.success_title'), description: `${t('report.toast.success_desc')} ${user?.name || ''}.` });
    setIsReportDialogOpen(false);
    setReportReason('');
    setReportDescription('');
  };

  if (isLoading) return <div className="flex-1 flex items-center justify-center"><Skeleton className="w-[90%] h-[70vh] rounded-[2.5rem]" /></div>;

  if (!user) return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <Sparkles size={48} className="text-muted-foreground opacity-20 mb-4" />
      <h4 className="text-xl font-black uppercase">{language === 'RU' ? 'Анкеты закончились' : 'No more profiles'}</h4>
      <Button variant="outline" onClick={() => router.push('/')} className="mt-8 rounded-full px-8 uppercase text-[10px] font-black">На главную</Button>
    </div>
  );

  return (
    <>
      <AppHeader />
      <main className="flex-1 overflow-hidden px-4 pt-4 pb-24 flex flex-col items-center relative bg-[#f8f9fb]">
        <div className="text-center mb-4 flex items-center gap-2">
            <Badge variant="outline" className="text-[8px] font-bold bg-white">{currentIndex + 1} / {userList.length}</Badge>
            <Badge variant="secondary" className="text-[8px] font-bold text-primary bg-primary/5">{pageTitle}</Badge>
        </div>
        
        <div className="relative w-full flex-1 mb-10 max-w-[420px] flex items-center justify-center">
          <Button variant="ghost" size="icon" onClick={handlePrev} disabled={currentIndex === 0} className="absolute -left-4 z-20 w-10 h-10 rounded-full bg-white/80 shadow-lg"><ChevronLeft size={24} /></Button>
          <Button variant="ghost" size="icon" onClick={handleNext} className="absolute -right-4 z-20 w-10 h-10 rounded-full bg-white/80 shadow-lg"><ChevronRight size={24} /></Button>

          <Suspense fallback={<Skeleton className="w-full h-full rounded-[2.5rem]" />}>
            <MotionDiv
              key={user.id}
              custom={direction}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute w-full h-full bg-white rounded-[2.5rem] overflow-hidden app-shadow border-4 border-white cursor-pointer group"
              onClick={() => router.push(`/user?id=${user.id}`)}
            >
              <Image 
                src={user.img} 
                alt={user.name} 
                fill 
                sizes="(max-width: 480px) 100vw, 420px" 
                priority
                loading="eager"
                className="object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                <h3 className="text-3xl font-black font-headline mb-1">{user.name}, {user.age}</h3>
                <p className="text-white/90 text-xs flex items-center gap-1 font-bold mb-3"><MapPin size={14} /> {user.distance} км</p>
                <div className="flex flex-wrap gap-1.5">
                  {user.interests.slice(0, 3).map((interest: string) => (
                    <span key={interest} className="px-2.5 py-1 bg-white/20 backdrop-blur-md text-white text-[9px] rounded-full font-black uppercase tracking-widest border border-white/10">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </MotionDiv>
          </Suspense>
        </div>

        <div className="flex justify-center items-center gap-4 w-full max-w-[400px]">
          <Button 
            variant="outline" 
            size="icon" 
            className="w-14 h-14 rounded-full bg-white shadow-xl border-0 text-slate-400 hover:text-slate-600 active:scale-90 transition-all" 
            onClick={handleNext}
          >
            <X size={28} strokeWidth={3} />
          </Button>
          
          <Button 
            size="icon" 
            className="w-20 h-20 rounded-full gradient-bg text-white shadow-2xl shadow-primary/40 hover:scale-110 active:scale-95 transition-all border-0" 
            onClick={handleLike}
          >
            <Heart size={36} fill="currentColor" />
          </Button>

          <Button 
            asChild 
            variant="outline" 
            size="icon" 
            className="w-14 h-14 rounded-full bg-white shadow-xl border-0 text-blue-500 hover:text-blue-600 active:scale-90 transition-all"
          >
            <Link href={`/user?id=${user.id}`}>
              <User size={28} strokeWidth={3} />
            </Link>
          </Button>

          <Button 
            asChild 
            variant="outline" 
            size="icon" 
            className="w-14 h-14 rounded-full bg-white shadow-xl border-0 text-[#2ecc71] hover:text-[#27ae60] active:scale-90 transition-all"
          >
            <Link href={`/chats?matchId=${user.id}`}>
              <MessageCircle size={28} strokeWidth={3} />
            </Link>
          </Button>
        </div>
      </main>
      
      <Dialog open={!!matchUser} onOpenChange={(open) => !open && setMatchUser(null)}>
        <DialogContent className="max-w-[400px] rounded-3xl border-0 p-0 overflow-hidden bg-white app-shadow">
          <div className="relative">
            <HeartConfetti />
            <div className="relative h-56 flex items-center justify-center p-6 gradient-bg">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="flex items-center justify-center gap-0 relative">
                    <MotionDiv initial={{ x: -60, opacity: 0, rotate: -15, scale: 0.8 }} animate={{ x: 0, opacity: 1, rotate: -8, scale: 1 }} transition={{ type: "spring", damping: 12, delay: 0.2 }} className="w-36 h-36 rounded-3xl border-4 border-white shadow-2xl overflow-hidden relative z-10 -mr-8 bg-muted">
                        <Image src={ALL_DEMO_USERS[1].img} alt="Вы" fill sizes="144px" className="object-cover" />
                    </MotionDiv>
                    <MotionDiv initial={{ x: 60, opacity: 0, rotate: 15, scale: 0.8 }} animate={{ x: 0, opacity: 1, rotate: 8, scale: 1 }} transition={{ type: "spring", damping: 12, delay: 0.3 }} className="w-36 h-36 rounded-3xl border-4 border-white shadow-2xl overflow-hidden relative z-0 bg-muted">
                        <Image src={matchUser?.img || ALL_DEMO_USERS[0].img} alt={matchUser?.name || "Matched user photo"} fill sizes="144px" className="object-cover" />
                    </MotionDiv>
                </div>
            </div>

            <div className="px-8 pt-8 pb-8 text-center">
              <DialogTitle className="text-3xl font-black font-headline mb-3 gradient-text uppercase tracking-tight">{t('match.title')}</DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm mb-8 px-6 leading-relaxed font-medium">
                {language === 'RU' ? 'Вы с ' : 'You and '} <span className="font-bold text-foreground">{matchUser?.name}</span> {language === 'RU' ? 'понравились друг другу.' : 'liked each other.'}
              </DialogDescription>
              
              <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="relative p-6 rounded-[2.5rem] mb-8 text-left border border-orange-500/20 bg-gradient-to-br from-white via-orange-500/[0.02] to-orange-500/[0.05] shadow-xl shadow-orange-500/5 overflow-hidden group">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                        <Cpu size={14} className="animate-pulse" />
                      </div>
                      <h4 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.2em]">{t('match.insight')}</h4>
                    </div>
                    <Sparkles size={20} className="text-orange-400 opacity-60" />
                  </div>
                  {loadingAi ? (
                    <div className="flex items-center gap-3 text-xs text-muted-foreground py-2 relative z-10">
                      <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="animate-pulse font-bold uppercase tracking-widest text-[10px]">{t('home.searching')}</span>
                    </div>
                  ) : (
                    <div className="relative z-10">
                      <p className="text-[13px] leading-relaxed text-foreground/90 font-semibold italic border-l-4 border-orange-500/30 pl-4 py-1">"{compatibility}"</p>
                    </div>
                  )}
              </MotionDiv>

              <div className="flex flex-col gap-4 w-full">
                <Button onClick={() => matchUser?.id && router.push(`/chats?matchId=${matchUser.id}`)} className="w-full h-16 rounded-full gradient-bg text-white font-black app-shadow hover:scale-[1.02] active:scale-95 transition-all border-0 uppercase tracking-[0.2em] text-[11px] shadow-primary/30">
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
      
      <BottomNav />
    </>
  );
}

export default function SearchPage() {
    return <Suspense fallback={<div className="flex-1 flex items-center justify-center"><Skeleton className="w-[90%] h-[70vh] rounded-[2.5rem]" /></div>}><SearchContent /></Suspense>;
}
