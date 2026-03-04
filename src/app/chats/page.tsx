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
      <div className="flex flex-col h-svh bg-white">
        <header className="flex items-center gap-3 px-4 py-3 border-b border-border sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <Button variant="ghost" size="icon" onClick={() => setSelectedChat(null)} className="rounded-full">
            <ChevronLeft size={24} />
          </Button>
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden relative border border-border">
              <Image src={selectedChat.img} alt={selectedChat.name} fill className="object-cover" />
            </div>
            {selectedChat.online && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#2ecc71] border-2 border-white rounded-full"></span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm leading-tight">{selectedChat.name}</h3>
            <p className="text-[10px] text-muted-foreground">{selectedChat.online ? 'В сети' : 'Был(а) недавно'}</p>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreVertical size={20} className="text-muted-foreground" />
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8f9fb]">
          <div className="text-center my-4">
            <Badge variant="secondary" className="bg-white/50 text-[10px] text-muted-foreground border-0 font-medium">Сегодня</Badge>
          </div>

          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={cn(
                "flex flex-col max-w-[80%]",
                msg.sender === "me" ? "ml-auto items-end" : "items-start"
              )}
            >
              <div 
                className={cn(
                  "px-4 py-2.5 rounded-[1.25rem] text-sm shadow-sm",
                  msg.sender === "me" 
                    ? "gradient-bg text-white rounded-tr-none" 
                    : "bg-white text-foreground rounded-tl-none border border-border/50"
                )}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 px-1">{msg.time}</span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <div className="flex gap-1 bg-white p-2 rounded-2xl border border-border/50">
                <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        <div className="p-4 bg-white border-t border-border shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
          {/* AI Theme Grid Toggle */}
          <div className="flex items-center justify-between mb-3">
             <button 
               onClick={() => setShowThemeGrid(!showThemeGrid)}
               className={cn(
                 "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tight transition-all",
                 showThemeGrid ? "gradient-bg text-white shadow-md" : "bg-primary/5 text-primary border border-primary/10"
               )}
             >
               <Sparkles size={12} className={cn(loadingIcebreakers && "animate-spin")} /> {showThemeGrid ? "Закрыть темы" : "Темы ответов AI"}
             </button>
             {!showThemeGrid && icebreakers.length > 0 && !loadingIcebreakers && (
               <p className="text-[9px] text-muted-foreground font-medium italic">Листайте вправо →</p>
             )}
          </div>

          {/* AI Themes Grid */}
          {showThemeGrid && (
            <div className="grid grid-cols-3 gap-2 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {CHAT_THEMES.map((theme) => {
                const Icon = theme.icon;
                return (
                  <button
                    key={theme.id}
                    onClick={() => loadIcebreakers(selectedChat, theme.mood)}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-muted/40 border border-border/50 hover:border-primary/30 hover:bg-white transition-all group"
                  >
                    <Icon size={20} className={cn("mb-1 group-hover:scale-110 transition-transform", theme.color)} />
                    <span className="text-[9px] font-black uppercase tracking-tighter text-foreground/70">{theme.label}</span>
                  </button>
                )
              })}
            </div>
          )}

          {/* Icebreaker Suggestions */}
          {!showThemeGrid && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 h-9 items-center">
              {loadingIcebreakers ? (
                <div className="flex gap-2">
                  <div className="h-7 w-32 bg-muted animate-pulse rounded-full"></div>
                  <div className="h-7 w-28 bg-muted animate-pulse rounded-full"></div>
                </div>
              ) : (
                icebreakers.map((text, i) => (
                  <button 
                    key={i} 
                    onClick={() => setInputValue(text)}
                    className="whitespace-nowrap px-4 py-1.5 bg-muted hover:bg-border transition-colors text-[10px] font-medium rounded-full text-foreground/80 border border-transparent active:scale-95 transition-transform"
                  >
                    {text}
                  </button>
                ))
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Input 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ваше сообщение..." 
                className="pr-10 h-11 bg-muted border-0 rounded-2xl focus-visible:ring-primary/20 font-medium"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                <Smile size={20} />
              </button>
            </div>
            <Button 
              size="icon" 
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="h-11 w-11 rounded-2xl gradient-bg text-white shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <AppHeader />
      <main className="flex-1 overflow-y-auto px-5 pt-6 pb-24">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-headline">Сообщения</h2>
          <Badge className="bg-primary text-white rounded-full">3 новых</Badge>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            className="pl-10 h-11 bg-muted border-0 rounded-2xl placeholder:text-muted-foreground focus-visible:ring-primary/20" 
            placeholder="Поиск по чатам..." 
          />
        </div>

        <div className="space-y-4">
          {ALL_DEMO_USERS.map((chat) => (
            <div 
              key={chat.id} 
              onClick={() => openChat(chat)}
              className="flex items-center gap-4 p-4 bg-white rounded-3xl app-shadow hover:translate-x-1 transition-transform cursor-pointer group"
            >
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-full overflow-hidden relative border border-border">
                  <Image src={chat.img} alt={chat.name} fill className="object-cover" />
                </div>
                {chat.online && (
                  <span className="absolute bottom-0 right-0 w-4 h-4 bg-[#2ecc71] border-2 border-white rounded-full"></span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-bold text-sm">{chat.name}</span>
                  <span className="text-[10px] text-muted-foreground">{chat.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground truncate pr-2">{chat.last}</p>
                  {chat.unread > 0 && (
                    <Badge className="bg-primary text-white text-[10px] h-4 min-w-[16px] px-1 flex items-center justify-center rounded-full">
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
    <Suspense fallback={<div className="flex items-center justify-center h-screen font-bold">Загрузка...</div>}>
      <ChatsContent />
    </Suspense>
  );
}
