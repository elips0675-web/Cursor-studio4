
"use client";

import { Flame, Search, Heart, MapPin, Zap, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Консистентный список из 10 демо-пользователей
const ALL_DEMO_USERS = [
  { id: 1, name: 'Анна', age: 24, img: PlaceHolderImages[0].imageUrl, online: true, distance: 2, match: 87 },
  { id: 2, name: 'Максим', age: 28, img: PlaceHolderImages[1].imageUrl, online: true, distance: 5, match: 92 },
  { id: 3, name: 'Елена', age: 26, img: PlaceHolderImages[2].imageUrl, online: false, distance: 3, match: 81 },
  { id: 4, name: 'Дмитрий', age: 31, img: PlaceHolderImages[3].imageUrl, online: false, distance: 12, match: 75 },
  { id: 5, name: 'София', age: 22, img: PlaceHolderImages[4].imageUrl, online: true, distance: 7, match: 88 },
  { id: 6, name: 'Артем', age: 25, img: PlaceHolderImages[5].imageUrl, online: true, distance: 4, match: 69 },
  { id: 7, name: 'Мария', age: 29, img: PlaceHolderImages[6].imageUrl, online: true, distance: 1, match: 94 },
  { id: 8, name: 'Иван', age: 27, img: PlaceHolderImages[7].imageUrl, online: false, distance: 15, match: 72 },
  { id: 9, name: 'Ксения', age: 23, img: PlaceHolderImages[8].imageUrl, online: true, distance: 6, match: 83 },
  { id: 10, name: 'Никита', age: 30, img: PlaceHolderImages[9].imageUrl, online: false, distance: 9, match: 77 }
];

export default function Home() {
  const [isAutoSearching, setIsAutoSearching] = useState(false);
  const recommendRef = useRef<HTMLDivElement>(null);

  const handleAutoSearch = () => {
    setIsAutoSearching(true);
    toast({
      title: "Автопоиск запущен",
      description: "Подбираем лучшие анкеты специально для вас...",
    });
    
    // Имитация процесса поиска и скролл к рекомендациям
    setTimeout(() => {
      setIsAutoSearching(false);
      recommendRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 1500);
  };

  const handleGoToSwipes = () => {
    setIsAutoSearching(true);
    setTimeout(() => {
      window.location.href = "/search";
    }, 800);
  };

  return (
    <>
      <AppHeader />
      <main className="flex-1 overflow-y-auto px-5 pt-6 pb-24 bg-[#f8f9fb]">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary border-0 gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
            <Flame size={12} fill="currentColor" /> Популярное сейчас
          </Badge>
          <h2 className="text-3xl font-black font-headline mb-2 leading-tight">
            Твой идеальный <br />
            <span className="gradient-text">мэтч</span> ждет тебя
          </h2>
          <p className="text-muted-foreground text-sm font-medium">Знакомься, общайся и находи любовь</p>
        </div>

        {/* Action Buttons & Filters */}
        <div className="space-y-4 mb-10">
          <div className="flex gap-3">
            <Button 
              onClick={handleGoToSwipes}
              className="flex-1 h-14 rounded-2xl gradient-bg text-white font-bold text-lg app-shadow hover:scale-[1.02] active:scale-95 transition-all border-0"
            >
              <Search size={20} className="mr-2 stroke-[3px]" /> Свайпы
            </Button>
            <Button 
              onClick={handleAutoSearch}
              disabled={isAutoSearching}
              className="w-14 h-14 rounded-2xl bg-white border-2 border-primary/20 text-primary hover:bg-primary/5 active:scale-95 transition-all app-shadow p-0"
            >
              <Zap size={24} fill={isAutoSearching ? "currentColor" : "none"} className={isAutoSearching ? "animate-pulse" : ""} />
            </Button>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAutoSearch}
              className={cn(
                "rounded-xl border-muted bg-white h-9 text-[10px] font-bold uppercase tracking-tight gap-1.5 shadow-sm shrink-0 transition-all",
                isAutoSearching && "border-primary text-primary"
              )}
            >
              <Zap size={12} className={isAutoSearching ? "animate-spin" : ""} /> Автопоиск
            </Button>
            {['Интересы', 'Возраст', 'Город', 'Зодиак'].map((filter) => (
              <Button key={filter} variant="secondary" size="sm" className="rounded-xl bg-white border border-border h-9 text-[10px] font-bold uppercase tracking-tight shadow-sm shrink-0">
                {filter}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Users - 4 Profiles Grid */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h5 className="font-black text-xl font-headline">🔥 Топ недели</h5>
            <Button asChild variant="outline" className="text-primary font-black uppercase tracking-widest text-[10px] h-9 px-6 rounded-full border-primary/20 hover:bg-primary/5 bg-white transition-all shadow-sm">
               <Link href="/search">Все</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {ALL_DEMO_USERS.slice(0, 4).map((u) => (
              <FeaturedCard key={u.id} user={u} />
            ))}
          </div>
        </section>

        {/* Grid Section - Ограничено до 4 анкет */}
        <section ref={recommendRef} className="scroll-mt-6">
          <div className="flex justify-between items-end mb-4">
            <h5 className="font-black text-xl font-headline">✨ Рекомендуем</h5>
            <Badge variant="outline" className="text-[10px] font-bold text-muted-foreground border-muted px-3 py-0.5 rounded-full uppercase tracking-tighter bg-white shadow-sm">Рядом</Badge>
          </div>
          <div className={cn(
            "grid grid-cols-2 gap-4 transition-opacity duration-500",
            isAutoSearching ? "opacity-40" : "opacity-100"
          )}>
            {ALL_DEMO_USERS.slice(4, 8).map((u) => (
              <ProfilePreviewCard key={u.id} user={u} />
            ))}
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  );
}

function FeaturedCard({ user }: { user: any }) {
  return (
    <Link href={`/search`} className="w-full group active:scale-[0.98] transition-all">
      <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden app-shadow border-2 border-white group-hover:border-primary/20 transition-colors bg-muted">
        <Image 
          src={user.img} 
          alt={user.name} 
          fill 
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
           <Badge className="bg-primary text-white text-[8px] border-0 px-2 py-1 font-black uppercase shadow-lg">
             {user.match}%
           </Badge>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
          <p className="text-white font-bold text-sm leading-tight">{user.name}, {user.age}</p>
          <div className="flex items-center gap-1.5 text-white/80 text-[9px] mt-1 font-bold uppercase tracking-tight">
            <MapPin size={10} className="text-primary" /> {user.distance} км
          </div>
        </div>
      </div>
    </Link>
  );
}

function ProfilePreviewCard({ user }: { user: any }) {
  return (
    <Link href={`/search`} className="bg-white rounded-[2rem] overflow-hidden app-shadow group active:scale-[0.98] transition-all border border-transparent hover:border-primary/10">
      <div className="relative aspect-square bg-muted">
        <Image 
          src={user.img} 
          alt={user.name} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {user.online && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
            <span className="w-1.5 h-1.5 bg-[#2ecc71] rounded-full animate-pulse"></span>
            <span className="text-white text-[8px] font-bold uppercase tracking-tight">Онлайн</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold text-sm">{user.name}, {user.age}</span>
          <Heart size={14} className="text-muted-foreground/30 group-hover:text-primary transition-colors" />
        </div>
        <div className="text-muted-foreground text-[10px] flex items-center gap-1.5 font-medium">
          <MapPin size={10} className="text-primary/60" /> {user.distance} км от вас
        </div>
      </div>
    </Link>
  );
}
