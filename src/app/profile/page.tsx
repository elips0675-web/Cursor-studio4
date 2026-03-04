
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
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X
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
    PlaceHolderImages[6].imageUrl,
    PlaceHolderImages[8].imageUrl,
  ]);

  // Gallery Viewer State
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const handleAddPhoto = () => {
    if (photos.length >= 9) {
      toast({
        variant: "destructive",
        title: "Лимит достигнут",
        description: "Максимум 9 фотографий в профиле.",
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
          <div className="relative inline-block mb-8">
            <div className="relative w-40 h-40 rounded-[2.5rem] border-4 border-white app-shadow overflow-hidden bg-muted transition-transform duration-500 hover:scale-[1.02]">
              <Image 
                src={photos[0]} 
                alt={profile.name} 
                fill 
                className="object-cover" 
                priority
              />
              {/* Premium Badge on top of image */}
              <Badge className="absolute top-3 left-3 bg-primary text-white border-0 font-black text-[8px] h-6 px-2 flex items-center justify-center rounded-full shadow-xl z-20 uppercase tracking-widest">
                PREMIUM 💎
              </Badge>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-3xl font-black font-headline mb-1 flex items-center justify-center gap-2">
              {profile.name}, {profile.age} <CheckCircle2 size={24} className="text-primary" fill="currentColor" />
            </h3>
            <p className="text-muted-foreground text-sm font-bold flex items-center justify-center gap-1.5 uppercase tracking-wider opacity-70">
              <MapPin size={16} className="text-primary" /> {profile.city}
            </p>
          </div>

          <div className="flex justify-center gap-4 mb-10">
            <Button 
              asChild
              className="rounded-2xl gradient-bg text-white h-14 px-8 font-black uppercase text-[11px] tracking-widest app-shadow active:scale-95 transition-all border-0 flex-1 max-w-[200px]"
            >
              <Link href="/profile/edit">
                <Edit2 size={16} className="mr-2" /> Редактировать
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline" 
              className="rounded-2xl h-14 px-6 font-black uppercase text-[11px] tracking-widest border-border text-muted-foreground bg-white shadow-md active:scale-95 transition-all"
            >
              <Link href="/settings"><Settings size={18} /></Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-[2.5rem] p-8 app-shadow border border-border/40 mb-10">
            <div className="grid grid-cols-2">
              <div className="text-center">
                <div className="text-3xl font-black text-primary">128</div>
                <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Лайков</div>
              </div>
              <div className="text-center border-l border-border/50">
                <div className="text-3xl font-black text-primary">45</div>
                <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Мэтчей</div>
              </div>
            </div>
          </div>

          {/* Photos Management Section */}
          <div className="bg-white rounded-[2.5rem] p-8 app-shadow border border-border/40 mb-10 text-left">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-black text-sm uppercase tracking-widest">Галерея</h4>
              <button 
                onClick={handleAddPhoto}
                className="text-primary flex items-center gap-1.5 text-[10px] font-black uppercase hover:underline tracking-widest"
              >
                <Plus size={18} /> Добавить
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {photos.map((url, idx) => (
                <div 
                  key={idx} 
                  onClick={() => openPhotoViewer(idx)}
                  className="relative aspect-square rounded-2xl overflow-hidden bg-muted group shadow-md border border-border/20 cursor-pointer hover:scale-[1.03] transition-transform active:scale-95"
                >
                  <Image src={url} alt={`Photo ${idx}`} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <div className="p-2 bg-white/20 backdrop-blur-md text-white rounded-full">
                      <Maximize2 size={16} />
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeletePhoto(idx); }}
                      className="p-2 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-destructive/60 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {photos.length < 9 && (
                <button 
                  onClick={handleAddPhoto}
                  className="aspect-square rounded-2xl border-2 border-dashed border-muted flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/30 hover:border-primary/30 transition-all group shadow-sm"
                >
                  <Plus size={28} className="group-hover:text-primary transition-colors" />
                  <span className="text-[8px] font-black mt-1 uppercase tracking-tighter">Новое</span>
                </button>
              )}
            </div>
          </div>

          {/* Interests */}
          <div className="bg-white rounded-[2.5rem] p-8 app-shadow border border-border/40 mb-10 text-left">
            <h4 className="font-black text-sm uppercase tracking-widest mb-6">Мои интересы</h4>
            <div className="flex flex-wrap gap-3">
              {interestMap.filter(i => profile.interests.includes(i.label)).map((item) => (
                <Badge key={item.label} variant="secondary" className="bg-[#f5f7fa] text-foreground/80 border-0 gap-2.5 py-3 px-5 font-bold text-[11px] rounded-2xl hover:bg-muted transition-colors shadow-sm">
                  <item.icon size={18} className="text-primary" /> {item.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Bio Section */}
          <div className="bg-white rounded-[2.5rem] p-8 app-shadow border border-border/40 mb-10 text-left">
            <h4 className="font-black text-sm uppercase tracking-widest mb-4">О себе</h4>
            <p className="text-base text-muted-foreground leading-relaxed font-medium">
              {profile.bio}
            </p>
          </div>

          {/* Premium Banner */}
          <div className="gradient-bg rounded-[3rem] p-10 text-white text-center app-shadow mb-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Star size={100} fill="currentColor" />
            </div>
            <h5 className="font-black text-2xl mb-3 relative z-10">SwiftMatch Premium</h5>
            <p className="text-sm text-white/80 mb-8 max-w-[240px] mx-auto relative z-10 leading-relaxed">Узнайте, кто вами интересуется, и получите безлимит свайпов</p>
            <Button variant="secondary" className="w-full rounded-2xl h-14 bg-white text-primary font-black uppercase text-[11px] tracking-widest hover:bg-white/90 shadow-xl relative z-10 active:scale-95 transition-all border-0">
              Стать Premium
            </Button>
          </div>
        </div>
      </main>

      {/* Fullscreen Photo Viewer */}
      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-[440px] w-[95vw] h-[80vh] p-0 border-0 bg-transparent shadow-none overflow-hidden flex flex-col items-center justify-center outline-none">
          <DialogTitle className="sr-only">Просмотр фото</DialogTitle>
          <button 
            onClick={() => setIsViewerOpen(false)}
            className="absolute top-4 right-4 z-50 p-3 bg-black/40 backdrop-blur-md text-white rounded-full hover:bg-black/60 transition-all active:scale-90"
          >
            <X size={24} />
          </button>
          
          <Carousel 
            className="w-full h-full" 
            opts={{ startIndex: activePhotoIndex }}
          >
            <CarouselContent className="h-full ml-0">
              {photos.map((url, idx) => (
                <CarouselItem key={idx} className="pl-0 h-[80vh] flex items-center justify-center relative">
                  <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden app-shadow border-4 border-white/10">
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
            <div className="absolute -bottom-12 left-0 right-0 flex justify-center gap-3">
              {photos.map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    activePhotoIndex === i ? "bg-white scale-150" : "bg-white/30"
                  )} 
                />
              ))}
            </div>
            <CarouselPrevious className="left-2 h-14 w-14 bg-white/10 hover:bg-white/20 border-0 text-white backdrop-blur-md" />
            <CarouselNext className="right-2 h-14 w-14 bg-white/10 hover:bg-white/20 border-0 text-white backdrop-blur-md" />
          </Carousel>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </>
  );
}
