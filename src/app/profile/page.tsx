
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
  User,
  Plus,
  Trash2
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
    interests: ["Фотография", "Путешествия", "Кофе", "Музыка", "Спорт"]
  });

  // Photo Gallery State
  const [photos, setPhotos] = useState([
    PlaceHolderImages[0].imageUrl,
    PlaceHolderImages[2].imageUrl,
    PlaceHolderImages[4].imageUrl,
  ]);

  const handleAddPhoto = () => {
    // Симуляция добавления фото (берем случайное из плейсхолдеров, которого еще нет)
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
          <div className="absolute top-6 left-6 text-white text-xl font-black uppercase tracking-tighter">SwiftMatch</div>
          <Link 
            href="/settings"
            className="absolute top-6 right-6 text-white/80 p-2 bg-black/10 rounded-full hover:bg-black/20 transition-colors flex items-center justify-center"
          >
            <Settings size={20} />
          </Link>
        </div>

        {/* Profile Info */}
        <div className="px-5 -mt-16 text-center">
          <div className="relative inline-block mb-3">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden relative bg-muted">
              <Image src={photos[0] || PlaceHolderImages[0].imageUrl} alt="My Profile" fill className="object-cover" />
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
              asChild
              variant="outline" 
              size="sm" 
              className="rounded-full h-9 px-6 font-bold border-border text-muted-foreground"
            >
              <Link href="/settings">Настройки</Link>
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

          {/* Photos Section */}
          <div className="bg-white rounded-3xl p-6 app-shadow mb-6 text-left">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-sm">Мои фото</h4>
              <button 
                onClick={handleAddPhoto}
                className="text-primary flex items-center gap-1 text-[10px] font-bold uppercase hover:underline"
              >
                <Plus size={14} /> Добавить
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {photos.map((url, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden bg-muted group">
                  <Image src={url} alt={`Photo ${idx}`} fill className="object-cover" />
                  <button 
                    onClick={() => handleDeletePhoto(idx)}
                    className="absolute top-1 right-1 p-1.5 bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              {photos.length < 6 && (
                <button 
                  onClick={handleAddPhoto}
                  className="aspect-square rounded-2xl border-2 border-dashed border-muted flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors"
                >
                  <Plus size={20} />
                  <span className="text-[8px] font-bold mt-1 uppercase">Добавить</span>
                </button>
              )}
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

      <BottomNav />
    </>
  );
}
