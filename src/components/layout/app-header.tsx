
"use client";

import { Bell, Languages, LogIn, ChevronLeft, Sparkles, Heart, MessageCircle, User, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, memo, useMemo } from "react";
import dynamic from 'next/dynamic';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLanguage } from "@/context/language-context";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Динамическая загрузка контента уведомлений для ускорения LCP
const PopoverContent = dynamic(() => import("@/components/ui/popover").then(mod => mod.PopoverContent));
const ScrollArea = dynamic(() => import("@/components/ui/scroll-area").then(mod => mod.ScrollArea));

const NOTIFICATIONS = [
  { id: 1, type: 'like', text: 'Анна поставила вам лайк!', time: '2 мин назад', icon: Heart, color: 'text-primary' },
  { id: 2, type: 'match', text: 'У вас новое совпадение с Максимом!', time: '15 мин назад', icon: Sparkles, color: 'text-yellow-500' },
  { id: 3, type: 'message', text: 'Елена прислала вам сообщение', time: '1 час назад', icon: MessageCircle, color: 'text-blue-500' },
  { id: 4, type: 'system', text: 'Ваш профиль стал популярнее на 20%', time: '3 часа назад', icon: Zap, color: 'text-green-500' },
];

export function AppHeader() {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(4);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const isHomePage = pathname === "/";
  const isLoginPage = pathname === "/login";

  const handleLangChange = (newLang: 'RU' | 'EN') => {
    setLanguage(newLang);
    toast({
      title: newLang === "RU" ? "Язык изменен" : "Language changed",
      description: newLang === "RU" ? "Выбран русский язык" : "English language selected",
    });
  };

  if (isLoginPage) return null;

  return (
    <header className="sticky top-0 w-full bg-white/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between z-50 h-16 relative">
      <div className="flex items-center min-w-[40px]">
        {!isHomePage && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()} 
            className="rounded-full h-9 w-9 hover:bg-muted"
          >
            <ChevronLeft size={22} />
          </Button>
        )}
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
        <Link href="/" prefetch={false}>
          <h1 className="text-xl font-black font-headline gradient-text cursor-pointer tracking-tight">
            SwiftMatch
          </h1>
        </Link>
      </div>

      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-9 px-2.5 rounded-full bg-muted/50 flex items-center justify-center text-foreground hover:bg-muted transition-all active:scale-95 gap-1.5 border border-transparent">
              <Languages size={15} className="text-primary" />
              <span className="text-[9px] font-black uppercase tracking-tighter">{language}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-2xl border-0 app-shadow p-1.5 min-w-[120px] bg-white">
            <DropdownMenuItem 
              onClick={() => handleLangChange("RU")}
              className="rounded-xl font-bold text-[10px] uppercase tracking-wider cursor-pointer py-2"
            >
              Русский (RU)
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleLangChange("EN")}
              className="rounded-xl font-bold text-[10px] uppercase tracking-wider cursor-pointer py-2"
            >
              English (EN)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Popover onOpenChange={(open) => {
          setIsNotificationsOpen(open);
          if (open) setUnreadCount(0);
        }}>
          <PopoverTrigger asChild>
            <button className="w-9 h-9 rounded-full bg-muted/50 flex items-center justify-center text-foreground hover:bg-muted transition-all active:scale-95 relative">
              <Zap size={16} />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 bg-primary text-white border-2 border-white flex items-center justify-center text-[8px] font-black animate-in zoom-in">
                  {unreadCount}
                </Badge>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[320px] p-0 rounded-3xl border-0 shadow-2xl bg-white overflow-hidden">
            {isNotificationsOpen && (
              <>
                <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center">
                  <h4 className="font-black text-xs uppercase tracking-widest text-foreground">
                    {language === "RU" ? "Уведомления" : "Notifications"}
                  </h4>
                </div>
                <ScrollArea className="h-[300px]">
                  <div className="flex flex-col">
                    {NOTIFICATIONS.length > 0 ? (
                      NOTIFICATIONS.map((note) => {
                        const Icon = note.icon;
                        return (
                          <div 
                            key={note.id} 
                            className="p-4 border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors cursor-pointer group"
                          >
                            <div className="flex gap-3">
                              <div className={cn("mt-0.5 p-2 rounded-xl bg-white shadow-sm border border-border/10", note.color)}>
                                <Icon size={14} fill={note.type === 'like' ? 'currentColor' : 'none'} />
                              </div>
                              <div className="flex-1">
                                <p className="text-[12px] font-bold leading-tight group-hover:text-primary transition-colors">
                                  {note.text}
                                </p>
                                <p className="text-[10px] text-muted-foreground font-medium mt-1 uppercase tracking-tighter">
                                  {note.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-10 text-center">
                        <p className="text-xs text-muted-foreground font-medium">Нет новых уведомлений</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                <div className="p-3 bg-muted/10 text-center border-t border-border">
                  <Button 
                    variant="ghost" 
                    onClick={() => router.push('/activity')}
                    className="h-8 text-[9px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 w-full rounded-xl"
                  >
                    {language === "RU" ? "Показать все" : "View all"}
                  </Button>
                </div>
              </>
            )}
          </PopoverContent>
        </Popover>

        <Button 
          asChild
          variant="ghost" 
          size="sm" 
          className="text-[10px] font-black uppercase tracking-widest gap-1.5 text-muted-foreground hover:text-primary transition-colors h-9 px-2 ml-1"
        >
          <Link href="/login" prefetch={false}>
            <LogIn size={14} />
            <span className="hidden xs:block">{language === "RU" ? "Вход" : "Login"}</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
