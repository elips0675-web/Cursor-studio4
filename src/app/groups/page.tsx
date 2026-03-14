"use client";

import { 
  Plus, 
  Users, 
  PackageX,
  Music,
  Dumbbell,
  Palette,
  Gamepad2,
  Film,
  Globe,
  ChefHat,
  Cpu,
  BookOpen,
  Sparkles,
  Shirt,
  HeartPulse,
  Dog,
  FlaskConical,
  Briefcase,
  Home,
  Car,
  Laugh,
  Star,
  Scroll
} from "lucide-react";
import Link from "next/link";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { AppHeader } from "@/components/layout/app-header";
import { GROUP_CATEGORIES } from "@/lib/demo-data";
import { Button } from "@/components/ui/button";
import { useFeatureFlags } from "@/context/feature-flags-context";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Music, Dumbbell, Palette, Gamepad2, Film, Globe, ChefHat, Cpu, BookOpen, Sparkles, Shirt, HeartPulse, Dog, FlaskConical, Briefcase, Home, Car, Laugh, Star, Scroll
};

export default function GroupsPage() {
  const { groupsPageEnabled } = useFeatureFlags();
  const { t, language } = useLanguage();

  if (!groupsPageEnabled) {
      return (
          <>
              <AppHeader />
              <main className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-[#f8f9fb]">
                  <div className="p-6 bg-muted rounded-full mb-6">
                    <PackageX size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Функция отключена</h3>
                  <p className="text-muted-foreground mt-2 max-w-xs">Раздел "Группы" временно недоступен.</p>
              </main>
              <BottomNav />
          </>
      )
  }
  
  return (
    <>
      <AppHeader />
      <main className="flex-1 overflow-y-auto px-5 pt-6 pb-24 bg-[#f8f9fb]">
        <div className="flex items-center justify-between mb-6 px-1">
            <h2 className="text-2xl font-black font-headline tracking-tight text-foreground">{t('nav.groups')}</h2>
        </div>

        {/* Groups Grid - Centered items, Rectangular style */}
        <div className="grid grid-cols-3 gap-3 px-1">
          {GROUP_CATEGORIES.map((category) => {
            const Icon = iconMap[category.icon] || Users;
            const totalMembers = category.subgroups.reduce((acc, sub) => acc + sub.members, 0);
            return (
            <Link href={`/groups/${category.id}`} key={category.id} className="bg-white rounded-2xl overflow-hidden app-shadow group block border border-transparent hover:border-primary/20 transition-all">
              <div className={cn("relative h-20 w-full bg-muted flex items-center justify-center")}>
                <Icon size={24} className="text-orange-500 transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div className="p-2 text-center">
                <h6 className="font-bold text-[10px] leading-tight truncate group-hover:text-primary uppercase tracking-tight">
                  {language === 'RU' ? category.name_ru : category.name_en}
                </h6>
                <div className="flex items-center justify-center text-muted-foreground text-[8px] mt-1 gap-1 font-bold">
                  <Users size={8} /> {totalMembers.toLocaleString('ru-RU')}
                </div>
              </div>
            </Link>
          )})}
        </div>

        <Button className="w-full h-14 rounded-xl gradient-bg text-white font-black uppercase tracking-widest mt-8 shadow-xl shadow-primary/20 border-0 active:scale-95 transition-all">
          <Plus size={18} className="mr-2" /> {language === 'RU' ? 'Создать группу' : 'Create Group'}
        </Button>
      </main>
      <BottomNav />
    </>
  );
}
