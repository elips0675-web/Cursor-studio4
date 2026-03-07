
"use client";

import { useState, useEffect, useMemo } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { useLanguage } from "@/context/language-context";
import { Trophy, Heart, Timer, Star, Info, ChevronRight, Crown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const DEMO_ENTRIES = [
  { id: '1', userId: 'u1', userName: 'Алина', photo: PlaceHolderImages[6].imageUrl, votes: 1240, rank: 1 },
  { id: '2', userId: 'u2', userName: 'Максим', photo: PlaceHolderImages[1].imageUrl, votes: 980, rank: 2 },
  { id: '3', userId: 'u3', userName: 'Ксения', photo: PlaceHolderImages[8].imageUrl, votes: 850, rank: 3 },
  { id: '4', userId: 'u4', userName: 'Дмитрий', photo: PlaceHolderImages[3].imageUrl, votes: 420, rank: 4 },
  { id: '5', userId: 'u5', userName: 'Анна', photo: PlaceHolderImages[0].imageUrl, votes: 310, rank: 5 },
  { id: '6', userId: 'u6', userName: 'Артем', photo: PlaceHolderImages[5].imageUrl, votes: 280, rank: 6 },
];

export default function ContestPage() {
  const { t, language } = useLanguage();
  const [timeLeft, setTimeLeft] = useState("");
  const [votedEntries, setVotedEntries] = useState<string[]>([]);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      const diff = endOfMonth.getTime() - now.getTime();
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft(`${days}д ${hours}ч ${mins}м`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleVote = (entryId: string) => {
    if (votedEntries.includes(entryId)) return;
    setVotedEntries([...votedEntries, entryId]);
    toast({
      title: language === 'RU' ? "Голос учтен!" : "Vote counted!",
      description: language === 'RU' ? "Вы проголосовали за участника." : "You have voted for the participant.",
    });
  };

  const topThree = DEMO_ENTRIES.slice(0, 3);
  const others = DEMO_ENTRIES.slice(3);

  return (
    <>
      <AppHeader />
      <main className="flex-1 overflow-y-auto px-5 pt-6 pb-24 bg-[#f8f9fb]">
        <header className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex p-4 rounded-3xl bg-amber-500/10 text-amber-600 mb-4 shadow-sm border border-amber-500/20"
          >
            <Trophy size={32} />
          </motion.div>
          <h2 className="text-3xl font-black font-headline tracking-tighter text-foreground leading-none">
            {t('contest.title')}
          </h2>
          <p className="text-muted-foreground text-xs mt-2 font-medium uppercase tracking-widest opacity-70">
            {t('contest.subtitle')}
          </p>
        </header>

        {/* Timer Card */}
        <div className="bg-white rounded-3xl p-5 border border-border/40 app-shadow mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Timer size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('contest.ends_in')}</p>
              <p className="text-lg font-black tracking-tight">{timeLeft}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground/40">
            <Info size={18} />
          </Button>
        </div>

        {/* Podium */}
        <section className="mb-10 pt-10 relative">
          <div className="flex justify-center items-end gap-2 sm:gap-4 relative z-10">
            {/* 2nd Place */}
            <div className="flex flex-col items-center flex-1 max-w-[100px]">
              <div className="relative mb-3">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[1.5rem] border-4 border-slate-300 shadow-lg overflow-hidden bg-muted">
                  <Image src={topThree[1].photo} alt={topThree[1].userName} fill className="object-cover" />
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-slate-300 rounded-full flex items-center justify-center text-white font-black text-xs shadow-md border-2 border-white">2</div>
              </div>
              <p className="font-bold text-xs truncate w-full text-center">{topThree[1].userName}</p>
              <Badge variant="secondary" className="mt-1 bg-slate-100 text-slate-600 text-[8px] font-black">{topThree[1].votes}</Badge>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center flex-1 max-w-[120px] -mt-8">
              <div className="relative mb-3">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-10 left-1/2 -translate-x-1/2 text-amber-500"
                >
                  <Crown size={32} fill="currentColor" />
                </motion.div>
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[2rem] border-4 border-amber-400 shadow-2xl overflow-hidden bg-muted ring-4 ring-amber-400/20">
                  <Image src={topThree[0].photo} alt={topThree[0].userName} fill className="object-cover" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-white font-black text-sm shadow-md border-2 border-white">1</div>
              </div>
              <p className="font-black text-sm truncate w-full text-center">{topThree[0].userName}</p>
              <Badge className="mt-1 gradient-bg text-white text-[9px] font-black border-0 shadow-lg shadow-primary/20">{topThree[0].votes}</Badge>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center flex-1 max-w-[100px]">
              <div className="relative mb-3">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[1.5rem] border-4 border-amber-700/40 shadow-lg overflow-hidden bg-muted">
                  <Image src={topThree[2].photo} alt={topThree[2].userName} fill className="object-cover" />
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-amber-700/60 rounded-full flex items-center justify-center text-white font-black text-xs shadow-md border-2 border-white">3</div>
              </div>
              <p className="font-bold text-xs truncate w-full text-center">{topThree[2].userName}</p>
              <Badge variant="secondary" className="mt-1 bg-amber-50 text-amber-700 text-[8px] font-black">{topThree[2].votes}</Badge>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-muted/30 to-transparent -z-0 rounded-b-[3rem]"></div>
        </section>

        {/* List of others */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1 mb-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{t('contest.all_participants')}</h4>
            <Sparkles className="text-primary/40" size={14} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {DEMO_ENTRIES.map((entry) => (
              <motion.div 
                whileHover={{ y: -4 }}
                key={entry.id} 
                className="bg-white rounded-3xl overflow-hidden border border-border/40 app-shadow group"
              >
                <div className="relative aspect-[4/5] bg-muted">
                  <Image src={entry.photo} alt={entry.userName} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-black/40 backdrop-blur-md text-white border-0 font-bold text-[9px]">#{entry.rank}</Badge>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white font-bold text-xs truncate">{entry.userName}</p>
                    <p className="text-white/70 text-[9px] font-medium">{entry.votes} {t('contest.votes_count')}</p>
                  </div>
                </div>
                <div className="p-2">
                  <Button 
                    onClick={() => handleVote(entry.id)}
                    disabled={votedEntries.includes(entry.id)}
                    className={cn(
                      "w-full h-10 rounded-2xl font-black uppercase text-[9px] tracking-widest transition-all",
                      votedEntries.includes(entry.id) 
                        ? "bg-muted text-muted-foreground cursor-default" 
                        : "gradient-bg text-white shadow-lg shadow-primary/20 active:scale-95"
                    )}
                  >
                    {votedEntries.includes(entry.id) ? (
                      <span className="flex items-center gap-1.5"><Heart size={10} fill="currentColor" /> {language === 'RU' ? 'Голос' : 'Voted'}</span>
                    ) : (
                      t('button.vote')
                    )}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Rules Banner */}
        <div className="mt-10 p-6 bg-primary/5 rounded-[2rem] border border-primary/10 border-dashed mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Info size={16} />
            </div>
            <h5 className="font-black text-xs uppercase tracking-tight text-primary">{t('contest.rules')}</h5>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
            {t('contest.rules_desc')}
          </p>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
