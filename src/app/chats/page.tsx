
"use client";

import { MessageCircle, Search } from "lucide-react";
import Image from "next/image";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { AppHeader } from "@/components/layout/app-header";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const chats = [
  { id: 1, name: 'Анна', last: 'Привет! Как дела? 😊', time: '2 мин', unread: 2, img: PlaceHolderImages[0].imageUrl, online: true },
  { id: 2, name: 'Максим', last: 'Давай встретимся завтра', time: '1 час', unread: 0, img: PlaceHolderImages[1].imageUrl, online: false },
  { id: 3, name: 'Елена', last: 'Спасибо за комплимент!', time: '3 часа', unread: 1, img: PlaceHolderImages[2].imageUrl, online: true },
  { id: 4, name: 'Мария', last: 'Я тоже люблю этот фильм!', time: 'Вчера', unread: 0, img: PlaceHolderImages[3].imageUrl, online: true },
];

export default function ChatsPage() {
  return (
    <>
      <AppHeader />
      <main className="flex-1 overflow-y-auto px-5 pt-6 pb-24">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-headline">Сообщения</h2>
          <Badge className="bg-primary text-white rounded-full">3 новых</Badge>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            className="pl-10 h-11 bg-muted border-0 rounded-2xl placeholder:text-muted-foreground focus-visible:ring-primary/20" 
            placeholder="Поиск по чатам..." 
          />
        </div>

        <div className="space-y-4">
          {chats.map((chat) => (
            <div key={chat.id} className="flex items-center gap-4 p-4 bg-white rounded-3xl app-shadow hover:translate-x-1 transition-transform cursor-pointer group">
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-full overflow-hidden relative border border-border">
                  <Image src={chat.img} alt={chat.name} fill className="object-cover" />
                </div>
                {chat.online && (
                  <span className="absolute bottom-0 right-0 w-4 h-4 bg-[#2ecc71] border-2 border-white rounded-full"></span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-bold text-sm">{chat.name}</span>
                  <span className="text-[10px] text-muted-foreground">{chat.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground truncate pr-2">{chat.last}</p>
                  {chat.unread > 0 && (
                    <Badge className="bg-primary text-white text-[10px] h-4 min-w-[16px] px-1 flex items-center justify-center rounded-full">
                      {chat.unread}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <BottomNav />
    </>
  );
}
