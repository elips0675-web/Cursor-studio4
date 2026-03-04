
"use client";

import { useState } from "react";
import { 
  Heart, 
  Eye, 
  UserPlus, 
  ChevronRight, 
  Sparkles, 
  Play, 
  Check, 
  Zap, 
  ShieldCheck,
  Star
} from "lucide-react";
import Image from "next/image";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const ACTIVITY_DATA = [
  { id: 1, user: 'Анна', age: 24, img: PlaceHolderImages[0].imageUrl, type: 'like', time: '5 мин назад', seen: false, blurred: true },
  { id: 2, user: 'Елена', age: 26, img: PlaceHolderImages[2].imageUrl, type: 'visit', time: '15 мин назад', seen: false, blurred: false },
  { id: 3, user: 'Мария', age: 29, img: PlaceHolderImages[6].imageUrl, type: 'match', time: '1 час назад', seen: true, blurred: false },
  { id: 4, user: 'София', age: 22, img: PlaceHolderImages[4].imageUrl, type: 'like', time: '3 часа назад', seen: true, blurred: true },
  { id: 5, user: 'Ксения', age: 23, img: PlaceHolderImages[8].imageUrl, type: 'visit', time: '5 часов назад', seen: true, blurred: false },
];

const PREMIUM_PLANS = [
  { id: '1m', name: '1 месяц', price: '499 ₽', oldPrice: '', discount: '', popular: false },
  { id: '6m', name: '6 месяцев', price: '1 990 ₽', oldPrice: '2 994 ₽', discount: '-33%', popular: true },
  { id: '12m', name: '12 месяцев', price: '2 990 ₽', oldPrice: '5 988 ₽', discount: '-50%', popular: false },
];

