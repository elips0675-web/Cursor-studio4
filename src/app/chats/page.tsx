
"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, Search, ChevronLeft, Send, MoreVertical, Sparkles, Smile } from "lucide-react";
import Image from "next/image";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { AppHeader } from "@/components/layout/app-header";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { generateIcebreakerSuggestions } from "@/ai/flows/ai-chat-icebreaker-suggestions";

const CHATS_DATA = [
  { 
    id: 1, 
    name: 'Анна', 
    last: 'Привет! Как дела? 😊', 
    time: '2 мин', 
    unread: 2, 
    img: PlaceHolderImages[0].imageUrl, 
    online: true,
    interests: ['Фотография', 'Путешествия', 'Кофе'],
    bio: 'Люблю закаты и интересные разговоры.'
  },
  { 
    id: 2, 
    name: 'Максим', 
    last: 'Давай встретимся завтра', 
    time: '1 час', 
    unread: 0, 
    img: PlaceHolderImages[1].imageUrl, 
    online: false,
    interests: ['Спорт', 'IT', 'Книги'],
    bio: 'Ищу компанию для пробежек.'
  },
  { 
    id: 3, 
    name: 'Елена', 
    last: 'Спасибо за комплимент!', 
    time: '3 часа', 
    unread: 1, 
    img: PlaceHolderImages[2].imageUrl, 
    online: true,
    interests: ['Искусство', 'Музыка'],
    bio: 'Мечтаю о кругосветке.'
  },
];

const INITIAL_MESSAGES = [
  { id: 1, text: "Привет! 👋 Видел твой профиль, у нас много общих интересов.", sender: "other", time: "10:00" },
  { id: 2, text: "Привет! Да, я тоже заметила. Ты тоже любишь кофе?", sender: "me", time: "10:02" },
  { id: 3, text: "О да, без него утро не начинается! Знаешь какое-нибудь уютное место?", sender: "other", time: "10:05" },
];

export default function ChatsPage() {
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [icebreakers, setIcebreakers] = useState<string[]>([]);
  const [loadingIcebreakers, setLoadingIcebreakers] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (selectedChat) {
      scrollToBottom();
    }
  }, [messages, selectedChat]);

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

    // Simulate response
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

  const loadIcebreakers = async (chat: any) => {
    setLoadingIcebreakers(true);
    try {
      const res = await generateIcebreakerSuggestions({
        currentUserInterests: ["Спорт", "Кофе", "Кино"],
        matchedUserName: chat.name,
        matchedUserInterests: chat.interests,
        matchedUserBio: chat.bio
      });
      setIcebreakers(res.suggestions);
    } catch (e) {
      setIcebreakers(["Привет! Как прошел твой день?", "Чем любишь заниматься в свободное время?", "Какой твой любимый фильм?"]);
    } finally {
      setLoadingIcebreakers(false);
    }
  };

  const openChat = (chat: any) => {
    setSelectedChat(chat);
    setMessages(INITIAL_MESSAGES);
    loadIcebreakers(chat);
  };

  if (selectedChat) {
    return (
      <div className="flex flex-col h-svh bg-white">
        {/* Chat Header */}
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

        {/* Messages Area */}
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

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-border">
          {/* AI Icebreakers */}
          {!isTyping && messages.length < 5 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
              <div className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 bg-primary/5 text-primary text-[10px] font-bold rounded-full border border-primary/10">
                <Sparkles size={12} /> AI
              </div>
              {loadingIcebreakers ? (
                <div className="h-7 w-32 bg-muted animate-pulse rounded-full"></div>
              ) : (
                icebreakers.map((text, i) => (
                  <button 
                    key={i} 
                    onClick={() => setInputValue(text)}
                    className="whitespace-nowrap px-4 py-1.5 bg-muted hover:bg-border transition-colors text-[10px] font-medium rounded-full text-foreground/80"
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
                className="pr-10 h-11 bg-muted border-0 rounded-2xl focus-visible:ring-primary/20"
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
          {CHATS_DATA.map((chat) => (
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
