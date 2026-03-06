
"use client";

import { useState, useMemo, memo, useCallback } from "react";
import { MapPin, User, ChevronLeft, ChevronRight, X, Heart, MessageCircle, Cpu, MoreVertical, Flag, Sparkles } from "lucide-react";
import Image from "next/image";
import dynamic from 'next/dynamic';
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import { toast } from "@/hooks/use-toast";
import { generateMatchCompatibilityInsight } from "@/ai/flows/ai-match-compatibility-insight";
import { ALL_DEMO_USERS } from "@/lib/demo-data";
import Link from "next/link";

// Оптимизация тяжелых компонентов через динамический импорт
const Dialog = dynamic(() => import("@/components/ui/dialog").then(mod => mod.Dialog));
const DialogContent = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogContent));
const DialogTitle = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogTitle));
const DialogDescription = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogDescription));
const DialogHeader = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogHeader));
const DialogFooter = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogFooter));
const DropdownMenu = dynamic(() => import("@/components/ui/dropdown-menu").then(mod => mod.DropdownMenu));
const DropdownMenuContent = dynamic(() => import("@/components/ui/dropdown-menu").then(mod => mod.DropdownMenuContent));
const DropdownMenuItem = dynamic(() => import("@/components/ui/dropdown-menu").then(mod => mod.DropdownMenuItem));
const DropdownMenuTrigger = dynamic(() => import("@/components/ui/dropdown-menu").then(mod => mod.DropdownMenuTrigger));
const RadioGroup = dynamic(() => import("@/components/ui/radio-group").then(mod => mod.RadioGroup));
const RadioGroupItem = dynamic(() => import("@/components/ui/radio-group").then(mod => mod.RadioGroupItem));
const Label = dynamic(() => import("@/components/ui/label").then(mod => mod.Label));
const Textarea = dynamic(() => import("@/components/ui/textarea").then(mod => mod.Textarea));
const HeartConfetti = dynamic(() => import("@/components/animations/heart-confetti").then(mod => mod.HeartConfetti), { ssr: false });

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.8,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.8,
  }),
};

const REPORT_REASONS = [
    'report.reason.spam',
    'report.reason.abuse',
    'report.reason.fake',
    'report.reason.scam',
    'report.reason.content'
];

