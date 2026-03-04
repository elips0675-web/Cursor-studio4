
"use client";

import { Edit2, Settings, MapPin, CheckCircle2, Star, Camera, Coffee, Music, Globe, Dumbbell } from "lucide-react";
import Image from "next/image";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const interests = [
    { icon: Camera, label: "Фотография" },
    { icon: Globe, label: "Путешествия" },
    { icon: Coffee, label: "Кофе" },
    { icon: Music, label: "Музыка" },
    { icon: Dumbbell, label: "Спорт" },
  ];

  return (
    <>
      <main className="flex-1 overflow-y-auto pb-24">
        {/* Header Header */}
        <div className="h-40 gradient-bg rounded-b-[2.5rem] relative">
          <div className="absolute top-6 left-6 text-white text-xl font-black">SwiftMatch</div>
          <button className="absolute top-6 right-6 text-white/80 p-2 bg-black/10 rounded-full hover:bg-black/20">
            <Settings size={20} />
          </button>
        </div>

        {/* Profile Info */}
        <div className="px-5 -mt-16 text-center">
          <div className="relative inline-block mb-3">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden relative bg-muted">
              <Image src={PlaceHolderImages[9].imageUrl} alt="My Profile" fill className="object-cover" />
            </div>
            <Badge className="absolute bottom-1 right-1 bg-yellow-400 text-black border-2 border-white font-black text-xs h-7 w-7 flex items-center justify-center p-0 rounded-full shadow-md">
              💎
            </Badge>
          </div>

          <h3 className="text-2xl font-bold font-headline mb-1 flex items-center justify-center gap-2">
            Анна, 24 <CheckCircle2 size={18} className="text-primary" fill="currentColor" />
          </h3>
          <p className="text-muted-foreground text-sm mb-5 flex items-center justify-center gap-1">
            <MapPin size={14} className="text-primary" /> Москва
          </p>

          <div className="flex justify-center gap-3 mb-8">
            <Button size="sm" className="rounded-full bg-primary text-white h-9 px-6 font-bold hover:bg-primary/90">
              <Edit2 size={14} className="mr-1.5" /> Редактировать
            </Button>
            <Button variant="outline" size="sm" className="rounded-full h-9 px-6 font-bold border-border text-muted-foreground">
              Настройки
            </Button>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-3xl p-6 app-shadow mb-6">
            <div className="grid grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">128</div>
                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Лайков</div>
              </div>
              <div className="text-center border-x border-border/50">
                <div className="text-2xl font-bold text-primary">45</div>
                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Мэтчей</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">12</div>
                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Групп</div>
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="bg-white rounded-3xl p-6 app-shadow mb-6 text-left">
            <h4 className="font-bold text-sm mb-4">Мои интересы</h4>
            <div className="flex flex-wrap gap-2">
              {interests.map((item) => (
                <Badge key={item.label} variant="secondary" className="bg-[#f5f7fa] text-foreground border-0 gap-1.5 py-1.5 px-3 font-semibold">
                  <item.icon size={14} className="text-primary" /> {item.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Premium Banner */}
          <div className="gradient-bg rounded-[2rem] p-6 text-white text-center shadow-lg shadow-primary/20 mb-6">
            <Star size={24} className="mx-auto mb-2 text-yellow-300" />
            <h5 className="font-bold text-lg mb-1">SwiftMatch Premium</h5>
            <p className="text-xs text-white/80 mb-4">Кто тебя лайкнул, безлимитные свайпы и многое другое</p>
            <Button variant="secondary" className="w-full rounded-full h-11 bg-white text-primary font-bold hover:bg-white/90">
              Попробовать бесплатно
            </Button>
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
