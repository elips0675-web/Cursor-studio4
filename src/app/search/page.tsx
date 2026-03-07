
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
        
        <div className="relative w-full flex-1 mb-6 max-w-[420px] flex items-center justify-center">
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
              className="absolute w-full h-full bg-white rounded-[2.5rem] overflow-hidden app-shadow border-4 border-white cursor-pointer"
              onClick={() => router.push(`/user?id=${user.id}`)}
            >
              <Image 
                src={user.img} 
                alt={user.name} 
                fill 
                sizes="(max-width: 480px) 100vw, 420px" 
                priority
                loading="eager"
                className="object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                <h3 className="text-3xl font-black font-headline mb-1">{user.name}, {user.age}</h3>
                <p className="text-white/90 text-xs flex items-center gap-1 font-bold mb-3"><MapPin size={14} /> {user.distance} км</p>
                <div className="flex flex-wrap gap-1.5"><span className="px-2 py-0.5 bg-white/20 text-white text-[8px] rounded-full font-black uppercase tracking-widest">{user.interests[0]}</span></div>
              </div>
            </MotionDiv>
          </Suspense>
        </div>

        <div className="flex justify-center items-center gap-3 w-full">
          <Button variant="outline" size="icon" className="w-14 h-14 rounded-full bg-white shadow-lg border-muted" onClick={handleNext}><X size={24} /></Button>
          <Button size="icon" className="w-18 h-18 rounded-full gradient-bg text-white shadow-xl" onClick={handleLike}><Heart size={32} fill="currentColor" /></Button>
          <Button asChild variant="outline" size="icon" className="w-14 h-14 rounded-full bg-white shadow-lg border-muted">
            <Link href={`/user?id=${user.id}`}>
              <User size={24} />
            </Link>
          </Button>
          <Button asChild variant="outline" size="icon" className="w-14 h-14 rounded-full bg-white shadow-lg border-muted">
            <Link href={`/chats?matchId=${user.id}`}>
              <MessageCircle size={24} />
            </Link>
          </Button>
        </div>
      </main>
      
      <BottomNav />
    </>
  );
}

export default function SearchPage() {
    return <Suspense fallback={<div className="flex-1 flex items-center justify-center"><Skeleton className="w-[90%] h-[70vh] rounded-[2.5rem]" /></div>}><SearchContent /></Suspense>;
}
