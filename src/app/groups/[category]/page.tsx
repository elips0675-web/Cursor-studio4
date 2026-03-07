
'use client';

import { Suspense, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
    ChevronLeft, 
    Users, 
    Plus, 
    Gift, 
    Play, 
    CreditCard,
    Music,
    Dumbbell,
    Palette,
    Gamepad2,
    Film,
    Globe,
    ChefHat,
    Cpu,
    BookOpen,
    Sparkles,
    Shirt,
    HeartPulse,
    Dog,
    FlaskConical,
    Briefcase,
    Home,
    Car,
    Laugh,
    Star,
    Scroll
} from 'lucide-react';
import { GROUP_CATEGORIES } from '@/lib/demo-data';
import { AppHeader } from '@/components/layout/app-header';
import { BottomNav } from '@/components/navigation/bottom-nav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/language-context';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';

const iconMap: Record<string, React.ElementType> = {
    Music, Dumbbell, Palette, Gamepad2, Film, Globe, ChefHat, Cpu, BookOpen, Sparkles, Shirt, HeartPulse, Dog, FlaskConical, Briefcase, Home, Car, Laugh, Star, Scroll
};


function SubGroupsContent() {
    const params = useParams();
    const router = useRouter();
    const { t, language } = useLanguage();
    const { category: categoryId } = params;

    const [showPremiumDialog, setShowPremiumDialog] = useState(false);

    const category = GROUP_CATEGORIES.find(c => c.id === categoryId);

    const handleAdWatch = () => {
        toast({ title: t('groups.ad.toast.title'), description: t('groups.ad.toast.description') });
        setShowPremiumDialog(false);
    };

    const handlePurchase = () => {
        toast({ title: 'Покупка', description: 'Функция покупки в разработке.' });
        setShowPremiumDialog(false);
    };

    if (!category) {
        return (
          <div className="flex-1 flex items-center justify-center text-center p-8">
            <div>
              <h2 className="text-xl font-bold">Категория не найдена</h2>
              <Button onClick={() => router.push('/groups')} className="mt-4">Назад к группам</Button>
            </div>
          </div>
        );
    }
    
    const CategoryIcon = iconMap[category.icon] || Users;

    return (
        <div className="flex flex-col h-svh bg-[#f8f9fb]">
            <header className="flex items-center gap-2 px-3 py-2 border-b border-border sticky top-0 bg-white/90 backdrop-blur-lg z-50 h-16">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-muted/50">
                  <ChevronLeft size={24} className="text-foreground" />
                </Button>
                <div className="flex-1 min-w-0 flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <CategoryIcon size={18} className="text-orange-500" />
                  </div>
                  <h3 className="font-black text-lg leading-tight tracking-tight text-foreground truncate">
                    {language === 'RU' ? category.name_ru : category.name_en}
                  </h3>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto px-5 pt-6 pb-24">
                <div 
                    onClick={() => setShowPremiumDialog(true)}
                    className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl text-white flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition-transform app-shadow"
                >
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/20">
                        <Gift size={24} />
                    </div>
                    <div>
                        <h4 className="font-black tracking-tight">{t('groups.ad.title')}</h4>
                        <p className="text-xs text-white/80 mt-0.5">{t('groups.ad.description')}</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {category.subgroups.map(subgroup => (
                        <Link href={`/chats?groupId=${subgroup.id}`} key={subgroup.id} className="flex items-center justify-between p-4 bg-white rounded-2xl app-shadow hover:bg-muted/30 transition-all cursor-pointer group border border-white">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">{language === 'RU' ? subgroup.name_ru : subgroup.name_en}</h4>
                                    <div className="flex items-center text-muted-foreground text-xs mt-1.5 gap-3">
                                        <div className="flex items-center gap-1.5 font-semibold">
                                            <Users size={12} /> {subgroup.members}
                                        </div>
                                        <div className="flex items-center gap-1.5 font-semibold text-green-600">
                                            <div className="w-2 h-2 rounded-full bg-current"></div>
                                            {subgroup.online} {t('chats.online')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Button variant="outline" className="ml-4 shrink-0 px-4 h-9 rounded-full border-primary/20 text-primary hover:bg-primary/5 hover:text-primary font-black uppercase text-[9px] tracking-widest shadow-sm group-hover:scale-105 transition-transform">
                                <Plus size={14} className="mr-1.5" />
                                {t('button.join') || 'Вступить'}
                            </Button>
                        </Link>
                    ))}
                </div>
            </main>
            <BottomNav />

            <AnimatePresence>
                {showPremiumDialog && (
                <Dialog open={showPremiumDialog} onOpenChange={setShowPremiumDialog}>
                    <DialogContent className="max-w-[340px] rounded-[2.5rem] p-0 overflow-hidden border-0 bg-white app-shadow">
                    <div className="relative h-40 bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center justify-center text-white p-6 overflow-hidden">
                        <div className="absolute inset-0 bg-black/5"></div>
                        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute"><Gift size={160} /></motion.div>
                        <Gift className="text-white mb-2 drop-shadow-lg relative z-10 animate-pulse" size={48} />
                        <DialogTitle className="text-2xl font-black uppercase tracking-tighter relative z-10">{t('groups.ad.title')}</DialogTitle>
                        <DialogDescription className="text-[10px] text-white/90 font-bold uppercase tracking-[0.1em] relative z-10 mt-1 text-center px-4 leading-relaxed">{t('autosearch.desc')}</DialogDescription>
                    </div>
                    <div className="p-6 space-y-4">
                        <Button onClick={handleAdWatch} variant="outline" className="w-full h-16 rounded-2xl border-2 border-primary/20 bg-primary/5 flex flex-col items-center justify-center gap-1 group hover:bg-primary/10 transition-all border-dashed">
                            <div className="flex items-center gap-2 text-primary"><Play size={14} fill="currentColor" /><span className="text-[11px] font-black uppercase tracking-widest">{t('autosearch.free')}</span></div>
                            <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-tighter opacity-60">{language === 'RU' ? '1 доступ за видео' : '1 access for 1 Video'}</span>
                        </Button>
                        <div className="relative py-2"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-muted"></span></div><div className="relative flex justify-center text-[8px] uppercase font-black tracking-widest text-muted-foreground bg-white px-4">или</div></div>
                        <Button onClick={handlePurchase} className="w-full h-16 rounded-2xl gradient-bg text-white shadow-xl shadow-primary/20 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all border-0">
                            <div className="flex items-center gap-2">
                                <CreditCard size={16} />
                                <span className="text-xs font-black uppercase tracking-widest">{t('autosearch.paid')}</span>
                            </div>
                            <span className="text-[10px] text-white/80 font-bold uppercase tracking-tighter">{language === 'RU' ? 'Всего за 49 ₽' : 'Just $0.99'}</span>
                        </Button>
                    </div>
                    <DialogFooter className="p-6 pt-0"><Button variant="ghost" onClick={() => setShowPremiumDialog(false)} className="w-full text-muted-foreground text-[9px] font-black uppercase tracking-widest h-10">{t('button.not_now')}</Button></DialogFooter>
                    </DialogContent>
                </Dialog>
                )}
            </AnimatePresence>
        </div>
    )
}

function LoadingSkeleton() {
    return (
        <div className="flex flex-col h-svh bg-[#f8f9fb]">
            <header className="flex items-center gap-2 px-3 py-2 border-b border-border sticky top-0 bg-white/90 backdrop-blur-lg z-50 h-16">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-6 w-32 rounded-md" />
            </header>
            <main className="flex-1 overflow-y-auto px-5 pt-6 pb-24">
                <div className="space-y-3">
                    {Array.from({ length: 10 }).map((_, i) => (
                         <div key={i} className="flex items-center gap-4 p-3 bg-white rounded-2xl app-shadow">
                            <Skeleton className="w-14 h-14 rounded-xl" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-4/5 rounded-md" />
                                <Skeleton className="h-4 w-3/5 rounded-md" />
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <BottomNav />
        </div>
    )
}

export default function SubGroupsPage() {
    return (
        <Suspense fallback={<LoadingSkeleton />}>
            <SubGroupsContent />
        </Suspense>
    )
}
