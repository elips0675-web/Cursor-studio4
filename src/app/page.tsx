
"use client";

import { Flame, Search, Heart, MapPin, Zap, Sparkles, ChevronDown, Cpu, User, Trophy, Star, Navigation, Globe, Users, Check, Target, Play, CreditCard, Camera } from "lucide-react";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useRef, useEffect, useCallback, useMemo, memo } from "react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/language-context";
import { ALL_DEMO_USERS } from "@/lib/demo-data";
import { INTEREST_OPTIONS, CAPITALS, DATING_GOALS } from "@/lib/constants";

// Динамические импорты для тяжелых компонентов
const Dialog = dynamic(() => import("@/components/ui/dialog").then(mod => mod.Dialog));
const DialogContent = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogContent));
const DialogHeader = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogHeader));
const DialogTitle = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogTitle));
const DialogFooter = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogFooter));

const TopOfWeekSection = dynamic(() => import('@/components/sections/top-of-week').then(mod => mod.TopOfWeekSection), { ssr: false });
const RecommendationsSection = dynamic(() => import('@/components/sections/recommendations').then(mod => mod.RecommendationsSection), { ssr: false });

export default function Home() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [showAutosearchDialog, setShowAutosearchDialog] = useState(false);
  const [isAutosearchLoading, setIsAutosearchLoading] = useState(false);
  
  // Get current authorized user from localStorage or fallback to demo
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      try {
        const profile = JSON.parse(saved);
        if (profile.gender === 'male' || profile.gender === 'мужской') profile.gender = 'male';
        if (profile.gender === 'female' || profile.gender === 'женский') profile.gender = 'female';
        setCurrentUser(profile);
      } catch (e) {
        setCurrentUser(ALL_DEMO_USERS.find(u => u.name === "Анна"));
      }
    } else {
      setCurrentUser(ALL_DEMO_USERS.find(u => u.name === "Анна"));
    }
  }, []);

  // Top of Week - EXCLUDE SYSTEM USERS
  const topUsers = useMemo(() => {
    return [...ALL_DEMO_USERS]
      .filter(u => u.id !== (currentUser?.id || 1) && !u.isSystem)
      .sort((a, b) => b.match - a.match)
      .slice(0, 4);
  }, [currentUser]);

  // Recommendations - EXCLUDE SYSTEM USERS
  const recommendedUsers = useMemo(() => {
    const myInterests = currentUser?.interests || ["Фотография", "Кофе", "Музыка", "Путешествия"];
    return ALL_DEMO_USERS.filter(u => u.id !== (currentUser?.id || 1) && !u.isSystem)
      .map(u => ({
        ...u,
        commonInterests: u.interests.filter(i => myInterests.includes(i)).length
      }))
      .sort((a, b) => b.commonInterests - a.commonInterests)
      .slice(0, 4);
  }, [currentUser]);

  const handleLikeHomepage = (user: any) => {
    toast({
      title: "Лайк!",
      description: `Вы лайкнули ${user.name}`,
    });
  }

  const runAutosearch = useCallback(() => {
    if (!currentUser) return;

    const interests = currentUser.interests?.filter((interest: string) => INTEREST_OPTIONS.includes(interest)) || [];
    let city = "Все";
    if (currentUser.city && [...CAPITALS, "Все"].includes(currentUser.city)) {
        city = currentUser.city;
    }
    const baseAge = parseInt(currentUser.age) || 25;
    const age = [Math.max(18, baseAge - 5), Math.min(60, baseAge + 5)];
    
    let genderPref = 'all';
    if (currentUser.gender === 'female') {
      genderPref = 'male';
    } else if (currentUser.gender === 'male') {
      genderPref = 'female';
    }

    let datingGoal = "all";
    const userDatingGoal = currentUser.datingGoal || currentUser.goal;
    if (userDatingGoal && DATING_GOALS.includes(userDatingGoal)) {
      datingGoal = userDatingGoal;
    }

    const filters = {
        ageRange: age,
        selectedCity: city,
        distance: [50],
        genderPref: genderPref,
        selectedDatingGoal: datingGoal,
        selectedInterests: interests,
    };

    sessionStorage.setItem('autosearchFilters', JSON.stringify(filters));
    router.push('/search?mode=autosearch');
  }, [currentUser, router]);

  const handleAutosearchAd = () => {
    setIsAutosearchLoading(true);
    setTimeout(() => {
      setIsAutosearchLoading(false);
      setShowAutosearchDialog(false);
      runAutosearch();
      toast({ title: t('autosearch.success_ad') });
    }, 3000);
  };

  const handleAutosearchPaid = () => {
    setShowAutosearchDialog(false);
    runAutosearch();
    toast({ title: t('autosearch.success_paid') });
  };

  return (
    <>
      <AppHeader />
      <main className="flex-1 overflow-y-auto pb-24 bg-[#f8f9fb]">
        {/* Banner Section */}
        <section className="px-6 py-10 text-center relative overflow-hidden bg-white border-b border-border/40">
          <div className="absolute top-[-10%] left-[-20%] w-[100%] h-[50%] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
          <div className="absolute bottom-[-10%] right-[-20%] w-[100%] h-[50%] bg-[#ff8e53]/5 rounded-full blur-[120px] -z-10"></div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-0 gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
              <Sparkles size={12} fill="currentColor" /> {t('home.popular')}
            </Badge>
            <h1 className="text-3xl font-black font-headline mb-2 leading-tight tracking-tighter text-foreground">
              {t('home.headline')}
            </h1>
            <p className="text-muted-foreground text-xs font-medium mb-8 max-w-[280px] mx-auto">
              {t('home.subheadline')}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 max-w-[360px] mx-auto">
            <Button 
              onClick={() => setShowAutosearchDialog(true)}
              className="h-12 rounded-2xl gradient-bg text-white font-black text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all border-0 uppercase tracking-widest"
            >
              <Zap size={14} fill="currentColor" /> {t('button.autosearch')}
            </Button>
            <Button 
              asChild
              className="h-12 rounded-2xl bg-white border-2 border-primary text-primary font-black text-[10px] shadow-lg shadow-primary/5 hover:scale-[1.02] hover:bg-primary/5 active:scale-95 transition-all uppercase tracking-widest"
            >
              <Link href="/search?mode=nearby">
                <Search size={14} className="stroke-[3px]" /> {t('home.nearby')}
              </Link>
            </Button>
          </div>
        </section>

        {/* Contest Entry Banner */}
        <section className="px-5 pt-8">
          <Link href="/contest" className="block relative h-28 rounded-[2rem] overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600"></div>
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:scale-110 transition-transform duration-700">
              <Trophy size={80} />
            </div>
            <div className="relative h-full flex items-center p-6 text-white">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center mr-4">
                <Camera size={24} />
              </div>
              <div className="flex-1">
                <h4 className="font-black text-lg tracking-tight leading-tight">{t('contest.title')}</h4>
                <p className="text-[10px] font-bold opacity-80 uppercase tracking-wider">{t('contest.participate_banner')}</p>
              </div>
              <ChevronDown className="-rotate-90 opacity-60" size={24} />
            </div>
          </Link>
        </section>

        <TopOfWeekSection topUsers={topUsers} onLike={handleLikeHomepage} t={t} />

        <RecommendationsSection recommendedUsers={recommendedUsers} onLike={handleLikeHomepage} t={t} />
      </main>

      <AnimatePresence>
        {showAutosearchDialog && (
          <Dialog open={showAutosearchDialog} onOpenChange={setShowAutosearchDialog}>
            <DialogContent className="max-w-[340px] rounded-[2.5rem] p-0 overflow-hidden border-0 bg-white app-shadow">
              <div className="relative h-40 gradient-bg flex flex-col items-center justify-center text-white p-6 overflow-hidden">
                 <div className="absolute inset-0 bg-black/5"></div>
                 <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute"><Zap size={160} fill="currentColor" /></motion.div>
                 <Zap className="text-yellow-300 mb-2 drop-shadow-lg relative z-10 animate-pulse" size={48} fill="currentColor" />
                 <DialogTitle className="text-2xl font-black uppercase tracking-tighter relative z-10">{t('autosearch.title')}</DialogTitle>
                 <p className="text-[10px] text-white/90 font-bold uppercase tracking-[0.1em] relative z-10 mt-1 text-center px-4 leading-relaxed">{t('autosearch.desc')}</p>
              </div>
              <div className="p-6 space-y-4">
                <Button onClick={handleAutosearchAd} disabled={isAutosearchLoading} variant="outline" className="w-full h-16 rounded-2xl border-2 border-primary/20 bg-primary/5 flex flex-col items-center justify-center gap-1 group hover:bg-primary/10 transition-all border-dashed">
                  {isAutosearchLoading ? (<div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div><span className="text-[10px] font-black uppercase tracking-widest text-primary">{language === 'RU' ? 'Загрузка...' : 'Loading...'}</span></div>) : (<><div className="flex items-center gap-2 text-primary"><Play size={14} fill="currentColor" /><span className="text-[11px] font-black uppercase tracking-widest">{t('autosearch.free')}</span></div><span className="text-[8px] text-muted-foreground font-bold uppercase tracking-tighter opacity-60">{language === 'RU' ? '1 поиск за видео' : '1 search for 1 Video'}</span></>)}
                </Button>
                <div className="relative py-2"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-muted"></span></div><div className="relative flex justify-center text-[8px] uppercase font-black tracking-widest text-muted-foreground bg-white px-4">или</div></div>
                <Button onClick={handleAutosearchPaid} className="w-full h-16 rounded-2xl gradient-bg text-white shadow-xl shadow-primary/20 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all border-0">
                  <div className="flex items-center gap-2">
                    <CreditCard size={16} />
                    <span className="text-xs font-black uppercase tracking-widest">{t('autosearch.paid')}</span>
                  </div>
                  <span className="text-[10px] text-white/80 font-bold uppercase tracking-tighter">{language === 'RU' ? 'Всего за 49 ₽' : 'Just $0.99'}</span>
                </Button>
              </div>
              <DialogFooter className="p-6 pt-0"><Button variant="ghost" onClick={() => setShowAutosearchDialog(false)} className="w-full text-muted-foreground text-[9px] font-black uppercase tracking-widest h-10">{t('button.not_now')}</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      <BottomNav />
    </>
  );
}
