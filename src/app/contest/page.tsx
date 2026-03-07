"use client";

import { useState, useEffect, useMemo } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { useLanguage } from "@/context/language-context";
import { 
  Trophy, 
  Heart, 
  Timer, 
  Star, 
  Info, 
  ChevronRight, 
  Crown, 
  Sparkles, 
  Maximize2, 
  X, 
  Gift, 
  Zap, 
  ShieldCheck,
  Award,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

const FEMALE_ENTRIES = [
  { id: 'f1', userId: 'u1', userName: 'Алина', photo: PlaceHolderImages[6].imageUrl, votes: 1240, rank: 1, gender: 'female' },
  { id: 'f2', userId: 'u5', userName: 'Анна', photo: PlaceHolderImages[0].imageUrl, votes: 980, rank: 2, gender: 'female' },
  { id: 'f3', userId: 'u3', userName: 'Елена', photo: PlaceHolderImages[2].imageUrl, votes: 850, rank: 3, gender: 'female' },
  { id: 'f4', userId: 'u9', userName: 'Ксения', photo: PlaceHolderImages[8].imageUrl, votes: 420, rank: 4, gender: 'female' },
  { id: 'f5', userId: 'u11', userName: 'София', photo: PlaceHolderImages[4].imageUrl, votes: 310, rank: 5, gender: 'female' },
];

const MALE_ENTRIES = [
  { id: 'm1', userId: 'u2', userName: 'Максим', photo: PlaceHolderImages[1].imageUrl, votes: 1100, rank: 1, gender: 'male' },
  { id: 'm2', userId: 'u8', userName: 'Иван', photo: PlaceHolderImages[7].imageUrl, votes: 950, rank: 2, gender: 'male' },
  { id: 'm3', userId: 'u4', userName: 'Дмитрий', photo: PlaceHolderImages[3].imageUrl, votes: 700, rank: 3, gender: 'male' },
  { id: 'm4', userId: 'u6', userName: 'Артем', photo: PlaceHolderImages[5].imageUrl, votes: 300, rank: 4, gender: 'male' },
  { id: 'm5', userId: 'u10', userName: 'Никита', photo: PlaceHolderImages[9].imageUrl, votes: 250, rank: 5, gender: 'male' },
];

export default function ContestPage() {
  const { t, language } = useLanguage();
  const [timeLeft, setTimeLeft] = useState("");
  const [votedEntries, setVotedEntries] = useState<string[]>([]);
  const [viewerPhoto, setViewerPhoto] = useState<string | null>(null);
  const [activeGender, setActiveGender] = useState<string>("female");
  const [votingProgress, setVotingProgress] = useState(0);

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
    
    const newVoted = [...votedEntries, entryId];
    setVotedEntries(newVoted);
    
    // Progress quest logic
    if (votingProgress < 5) {
      const newProgress = votingProgress + 1;
      setVotingProgress(newProgress);
      
      if (newProgress === 5) {
        toast({
          title: language === 'RU' ? "Задание выполнено! 🎉" : "Quest completed! 🎉",
          description: t('contest.quest.reward'),
        });
      }
    }

    toast({
      title: language === 'RU' ? "Голос учтен!" : "Vote counted!",
      description: language === 'RU' ? "Вы проголосовали за участника." : "You have voted for the participant.",
    });
  };

  const currentEntries = useMemo(() => {
    return activeGender === "female" ? FEMALE_ENTRIES : MALE_ENTRIES;
  }, [activeGender]);

  const topThree = currentEntries.slice(0, 3);

  const prizes = [
    { id: 'p1', icon: <ShieldCheck className="text-blue-500" />, title: t('contest.prizes.pro.title'), desc: t('contest.prizes.pro.desc') },
    { id: 'p2', icon: <Zap className="text-amber-500" />, title: t('contest.prizes.boost.title'), desc: t('contest.prizes.boost.desc') },
    { id: 'p3', icon: <Award className="text-purple-500" />, title: t('contest.prizes.badge.title'), desc: t('contest.prizes.badge.desc') },
  ];

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

        {/* Daily Quest Section */}
        <section className="mb-8">
          <div className="bg-white rounded-[2rem] p-5 border border-primary/10 app-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
              <Gift size={64} />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Star size={20} fill="currentColor" />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-tight">{t('contest.quest.title')}</h4>
                <p className="text-[10px] text-muted-foreground font-bold">{t('contest.quest.desc')}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-primary">
                <span>{votingProgress}/5</span>
                <span>{Math.round((votingProgress / 5) * 100)}%</span>
              </div>
              <Progress value={(votingProgress / 5) * 100} className="h-2.5 bg-primary/10" />
              <p className="text-[9px] text-primary/60 font-bold italic text-center pt-1">{t('contest.quest.reward')}</p>
            </div>
          </div>
        </section>

        <Tabs defaultValue="female" className="w-full mb-8" onValueChange={setActiveGender}>
          <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-2xl h-12 mb-6">
            <TabsTrigger value="female" className="rounded-xl font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">
              {t('contest.tab.women')}
            </TabsTrigger>
            <TabsTrigger value="male" className="rounded-xl font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">
              {t('contest.tab.men')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeGender} className="mt-0 outline-none">
            <div className="bg-white rounded-3xl p-5 border border-border/40 app-shadow mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
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

            <section className="mb-10 pt-10 relative">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeGender}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-center items-end gap-2 sm:gap-4 relative z-10"
                >
                  {/* Rank 2 */}
                  <div className="flex flex-col items-center flex-1 max-w-[100px]">
                    <div className="relative mb-3 cursor-pointer group" onClick={() => setViewerPhoto(topThree[1].photo)}>
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[1.5rem] border-4 border-slate-300 shadow-lg overflow-hidden bg-muted">
                        <Image src={topThree[1].photo} alt={topThree[1].userName} fill sizes="80px" className="object-cover transition-transform group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Maximize2 className="text-white" size={16} />
                        </div>
                      </div>
                      <div className="absolute -top-2 -right-2 w-7 h-7 bg-slate-300 rounded-full flex items-center justify-center text-white font-black text-xs shadow-md border-2 border-white">2</div>
                    </div>
                    <p className="font-bold text-xs truncate w-full text-center">{topThree[1].userName}</p>
                    <Badge variant="secondary" className="mt-1 bg-slate-100 text-slate-600 text-[8px] font-black">{topThree[1].votes}</Badge>
                  </div>

                  {/* Rank 1 */}
                  <div className="flex flex-col items-center flex-1 max-w-[120px] -mt-8">
                    <div className="relative mb-3 cursor-pointer group" onClick={() => setViewerPhoto(topThree[0].photo)}>
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-10 left-1/2 -translate-x-1/2 text-amber-500"
                      >
                        <Crown size={32} fill="currentColor" />
                      </motion.div>
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[2rem] border-4 border-amber-400 shadow-2xl overflow-hidden bg-muted ring-4 ring-amber-400/20">
                        <Image src={topThree[0].photo} alt={topThree[0].userName} fill sizes="100px" className="object-cover transition-transform group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Maximize2 className="text-white" size={24} />
                        </div>
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-white font-black text-sm shadow-md border-2 border-white">1</div>
                    </div>
                    <p className="font-black text-sm truncate w-full text-center">{topThree[0].userName}</p>
                    <Badge className="mt-1 gradient-bg text-white text-[9px] font-black border-0 shadow-lg shadow-primary/20">{topThree[0].votes}</Badge>
                  </div>

                  {/* Rank 3 */}
                  <div className="flex flex-col items-center flex-1 max-w-[100px]">
                    <div className="relative mb-3 cursor-pointer group" onClick={() => setViewerPhoto(topThree[2].photo)}>
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[1.5rem] border-4 border-amber-700/40 shadow-lg overflow-hidden bg-muted">
                        <Image src={topThree[2].photo} alt={topThree[2].userName} fill sizes="80px" className="object-cover transition-transform group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Maximize2 className="text-white" size={16} />
                        </div>
                      </div>
                      <div className="absolute -top-2 -right-2 w-7 h-7 bg-amber-700/60 rounded-full flex items-center justify-center text-white font-black text-xs shadow-md border-2 border-white">3</div>
                    </div>
                    <p className="font-bold text-xs truncate w-full text-center">{topThree[2].userName}</p>
                    <Badge variant="secondary" className="mt-1 bg-amber-50 text-amber-700 text-[8px] font-black">{topThree[2].votes}</Badge>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-muted/30 to-transparent -z-0 rounded-b-[3rem]"></div>
            </section>

            {/* Prizes List */}
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-4 px-1">
                <Award className="text-primary" size={18} />
                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t('contest.prizes.title')}</h4>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {prizes.map((prize) => (
                  <div key={prize.id} className="flex items-center gap-4 bg-white p-3.5 rounded-2xl border border-border/40 app-shadow">
                    <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
                      {prize.icon}
                    </div>
                    <div className="flex-1">
                      <h5 className="text-xs font-black leading-none">{prize.title}</h5>
                      <p className="text-[10px] text-muted-foreground mt-1 font-medium">{prize.desc}</p>
                    </div>
                    <div className="text-primary/20">
                      <CheckCircle2 size={16} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between px-1 mb-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{t('contest.all_participants')}</h4>
                <Sparkles className="text-primary/40" size={14} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {currentEntries.map((entry) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ y: -4 }}
                      key={entry.id} 
                      className="bg-white rounded-3xl overflow-hidden border border-border/40 app-shadow group"
                    >
                      <div className="relative aspect-[4/5] bg-muted cursor-pointer" onClick={() => setViewerPhoto(entry.photo)}>
                        <Image src={entry.photo} alt={entry.userName} fill sizes="(max-width: 480px) 50vw, 240px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Maximize2 className="text-white" size={24} />
                        </div>
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
                </AnimatePresence>
              </div>
            </section>
          </TabsContent>
        </Tabs>

        {/* Participation Section */}
        <section className="mt-8 mb-8">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden app-shadow">
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Camera size={120} />
            </div>
            <h4 className="text-lg font-black tracking-tight mb-2">{t('contest.participate_banner')}</h4>
            <p className="text-xs text-white/60 mb-6 leading-relaxed">{t('contest.rules_desc')}</p>
            <Button className="w-full h-12 rounded-full bg-white text-slate-900 font-black uppercase text-[10px] tracking-widest border-0 hover:bg-slate-100 transition-colors">
              {t('button.participate')}
            </Button>
          </div>
        </section>

        <div className="mt-6 p-6 bg-primary/5 rounded-[2rem] border border-primary/10 border-dashed mb-8">
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

      <Dialog open={!!viewerPhoto} onOpenChange={(open) => !open && setViewerPhoto(null)}>
        <DialogContent className="max-w-[440px] w-[95vw] p-0 border-0 bg-transparent shadow-none flex flex-col items-center justify-center [&>button]:hidden">
          <DialogTitle className="sr-only">Photo Viewer</DialogTitle>
          <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden app-shadow">
            {viewerPhoto && (
              <Image src={viewerPhoto} alt="Contest entry" fill sizes="(max-width: 480px) 100vw, 440px" className="object-cover" />
            )}
          </div>
          <div className="absolute top-4 right-4 z-50">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setViewerPhoto(null)} 
              className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border-white/20 text-white hover:bg-black/40 transition-all active:scale-90 shadow-lg"
            >
              <X size={20} />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </>
  );
}
