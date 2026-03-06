"use client";

import { Plus, Users, PackageX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { AppHeader } from "@/components/layout/app-header";
import { GROUP_CATEGORIES } from "@/lib/demo-data";
import { Button } from "@/components/ui/button";
import { useFeatureFlags } from "@/context/feature-flags-context";
import { useLanguage } from "@/context/language-context";

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
                  <p className="text-muted-foreground mt-2 max-w-xs">Раздел "Группы" временно недоступен. Администратор скоро все включит!</p>
              </main>
              <BottomNav />
          </>
      )
  }
  
  return (
    <>
      <AppHeader />
      <main className="flex-1 overflow-y-auto px-5 pt-6 pb-24">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black font-headline tracking-tight text-foreground">{t('nav.groups')}</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {GROUP_CATEGORIES.map((category) => (
            <Link href={`/groups/${category.id}`} key={category.id} className="bg-white rounded-2xl overflow-hidden app-shadow group block border border-transparent hover:border-primary/20 transition-all">
              <div className="relative h-24 w-full">
                <Image src={category.img} alt={language === 'RU' ? category.name_ru : category.name_en} fill sizes="(max-width: 480px) 50vw, 240px" data-ai-hint={category.hint} className="object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="p-3">
                <h6 className="font-bold text-sm leading-tight truncate group-hover:text-primary">{language === 'RU' ? category.name_ru : category.name_en}</h6>
                <div className="flex items-center text-muted-foreground text-[10px] mt-1 gap-1 font-semibold">
                  <Users size={12} /> {category.subgroups.length} {language === 'RU' ? 'тем' : 'topics'}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Button className="w-full h-12 rounded-full gradient-bg text-white font-bold mt-8 shadow-lg shadow-primary/20">
          <Plus size={18} className="mr-2" /> {language === 'RU' ? 'Создать группу' : 'Create Group'}
        </Button>
      </main>
      <BottomNav />
    </>
  );
}
