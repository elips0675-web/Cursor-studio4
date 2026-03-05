"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { MessageCircle, Search, ChevronLeft, Send, MoreVertical, Sparkles, Smile, Heart, Laugh, Compass, Coffee, Zap, MessageSquareQuote } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { AppHeader } from "@/components/layout/app-header";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { generateIcebreakerSuggestions } from "@/ai/flows/ai-chat-icebreaker-suggestions";
import { motion, AnimatePresence } from "framer-motion";

const CHAT_THEMES = [
  { id: 'romantic', label: 'Романтика', icon: Heart, color: 'text-pink-500', mood: 'Romantic, sweet and poetic' },
  { id: 'funny', label: 'Юмор', icon: Laugh, color: 'text-orange-500', mood: 'Funny, witty and lighthearted' },
  { id: 'hobbies', label: 'О хобби', icon: Compass, color: 'text-blue-500', mood: 'Focus on shared interests and activities' },
  { id: 'daily', label: 'Про день', icon: Coffee, color: 'text-amber-600', mood: 'Casual, relaxed daily life conversation' },
  { id: 'deep', label: 'Глубокое', icon: MessageSquareQuote, color: 'text-purple-500', mood: 'Deep, philosophical and meaningful questions' },
  { id: 'bold', label: 'Смело', icon: Zap, color: 'text-yellow-500', mood: 'Bold, confident and slightly flirty' },
];

const ALL_DEMO_USERS = [
  { id: 1, name: 'Анна', img: PlaceHolderImages[0].imageUrl, last: 'Привет! Как дела? 😊', time: '2 мин', unread: 2, online: true, interests: ['Фотография', 'Путешествия', 'Кофе'], bio: 'Люблю закаты и интересные разговоры.' },
  { id: 2, name: 'Максим', img: PlaceHolderImages[1].imageUrl, last: 'Давай встретимся завтра', time: '1 час', unread: 0, online: true, interests: ['Спорт', 'IT', 'Книги'], bio: 'Ищу компанию для пробежек.' },
  { id: 3, name: 'Елена', img: PlaceHolderImages[2].imageUrl, last: 'Спасибо за комплимент!', time: '3 часа', unread: 1, online: false, interests: ['Искусство', 'Книги', 'Вино'], bio: 'Мечтаю о кругосветке.' },
  { id: 4, name: 'Дмитрий', img: PlaceHolderImages[3].imageUrl, last: 'Был рад познакомиться', time: '5 час', unread: 0, online: false, interests: ['Бизнес', 'Авто', 'Спорт'], bio: 'Ценю время.' },
  { id: 5, name: 'София', img: PlaceHolderImages[4].imageUrl, last: 'Круто!', time: '1 день', unread: 0, online: true, interests: ['Музыка', 'Гитара'], bio: 'Рок-н-ролл жив!' },
  { id: 6, name: 'Артем', img: PlaceHolderImages[5].imageUrl, last: 'Го играть!', time: '1 день', unread: 0, online: true, interests: ['Игры', 'Аниме'], bio: 'Геймер со стажем.' },
  { id: 7, name: 'Мария', img: PlaceHolderImages[6].imageUrl, last: 'Завтра в парк?', time: '2 дня', unread: 0, online: true, interests: ['Йога', 'Природа'], bio: 'За здоровый образ жизни.' },
  { id: 8, name: 'Иван', img: PlaceHolderImages[7].imageUrl, last: 'Фото готовы!', time: '3 дня', unread: 0, online: false, interests: ['Фотография', 'Горы'], bio: 'Фотограф-пейзажист.' },
  { id: 9, name: 'Ксения', img: PlaceHolderImages[8].imageUrl, last: 'Как тебе образ?', time: '4 дня', unread: 0, online: true, interests: ['Мода', 'Дизайн'], bio: 'Стиль - это всё.' },
  { id: 10, name: 'Никита', img: PlaceHolderImages[9].imageUrl, last: 'Интересный факт...', time: '5 дней', unread: 0, online: false, interests: ['Наука', 'История'], bio: 'Люблю космос.' }
];

const INITIAL_MESSAGES = [
  { id: 1, text: "Привет! 👋 Видел твой профиль, у нас много общих интересов.", sender: "other", time: "10:00" },
  { id: 2, text: "Привет! Да, я тоже заметила. Ты тоже любишь кофе?", sender: "me", time: "10:02" },
  { id: 3, text: "О да, без него утро не начинается! Знаешь какое-нибудь уютное место?", sender: "other", time: "10:05" },
];

