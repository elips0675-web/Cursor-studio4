
"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Users, MessageSquare, Info, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { AppHeader } from "@/components/layout/app-header";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { format, isToday, isYesterday } from 'date-fns';
import { ru } from 'date-fns/locale';

const ITEMS_PER_PAGE = 10;

function ChatListSkeleton() {
  return (
    <div className="space-y-1 px-1">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-white app-shadow border border-white">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <Skeleton className="h-4 w-2/4" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Pagination({ current, total, onChange }: { current: number, total: number, onChange: (p: number) => void }) {
  if (total <= 1) return null;
  const pages = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1.5 pt-4 pb-4">
      <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border-muted bg-white" disabled={current === 1} onClick={() => onChange(current - 1)}>
        <ChevronLeft size={14} />
      </Button>
      {pages.map(p => (
        <Button
          key={p}
          variant={current === p ? "default" : "outline"}
          size="icon"
          className={cn("w-8 h-8 rounded-lg text-xs font-black transition-all", current === p ? "gradient-bg border-0 text-white shadow-md scale-110" : "bg-white border-muted text-muted-foreground hover:bg-muted/50")}
          onClick={() => onChange(p)}
        >
          {p}
        </Button>
      ))}
      <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border-muted bg-white" disabled={current === total} onClick={() => onChange(current + 1)}>
        <ChevronRight size={14} />
      </Button>
    </div>
  );
}

export default function ChatsListPage() {
  const router = useRouter();
  const { t, language } = useLanguage();

  const [activeTab, setActiveTab] = useState<"direct" | "groups">("direct");
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchChats = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('/api/chats', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          // TEMP: Добавляем isGroup поле для разделения. В будущем API может измениться.
          setChats(data.map((c: any) => ({ ...c, isGroup: c.name.includes('Group') })));
        } else {
          toast({ title: "Ошибка", description: "Не удалось загрузить чаты.", variant: "destructive" });
        }
      } catch (error) {
        console.error("Fetch chats error:", error);
        toast({ title: "Сетевая ошибка", description: "Не удалось подключиться к серверу.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, [router]);

  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (isToday(date)) return format(date, 'HH:mm');
    if (isYesterday(date)) return t('chats.yesterday');
    return format(date, 'dd.MM.yy', { locale: language === 'ru' ? ru : undefined });
  };

  const filteredData = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const source = chats.filter(c => activeTab === 'direct' ? !c.isGroup : c.isGroup);
    if (!query) return source;
    return source.filter(item => item.name.toLowerCase().includes(query));
  }, [searchQuery, activeTab, chats]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const unreadCount = useMemo(() => chats.reduce((acc, chat) => acc + (chat.unread_count || 0), 0), [chats]);

  return (
    <>
      <AppHeader />
      <main className="flex-1 overflow-y-auto px-5 pt-6 pb-24 bg-[#f8f9fb]">
        <div className="flex justify-between items-center mb-6 px-1">
          <div>
            <h2 className="text-2xl font-black font-headline tracking-tight text-foreground">{t('chats.title')}</h2>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-0.5 opacity-60">{t('chats.subtitle')}</p>
          </div>
          {unreadCount > 0 && <Badge className="gradient-bg text-white rounded-full px-3 py-1 font-black text-[10px] border-0 shadow-lg shadow-primary/20">{unreadCount} {t('activity.new')}</Badge>}
        </div>

        <div className="flex gap-2 p-1 bg-white rounded-2xl app-shadow mb-6 mx-1 border border-border/40">
          <button onClick={() => setActiveTab("direct")} className={cn("flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2", activeTab === "direct" ? "gradient-bg text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-muted/50")}><MessageSquare size={14} /> {language === 'RU' ? 'ЛС' : 'DMs'}</button>
          <button onClick={() => setActiveTab("groups")} className={cn("flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2", activeTab === "groups" ? "gradient-bg text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-muted/50")}><Users size={14} /> {language === 'RU' ? 'Группы' : 'Groups'}</button>
        </div>

        <div className="relative mb-8 px-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={16} />
          <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 h-12 bg-white border-0 rounded-2xl app-shadow text-sm font-medium" placeholder={t('chats.search')} />
        </div>

        {isLoading ? <ChatListSkeleton /> : (
          <div className="space-y-1 px-1">
            {paginatedItems.length > 0 ? (
              paginatedItems.map((item) => (
                <div key={item.chat_id} onClick={() => router.push(`/chats/${item.chat_id}`)} className="flex items-center gap-3 p-3 rounded-2xl transition-all cursor-pointer group border border-white mb-2 bg-white app-shadow hover:bg-muted/30">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden relative border-2 border-white shadow-sm bg-muted flex items-center justify-center">
                      {item.isGroup ? <Users size={24} className="text-orange-500" /> : <Image src={item.avatar || '/demo/people/ivan.png'} alt={item.name || ''} fill sizes="48px" className="object-cover" />}
                    </div>
                    {!item.isGroup && item.online && <span className="absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full shadow-md bg-[#2ecc71]"></span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-black text-sm text-foreground tracking-tight group-hover:text-primary transition-colors truncate">{item.name}</span>
                      <span className="text-[10px] text-muted-foreground font-bold opacity-60 flex-shrink-0 ml-2">{formatTimestamp(item.last_message_timestamp)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className={cn("text-xs truncate pr-2 font-medium leading-snug", (item.unread_count > 0) ? "text-foreground font-bold" : "text-muted-foreground opacity-80")}>{item.last_message}</p>
                      {item.unread_count > 0 && <Badge className="h-5 min-w-[20px] px-1.5 gradient-bg text-white border-0 text-[9px] font-black flex items-center justify-center rounded-full scale-90 shadow-lg shadow-primary/20">{item.unread_count}</Badge>}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 opacity-30 flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center"><Info size={24} /></div>
                <p className="text-[10px] font-black uppercase tracking-widest">{t('activity.empty')}</p>
              </div>
            )}
            <Pagination current={currentPage} total={totalPages} onChange={setCurrentPage} />
          </div>
        )}
      </main>
      <BottomNav />
    </>
  );
}
