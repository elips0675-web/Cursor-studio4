
"use client";

import { Plus, Users, Search, Heart } from "lucide-react";
import Image from "next/image";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { AppHeader } from "@/components/layout/app-header";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const groups = [
  { id: 1, name: 'Вечерние пробежки', members: 128, online: 12, img: PlaceHolderImages[6].imageUrl, category: 'Спорт' },
  { id: 2, name: 'Indie Music', members: 342, online: 45, img: PlaceHolderImages[7].imageUrl, category: 'Музыка' },
  { id: 3, name: 'Digital Art', members: 89, online: 8, img: PlaceHolderImages[8].imageUrl, category: 'Творчество' },
];

export default function GroupsPage() {
  return (
    <>
      <AppHeader />
      <main className="flex-1 overflow-y-auto px-5 pt-6 pb-24">
        <div className="flex overflow-x-auto gap-2 pb-4 no-scrollbar">
          {['Все', 'Спорт', 'Музыка', 'Творчество', 'IT'].map((cat, i) => (
            <span 
              key={cat} 
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${i === 0 ? 'gradient-bg text-white' : 'bg-muted text-muted-foreground hover:bg-border'}`}
            >
              {cat}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between my-4">
          <h5 className="font-bold text-lg">Популярные группы</h5>
          <Button variant="ghost" size="sm" className="text-primary text-xs font-bold hover:bg-primary/5">См. все</Button>
        </div>

        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group.id} className="bg-white rounded-[2rem] overflow-hidden app-shadow">
              <div className="relative h-32 w-full">
                <Image src={group.img} alt={group.name} fill className="object-cover" />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-white/90 backdrop-blur-sm text-foreground text-[10px] border-0 gap-1 px-2">
                    <span className="w-1.5 h-1.5 bg-[#2ecc71] rounded-full"></span> {group.online} онлайн
                  </Badge>
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h6 className="font-bold text-base leading-tight">{group.name}</h6>
                  <Badge variant="outline" className="text-[10px] border-primary/20 text-primary">{group.category}</Badge>
                </div>
                <div className="flex items-center text-muted-foreground text-xs mb-4 gap-1">
                  <Users size={12} /> {group.members} участников
                </div>
                <Button className="w-full h-10 rounded-full bg-[#f5f7fa] text-foreground font-bold hover:gradient-bg hover:text-white transition-all">
                  Присоединиться
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Button className="w-full h-12 rounded-full gradient-bg text-white font-bold mt-6 shadow-lg shadow-primary/20">
          <Plus size={18} className="mr-2" /> Создать группу
        </Button>
      </main>
      <BottomNav />
    </>
  );
}
