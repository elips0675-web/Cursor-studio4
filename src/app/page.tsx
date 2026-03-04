"use client";

import { Flame, Search } from "lucide-react";
import Link from "next/link";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const users = [
  { id: 1, name: 'Анна', age: 24, img: PlaceHolderImages[0].imageUrl, online: true, distance: 2 },
  { id: 2, name: 'Максим', age: 28, img: PlaceHolderImages[1].imageUrl, online: true, distance: 5 },
  { id: 3, name: 'Елена', age: 26, img: PlaceHolderImages[2].imageUrl, online: false, distance: 8 },
  { id: 4, name: 'Мария', age: 23, img: PlaceHolderImages[3].imageUrl, online: true, distance: 1 },
  { id: 5, name: 'Александр', age: 29, img: PlaceHolderImages[4].imageUrl, online: false, distance: 12 },
  { id: 6, name: 'София', age: 25, img: PlaceHolderImages[5].imageUrl, online: true, distance: 3 }
];

export default function Home() {
  return (
    <>
      <AppHeader />
      <main className="flex-1 overflow-y-auto px-5 pt-6 pb-24">
        <div className="text-center mb-6">
          <Badge variant="secondary" className="mb-2 bg-muted text-foreground gap-1.5 px-3 py-1">
            <Flame size={14} className="text-primary" /> Популярное
          </Badge>
          <h2 className="text-3xl font-bold font-headline mb-1">
            Найди свою <span className="gradient-text">половинку</span>
          </h2>
          <p className="text-muted-foreground text-sm">Или новых друзей по интересам</p>
        </div>

        <div className="flex gap-3 mb-8">
          <Button asChild className="w-full gradient-bg text-white h-12 rounded-full font-bold shadow-lg shadow-primary/20">
            <Link href="/search">
              <Search size={18} className="mr-2" /> Начать поиск
            </Link>
          </Button>
        </div>

        <section className="mb-6">
          <h5 className="font-bold mb-4 text-lg">🔥 Топ пользователей</h5>
          <div className="grid grid-cols-2 gap-4">
            {users.slice(0, 2).map((u) => (
              <ProfilePreviewCard key={u.id} user={u} />
            ))}
          </div>
        </section>

        <section>
          <h5 className="font-bold mb-4 text-lg mt-8">✨ Новые</h5>
          <div className="grid grid-cols-2 gap-4">
            {users.slice(2).map((u) => (
              <ProfilePreviewCard key={u.id} user={u} />
            ))}
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  );
}

function ProfilePreviewCard({ user }: { user: any }) {
  return (
    <Link href="/search" className="bg-white rounded-3xl overflow-hidden app-shadow group active:scale-[0.98] transition-all">
      <div className="relative aspect-[3/4]">
        <Image 
          src={user.img} 
          alt={user.name} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          data-ai-hint="user portrait"
        />
        {user.online && (
          <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#2ecc71] text-white text-[10px] font-bold rounded-full border border-white">
            Онлайн
          </span>
        )}
      </div>
      <div className="p-3">
        <div className="font-bold text-sm">{user.name}, {user.age}</div>
        <div className="text-muted-foreground text-[11px] flex items-center gap-1">
          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          {user.distance} км
        </div>
      </div>
    </Link>
  );
}
