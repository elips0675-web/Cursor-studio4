
"use client";

import { Zap, Search, Sparkles, Trophy, Camera, ChevronDown, Play, CreditCard } from "lucide-react";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { Suspense, useState, useEffect, useCallback, useMemo } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import { ALL_DEMO_USERS } from "@/lib/demo-data";
import { INTEREST_OPTIONS, CAPITALS, DATING_GOALS } from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Агрессивная ленивая загрузка для снижения TBT
const TopOfWeekSection = dynamic(() => import('@/components/sections/top-of-week').then(mod => mod.TopOfWeekSection), { 
  ssr: false,
  loading: () => <div className="px-5 pt-8 space-y-4"><Skeleton className="h-8 w-40" /><div className="grid grid-cols-2 gap-4"><Skeleton className="aspect-[4/3] rounded-2xl" /><Skeleton className="aspect-[4/3] rounded-2xl" /></div></div>
});

const RecommendationsSection = dynamic(() => import('@/components/sections/recommendations').then(mod => mod.RecommendationsSection), { 
  ssr: false,
  loading: () => <div className="px-5 pt-10 space-y-4"><Skeleton className="h-8 w-40" /><div className="grid grid-cols-2 gap-4"><Skeleton className="aspect-[16/10] rounded-2xl" /><Skeleton className="aspect-[16/10] rounded-2xl" /></div></div>
});

