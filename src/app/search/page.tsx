
"use client";

import { useState, useMemo, useCallback, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MapPin, User, ChevronLeft, ChevronRight, X, Heart, MessageCircle, Flag, Sparkles } from "lucide-react";
import Image from "next/image";
import dynamic from 'next/dynamic';
import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import { toast } from "@/hooks/use-toast";
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
import { motion, AnimatePresence } from "framer-motion";

const MatchDialog = dynamic(() => import('@/components/dialogs/match-dialog').then(mod => mod.MatchDialog), { ssr: false });

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
          const matchesDistance = user.distance <= distance[0];
          return matchesAge && matchesCity && matchesGender && matchesDistance;
        })
        .map(user => {
          let score = 0;
          const commonInterests = user.interests.filter((i: string) => selectedInterests.includes(i)).length;
          const hasMatchingGoal = selectedDatingGoal !== "all" && user.goal === selectedDatingGoal;

          if (hasMatchingGoal) {
            score += 1000;
          }
          score += commonInterests * 100;
          
          const isCandidate = hasMatchingGoal || (commonInterests > 0);

          return { ...user, score, isCandidate };
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
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch (e) {
        setCurrentUser(ALL_DEMO_USERS[1]);
      }
    } else {
      setCurrentUser(ALL_DEMO_USERS[1]);
    }
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const mode = searchParams.get('mode');
    let initialUsers: any[] = [];
    setIsLoading(true);
    if (mode === 'autosearch') {
        setPageTitle(t('button.autosearch'));
        const filters = JSON.parse(sessionStorage.getItem('autosearchFilters') || 'null');
        if (filters) {
            setSelectedInterests(filters.selectedInterests || []);
            initialUsers = performAutosearch(filters, ALL_DEMO_USERS, currentUser);
        } else {
            initialUsers = ALL_DEMO_USERS.slice(1, 11);
        }
    } else {
        setPageTitle(t('home.nearby'));
        initialUsers = ALL_DEMO_USERS.filter(u => u.id !== currentUser.id && !u.isSystem).slice(0, 10);
        setSelectedInterests([]);
    }
    setUserList(initialUsers);
    setCurrentIndex(0);
    setIsLoading(false);
  }, [searchParams, currentUser, t]);
  
  const user = userList[currentIndex] || null;

  const handleNext = useCallback(() => { 
    if (currentIndex < userList.length - 1) {
      setDirection(1); 
      setCurrentIndex(prev => prev + 1); 
    } else {
      setCurrentIndex(prev => prev + 1); // Trigger "no more profiles" state
    }
  }, [currentIndex, userList.length]);

  const handlePrev = useCallback(() => { 
    if (currentIndex > 0) { 
      setDirection(-1); 
      setCurrentIndex(prev => prev - 1); 
    } 
  }, [currentIndex]);

  const handleLike = async () => {
    if (!user) return;
    toast({ title: "Лайк!", description: `${language === 'RU' ? 'Вы лайкнули' : 'You liked'} ${user.name}` });
    
    // Simulate a match
    if (Math.random() > 0.7) {
      setMatchUser(user);
    } else {
      handleNext();
    }
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

  if (isLoading) return <div className="flex-1 flex items-center justify-center h-full"><Skeleton className="w-[90%] h-[70vh] rounded-[2.5rem]" /></div>;

  if (!user) return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full">
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
          <Button variant="ghost" size="icon" onClick={handlePrev} disabled={currentIndex === 0} className="absolute -left-4 z-20 w-10 h-10 rounded-full bg-white/80 shadow-lg border-0"><ChevronLeft size={24} /></Button>
          <Button variant="ghost" size="icon" onClick={handleNext} disabled={currentIndex >= userList.length - 1} className="absolute -right-4 z-20 w-10 h-10 rounded-full bg-white/80 shadow-lg border-0"><ChevronRight size={24} /></Button>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={user.id}
              custom={direction}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute w-full h-full bg-white rounded-[2.5rem] overflow-hidden app-shadow border-4 border-white cursor-pointer group"
              onClick={() => router.push(`/user?id=${user.id}`)}
            >
              <Image 
                src={user.img} 
                alt={user.name} 
                fill 
                sizes="(max-width: 480px) 100vw, 420px" 
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                <h3 className="text-3xl font-black font-headline mb-1">{user.name}, {user.age}</h3>
                <p className="text-white/90 text-xs flex items-center gap-1 font-bold mb-3"><MapPin size={14} /> {user.distance} км</p>
                <div className="flex flex-wrap gap-1.5">
                  {user.interests.slice(0, 3).map((interest: string) => {
                    const isCommon = selectedInterests.includes(interest);
                    return (
                      <span key={interest} className={cn(
                        "px-2.5 py-1 backdrop-blur-md text-[9px] rounded-full font-black uppercase tracking-widest border transition-all flex items-center gap-1",
                        isCommon 
                          ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-110 z-10" 
                          : "bg-white/20 text-white border-white/10"
                      )}>
                        {isCommon && <Sparkles size={8} className="fill-current" />}
                        {interest}
                      </span>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center items-center gap-4 w-full max-w-[400px]">
          <Button 
            variant="outline" 
            size="icon" 
            className="w-14 h-14 rounded-full bg-white shadow-xl border-0 text-slate-400 hover:text-slate-600 active:scale-90 transition-all" 
            onClick={handleNext}
          >
            <ChevronRight size={28} strokeWidth={3} />
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
            className="w-14 h-14 rounded-full bg-white shadow-xl border-0 text-blue-400 hover:text-blue-600 active:scale-90 transition-all"
          >
            <Link href={`/user?id=${user.id}`} prefetch={true}>
              <User size={28} strokeWidth={3} />
            </Link>
          </Button>
          
          <Button 
            asChild 
            variant="outline" 
            size="icon" 
            className="w-16 h-16 rounded-full bg-white shadow-xl border-0 text-[#2ecc71] hover:text-[#27ae60] active:scale-90 transition-all"
          >
            <Link href={`/chats?matchId=${user.id}`} prefetch={true}>
              <MessageCircle size={32} strokeWidth={3} />
            </Link>
          </Button>
        </div>
      </main>
      
      {matchUser && (
        <MatchDialog
          open={!!matchUser}
          onOpenChange={(open) => !open && setMatchUser(null)}
          currentUser={currentUser}
          matchUser={matchUser}
        />
      )}

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
    return <Suspense fallback={<div className="flex-1 flex items-center justify-center h-full"><Skeleton className="w-[90%] h-[70vh] rounded-[2.5rem]" /></div>}><SearchContent /></Suspense>;
}
