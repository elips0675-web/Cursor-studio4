"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { Zap, Search, Sparkles, Trophy, ChevronRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import { ALL_DEMO_USERS, GROUP_CATEGORIES } from "@/lib/demo-data";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const TopOfWeekSection = dynamic(() => import('@/components/sections/top-of-week').then(mod => mod.TopOfWeekSection), { 
  ssr: false,
  loading: () => <div className="px-5 pt-8 space-y-4"><Skeleton className="h-8 w-40" /><div className="grid grid-cols-2 gap-4"><Skeleton className="aspect-[4/3] rounded-xl" /><Skeleton className="aspect-[4/3] rounded-xl" /></div></div>
});

const RecommendationsSection = dynamic(() => import('@/components/sections/recommendations').then(mod => mod.RecommendationsSection), { 
  ssr: false,
  loading: () => <div className="px-5 pt-10 space-y-4"><Skeleton className="h-8 w-40" /><div className="grid grid-cols-2 gap-4"><Skeleton className="aspect-[16/10] rounded-xl" /><Skeleton className="aspect-[16/10] rounded-xl" /></div></div>
});

const AutosearchDialog = dynamic(() => import('@/components/dialogs/autosearch-dialog').then(mod => mod.AutosearchDialog), { ssr: false });

export default function Home() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [showAutosearchDialog, setShowAutosearchDialog] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
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
        commonInterests: u.interests.filter((i: string) => myInterests.includes(i)).length
      }))
      .sort((a, b) => b.commonInterests - a.commonInterests)
      .slice(0, 4);
  }, [currentUser]);

  const popularGroups = useMemo(() => {
    return GROUP_CATEGORIES.slice(0, 4).map(cat => ({
      ...cat,
      online: Math.floor(Math.random() * 50) + 10
    }));
  }, []);

  const runAutosearch = useCallback(() => {
    if (!currentUser) return;
    const filters = {
        ageRange: [18, 40],
        selectedCity: currentUser.city || "Все",
        distance: [50],
        genderPref: currentUser.gender === 'female' ? 'male' : 'female',
        selectedDatingGoal: currentUser.datingGoal || "all",
        selectedInterests: currentUser.interests || [],
    };
    sessionStorage.setItem('autosearchFilters', JSON.stringify(filters));
    router.push('/search?mode=autosearch');
  }, [currentUser, router]);

  if (!isMounted) {
    return (
      <div className="flex flex-col h-svh bg-white items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-4xl font-black font-headline gradient-text tracking-tighter"
        >
          SwiftMatch
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-svh bg-[#f8f9fb]">
      <AppHeader />
      <main className="flex-1 overflow-y-auto pb-24">
        {/* Hero Section */}
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
            <Button onClick={() => setShowAutosearchDialog(true)} className="h-12 rounded-xl gradient-bg text-white font-black text-[10px] shadow-xl border-0 uppercase tracking-widest active:scale-95 transition-all">
              <Zap size={14} fill="currentColor" /> {t('button.autosearch')}
            </Button>
            <Button asChild className="h-12 rounded-xl bg-white border-2 border-primary text-primary font-black text-[10px] shadow-lg uppercase tracking-widest active:scale-95 transition-all">
              <Link href="/search?mode=nearby" prefetch={true}><Search size={14} className="stroke-[3px]" /> {t('home.nearby')}</Link>
            </Button>
          </div>
        </section>

        {/* Popular Groups Section */}
        <section className="px-5 pt-8">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="font-black text-lg font-headline tracking-tight">Популярные группы</h2>
            <Link href="/groups" className="text-[10px] font-black text-primary uppercase tracking-widest">Все</Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {popularGroups.map((group) => (
              <Link 
                href={`/groups/${group.id}`} 
                key={group.id} 
                className="bg-white p-4 rounded-xl app-shadow border border-white hover:bg-primary/5 transition-all flex flex-col items-center text-center gap-2 group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-xs leading-tight">{language === 'RU' ? group.name_ru : group.name_en}</h4>
                  <p className="text-[9px] text-green-600 font-bold uppercase mt-1 flex items-center justify-center gap-1">
                    <span className="w-1 h-1 bg-current rounded-full"></span>
                    {group.online} {t('chats.online')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Photo Month Section */}
        <section className="px-5 pt-8">
          <Link href="/contest" prefetch={true} className="block relative h-28 rounded-[2.5rem] overflow-hidden group bg-gradient-to-r from-amber-500 to-orange-600 shadow-xl shadow-amber-500/20">
            <div className="relative h-full flex items-center p-6 text-white">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center mr-4">
                <Trophy size={24} fill="currentColor" />
              </div>
              <div className="flex-1">
                <h4 className="font-black text-lg tracking-tight leading-tight">{t('contest.title')}</h4>
                <p className="text-[10px] font-bold opacity-80 uppercase tracking-wider">{t('contest.participate_banner')}</p>
              </div>
              <ChevronRight className="opacity-60" size={24} />
            </div>
          </Link>
        </section>

        <Suspense fallback={<div className="px-5 pt-8 space-y-4"><Skeleton className="h-8 w-40" /><div className="grid grid-cols-2 gap-4"><Skeleton className="aspect-[4/3] rounded-xl" /><Skeleton className="aspect-[4/3] rounded-xl" /></div></div>}>
          <TopOfWeekSection topUsers={topUsers} onLike={(u) => toast({ title: "Лайк!", description: `Вы лайкнули ${u.name}` })} t={t} />
        </Suspense>

        <Suspense fallback={<div className="px-5 pt-10 space-y-4"><Skeleton className="h-8 w-40" /><div className="grid grid-cols-2 gap-4"><Skeleton className="aspect-[16/10] rounded-xl" /><Skeleton className="aspect-[16/10] rounded-xl" /></div></div>}>
          <RecommendationsSection recommendedUsers={recommendedUsers} onLike={(u) => toast({ title: "Лайк!", description: `Вы лайкнули ${u.name}` })} t={t} />
        </Suspense>
      </main>

      {showAutosearchDialog && <AutosearchDialog open={showAutosearchDialog} onOpenChange={setShowAutosearchDialog} onAutosearch={runAutosearch} />}

      <BottomNav />
    </div>
  );
}