export default function Home() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [showAutosearchDialog, setShowAutosearchDialog] = useState(false);
  const [isAutosearchLoading, setIsAutosearchLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      try {
        const profile = JSON.parse(saved);
        setCurrentUser(profile);
      } catch (e) {
        setCurrentUser(ALL_DEMO_USERS[1]);
      }
    } else {
      setCurrentUser(ALL_DEMO_USERS[1]);
    }
  }, []);

  const topUsers = useMemo(() => {
    return [...ALL_DEMO_USERS]
      .filter(u => u.id !== (currentUser?.id || 1) && !u.isSystem)
      .sort((a, b) => b.match - a.match)
      .slice(0, 4);
  }, [currentUser]);

  const recommendedUsers = useMemo(() => {
    const myInterests = currentUser?.interests || ["Фотография", "Кофе"];
    return ALL_DEMO_USERS.filter(u => u.id !== (currentUser?.id || 1) && !u.isSystem)
      .map(u => ({
        ...u,
        commonInterests: u.interests.filter(i => myInterests.includes(i)).length
      }))
      .sort((a, b) => b.commonInterests - a.commonInterests)
      .slice(0, 4);
  }, [currentUser]);

  const handleLikeHomepage = (user: any) => {
    toast({ title: "Лайк!", description: `Вы лайкнули ${user.name}` });
  };

  const runAutosearch = useCallback(() => {
    if (!currentUser) return;
    const filters = {
        ageRange: [18, 40],
        selectedCity: currentUser.city || "Все",
        distance: [50],
        genderPref: currentUser.gender === 'female' ? 'male' : 'female',
        selectedDatingGoal: "all",
        selectedInterests: currentUser.interests || [],
    };
    sessionStorage.setItem('autosearchFilters', JSON.stringify(filters));
    router.push('/search?mode=autosearch');
  }, [currentUser, router]);

  return (
    <>
      <AppHeader />
      <main className="flex-1 overflow-y-auto pb-24 bg-[#f8f9fb]">
        <section className="px-6 py-10 text-center relative overflow-hidden bg-white border-b border-border/40">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-0 gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
            <Sparkles size={12} fill="currentColor" /> {t('home.popular')}
          </Badge>
          <h1 className="text-3xl font-black font-headline mb-2 leading-tight tracking-tighter text-foreground">
            {t('home.headline')}
          </h1>
          <p className="text-muted-foreground text-xs font-medium mb-8 max-w-[280px] mx-auto">
            {t('home.subheadline')}
          </p>

          <div className="grid grid-cols-2 gap-3 max-w-[360px] mx-auto">
            <Button onClick={() => setShowAutosearchDialog(true)} className="h-12 rounded-2xl gradient-bg text-white font-black text-[10px] shadow-xl border-0 uppercase tracking-widest">
              <Zap size={14} fill="currentColor" /> {t('button.autosearch')}
            </Button>
            <Button asChild className="h-12 rounded-2xl bg-white border-2 border-primary text-primary font-black text-[10px] shadow-lg uppercase tracking-widest">
              <Link href="/search?mode=nearby"><Search size={14} className="stroke-[3px]" /> {t('home.nearby')}</Link>
            </Button>
          </div>
        </section>

        <Suspense fallback={<div className="px-5 pt-8 space-y-4"><Skeleton className="h-8 w-40" /><div className="grid grid-cols-2 gap-4"><Skeleton className="aspect-[4/3] rounded-2xl" /><Skeleton className="aspect-[4/3] rounded-2xl" /></div></div>}>
          <TopOfWeekSection topUsers={topUsers} onLike={handleLikeHomepage} t={t} />
        </Suspense>

        <section className="px-5 pt-8">
          <Link href="/contest" className="block relative h-28 rounded-[2rem] overflow-hidden group bg-gradient-to-r from-amber-500 to-orange-600">
            <div className="relative h-full flex items-center p-6 text-white">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center mr-4">
                <Trophy size={24} fill="currentColor" />
              </div>
              <div className="flex-1">
                <h4 className="font-black text-lg tracking-tight leading-tight">{t('contest.title')}</h4>
                <p className="text-[10px] font-bold opacity-80 uppercase tracking-wider">{t('contest.participate_banner')}</p>
              </div>
              <ChevronDown className="-rotate-90 opacity-60" size={24} />
            </div>
          </Link>
        </section>

        <Suspense fallback={<div className="px-5 pt-10 space-y-4"><Skeleton className="h-8 w-40" /><div className="grid grid-cols-2 gap-4"><Skeleton className="aspect-[16/10] rounded-2xl" /><Skeleton className="aspect-[16/10] rounded-2xl" /></div></div>}>
          <RecommendationsSection recommendedUsers={recommendedUsers} onLike={handleLikeHomepage} t={t} />
        </Suspense>
      </main>

      <Dialog open={showAutosearchDialog} onOpenChange={setShowAutosearchDialog}>
        <DialogContent className="max-w-[340px] rounded-[2.5rem] p-0 overflow-hidden border-0 bg-white">
          <div className="relative h-40 gradient-bg flex flex-col items-center justify-center text-white p-6">
             <Zap className="text-yellow-300 mb-2 drop-shadow-lg relative z-10" size={48} fill="currentColor" />
             <DialogTitle className="text-2xl font-black uppercase tracking-tighter relative z-10">{t('autosearch.title')}</DialogTitle>
             <p className="text-[10px] text-white/90 font-bold uppercase tracking-[0.1em] relative z-10 mt-1 text-center px-4 leading-relaxed">{t('autosearch.desc')}</p>
          </div>
          <div className="p-6 space-y-4">
            <Button onClick={() => { setIsAutosearchLoading(true); setTimeout(() => { setIsAutosearchLoading(false); setShowAutosearchDialog(false); runAutosearch(); }, 2000); }} disabled={isAutosearchLoading} variant="outline" className="w-full h-16 rounded-2xl border-2 border-primary/20 bg-primary/5 flex flex-col items-center justify-center gap-1 group border-dashed">
              {isAutosearchLoading ? <div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div><span className="text-[10px] font-black uppercase tracking-widest text-primary">Loading...</span></div> : <><div className="flex items-center gap-2 text-primary"><Play size={14} fill="currentColor" /><span className="text-[11px] font-black uppercase tracking-widest">{t('autosearch.free')}</span></div><span className="text-[8px] text-muted-foreground font-bold uppercase tracking-tighter opacity-60">{language === 'RU' ? '1 поиск за видео' : '1 search for 1 Video'}</span></>}
            </Button>
            <Button onClick={() => { setShowAutosearchDialog(false); runAutosearch(); }} className="w-full h-16 rounded-2xl gradient-bg text-white shadow-xl flex flex-col items-center justify-center gap-1 border-0">
              <div className="flex items-center gap-2"><CreditCard size={16} /><span className="text-xs font-black uppercase tracking-widest">{t('autosearch.paid')}</span></div>
              <span className="text-[10px] text-white/80 font-bold uppercase tracking-tighter">{language === 'RU' ? 'Всего за 49 ₽' : 'Just $0.99'}</span>
            </Button>
          </div>
          <DialogFooter className="p-6 pt-0"><Button variant="ghost" onClick={() => setShowAutosearchDialog(false)} className="w-full text-muted-foreground text-[9px] font-black uppercase tracking-widest h-10">{t('button.not_now')}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </>
  );
}