export default function ActivityPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [showPremium, setShowPremium] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [isAdLoading, setIsAdLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('6m');

  const handleWatchAd = () => {
    setIsAdLoading(true);
    setTimeout(() => {
      setIsAdLoading(false);
      setShowAd(false);
      toast({
        title: "Профиль открыт!",
        description: "Вы получили 1 бесплатный просмотр лайка за рекламу.",
      });
    }, 3000);
  };

  const filteredActivity = ACTIVITY_DATA.filter(item => {
    if (activeTab === "all") return true;
    if (activeTab === "likes") return item.type === "like" || item.type === "match";
    if (activeTab === "visits") return item.type === "visit";
    return true;
  });

  return (
    <>
      <AppHeader />
      <main className="flex-1 overflow-y-auto px-5 pt-6 pb-24 bg-[#f8f9fb]">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-black font-headline tracking-tight">Активность</h2>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">Твои новые события</p>
          </div>
          <Badge className="gradient-bg text-white rounded-full px-3 border-0 shadow-sm">5 новых</Badge>
        </div>

        <Tabs defaultValue="all" className="w-full mb-8" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-transparent h-auto p-0 gap-3 border-0 shadow-none">
            <TabsTrigger 
              value="all" 
              className="h-12 rounded-2xl bg-white border border-border/50 text-[11px] font-black uppercase tracking-widest text-muted-foreground data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#fe3c72] data-[state=active]:to-[#ff8e53] data-[state=active]:text-white data-[state=active]:border-0 data-[state=active]:shadow-lg transition-all duration-300"
            >
              Все
            </TabsTrigger>
            <TabsTrigger 
              value="likes" 
              className="h-12 rounded-2xl bg-white border border-border/50 text-[11px] font-black uppercase tracking-widest text-muted-foreground data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#fe3c72] data-[state=active]:to-[#ff8e53] data-[state=active]:text-white data-[state=active]:border-0 data-[state=active]:shadow-lg transition-all duration-300"
            >
              Лайки
            </TabsTrigger>
            <TabsTrigger 
              value="visits" 
              className="h-12 rounded-2xl bg-white border border-border/50 text-[11px] font-black uppercase tracking-widest text-muted-foreground data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#fe3c72] data-[state=active]:to-[#ff8e53] data-[state=active]:text-white data-[state=active]:border-0 data-[state=active]:shadow-lg transition-all duration-300"
            >
              Визиты
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-6 space-y-4 outline-none">
            {/* Ad Button */}
            <Button 
              variant="outline" 
              onClick={() => setShowAd(true)}
              className="w-full h-12 rounded-2xl border-dashed border-primary/40 text-primary font-black text-[11px] uppercase tracking-widest gap-2 bg-white hover:bg-primary/5 transition-all shadow-sm mb-2"
            >
              <Play size={14} fill="currentColor" /> Посмотреть рекламу
            </Button>

            {/* List */}
            <div className="space-y-4">
              {filteredActivity.length > 0 ? (
                filteredActivity.map((item) => (
                  <ActivityItem key={item.id} item={item} onUnlock={() => setShowAd(true)} />
                ))
              ) : (
                <div className="text-center py-20 opacity-40">
                  <p className="text-sm font-bold">Здесь пока пусто</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Premium Banner */}
        <div 
          onClick={() => setShowPremium(true)}
          className="gradient-bg rounded-[2.5rem] p-8 text-white mb-12 relative overflow-hidden app-shadow cursor-pointer group active:scale-[0.98] transition-all"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-500">
            <Sparkles size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                <Star size={18} className="text-yellow-300" fill="currentColor" />
              </div>
              <h4 className="font-black text-xl tracking-tight">SwiftMatch Premium</h4>
            </div>
            <p className="text-sm text-white/90 mb-6 max-w-[240px] leading-relaxed">Узнай, кто тебя лайкнул и получи безлимит возможностей</p>
            <button className="bg-white text-primary text-[10px] font-black uppercase tracking-[0.2em] py-4 px-10 rounded-full shadow-xl hover:shadow-2xl transition-all">
              Попробовать сейчас
            </button>
          </div>
        </div>
      </main>

      {/* Premium Tariffs Dialog */}
      <Dialog open={showPremium} onOpenChange={setShowPremium}>
        <DialogContent className="max-w-[380px] rounded-[2.5rem] p-0 overflow-hidden border-0 bg-white app-shadow">
          <div className="relative h-44 gradient-bg flex flex-col items-center justify-center text-white p-6">
             <div className="absolute inset-0 bg-black/5"></div>
             <Star className="text-yellow-300 mb-3 animate-pulse relative z-10" size={48} fill="currentColor" />
             <DialogTitle className="text-2xl font-black uppercase tracking-tighter relative z-10">Premium</DialogTitle>
             <p className="text-[10px] text-white/80 font-bold uppercase tracking-[0.2em] relative z-10 mt-1">Выберите ваш тариф</p>
          </div>

          <div className="p-8 space-y-4">
            {PREMIUM_PLANS.map((plan) => (
              <div 
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={cn(
                  "relative p-5 rounded-[1.75rem] border-2 transition-all cursor-pointer flex justify-between items-center group",
                  selectedPlan === plan.id 
                    ? "border-primary bg-primary/5 shadow-md" 
                    : "border-muted hover:border-muted-foreground/20"
                )}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-6 bg-primary text-white text-[8px] uppercase font-black border-2 border-white shadow-sm px-3">Популярно</Badge>
                )}
                {plan.discount && (
                  <Badge className="absolute -top-3 right-6 bg-[#2ecc71] text-white text-[8px] uppercase font-black border-2 border-white shadow-sm px-3">{plan.discount}</Badge>
                )}
                
                <div>
                  <h6 className="font-bold text-sm text-foreground/80 group-hover:text-foreground">{plan.name}</h6>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xl font-black text-foreground">{plan.price}</span>
                    {plan.oldPrice && <span className="text-[10px] text-muted-foreground line-through decoration-primary/40">{plan.oldPrice}</span>}
                  </div>
                </div>

                <div className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
                  selectedPlan === plan.id ? "border-primary bg-primary text-white scale-110 shadow-sm" : "border-muted"
                )}>
                  {selectedPlan === plan.id && <Check size={18} strokeWidth={4} />}
                </div>
              </div>
            ))}

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-muted">
               <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-black uppercase tracking-tighter">
                 <Zap size={14} className="text-primary" /> Безлимит
               </div>
               <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-black uppercase tracking-tighter">
                 <Eye size={14} className="text-primary" /> Просмотры
               </div>
               <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-black uppercase tracking-tighter">
                 <ShieldCheck size={14} className="text-primary" /> Инкогнито
               </div>
               <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-black uppercase tracking-tighter">
                 <Sparkles size={14} className="text-primary" /> 5 Супер-лайков
               </div>
            </div>
          </div>

          <DialogFooter className="p-8 pt-0">
            <Button className="w-full h-16 rounded-full gradient-bg text-white font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 active:scale-95 transition-all">
              Подключить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Watch Ad Dialog */}
      <Dialog open={showAd} onOpenChange={setShowAd}>
        <DialogContent className="max-w-[340px] rounded-[2.5rem] p-10 text-center bg-white app-shadow border-0">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
            <div className="absolute inset-0 rounded-full bg-primary/5 animate-ping"></div>
            <Play size={40} className="text-primary ml-1.5 relative z-10" fill="currentColor" />
          </div>
          <DialogTitle className="text-2xl font-black mb-3 font-headline tracking-tight">Бонус-просмотр</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm mb-8 leading-relaxed">
            Посмотрите короткое видео, чтобы открыть профиль на <span className="text-primary font-bold">24 часа</span> бесплатно.
          </DialogDescription>
          
          <div className="flex flex-col gap-4">
            <Button 
              onClick={handleWatchAd}
              disabled={isAdLoading}
              className="w-full h-16 rounded-full gradient-bg text-white font-black uppercase tracking-widest shadow-lg shadow-primary/20"
            >
              {isAdLoading ? "Загрузка..." : "Смотреть"}
            </Button>
            <Button variant="ghost" onClick={() => setShowAd(false)} className="rounded-full text-muted-foreground text-xs font-bold uppercase tracking-widest h-12">
              Не сейчас
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </>
  );
}

