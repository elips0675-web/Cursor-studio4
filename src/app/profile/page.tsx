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
  Edit2,
  Palette,
  Plus,
  Trash2,
  Film,
  Flower2,
  Briefcase,
  Gamepad2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

export default function ProfilePage() {
  // Profile State
  const [profile] = useState({
    name: "Анна",
    age: 24,
    city: "Москва",
    bio: "Люблю закаты, хороший кофе и интересные разговоры. Ищу человека, с которым можно разделить эти моменты.",
    interests: ["Фотография", "Путешествия", "Кофе", "Музыка", "Спорт", "Искусство"]
  });

  // Photo Gallery State
  const [photos, setPhotos] = useState([
    PlaceHolderImages[0].imageUrl,
    PlaceHolderImages[2].imageUrl,
    PlaceHolderImages[4].imageUrl,
  ]);

  const handleAddPhoto = () => {
    // Симуляция добавления фото
    const newPhoto = PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)].imageUrl;
    setPhotos(prev => [...prev, newPhoto]);
    toast({
      title: "Фото добавлено",
      description: "Ваша галерея обновлена.",
    });
  };

  const handleDeletePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    toast({
      title: "Фото удалено",
    });
  };

  // Карта иконок для всех возможных интересов
  const interestMap = [
    { label: "Фотография", icon: Camera },
    { label: "Путешествия", icon: Globe },
    { label: "Кофе", icon: Coffee },
    { label: "Музыка", icon: Music },
    { label: "Спорт", icon: Dumbbell },
    { label: "Искусство", icon: Palette },
    { label: "Кино", icon: Film },
    { label: "Йога", icon: Flower2 },
    { label: "Бизнес", icon: Briefcase },
    { label: "Игры", icon: Gamepad2 },
  ];

  return (
    <>
      <main className="flex-1 overflow-y-auto pb-24 bg-[#f8f9fb]">
        {/* Profile Header Background - Rectangular and shorter */}
        <div className="h-32 gradient-bg relative shadow-lg">
          <div className="absolute top-6 left-8 text-white text-2xl font-black uppercase tracking-tighter">SwiftMatch</div>
          <Link 
            href="/settings"
            className="absolute top-6 right-8 text-white/90 p-2.5 bg-black/10 rounded-full hover:bg-black/20 transition-colors backdrop-blur-sm shadow-sm"
          >
            <Settings size={22} />
          </Link>
        </div>

        {/* Profile Info */}
        <div className="px-6 -mt-16 text-center">
          <div className="relative inline-block mb-4">
            <div className="w-36 h-36 rounded-[2.5rem] border-4 border-white app-shadow overflow-hidden relative bg-muted transform -rotate-3">
              <Image src={photos[0] || PlaceHolderImages[0].imageUrl} alt="My Profile" fill className="object-cover" />
            </div>
            <Badge className="absolute -bottom-2 -right-2 bg-yellow-400 text-black border-4 border-white font-black text-sm h-10 w-10 flex items-center justify-center p-0 rounded-2xl shadow-xl transform rotate-12">
              💎
            </Badge>
          </div>

          <h3 className="text-2xl font-black font-headline mb-1 flex items-center justify-center gap-2">
            {profile.name}, {profile.age} <CheckCircle2 size={20} className="text-primary" fill="currentColor" />
          </h3>
          <p className="text-muted-foreground text-sm font-bold flex items-center justify-center gap-1.5 mb-6 uppercase tracking-wider opacity-70">
            <MapPin size={14} className="text-primary" /> {profile.city}
          </p>

          <div className="flex justify-center gap-3 mb-10">
            <Button 
              asChild
              className="rounded-2xl gradient-bg text-white h-12 px-8 font-black uppercase text-[10px] tracking-widest app-shadow active:scale-95 transition-all border-0"
            >
              <Link href="/profile/edit">
                <Edit2 size={14} className="mr-2" /> Редактировать
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline" 
              className="rounded-2xl h-12 px-6 font-black uppercase text-[10px] tracking-widest border-border text-muted-foreground bg-white shadow-md active:scale-95 transition-all"
            >
              <Link href="/settings">Настройки</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-[2rem] p-6 app-shadow border border-border/40 mb-8">
            <div className="grid grid-cols-2">
              <div className="text-center">
                <div className="text-2xl font-black text-primary">128</div>
                <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Лайков</div>
              </div>
              <div className="text-center border-l border-border/50">
                <div className="text-2xl font-black text-primary">45</div>
                <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Мэтчей</div>
              </div>
            </div>
          </div>

          {/* Photos Section */}
          <div className="bg-white rounded-[2rem] p-6 app-shadow border border-border/40 mb-8 text-left">
            <div className="flex justify-between items-center mb-5">
              <h4 className="font-black text-sm uppercase tracking-widest">Мои фото</h4>
              <button 
                onClick={handleAddPhoto}
                className="text-primary flex items-center gap-1.5 text-[10px] font-black uppercase hover:underline tracking-widest"
              >
                <Plus size={16} /> Добавить
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {photos.map((url, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden bg-muted group shadow-md border border-border/20">
                  <Image src={url} alt={`Photo ${idx}`} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => handleDeletePhoto(idx)}
                      className="p-2 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {photos.length < 6 && (
                <button 
                  onClick={handleAddPhoto}
                  className="aspect-square rounded-2xl border-2 border-dashed border-muted flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/30 hover:border-primary/30 transition-all group shadow-sm"
                >
                  <Plus size={24} className="group-hover:text-primary transition-colors" />
                  <span className="text-[8px] font-black mt-1 uppercase tracking-tighter">Новое фото</span>
                </button>
              )}
            </div>
          </div>

          {/* Interests */}
          <div className="bg-white rounded-[2rem] p-6 app-shadow border border-border/40 mb-8 text-left">
            <h4 className="font-black text-sm uppercase tracking-widest mb-5">Мои интересы</h4>
            <div className="flex flex-wrap gap-2.5">
              {interestMap.filter(i => profile.interests.includes(i.label)).map((item) => (
                <Badge key={item.label} variant="secondary" className="bg-[#f5f7fa] text-foreground/80 border-0 gap-2 py-2 px-4 font-bold text-[11px] rounded-xl hover:bg-muted transition-colors shadow-sm">
                  <item.icon size={16} className="text-primary" /> {item.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Bio Section */}
          <div className="bg-white rounded-[2rem] p-6 app-shadow border border-border/40 mb-8 text-left">
            <h4 className="font-black text-sm uppercase tracking-widest mb-3">О себе</h4>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              {profile.bio}
            </p>
          </div>

          {/* Premium Banner */}
          <div className="gradient-bg rounded-[2.5rem] p-8 text-white text-center app-shadow mb-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Star size={80} fill="currentColor" />
            </div>
            <h5 className="font-black text-xl mb-2 relative z-10">SwiftMatch Premium</h5>
            <p className="text-xs text-white/80 mb-6 max-w-[200px] mx-auto relative z-10 leading-relaxed">Узнайте, кто вами интересуется, и получите безлимит свайпов</p>
            <Button variant="secondary" className="w-full rounded-2xl h-12 bg-white text-primary font-black uppercase text-[10px] tracking-widest hover:bg-white/90 shadow-xl relative z-10 active:scale-95 transition-all border-0">
              Стать Premium
            </Button>
          </div>
        </div>
      </main>

      <BottomNav />
    </>
  );
}