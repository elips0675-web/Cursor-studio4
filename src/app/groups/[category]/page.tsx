'use client';

import { Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from "next/image";
import { ChevronLeft, Users } from 'lucide-react';
import { GROUP_CATEGORIES } from '@/lib/demo-data';
import { AppHeader } from '@/components/layout/app-header';
import { BottomNav } from '@/components/navigation/bottom-nav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/language-context';
import { Skeleton } from '@/components/ui/skeleton';

function SubGroupsContent() {
    const params = useParams();
    const router = useRouter();
    const { t, language } = useLanguage();
    const { category: categoryId } = params;

    const category = GROUP_CATEGORIES.find(c => c.id === categoryId);

    if (!category) {
        return (
          <div className="flex-1 flex items-center justify-center text-center p-8">
            <div>
              <h2 className="text-xl font-bold">Категория не найдена</h2>
              <Button onClick={() => router.push('/groups')} className="mt-4">Назад к группам</Button>
            </div>
          </div>
        );
    }

    return (
        <div className="flex flex-col h-svh bg-[#f8f9fb]">
            <header className="flex items-center gap-2 px-3 py-2 border-b border-border sticky top-0 bg-white/90 backdrop-blur-lg z-50 h-16">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-muted/50">
                  <ChevronLeft size={24} className="text-foreground" />
                </Button>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-lg leading-tight tracking-tight text-foreground">
                    {language === 'RU' ? category.name_ru : category.name_en}
                  </h3>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto px-5 pt-6 pb-24">
                <div className="space-y-3">
                    {category.subgroups.map(subgroup => (
                        <Link href={`/chats?groupId=${subgroup.id}`} key={subgroup.id} className="flex items-center gap-4 p-3 bg-white rounded-2xl app-shadow hover:bg-muted/30 transition-all cursor-pointer group border border-white">
                            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-muted flex-shrink-0 border-2 border-white shadow-sm">
                                <Image src={category.img} alt={subgroup.name} fill sizes="56px" data-ai-hint={category.hint} className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"/>
                                <div className="absolute inset-0 bg-black/10"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">{subgroup.name}</h4>
                                <div className="flex items-center text-muted-foreground text-xs mt-1 gap-4">
                                    <div className="flex items-center gap-1.5 font-semibold">
                                        <Users size={12} /> {subgroup.members}
                                    </div>
                                    <div className="flex items-center gap-1.5 font-semibold text-green-600">
                                        <div className="w-2 h-2 rounded-full bg-current"></div>
                                        {subgroup.online} {t('chats.online')}
                                    </div>
                                </div>
                            </div>
                            <ChevronLeft size={16} className="text-muted-foreground/40 transform rotate-180 group-hover:text-primary transition-colors" />
                        </Link>
                    ))}
                </div>
            </main>
            <BottomNav />
        </div>
    )
}

function LoadingSkeleton() {
    return (
        <div className="flex flex-col h-svh bg-[#f8f9fb]">
            <header className="flex items-center gap-2 px-3 py-2 border-b border-border sticky top-0 bg-white/90 backdrop-blur-lg z-50 h-16">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-6 w-32 rounded-md" />
            </header>
            <main className="flex-1 overflow-y-auto px-5 pt-6 pb-24">
                <div className="space-y-3">
                    {Array.from({ length: 10 }).map((_, i) => (
                         <div key={i} className="flex items-center gap-4 p-3 bg-white rounded-2xl app-shadow">
                            <Skeleton className="w-14 h-14 rounded-xl" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-4/5 rounded-md" />
                                <Skeleton className="h-4 w-3/5 rounded-md" />
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <BottomNav />
        </div>
    )
}

export default function SubGroupsPage() {
    return (
        <Suspense fallback={<LoadingSkeleton />}>
            <SubGroupsContent />
        </Suspense>
    )
}
