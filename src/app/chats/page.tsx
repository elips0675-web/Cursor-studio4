
"use client";

import { useState, useMemo } from "react";
import { Search, Users, MessageSquare, Info, ChevronRight, ChevronLeft } from "lucide-react";
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
import { useApi } from "@/hooks/useApi";

const ITEMS_PER_PAGE = 10;

// ... (rest of the components are the same)

export default function ChatsListPage() {
  const router = useRouter();
  const { t, language } = useLanguage();

  const [activeTab, setActiveTab] = useState<"direct" | "groups">("direct");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: chats, loading: isLoading, error } = useApi<any[]>('/api/chats');

  if (error) {
    toast({ title: "Ошибка", description: "Не удалось загрузить чаты.", variant: "destructive" });
  }

  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (isToday(date)) return format(date, 'HH:mm');
    if (isYesterday(date)) return t('chats.yesterday');
    return format(date, 'dd.MM.yy', { locale: language === 'ru' ? ru : undefined });
  };

  const filteredData = useMemo(() => {
    if (!chats) return [];
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


  const unreadCount = useMemo(() => chats?.reduce((acc, chat) => acc + (chat.unread_count || 0), 0) || 0, [chats]);

  // ... (rest of the component is the same, but remove the old useEffect for fetching chats)
}
