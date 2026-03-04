"use client";

import { useState } from "react";
import { Heart, Eye, UserPlus, ChevronRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const ACTIVITY_DATA = [
  { id: 1, user: 'Анна', age: 24, img: PlaceHolderImages[0].imageUrl, type: 'like', time: '5 мин назад', seen: false },
  { id: 2, user: 'Елена', age: 26, img: PlaceHolderImages[2].imageUrl, type: 'visit', time: '15 мин назад', seen: false },
  { id: 3, user: 'Мария', age: 29, img: PlaceHolderImages[6].imageUrl, type: 'match', time: '1 час назад', seen: true },
  { id: 4, user: 'София', age: 22, img: PlaceHolderImages[4].imageUrl, type: 'like', time: '3 часа назад', seen: true },
  { id: 5, user: 'Ксения', age: 23, img: PlaceHolderImages[8].imageUrl, type: 'visit', time: '5 часов назад', seen: true },
];

export default function ActivityPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredActivity = ACTIVITY_DATA.filter(item => {
    if (activeTab === "all") return true;
    if (activeTab === "likes") return item.type === "like" || item.type === "match";
    if (activeTab === "visits") return item.type === "visit";
    return true;
  });

  return (
    <>
      <AppHeader />
      <main className="flex-1 overflow-y-auto px-5 pt-6 pb-24">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-headline">Активность</h2>
          <Badge className="bg-primary text-white rounded-full">5 новых</Badge>
        </div>

        <Tabs defaultValue="all" className="w-full mb-6" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-muted rounded-2xl h-11 p-1">
            <TabsTrigger value="all" className="rounded-xl text-xs font-bold data-[state=active]:gradient-bg data-[state=active]:text-white">Все</TabsTrigger>
            <TabsTrigger value="likes" className="rounded-xl text-xs font-bold data-[state=active]:gradient-bg data-[state=active]:text-white">Лайки</TabsTrigger>
            <TabsTrigger value="visits" className="rounded-xl text-xs font-bold data-[state=active]:gradient-bg data-[state=active]:text-white">Просмотры</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Premium Banner */}
        <div className="gradient-bg rounded-[2rem] p-5 text-white mb-8 relative overflow-hidden shadow-lg shadow-primary/20">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Sparkles size={60} />
          </div>
          <div className="relative z-10">
            <h4 className="font-bold text-base mb-1">Узнай, кто тебя лайкнул</h4>
            <p className="text-[10px] text-white/80 mb-4 uppercase tracking-wider font-bold">SwiftMatch Premium</p>
            <button className="bg-white text-primary text-[10px] font-bold py-2 px-6 rounded-full shadow-sm hover:scale-105 transition-transform active:scale-95">
              Попробовать сейчас
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredActivity.map((item) => (
            <ActivityItem key={item.id} item={item} />
          ))}
        </div>
      </main>
      <BottomNav />
    </>
  );
}

function ActivityItem({ item }: { item: any }) {
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
      case 'like': return 'bg-primary';
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
      "flex items-center gap-4 p-4 rounded-3xl transition-all cursor-pointer group",
      item.seen ? "bg-white/50 grayscale-[0.3]" : "bg-white app-shadow"
    )}>
      <div className="relative flex-shrink-0">
        <div className="w-14 h-14 rounded-full overflow-hidden relative border-2 border-white shadow-sm">
          <Image src={item.img} alt={item.user} fill className="object-cover" />
        </div>
        <div className={cn(
          "absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm",
          getBgColor()
        )}>
          {getIcon()}
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-0.5">
          <p className="text-xs leading-snug">
            <span className="font-bold text-foreground">{item.user}, {item.age}</span> {getMessage()}
          </p>
          {!item.seen && <span className="w-2 h-2 bg-primary rounded-full mt-1.5 animate-pulse"></span>}
        </div>
        <p className="text-[10px] text-muted-foreground">{item.time}</p>
      </div>

      <ChevronRight size={18} className="text-muted-foreground/30 group-hover:translate-x-1 transition-transform" />
    </div>
  );
}
