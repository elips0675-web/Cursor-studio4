
"use client";

import { Flame, Search, Heart, MapPin, Zap, Sparkles, ChevronDown, Cpu, User, Trophy, Star, Navigation, Globe, Users, Check, Target, Play, CreditCard } from "lucide-react";
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
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [showAutosearchDialog, setShowAutosearchDialog] = useState(false);
  const [isAutosearchLoading, setIsAutosearchLoading] = useState(false);
  
  // Filter States
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [ageRange, setAgeRange] = useState([18, 40]);
  const [selectedCity, setSelectedCity] = useState("Все");
  const [distance, setDistance] = useState([50]);
  const [genderPref, setGenderPreference] = useState("all");
  const [selectedDatingGoal, setSelectedDatingGoal] = useState("all");

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

  // Top of Week
  const topUsers = useMemo(() => {
    return [...ALL_DEMO_USERS]
      .filter(u => u.id !== (currentUser?.id || 1))
      .sort((a, b) => b.match - a.match)
      .slice(0, 4);
  }, [currentUser]);

  // Recommendations
  const recommendedUsers = useMemo(() => {
    const myInterests = currentUser?.interests || ["Фотография", "Кофе", "Музыка", "Путешествия"];
    return ALL_DEMO_USERS.filter(u => u.id !== (currentUser?.id || 1))
      .map(u => ({
        ...u,
        commonInterests: u.interests.filter(i => myInterests.includes(i)).length
      }))
      .sort((a, b) => b.commonInterests - a.commonInterests)
      .slice(0, 4);
  }, [currentUser]);

  useEffect(() => {
    if (isFilterDialogOpen && currentUser) {
      setSelectedInterests(currentUser.interests?.filter((interest: string) => INTEREST_OPTIONS.includes(interest)) || []);
      if (currentUser.city && [...CAPITALS, "Все"].includes(currentUser.city)) {
          setSelectedCity(currentUser.city);
      } else {
          setSelectedCity("Все");
      }
      const baseAge = parseInt(currentUser.age) || 25;
      setAgeRange([Math.max(18, baseAge - 5), Math.min(60, baseAge + 5)]);
      
      if (currentUser.gender === 'female') {
        setGenderPreference('male');
      } else if (currentUser.gender === 'male') {
        setGenderPreference('female');
      } else {
        setGenderPreference('all');
      }

      const datingGoal = currentUser.datingGoal || currentUser.goal;
      if (datingGoal && DATING_GOALS.includes(datingGoal)) {
        setSelectedDatingGoal(datingGoal);
      } else {
        setSelectedDatingGoal("all");
      }
    }
  }, [isFilterDialogOpen, currentUser]);

  const handleLikeHomepage = (user: any) => {
    toast({
      title: "Лайк!",
      description: `Вы лайкнули ${user.name}`,
    });
  }

  const handleAutoSearch = () => {
    const filters = {
      ageRange,
      selectedCity,
      distance,
      genderPref,
      selectedDatingGoal,
      selectedInterests,
    };
    sessionStorage.setItem('autosearchFilters', JSON.stringify(filters));

    setIsFilterDialogOpen(false);
    router.push('/search?mode=autosearch');
  };

  const handleAutosearchAd = () => {
    setIsAutosearchLoading(true);
    setTimeout(() => {
      setIsAutosearchLoading(false);
      setShowAutosearchDialog(false);
      setIsFilterDialogOpen(true);
      toast({ title: t('autosearch.success_ad') });
    }, 3000);
  };

  const handleAutosearchPaid = () => {
    setShowAutosearchDialog(false);
    setIsFilterDialogOpen(true);
    toast({ title: t('autosearch.success_paid') });
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
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
                <Search size={14} className="stroke-[3px]" /> {t('button.browse_profiles')}
              </Link>
            </Button>
          </div>
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

      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent className="max-w-[360px] rounded-[2.5rem] p-0 overflow-hidden border-0 bg-white app-shadow">
          <DialogHeader className="p-6 bg-muted/30 pb-4">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-2xl gradient-bg flex items-center justify-center text-white shadow-lg">
                <Zap size={20} fill="currentColor" />
              </div>
              <DialogTitle className="text-xl font-black font-headline tracking-tight">{t('button.autosearch')}</DialogTitle>
            </div>
            <p className="text-xs text-muted-foreground font-medium">{t('button.filters')}</p>
          </DialogHeader>
          <div className="p-6 space-y-6 overflow-y-auto max-h-[65vh] no-scrollbar">
            <div className="space-y-3">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2"><User size={12} className="text-primary" /> {t('filter.who_to_see')}</label>
              <div className="flex gap-2 bg-muted/30 p-1 rounded-xl">
                {['all', 'female', 'male'].map(pref => (
                  <button key={pref} onClick={() => setGenderPreference(pref)} className={cn("flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all", genderPref === pref ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:bg-white/50")}>
                    {t(`filter.gender.${pref}`)}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2"><Navigation size={12} className="text-primary" /> {t('filter.distance')}</label>
                <span className="text-xs font-black text-primary">{distance[0]} км</span>
              </div>
              <Slider value={distance} onValueChange={setDistance} min={1} max={100} step={1} className="py-2" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2"><Cpu size={12} className="text-primary" /> {t('profile.age')}</label>
                <span className="text-xs font-black text-primary">{ageRange[0]} - {ageRange[1]}</span>
              </div>
              <Slider value={ageRange} onValueChange={setAgeRange} min={18} max={60} step={1} className="py-2" />
            </div>
            <div className="space-y-3">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2"><MapPin size={12} className="text-primary" /> {t('profile.city')}</label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-0 font-bold px-4 focus:ring-primary/20"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl border-0 shadow-2xl">
                  <SelectItem value="Все" className="font-bold text-sm">Все города</SelectItem>
                  {CAPITALS.map(city => (<SelectItem key={city} value={city} className="font-bold text-sm">{city}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2"><Target size={12} className="text-primary" /> {t('filter.goal')}</label>
              <Select value={selectedDatingGoal} onValueChange={setSelectedDatingGoal}>
                <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-0 font-bold px-4 focus:ring-primary/20"><SelectValue placeholder={t('filter.goal.all')} /></SelectTrigger>
                <SelectContent className="rounded-xl border-0 shadow-2xl">
                  <SelectItem value="all" className="font-bold text-sm">{t('filter.goal.all')}</SelectItem>
                  {DATING_GOALS.map(goal => (<SelectItem key={goal} value={goal} className="font-bold text-sm">{goal}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2"><Star size={12} className="text-primary" /> {t('profile.interests')}</label>
              <div className="flex flex-wrap gap-1.5">
                {INTEREST_OPTIONS.map(interest => (
                  <Badge
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    variant={selectedInterests.includes(interest) ? "default" : "secondary"}
                    className={cn(
                      "cursor-pointer px-3 py-1.5 rounded-md transition-all border-0 font-bold text-[9px] uppercase tracking-tight shadow-sm",
                      selectedInterests.includes(interest) ? "gradient-bg text-white shadow-md" : "bg-muted/50 text-muted-foreground hover:bg-border"
                    )}
                  >
                    {t(interest)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="p-6 pt-2 bg-muted/10 border-t">
            <Button onClick={handleAutoSearch} className="w-full h-14 rounded-full gradient-bg text-white font-black uppercase tracking-[0.15em] shadow-xl shadow-primary/20 active:scale-95 transition-all border-0 text-[10px]">
              {t('button.autosearch')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </>
  );
}