function ChatsContent() {
  const searchParams = useSearchParams();
  const matchId = searchParams.get('matchId');

  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [icebreakers, setIcebreakers] = useState<string[]>([]);
  const [loadingIcebreakers, setLoadingIcebreakers] = useState(false);
  const [showThemeGrid, setShowThemeGrid] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (selectedChat) {
      scrollToBottom();
    }
  }, [messages, selectedChat]);

  useEffect(() => {
    if (matchId) {
      const id = parseInt(matchId);
      const chat = ALL_DEMO_USERS.find(u => u.id === id);

      if (chat) {
        setSelectedChat(chat);
        setMessages([
          { 
            id: Date.now(), 
            text: "Привет! Это совпадение, рад(а) знакомству! 😊", 
            sender: "me", 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
          }
        ]);
        loadIcebreakers(chat);
      }
    }
  }, [matchId]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: inputValue,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputValue("");
    setShowThemeGrid(false);

    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const response = {
          id: Date.now() + 1,
          text: "Звучит здорово! Давай это обсудим.",
          sender: "other",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, response]);
      }, 2000);
    }, 1000);
  };

  const loadIcebreakers = async (chat: any, mood?: string) => {
    setLoadingIcebreakers(true);
    try {
      const res = await generateIcebreakerSuggestions({
        currentUserInterests: ["Спорт", "Кофе", "Кино"],
        matchedUserName: chat.name,
        matchedUserInterests: chat.interests || [],
        matchedUserBio: chat.bio || "",
        mood: mood || "Friendly and polite"
      });
      setIcebreakers(res.suggestions);
    } catch (e) {
      setIcebreakers(["Привет! Как прошел твой день?", "Чем любишь заниматься в свободное время?", "Какой твой любимый фильм?"]);
    } finally {
      setLoadingIcebreakers(false);
      if (mood) setShowThemeGrid(false);
    }
  };

  const openChat = (chat: any) => {
    setSelectedChat(chat);
    setMessages(INITIAL_MESSAGES);
    setShowThemeGrid(false);
    setIcebreakers([]);
    loadIcebreakers(chat);
  };

  if (selectedChat) {
    return (
      <div className="flex flex-col h-svh bg-[#f8f9fb]">
        <header className="flex items-center gap-3 px-4 py-3 border-b border-border sticky top-0 bg-white/90 backdrop-blur-lg z-50">
          <Button variant="ghost" size="icon" onClick={() => setSelectedChat(null)} className="rounded-full hover:bg-muted/50">
            <ChevronLeft size={24} className="text-foreground" />
          </Button>
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden relative border-2 border-white shadow-sm">
              <Image src={selectedChat.img} alt={selectedChat.name} fill className="object-cover" />
            </div>
            {selectedChat.online && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#2ecc71] border-2 border-white rounded-full shadow-sm"></span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-sm leading-tight tracking-tight text-foreground">{selectedChat.name}</h3>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">
              {selectedChat.online ? '• В сети' : 'Был(а) недавно'}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
            <MoreVertical size={20} />
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="text-center my-2">
            <Badge variant="secondary" className="bg-white/50 text-[10px] text-muted-foreground border-0 font-black uppercase tracking-widest px-3 py-1">Сегодня</Badge>
          </div>

          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                key={msg.id} 
                className={cn(
                  "flex flex-col max-w-[85%]",
                  msg.sender === "me" ? "ml-auto items-end" : "items-start"
                )}
              >
                <div 
                  className={cn(
                    "px-4 py-3 rounded-[1.25rem] text-sm shadow-sm font-medium leading-relaxed transition-all",
                    msg.sender === "me" 
                      ? "gradient-bg text-white rounded-tr-none shadow-primary/10" 
                      : "bg-white text-foreground rounded-tl-none border border-border/40"
                  )}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-muted-foreground mt-1.5 px-1 font-bold uppercase tracking-tighter opacity-70">
                  {msg.time}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1.5 text-muted-foreground"
            >
              <div className="flex gap-1 bg-white px-3 py-2.5 rounded-[1.25rem] border border-border/40 shadow-sm rounded-tl-none">
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </main>

        <div className="p-4 bg-white border-t border-border shadow-[0_-10px_40px_-20px_rgba(0,0,0,0.1)] relative z-10">
          {/* AI Theme Grid Toggle */}
          <div className="flex items-center justify-between mb-3 px-1">
             <button 
               onClick={() => setShowThemeGrid(!showThemeGrid)}
               className={cn(
                 "flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] transition-all active:scale-95",
                 showThemeGrid ? "gradient-bg text-white shadow-lg shadow-primary/20" : "bg-primary/5 text-primary border border-primary/10 hover:bg-primary/10"
               )}
             >
               <Sparkles size={14} className={cn(loadingIcebreakers && "animate-spin")} /> {showThemeGrid ? "Закрыть темы" : "Темы ответов AI"}
             </button>
             {!showThemeGrid && icebreakers.length > 0 && !loadingIcebreakers && (
               <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest opacity-40 italic">Листайте →</p>
             )}
          </div>

          <AnimatePresence>
            {/* AI Themes Grid */}
            {showThemeGrid && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-3 gap-2.5 mb-5 overflow-hidden"
              >
                {CHAT_THEMES.map((theme) => {
                  const Icon = theme.icon;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => loadIcebreakers(selectedChat, theme.mood)}
                      className="flex flex-col items-center justify-center p-3.5 rounded-[1.5rem] bg-muted/40 border border-border/50 hover:border-primary/30 hover:bg-white hover:shadow-md transition-all group active:scale-95"
                    >
                      <Icon size={22} className={cn("mb-1.5 group-hover:scale-110 transition-transform", theme.color)} />
                      <span className="text-[9px] font-black uppercase tracking-tighter text-foreground/70">{theme.label}</span>
                    </button>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Icebreaker Suggestions */}
          {!showThemeGrid && (
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar mb-5 h-10 items-center px-1">
              {loadingIcebreakers ? (
                <div className="flex gap-2">
                  <div className="h-8 w-32 bg-muted animate-pulse rounded-full"></div>
                  <div className="h-8 w-28 bg-muted animate-pulse rounded-full"></div>
                </div>
              ) : (
                icebreakers.map((text, i) => (
                  <button 
                    key={i} 
                    onClick={() => setInputValue(text)}
                    className="whitespace-nowrap px-4 py-2 bg-white hover:bg-muted transition-all text-[11px] font-bold rounded-full text-foreground/80 border border-border/60 shadow-sm active:scale-95 whitespace-nowrap"
                  >
                    {text}
                  </button>
                ))
              )}
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="flex-1 relative group">
              <Input 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ваше сообщение..." 
                className="pr-12 h-14 bg-muted/50 border-0 rounded-3xl focus-visible:ring-primary/20 font-medium px-6 text-sm placeholder:text-muted-foreground/60 transition-all focus:bg-muted"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-1 rounded-full hover:bg-white active:scale-90">
                <Smile size={24} />
              </button>
            </div>
            <Button 
              size="icon" 
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="h-14 w-14 rounded-[1.5rem] gradient-bg text-white shadow-xl shadow-primary/20 transition-all active:scale-90 disabled:opacity-40 flex-shrink-0"
            >
              <Send size={22} className="ml-1" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <AppHeader />
      <main className="flex-1 overflow-y-auto px-5 pt-6 pb-24 bg-[#f8f9fb]">
        <div className="flex justify-between items-center mb-6 px-1">
          <div>
            <h2 className="text-2xl font-black font-headline tracking-tight text-foreground">Сообщения</h2>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-0.5 opacity-60">Твои диалоги</p>
          </div>
          <Badge className="gradient-bg text-white rounded-full px-3 py-1 font-black text-[10px] border-0 shadow-lg shadow-primary/20">3 новых</Badge>
        </div>

        <div className="relative mb-8 px-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={18} />
          <Input 
            className="pl-12 h-14 bg-white border-0 rounded-3xl placeholder:text-muted-foreground/50 focus-visible:ring-primary/20 app-shadow text-sm font-medium" 
            placeholder="Поиск по чатам..." 
          />
        </div>

        <div className="space-y-4 px-1">
          {ALL_DEMO_USERS.map((chat) => (
            <div 
              key={chat.id} 
              onClick={() => openChat(chat)}
              className="flex items-center gap-4 p-4 bg-white rounded-[2rem] app-shadow hover:translate-x-1.5 transition-all cursor-pointer group border border-transparent hover:border-primary/10"
            >
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden relative border-2 border-white shadow-sm transition-transform group-hover:scale-105">
                  <Image src={chat.img} alt={chat.name} fill className="object-cover" />
                </div>
                {chat.online && (
                  <span className="absolute bottom-0 right-0 w-4 h-4 bg-[#2ecc71] border-2 border-white rounded-full shadow-md"></span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-black text-sm text-foreground tracking-tight group-hover:text-primary transition-colors">{chat.name}</span>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter opacity-60">{chat.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground truncate pr-3 font-medium opacity-80 leading-snug">{chat.last}</p>
                  {chat.unread > 0 && (
                    <Badge className="gradient-bg text-white text-[9px] h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full border-0 font-black shadow-md shadow-primary/10">
                      {chat.unread}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <BottomNav />
    </>
  );
}

export default function ChatsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen font-black text-primary animate-pulse uppercase tracking-[0.2em] text-xs">Загрузка чатов...</div>}>
      <ChatsContent />
    </Suspense>
  );
}