export default function SearchPage() {
  const router = useRouter();
  const { t, language } = useLanguage();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [matchUser, setMatchUser] = useState<any>(null);
  const [compatibility, setCompatibility] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');

  // Используем демо-данные. В реальности здесь будет фильтрация из БД.
  const filteredUsers = useMemo(() => ALL_DEMO_USERS, []);
  
  const user = currentIndex < filteredUsers.length ? filteredUsers[currentIndex] : null;

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex(prev => prev + 1);
  }, []);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const getAiInsight = async (targetUser: any) => {
    if (!targetUser) return;
    setLoadingAi(true);
    try {
      const res = await generateMatchCompatibilityInsight({
        currentUser: {
          name: "Вы",
          age: 25,
          interests: ["Спорт", "Кино", "Кофе"],
          bio: "Активный пользователь SwiftMatch, люблю общение и новые открытия."
        },
        matchUser: {
          name: targetUser.name,
          age: targetUser.age,
          interests: targetUser.interests,
          bio: targetUser.bio || ""
        }
      });
      setCompatibility(res.explanation);
    } catch (e) {
      setCompatibility(t('match.insight_default') || "Вы отлично подходите друг другу!");
    } finally {
      setLoadingAi(false);
    }
  };

  const handleLike = () => {
    if (!user) return;
    toast({
        title: language === 'RU' ? "Лайк!" : "Like!",
        description: `${language === 'RU' ? 'Вы лайкнули' : 'You liked'} ${user.name}`,
    });

    if (Math.random() > 0.7) {
      setMatchUser(user);
      getAiInsight(user);
    } else {
      handleNext();
    }
  };

  const handleReportSubmit = () => {
    if (!reportReason) {
      toast({ variant: 'destructive', title: t('report.toast.no_reason_title'), description: t('report.toast.no_reason_desc') });
      return;
    }
    toast({ title: t('report.toast.success_title'), description: `${t('report.toast.success_desc')} ${user?.name}.` });
    setIsReportDialogOpen(false);
    setReportReason('');
    setReportDescription('');
  };

  if (!user) {
    return (
        <>
            <AppHeader />
            <main className="flex-1 overflow-hidden px-4 pt-4 pb-24 flex flex-col items-center justify-center relative bg-[#f8f9fb]">
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center h-full w-full text-center p-8 bg-white/50 rounded-[2.5rem] border-2 border-dashed border-muted shadow-inner"
                 >
                    <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                        <Sparkles size={40} className="text-muted-foreground opacity-40" />
                    </div>
                    <h4 className="text-xl font-black uppercase tracking-tight text-foreground">
                        {language === 'RU' ? 'Анкеты закончились' : 'No more profiles'}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-2 max-w-[200px] font-medium leading-relaxed">
                        {language === 'RU' ? 'Вы просмотрели всех людей поблизости. Заходите позже!' : 'You have seen everyone nearby. Come back later!'}
                    </p>
                    <Button 
                        variant="outline" 
                        onClick={() => setCurrentIndex(0)}
                        className="mt-8 rounded-full border-2 px-8 font-black uppercase text-[10px] tracking-widest h-12"
                    >
                        {language === 'RU' ? 'Начать заново' : 'Start over'}
                    </Button>
                </motion.div>
            </main>
            <BottomNav />
        </>
    );
  }

  return (
    <>
      <AppHeader />
      <main className="flex-1 overflow-hidden px-4 pt-4 pb-24 flex flex-col items-center relative bg-[#f8f9fb]">
        <div className="text-center mb-4 flex items-center justify-center gap-2">
            <Badge variant="outline" className="text-[8px] font-bold text-muted-foreground border-muted px-2 py-0.5 rounded-full uppercase tracking-tighter bg-white shadow-sm">
                {currentIndex + 1} / {filteredUsers.length}
            </Badge>
        </div>
        
        <div className="relative w-full flex-1 mb-6 max-w-[420px] flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrev}
            className="absolute left-[-10px] sm:left-[-16px] top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/50 backdrop-blur-sm text-foreground shadow-md hover:bg-white disabled:opacity-0 disabled:cursor-default transition-all"
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={24} />
          </Button>

          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={user.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute w-full h-full bg-white rounded-[2.5rem] overflow-hidden app-shadow flex flex-col border-4 border-white"
            >
              <div className="relative flex-1 select-none">
                  <Image 
                    src={user.img} 
                    alt={user.name} 
                    fill 
                    sizes="(max-width: 480px) 100vw, 420px"
                    data-ai-hint={user.hint} 
                    className="object-cover" 
                    priority
                  />
                  <div className="absolute top-4 left-4">
                     <Badge className="bg-[#2ecc71] text-white border-0 px-3 py-1 text-[10px] font-bold shadow-lg">
                        {language === 'RU' ? 'Онлайн' : 'Online'}
                     </Badge>
                  </div>
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                     <Badge className="bg-orange-500 text-white border-0 px-3 py-1 font-bold shadow-lg">
                       {user.match}% {language === 'RU' ? 'совпадение' : 'match'}
                     </Badge>
                     <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/40 backdrop-blur-md text-foreground border border-white/40 hover:bg-white/60 shadow-sm">
                                <MoreVertical size={16} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl border-0 shadow-2xl p-1.5 min-w-[160px] bg-white">
                            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setIsReportDialogOpen(true); }} className="rounded-xl font-bold text-[10px] uppercase tracking-wider cursor-pointer py-2 text-destructive focus:text-destructive focus:bg-destructive/10">
                                <Flag size={14} className="mr-2" />
                                {t('button.report')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                    <h3 className="text-3xl font-black font-headline mb-1 drop-shadow-md">{user.name}, {user.age}</h3>
                    <p className="text-white/90 text-xs flex items-center gap-1 font-bold mb-3">
                      <MapPin size={14} /> {user.distance} {language === 'RU' ? 'км от вас' : 'km from you'}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {user.interests.slice(0, 3).map(i => (
                        <span key={i} className="px-2 py-0.5 bg-white/20 backdrop-blur-md text-white text-[8px] rounded-full font-black uppercase tracking-widest border border-white/10">{i}</span>
                      ))}
                    </div>
                    <p className="text-white/80 text-[10px] leading-tight italic line-clamp-2">"{user.bio}"</p>
                  </div>
                </div>
            </motion.div>
          </AnimatePresence>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="absolute right-[-10px] sm:right-[-16px] top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/50 backdrop-blur-sm text-foreground shadow-md hover:bg-white transition-all"
          >
            <ChevronRight size={24} />
          </Button>
        </div>

        <div className="flex justify-center items-center gap-2 sm:gap-4 w-full px-2">
          <Button variant="outline" size="icon" className="w-16 h-16 rounded-full border-2 border-muted bg-white hover:bg-muted text-muted-foreground transition-all active:scale-90 shadow-lg" onClick={handleNext}>
              <X size={28} />
          </Button>
          <Button size="icon" className="w-20 h-20 rounded-full gradient-bg text-white shadow-xl shadow-primary/30 transition-all active:scale-90" onClick={handleLike}>
              <Heart size={36} fill="currentColor" />
          </Button>
          <Button variant="outline" size="icon" className="w-16 h-16 rounded-full border-2 border-primary/20 bg-white hover:bg-primary/5 text-primary transition-all active:scale-90 shadow-lg" onClick={() => router.push(`/chats?matchId=${user.id}`)}>
              <MessageCircle size={28} />
          </Button>
          <Button asChild variant="outline" size="icon" className="w-16 h-16 rounded-full border-2 border-muted bg-white hover:bg-muted text-foreground transition-all active:scale-90 shadow-lg">
            <Link href={`/user?id=${user.id}`} prefetch={false}>
              <User size={28} />
            </Link>
          </Button>
        </div>
      </main>
      
      <AnimatePresence>
        {matchUser && (
          <Dialog open={!!matchUser} onOpenChange={(open) => {
            if (!open) {
                setMatchUser(null);
                setTimeout(handleNext, 100);
            }
          }}>
            <DialogContent className="max-w-[400px] rounded-3xl border-0 p-0 overflow-hidden bg-white app-shadow">
              <div className="relative">
                <HeartConfetti />
                <div className="relative h-56 flex items-center justify-center p-6 gradient-bg">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    <div className="flex items-center justify-center gap-0 relative">
                        <motion.div 
                            initial={{ x: -60, opacity: 0, rotate: -15, scale: 0.8 }}
                            animate={{ x: 0, opacity: 1, rotate: -8, scale: 1 }}
                            transition={{ type: "spring", damping: 12, delay: 0.2 }}
                            className="w-36 h-36 rounded-3xl border-4 border-white shadow-2xl overflow-hidden relative z-10 -mr-8 bg-muted"
                        >
                            <Image 
                                src={PlaceHolderImages[10].imageUrl} 
                                alt="Вы" 
                                fill 
                                sizes="144px"
                                data-ai-hint={PlaceHolderImages[10].imageHint}
                                className="object-cover" 
                            />
                        </motion.div>
                        <motion.div 
                            initial={{ x: 60, opacity: 0, rotate: 15, scale: 0.8 }}
                            animate={{ x: 0, opacity: 1, rotate: 8, scale: 1 }}
                            transition={{ type: "spring", damping: 12, delay: 0.3 }}
                            className="w-36 h-36 rounded-3xl border-4 border-white shadow-2xl overflow-hidden relative z-0 bg-muted"
                        >
                            <Image 
                                src={matchUser?.img || PlaceHolderImages[0].imageUrl} 
                                alt={matchUser?.name || "Matched user photo"} 
                                fill 
                                sizes="144px"
                                data-ai-hint={matchUser?.hint || PlaceHolderImages[0].imageHint}
                                className="object-cover" 
                            />
                        </motion.div>
                    </div>
                </div>

                <div className="px-8 pt-8 pb-8 text-center">
                  <DialogTitle className="text-3xl font-black font-headline mb-3 gradient-text uppercase tracking-tight">
                    {t('match.title')}
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground text-sm mb-8 px-6 leading-relaxed font-medium">
                    {language === 'RU' ? 'Вы с ' : 'You and '} <span className="font-bold text-foreground">{matchUser?.name}</span> {language === 'RU' ? 'понравились друг другу.' : 'liked each other.'}
                  </DialogDescription>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="relative p-6 rounded-[2.5rem] mb-8 text-left border border-orange-500/20 bg-gradient-to-br from-white via-orange-500/[0.02] to-orange-500/[0.05] shadow-xl shadow-orange-500/5 overflow-hidden group"
                  >
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                    <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl opacity-40"></div>
                    
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                          <Cpu size={14} className="animate-pulse" />
                        </div>
                        <h4 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.2em]">{t('match.insight')}</h4>
                      </div>
                      <motion.div 
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                      >
                        <Sparkles size={20} className="text-orange-400 opacity-60" />
                      </motion.div>
                    </div>

                    {loadingAi ? (
                      <div className="flex items-center gap-3 text-xs text-muted-foreground py-2 relative z-10">
                        <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="animate-pulse font-bold uppercase tracking-widest text-[10px]">{t('home.searching')}</span>
                      </div>
                    ) : (
                      <div className="relative z-10">
                        <p className="text-[13px] leading-relaxed text-foreground/90 font-semibold italic border-l-4 border-orange-500/30 pl-4 py-1">
                          "{compatibility}"
                        </p>
                      </div>
                    )}

                    <div className="absolute bottom-2 right-4 text-orange-500/5 group-hover:text-orange-500/10 transition-colors">
                      <Sparkles size={48} />
                    </div>
                  </motion.div>

                  <div className="flex flex-col gap-4 w-full">
                    <Button 
                      onClick={() => matchUser?.id && router.push(`/chats?matchId=${matchUser.id}`)} 
                      className="w-full h-16 rounded-full gradient-bg text-white font-black app-shadow hover:scale-[1.02] active:scale-95 transition-all border-0 uppercase tracking-[0.2em] text-[11px] shadow-primary/30"
                    >
                      {t('button.write_first')}
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => { setMatchUser(null); setTimeout(handleNext, 100); }} 
                      className="w-full rounded-full h-12 text-muted-foreground font-black hover:bg-muted transition-all uppercase tracking-[0.1em] text-[10px]"
                    >
                      {t('button.continue')}
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

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
                          <RadioGroupItem value={t(reasonKey)} id={`${reasonKey}_swipe`} />
                          <Label htmlFor={`${reasonKey}_swipe`} className="font-bold text-sm cursor-pointer">{t(reasonKey)}</Label>
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
