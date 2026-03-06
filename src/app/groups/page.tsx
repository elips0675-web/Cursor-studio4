
"use client";

import { useState } from "react";
import { Plus, Users, Search, Heart, PackageX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { AppHeader } from "@/components/layout/app-header";
import { ALL_DEMO_GROUPS } from "@/lib/demo-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFeatureFlags } from "@/context/feature-flags-context";

export default function GroupsPage() {
  const { groupsPageEnabled } = useFeatureFlags();
  const [activeCategory, setActiveCategory] = useState('Все');

  if (!groupsPageEnabled) {
      return (
          <>
              <AppHeader />
              <main className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-[#f8f9fb]">
                  <div className="p-6 bg-muted rounded-full mb-6">
                    <PackageX size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Функция отключена</h3>
                  <p className="text-muted-foreground mt-2 max-w-xs">Раздел "Группы" временно недоступен. Администратор скоро все включит!</p>
              </main>
              <BottomNav />
          </>
      )
  }

  const categories = ['Все', 'Спорт', 'Музыка', 'Творчество', 'IT', 'Чтение', 'Игры', 'Туризм'];
  
  return (
    <>
      <AppHeader />
      <main className="flex-1 overflow-y-auto px-5 pt-6 pb-24">
        <div className="flex flex-wrap gap-2 pb-4">
          {categories.map((cat) => (
            <Button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              variant={activeCategory === cat ? 'default' : 'secondary'}
              size="sm"
              className={`rounded-full font-bold transition-all ${activeCategory === cat ? 'gradient-bg text-white shadow-md shadow-primary/20 border-0' : 'text-muted-foreground'}`}
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="flex items-center justify-between my-4">
          <h5 className="font-bold text-lg">Популярные группы</h5>
          <Button variant="ghost" size="sm" className="text-primary text-xs font-bold hover:bg-primary/5">См. все</Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {ALL_DEMO_GROUPS.map((group) => (
            <Link href={`/chats?groupId=${group.id}`} key={group.id} className="bg-white rounded-2xl overflow-hidden app-shadow group block border border-transparent hover:border-primary/20 transition-all">
              <div className="relative h-24 w-full">
                <Image src={group.img} alt={group.name} fill sizes="(max-width: 480px) 50vw, 240px" data-ai-hint={group.hint} className="object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-white/90 backdrop-blur-sm text-foreground text-[9px] border-0 gap-1 px-1.5 py-0.5 font-bold">
                    <span className="w-1.5 h-1.5 bg-[#2ecc71] rounded-full"></span> {group.online}
                  </Badge>
                </div>
              </div>
              <div className="p-3">
                <h6 className="font-bold text-sm leading-tight truncate group-hover:text-primary">{group.name}</h6>
                <div className="flex items-center text-muted-foreground text-[10px] mt-1 gap-1 font-semibold">
                  <Users size={12} /> {group.members} участников
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Button className="w-full h-12 rounded-full gradient-bg text-white font-bold mt-8 shadow-lg shadow-primary/20">
          <Plus size={18} className="mr-2" /> Создать группу
        </Button>
      </main>
      <BottomNav />
    </>
  );
}
