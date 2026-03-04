
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
  Gamepad2,
  Maximize2,
  X,
  Dog,
  Ruler,
  Moon,
  Sun,
  Target,
  Sparkles,
  Heart
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Zodiac Icons SVG Map
const ZodiacIcon = ({ sign }: { sign: string }) => {
  const signs: Record<string, string> = {
    "Овен": "♈", "Телец": "♉", "Близнецы": "♊", "Рак": "♋", "Лев": "♌", "Дева": "♍",
    "Весы": "♎", "Скорпион": "♏", "Стрелец": "♐", "Козерог": "♑", "Водолей": "♒", "Рыбы": "♓"
  };
  return <span className="text-xl leading-none">{signs[sign] || "✨"}</span>;
};

export default function ProfilePage() {
  // Profile State
  const [profile] = useState({
    name: "Анна",
    age: 24,
    city: "Москва",
    datingGoal: "Серьезные отношения",
    zodiac: "Лев",
    bio: "Люблю закаты, хороший кофе и интересные разговоры. Ищу человека, с которым можно разделить эти моменты.",
    interests: ["Фотография", "Путешествия", "Кофе", "Музыка", "Спорт", "Искусство", "Собаки", "Рост: 172 см", "Сова"]
  });

  // Photo Gallery State
  const [photos, setPhotos] = useState([
    PlaceHolderImages[0].imageUrl,
    PlaceHolderImages[2].imageUrl,
    PlaceHolderImages[4].imageUrl,
    PlaceHolderImages[6].imageUrl,
    PlaceHolderImages[8].imageUrl,
  ]);

  // Gallery Viewer State
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const handleAddPhoto = () => {
    if (photos.length >= 10) {
      toast({
        variant: "destructive",
        title: "Лимит достигнут",
        description: "Максимум 10 фотографий в профиле.",
      });
      return;
    }
    const newPhoto = PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)].imageUrl;
    setPhotos(prev => [...prev, newPhoto]);
    toast({
      title: "Фото добавлено",
      description: "Ваша галерея обновлена.",
    });
  };

  const handleDeletePhoto = (index: number) => {
    if (photos.length <= 1) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "В профиле должно быть хотя бы одно фото.",
      });
      return;
    }
    setPhotos(prev => prev.filter((_, i) => i !== index));
    toast({
      title: "Фото удалено",
    });
  };

  const openPhotoViewer = (index: number) => {
    setActivePhotoIndex(index);
    setIsViewerOpen(true);
  };

  // Карта иконок для всех возможных интересов и деталей
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
    { label: "Собаки", icon: Dog },
    { label: "Кошки", icon: Dog }, 
    { label: "Рост:", icon: Ruler },
    { label: "Сова", icon: Moon },
    { label: "Жаворонок", icon: Sun },
  ];

  // Разделение интересов на "Стиль жизни" и "Хобби"
  const lifestyleKeywords = ["Рост:", "Сова", "Жаворонок", "Собаки", "Кошки"];
  
  const lifestyleDetails = profile.interests.filter(i => 
    lifestyleKeywords.some(key => i.includes(key))
  );
  
  const generalInterests = profile.interests.filter(i => 
    !lifestyleKeywords.some(key => i.includes(key))
  );

  return (
    <>
      <main className="flex-1 overflow-y-auto pb-24 bg-[#f8f9fb]">
        {/* Profile Header Background */}
        <div className="h-40 gradient-bg relative shadow-lg">
          <div className="absolute top-6 left-8 text-white text-2xl font-black uppercase tracking-tighter opacity-90">SwiftMatch</div>
          <Link 
            href="/settings"
            className="absolute top-6 right-8 text-white/90 p-2.5 bg-black/10 rounded-full hover:bg-black/20 transition-colors backdrop-blur-sm shadow-sm"
          >
            <Settings size={22} />
          </Link>
        </div>

        {/* Profile Info */}
        <div className="px-6 -mt-16 text-center">
          <div className="relative inline-block mb-6">
            <div 
              onClick={() => openPhotoViewer(0)}
              className="relative w-36 h-36 rounded-[2.5rem] border-4 border-white app-shadow overflow-hidden bg-muted transition-transform duration-500 hover:scale-[1.02] cursor-pointer"
            >
              <Image 
                src={photos[0]} 
                alt={profile.name} 
                fill 
                className="object-cover" 
                priority
              />
            </div>
            <Badge className="absolute bottom-1 right-1 bg-primary text-white border-2 border-white font-black text-[9px] h-7 px-3 flex items-center justify-center rounded-full shadow-xl z-20 uppercase tracking-widest pointer-events-none">
              PRO 💎
            </Badge>
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-black font-headline mb-1 flex items-center justify-center gap-2">
              {profile.name}, {profile.age} <CheckCircle2 size={22} className="text-primary" fill="currentColor" />
            </h3>
            <div className="flex flex-col items-center gap-2">
              <p className="text-muted-foreground text-[11px] font-bold flex items-center justify-center gap-1.5 uppercase tracking-wider opacity-70">
                <MapPin size={14} className="text-primary" /> {profile.city}
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-0 gap-2 py-1.5 px-4 font-black text-[10px] rounded-full uppercase tracking-widest shadow-sm">
                  <Target size={14} /> {profile.datingGoal}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <Button 
              asChild
              className="rounded-2xl gradient-bg text-white h-14 px-8 font-black uppercase text-xs tracking-widest app-shadow active:scale-95 transition-all border-0 flex-1"
            >
              <Link href="/profile/edit">
                <Edit2 size={16} className="mr-2" /> Редактировать
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline" 
              className="rounded-2xl h-14 w-14 p-0 font-black uppercase border-border text-muted-foreground bg-white shadow-md active:scale-95 transition-all"
            >
              <Link href="/settings"><Settings size={20} /></Link>
            </Button>
          </div>

          {/* Stats Bar */}
          <div className="bg-white rounded-[2rem] p-5 app-shadow border border-border/40 mb-8">
            <div className="grid grid-cols-2">
              <div className="text-center">
                <div className="text-2xl font-black text-primary">128</div>
                <div className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mt-1">Лайков</div>
              </div>
              <div className="text-center border-l border-border/50">
                <div className="text-2xl font-black text-primary">45</div>
                <div className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mt-1">Мэтчей</div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="bg-white rounded-[2.5rem] p-8 app-shadow border border-border/40 mb-8 text-left">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-primary" />
              <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Биография</h4>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed font-medium">
              {profile.bio}
            </p>
          </div>

          {/* Lifestyle & Details */}
          <div className="bg-white rounded-[2.5rem] p-8 app-shadow border border-border/40 mb-8 text-left">
            <div className="flex items-center gap-2 mb-6">
              <Star size={16} className="text-primary" />
              <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Стиль жизни</h4>
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="bg-orange-50 text-orange-600 border-0 gap-2 py-3 px-5 font-bold text-[11px] rounded-xl shadow-sm">
                <ZodiacIcon sign={profile.zodiac} /> {profile.zodiac}
              </Badge>
              {lifestyleDetails.map((detail) => {
                const mapItem = interestMap.find(m => detail.includes(m.label));
                const Icon = mapItem?.icon || Star;
                return (
                  <Badge key={detail} variant="secondary" className="bg-blue-50 text-blue-600 border-0 gap-2 py-3 px-5 font-bold text-[11px] rounded-xl shadow-sm">
                    <Icon size={16} /> {detail}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Interests Section */}
          <div className="bg-white rounded-[2.5rem] p-8 app-shadow border border-border/40 mb-8 text-left">
            <div className="flex items-center gap-2 mb-6">
              <Heart size={16} className="text-primary" />
              <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Интересы</h4>
            </div>
            <div className="flex flex-wrap gap-3">
              {generalInterests.map((interest) => {
                const mapItem = interestMap.find(m => interest.includes(m.label));
                const Icon = mapItem?.icon || Heart;
                return (
                  <Badge key={interest} variant="secondary" className="bg-[#f5f7fa] text-foreground/80 border-0 gap-2 py-3 px-5 font-bold text-[11px] rounded-xl hover:bg-muted transition-colors shadow-sm">
                    <Icon size={16} className="text-primary" /> {interest}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Gallery Management Section */}
          <div className="bg-white rounded-[2.5rem] p-8 app-shadow border border-border/40 mb-10 text-left">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Camera size={16} className="text-primary" />
                <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Галерея</h4>
              </div>
              <button 
                onClick={handleAddPhoto}
                className="text-primary flex items-center gap-1.5 text-[10px] font-black uppercase hover:underline tracking-widest"
              >
                <Plus size={16} /> Добавить
              </button>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {photos.map((url, idx) => (
                <div 
                  key={idx} 
                  onClick={() => openPhotoViewer(idx)}
                  className="relative aspect-[3/4] rounded-[1.75rem] overflow-hidden bg-muted group shadow-lg border border-border/10 cursor-pointer hover:scale-[1.02] transition-transform active:scale-95"
                >
                  <Image src={url} alt={`Photo ${idx}`} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[1px]">
                    <div className="p-2.5 bg-white/20 backdrop-blur-md text-white rounded-full">
                      <Maximize2 size={18} />
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeletePhoto(idx); }}
                      className="p-2.5 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-destructive/70 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {photos.length < 10 && (
                <button 
                  onClick={handleAddPhoto}
                  className="aspect-[3/4] rounded-[1.75rem] border-2 border-dashed border-muted flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/30 hover:border-primary/30 transition-all group shadow-sm bg-muted/5"
                >
                  <Plus size={36} className="group-hover:text-primary transition-colors opacity-40" />
                  <span className="text-[9px] font-black mt-3 uppercase tracking-[0.2em] opacity-60">Добавить</span>
                </button>
              )}
            </div>
          </div>

          {/* Premium CTA */}
          <div className="gradient-bg rounded-[3rem] p-10 text-white text-center app-shadow mb-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Star size={100} fill="currentColor" />
            </div>
            <h5 className="font-black text-2xl mb-2 relative z-10 tracking-tight">SwiftMatch Premium</h5>
            <p className="text-[11px] text-white/80 mb-8 max-w-[240px] mx-auto relative z-10 leading-relaxed font-bold uppercase tracking-wider">
              Твои мэтчи ждут тебя — узнай кто тебя лайкнул первым
            </p>
            <Button variant="secondary" className="w-full rounded-2xl h-14 bg-white text-primary font-black uppercase text-xs tracking-[0.2em] hover:bg-white/90 shadow-2xl relative z-10 active:scale-95 transition-all border-0">
              Стать Premium
            </Button>
          </div>
        </div>
      </main>

      {/* Fullscreen Photo Viewer */}
      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-[440px] w-[95vw] h-[85vh] p-0 border-0 bg-transparent shadow-none overflow-hidden flex flex-col items-center justify-center outline-none">
          <DialogTitle className="sr-only">Просмотр фото</DialogTitle>
          <button 
            onClick={() => setIsViewerOpen(false)}
            className="absolute top-4 right-4 z-50 p-3 bg-black/50 backdrop-blur-md text-white rounded-full hover:bg-black/70 transition-all active:scale-90"
          >
            <X size={24} />
          </button>
          
          <Carousel 
            className="w-full h-full" 
            opts={{ startIndex: activePhotoIndex }}
            key={activePhotoIndex} 
          >
            <CarouselContent className="h-full ml-0">
              {photos.map((url, idx) => (
                <CarouselItem key={idx} className="pl-0 h-[80vh] flex items-center justify-center relative">
                  <div className="relative w-full h-full rounded-[3rem] overflow-hidden app-shadow border-4 border-white/10">
                    <Image 
                      src={url} 
                      alt={`Gallery view ${idx}`} 
                      fill 
                      className="object-cover"
                      sizes="(max-width: 480px) 100vw, 440px"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute -bottom-10 left-0 right-0 flex justify-center gap-2">
              {photos.map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    activePhotoIndex === i ? "bg-white scale-125" : "bg-white/30"
                  )} 
                />
              ))}
            </div>
            <CarouselPrevious className="left-4 h-14 w-14 bg-white/10 hover:bg-white/20 border-0 text-white backdrop-blur-md" />
            <CarouselNext className="right-4 h-14 w-14 bg-white/10 hover:bg-white/20 border-0 text-white backdrop-blur-md" />
          </Carousel>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </>
  );
}
