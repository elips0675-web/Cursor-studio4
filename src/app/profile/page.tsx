
"use client";

import { useState } from "react";
import { 
  Settings, 
  MapPin, 
  CheckCircle2, 
  Star, 
  Camera, 
  Coffee, 
  Music, 
  Globe, 
  Dumbbell,
  Sparkles,
  LogOut,
  Trash2,
  Bell,
  EyeOff,
  ShieldCheck,
  User,
  Search,
  Edit2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";

export default function ProfilePage() {
  // Profile State
  const [profile] = useState({
    name: "Анна",
    age: 24,
    city: "Москва",
    bio: "Люблю закаты, хороший кофе и интересные разговоры. Ищу человека, с которым можно разделить эти моменты.",
    interests: ["Фотография", "Путешествия", "Кофе", "Музыка", "Спорт"]
  });

  // UI States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    notifications: true,
    discovery: true,
    incognito: false,
    smartPhotos: true
  });

  const allInterests = [
    { icon: Camera, label: "Фотография" },
    { icon: Globe, label: "Путешествия" },
    { icon: Coffee, label: "Кофе" },
    { icon: Music, label: "Музыка" },
    { icon: Dumbbell, label: "Спорт" },
    { icon: User, label: "Искусство" },
  ];

  return (
    <>
      <main className="flex-1 overflow-y-auto pb-24">
        {/* Profile Header Background */}
        <div className="h-40 gradient-bg rounded-b-[2.5rem] relative">
          <div className="absolute top-6 left-6 text-white text-xl font-black">SwiftMatch</div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="absolute top-6 right-6 text-white/80 p-2 bg-black/10 rounded-full hover:bg-black/20 transition-colors"
          >
            <Settings size={20} />
          </button>
        </div>

        {/* Profile Info */}
        <div className="px-5 -mt-16 text-center">
          <div className="relative inline-block mb-3">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden relative bg-muted">
              <Image src={PlaceHolderImages[0].imageUrl} alt="My Profile" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={24} />
              </div>
            </div>
            <Badge className="absolute bottom-1 right-1 bg-yellow-400 text-black border-2 border-white font-black text-xs h-7 w-7 flex items-center justify-center p-0 rounded-full shadow-md">
              💎
            </Badge>
          </div>

          <h3 className="text-2xl font-bold font-headline mb-1 flex items-center justify-center gap-2">
            {profile.name}, {profile.age} <CheckCircle2 size={18} className="text-primary" fill="currentColor" />
          </h3>
          <p className="text-muted-foreground text-sm mb-5 flex items-center justify-center gap-1">
            <MapPin size={14} className="text-primary" /> {profile.city}
          </p>

          <div className="flex justify-center gap-3 mb-8">
            <Button 
              asChild
              size="sm" 
              className="rounded-full bg-primary text-white h-9 px-6 font-bold hover:bg-primary/90"
            >
              <Link href="/profile/edit">
                <Edit2 size={14} className="mr-1.5" /> Редактировать
              </Link>
            </Button>
            <Button 
              onClick={() => setIsSettingsOpen(true)}
              variant="outline" 
              size="sm" 
              className="rounded-full h-9 px-6 font-bold border-border text-muted-foreground"
            >
              Настройки
            </Button>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-3xl p-6 app-shadow mb-6">
            <div className="grid grid-cols-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">128</div>
                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Лайков</div>
              </div>
              <div className="text-center border-l border-border/50">
                <div className="text-2xl font-bold text-primary">45</div>
                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Мэтчей</div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="bg-white rounded-3xl p-6 app-shadow mb-6 text-left">
            <h4 className="font-bold text-sm mb-2">О себе</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {profile.bio}
            </p>
          </div>

          {/* Interests */}
          <div className="bg-white rounded-3xl p-6 app-shadow mb-6 text-left">
            <h4 className="font-bold text-sm mb-4">Мои интересы</h4>
            <div className="flex flex-wrap gap-2">
              {allInterests.filter(i => profile.interests.includes(i.label)).map((item) => (
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

      {/* Settings Sheet */}
      <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <SheetContent side="right" className="w-full max-w-[380px] p-0 border-0 flex flex-col h-full">
          <SheetHeader className="p-6 bg-muted/30 text-left">
            <SheetTitle className="text-2xl font-black font-headline gradient-text">Настройки</SheetTitle>
            <SheetDescription>Управление аккаунтом и приватностью</SheetDescription>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
            <div className="space-y-4">
              <h5 className="text-[10px] font-black uppercase tracking-[2px] text-muted-foreground">Аккаунт</h5>
              <div className="space-y-1">
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Bell size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Уведомления</p>
                      <p className="text-[10px] text-muted-foreground">Мэтчи, сообщения, лайки</p>
                    </div>
                  </div>
                  <Switch 
                    checked={settings.notifications} 
                    onCheckedChange={(val) => setSettings({...settings, notifications: val})} 
                  />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Search size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Показывать меня</p>
                      <p className="text-[10px] text-muted-foreground">Ваш профиль в поиске</p>
                    </div>
                  </div>
                  <Switch 
                    checked={settings.discovery} 
                    onCheckedChange={(val) => setSettings({...settings, discovery: val})} 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="text-[10px] font-black uppercase tracking-[2px] text-muted-foreground">Приватность</h5>
              <div className="space-y-1">
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                      <EyeOff size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Инкогнито</p>
                      <p className="text-[10px] text-muted-foreground">Скрывать посещения</p>
                    </div>
                  </div>
                  <Switch 
                    checked={settings.incognito} 
                    onCheckedChange={(val) => setSettings({...settings, incognito: val})} 
                  />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                      <ShieldCheck size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Безопасность</p>
                      <p className="text-[10px] text-muted-foreground">Верификация профиля</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] text-primary border-primary/20">OK</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground font-semibold h-12 gap-3 px-0">
                <LogOut size={18} /> Выйти из аккаунта
              </Button>
              <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive/80 font-semibold h-12 gap-3 px-0">
                <Trash2 size={18} /> Удалить профиль
              </Button>
            </div>
          </div>

          <SheetFooter className="p-6 border-t border-border bg-white">
            <Button 
              className="w-full h-12 rounded-full gradient-bg text-white font-bold" 
              onClick={() => setIsSettingsOpen(false)}
            >
              Закрыть
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <BottomNav />
    </>
  );
}