function ActivityItem({ item, onUnlock }: { item: any, onUnlock: () => void }) {
  const getIcon = () => {
    switch (item.type) {
      case 'like': return <Heart size={14} className="text-white" fill="currentColor" />;
      case 'visit': return <Eye size={14} className="text-white" />;
      case 'match': return <UserPlus size={14} className="text-white" />;
      default: return null;
    }
  };

  const getBgColor = () => {
    switch (item.type) {
      case 'like': return 'gradient-bg';
      case 'visit': return 'bg-blue-500';
      case 'match': return 'bg-green-500';
      default: return 'bg-muted';
    }
  };

  const getMessage = () => {
    switch (item.type) {
      case 'like': return 'поставила вам лайк';
      case 'visit': return 'посетила ваш профиль';
      case 'match': return 'новое совпадение с вами!';
      default: return '';
    }
  };

  return (
    <div className={cn(
      "flex items-center gap-4 p-5 rounded-[2.5rem] transition-all cursor-pointer group relative overflow-hidden",
      item.seen ? "bg-white/50 opacity-80" : "bg-white app-shadow hover:translate-y-[-4px]"
    )}>
      {!item.seen && (
        <div className="absolute top-0 left-0 w-1.5 h-full gradient-bg opacity-60"></div>
      )}
      
      <div className="relative flex-shrink-0">
        <div className={cn(
          "w-16 h-16 rounded-[1.75rem] overflow-hidden relative border-2 border-white shadow-md transition-all",
          item.blurred && "blur-[8px] grayscale opacity-70"
        )}>
          <Image src={item.img} alt={item.user} fill className="object-cover" />
        </div>
        <div className={cn(
          "absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-md z-10",
          getBgColor()
        )}>
          {getIcon()}
        </div>
      </div>
      
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex justify-between items-start mb-0.5">
          <p className="text-[13px] leading-tight text-foreground/90">
            {item.blurred ? (
              <span className="font-bold">Кто-то <span className="font-medium text-muted-foreground">{getMessage()}</span></span>
            ) : (
              <>
                <span className="font-bold">{item.user}, {item.age}</span> <span className="font-medium text-muted-foreground">{getMessage()}</span>
              </>
            )}
          </p>
          {!item.seen && (
            <div className="relative flex h-2 w-2 mt-1.5 ml-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </div>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground font-bold tracking-tight uppercase opacity-60 mt-1">{item.time}</p>
        
        {item.blurred && (
          <button 
            onClick={(e) => { e.stopPropagation(); onUnlock(); }}
            className="text-[10px] font-black text-primary flex items-center gap-1.5 mt-2 bg-primary/5 px-4 py-2 rounded-full w-fit hover:bg-primary/10 transition-colors uppercase tracking-widest shadow-sm"
          >
            <Sparkles size={11} /> Узнать кто
          </button>
        )}
      </div>

      <ChevronRight size={18} className="text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
    </div>
  );
}
