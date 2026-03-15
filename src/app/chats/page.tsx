
"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { 
  Search, ChevronLeft, Send, MoreVertical, Sparkles, Smile, Heart, Laugh, Compass, Coffee, Zap, MessageSquareQuote, Flame, Star, Ghost, Rocket, Crown, Music, Phone, Video, Flag, Check, CheckCheck, Info, Users, LogOut
} from "lucide-react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import { BottomNav } from "@/components/navigation/bottom-nav";
import { AppHeader } from "@/components/layout/app-header";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { generateIcebreakerSuggestions } from "@/ai/flows/ai-chat-icebreaker-suggestions";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/language-context";
import { toast } from "@/hooks/use-toast";
import { useFeatureFlags } from "@/context/feature-flags-context";
import { ALL_DEMO_USERS, GROUP_CATEGORIES } from "@/lib/demo-data";
import { containsForbiddenWords, isGibberish } from "@/lib/word-filter";

const VideoCallDialog = dynamic(() => import('@/components/video-call').then(mod => mod.VideoCallDialog), { ssr: false });
const VoiceCallDialog = dynamic(() => import('@/components/voice-call').then(mod => mod.VoiceCallDialog), { ssr: false });

const CHAT_THEMES = [
  { id: 'romantic', label_ru: 'Романтика', label_en: 'Romantic', icon: Heart, color: 'text-pink-500', mood: 'Romantic, sweet and poetic' },
  { id: 'funny', label_ru: 'Юмор', label_en: 'Humor', icon: Laugh, color: 'text-orange-500', mood: 'Funny, witty and lighthearted' },
  { id: 'hobbies', label_ru: 'О хобби', label_en: 'Hobbies', icon: Compass, color: 'text-blue-500', mood: 'Focus on shared interests and activities' },
  { id: 'daily', label_ru: 'Про день', label_en: 'Daily', icon: Coffee, color: 'text-amber-600', mood: 'Casual, relaxed daily life conversation' },
  { id: 'deep', label_ru: 'Глубокое', label_en: 'Deep', icon: MessageSquareQuote, color: 'text-purple-500', mood: 'Deep, philosophical and meaningful questions' },
  { id: 'bold', label_ru: 'Смело', label_en: 'Bold', icon: Zap, color: 'text-yellow-500', mood: 'Bold, confident and slightly flirty' },
];

const QUICK_REACTIONS = [
  { id: 'heart', icon: Heart, color: 'text-red-500', label: '❤️' },
  { id: 'flame', icon: Flame, color: 'text-orange-500', label: '🔥' },
  { id: 'zap', icon: Zap, color: 'text-yellow-400', label: '⚡' },
  { id: 'star', icon: Star, color: 'text-yellow-500', label: '⭐' },
  { id: 'smile', icon: Smile, color: 'text-green-500', label: '😊' },
  { id: 'laugh', icon: Laugh, color: 'text-orange-400', label: '😂' },
  { id: 'ghost', icon: Ghost, color: 'text-purple-400', label: '👻' },
  { id: 'rocket', icon: Rocket, color: 'text-blue-500', label: '🚀' },
  { id: 'crown', icon: Crown, color: 'text-amber-500', label: '👑' },
  { id: 'music', icon: Music, color: 'text-pink-400', label: '🎵' },
];

const INITIAL_MESSAGES = [
  { id: 1, text: "Привет! 👋 Видел твой профиль, у нас много общих интересов.", sender: "other", time: "10:00" },
  { id: 2, text: "Привет! Да, я тоже заметила. Ты тоже любишь кофе?", sender: "me", time: "10:02" },
  { id: 3, text: "О да, без него утро не начинается! Знаешь какое-нибудь уютное место?", sender: "other", time: "10:05" },
];

const INITIAL_GROUP_MESSAGES = [
    { id: 1, text: "Всем привет! Кто сегодня идет на пробежку?", sender: "other", time: "10:00", senderName: "Елена" },
    { id: 2, text: "Я планирую! В 19:00 у входа в парк?", sender: "other", time: "10:02", senderName: "Максим" },
    { id: 3, text: "Отлично, буду!", sender: "me", time: "10:05" },
];

const REPORT_REASONS = ['report.reason.spam', 'report.reason.abuse', 'report.reason.fake', 'report.reason.scam', 'report.reason.content'];

function ChatsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, language } = useLanguage();
  const { videoCallsEnabled, aiIcebreakersEnabled } = useFeatureFlags();
  const matchId = searchParams.get('matchId');
  const groupId = searchParams.get('groupId');

  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [icebreakers, setIcebreakers] = useState<string[]>([]);
  const [loadingIcebreakers, setLoadingIcebreakers] = useState(false);
  const [showThemeGrid, setShowThemeGrid] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isVoiceCall, setIsVoiceCall] = useState(false);
  const [lastMessageTime, setLastMessageTime] = useState(0);
  const COOLDOWN_SECONDS = 5;

  const allChats = useMemo(() => {
    const userChats = ALL_DEMO_USERS.map(u => ({ 
      ...u, 
      type: 'user' as const, 
      lastMessage: language === 'RU' ? 'Привет!' : 'Hi!', 
      time: u.id % 2 === 0 ? "10:30" : (language === 'RU' ? 'Вчера' : 'Yesterday') 
    }));

    const groupChats = GROUP_CATEGORIES.flatMap(category => 
      category.subgroups.map(subgroup => ({
        ...subgroup,
        name: language === 'RU' ? subgroup.name_ru : subgroup.name_en,
        id: subgroup.id,
        img: category.img,
        hint: category.hint,
        type: 'group' as const,
        lastMessage: `${subgroup.online} ${t('chats.online')}`,
        time: `${subgroup.members} ${t('chats.members')}`
      }))
    );
    
    return [...userChats, ...groupChats];
  }, [language, t]);

  const filteredChats = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return allChats;
    return allChats.filter(chat => 
      (chat.name && chat.name.toLowerCase().includes(query)) || 
      (chat.name_ru && chat.name_ru.toLowerCase().includes(query)) ||
      (chat.name_en && chat.name_en.toLowerCase().includes(query))
    );
  }, [searchQuery, allChats]);

  const handleReportSubmit = () => {
    if (!reportReason) { toast({ variant: 'destructive', title: t('report.toast.no_reason_title'), description: t('report.toast.no_reason_desc') }); return; }
    toast({ title: t('report.toast.success_title'), description: `${t('report.toast.success_desc')} ${selectedChat.name}.` });
    setIsReportDialogOpen(false); setReportReason(''); setReportDescription('');
  };

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { if (selectedChat) scrollToBottom(); }, [messages, selectedChat]);

  const loadIcebreakers = useCallback(async (chat: any, mood?: string) => {
    if (!aiIcebreakersEnabled) return;
    setLoadingIcebreakers(true);
    try {
      const res = await generateIcebreakerSuggestions({ currentUserInterests: ["Спорт", "Кофе", "Кино"], matchedUserName: chat.name, matchedUserInterests: chat.interests || [], matchedUserBio: chat.bio || "", mood: mood || "Friendly and polite" });
      setIcebreakers(res.suggestions);
    } catch (e) {
      setIcebreakers(language === 'RU' ? ["Привет! Как прошел твой день?", "Чем любишь заниматься в свободное время?", "Какой твой любимый фильм?"] : ["Hi! How was your day?", "What do you like doing in your free time?", "What's your favorite movie?"]);
    } finally {
      setLoadingIcebreakers(false); if (mood) setShowThemeGrid(false);
    }
  }, [aiIcebreakersEnabled, language]);

  useEffect(() => {
    if (matchId) {
      const id = parseInt(matchId);
      const chat = ALL_DEMO_USERS.find(u => u.id === id);
      if (chat) { setSelectedChat({ ...chat, type: 'user' }); setMessages([{ id: Date.now(), text: language === 'RU' ? "Привет! Это совпадение, рад(а) знакомству! 😊" : "Hi! It's a match, glad to meet you! 😊", sender: "me", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]); loadIcebreakers(chat); }
    } else if (groupId) {
        const id = parseInt(groupId);
        let groupData: any = null;
        for (const category of GROUP_CATEGORIES) {
            const foundSubgroup = category.subgroups.find(sg => sg.id === id);
            if (foundSubgroup) {
                groupData = { 
                    ...foundSubgroup, 
                    name: language === 'RU' ? foundSubgroup.name_ru : foundSubgroup.name_en,
                    img: category.img, 
                    hint: category.hint,
                };
                break;
            }
        }

        if (groupData) {
            const chatData = { ...groupData, type: 'group' };
            setSelectedChat(chatData);
            setMessages(INITIAL_GROUP_MESSAGES);
            setIcebreakers([]);
        }
    }
  }, [matchId, groupId, language, loadIcebreakers]);

  const handleSendMessage = (textOverride?: string) => {
    const textToSend = textOverride || inputValue;
    if (!textToSend.trim()) return;

    if (selectedChat?.type === 'group') {
        const now = Date.now();
        if (now - lastMessageTime < COOLDOWN_SECONDS * 1000) {
            toast({
                variant: 'destructive',
                title: t('cooldown.title'),
                description: t('cooldown.description').replace('{seconds}', COOLDOWN_SECONDS.toString()),
            });
            return;
        }
    }

    if (containsForbiddenWords(textToSend)) {
      toast({
        variant: 'destructive',
        title: t('filter.toast.title'),
        description: t('filter.toast.description'),
      });
      return;
    }

    if (isGibberish(textToSend)) {
      toast({
        variant: 'destructive',
        title: t('filter.toast.title'),
        description: t('filter.toast.gibberish_description'),
      });
      return;
    }

    const newMessage = { id: Date.now(), text: textToSend, sender: "me", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages([...messages, newMessage]); if (!textOverride) setInputValue(""); setShowThemeGrid(false);
    
    if (selectedChat?.type === 'group') {
        setLastMessageTime(Date.now());
        setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
                const randomUser = ALL_DEMO_USERS[Math.floor(Math.random() * ALL_DEMO_USERS.length)];
                const response = { id: Date.now() + 1, text: language === 'RU' ? "Интересная мысль!" : "Interesting thought!", sender: "other", senderName: randomUser.name, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }; 
                setMessages(prev => [...prev, response]); 
            }, 1500);
        }, 500);
    } else {
        setTimeout(() => { 
          setIsTyping(true); 
          setTimeout(() => { 
            setIsTyping(false); 
            const text = (language === 'RU' ? "Звучит здорово! Давай это обсудим." : "Sounds great! Let's discuss it.");
            const response = { id: Date.now() + 1, text, sender: "other", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }; 
            setMessages(prev => [...prev, response]); 
          }, 2000); 
        }, 1000);
    }
  };

  const handleLeaveGroup = () => {
    if (!selectedChat || selectedChat.type !== 'group') return;

    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        if (profile.joinedGroups && Array.isArray(profile.joinedGroups)) {
          profile.joinedGroups = profile.joinedGroups.filter(
            (groupName: string) => groupName !== selectedChat.name_ru && groupName !== selectedChat.name_en
          );
          localStorage.setItem('userProfile', JSON.stringify(profile));
        }
      }
    } catch (e) {
      console.error("Failed to update profile after leaving group:", e);
    }
    
    toast({ title: `${t('toast.left_group')} "${selectedChat.name}"` });
    setSelectedChat(null);
  };

  const openChat = (chat: any) => { 
    setSelectedChat(chat);
    if(chat.type === 'group') {
      setMessages(INITIAL_GROUP_MESSAGES);
      setShowThemeGrid(false);
      setIcebreakers([]);
    } else {
      setMessages(INITIAL_MESSAGES);
      setShowThemeGrid(false);
      setIcebreakers([]);
      loadIcebreakers(chat); 
    }
  };

  const handleBack = () => {
    if (matchId || groupId) {
      router.back();
    } else {
      setSelectedChat(null);
    }
  };

  if (selectedChat) {
    const isGroupChat = selectedChat.type === 'group';

    return (
      <div className="flex flex-col h-svh bg-[#f8f9fb]">
        <header className="flex items-center gap-2 px-3 py-2 border-b border-border sticky top-0 bg-white/90 backdrop-blur-lg z-50 h-16">
          <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full hover:bg-muted/50"><ChevronLeft size={24} /></Button>
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden relative border-2 border-white shadow-sm">
              <Image src={selectedChat.img} alt={selectedChat.name || ''} fill sizes="40px" className="object-cover" />
            </div>
            {selectedChat.online && !isGroupChat && <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#2ecc71] border-2 border-white rounded-full shadow-sm"></span>}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-black text-sm leading-tight tracking-tight text-foreground truncate">
                {language === 'RU' ? (selectedChat.name_ru || selectedChat.name) : (selectedChat.name_en || selectedChat.name)}
              </h3>
            </div>
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">
              {isGroupChat ? `${selectedChat.members} ${t('chats.members')}, ${selectedChat.online} ${t('chats.online')}` : (selectedChat.online ? `• ${t('chats.online')}` : t('chats.offline'))}
            </p>
          </div>
          <div className="flex items-center">
            {!isGroupChat && videoCallsEnabled && <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:bg-muted/50" onClick={() => setIsVideoCall(true)}><Video size={18} /></Button>}
            {!isGroupChat && <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:bg-muted/50" onClick={() => setIsVoiceCall(true)}><Phone size={18} /></Button>}
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:bg-muted/50"><MoreVertical size={18} /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-2xl border-0 app-shadow p-1.5 min-w-[160px] bg-white">
                    {isGroupChat ? (
                        <DropdownMenuItem onSelect={handleLeaveGroup} className="rounded-xl font-bold text-[10px] uppercase tracking-wider cursor-pointer py-2 text-destructive focus:text-destructive focus:bg-destructive/10">
                            <LogOut size={14} className="mr-2" />
                            {t('button.leave_group')}
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setIsReportDialogOpen(true); }} className="rounded-xl font-bold text-[10px] uppercase tracking-wider cursor-pointer py-2 text-destructive focus:text-destructive focus:bg-destructive/10">
                            <Flag size={14} className="mr-2" />
                            {t('button.report')}
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 space-y-2"><div className="text-center my-2"><Badge variant="secondary" className="bg-white/50 text-[9px] text-muted-foreground border-0 font-black uppercase tracking-widest px-2.5 py-0.5">{t('chats.today')}</Badge></div><AnimatePresence>{messages.map((msg: any) => (<motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} key={msg.id} className={cn("flex flex-col max-w-[80%]", msg.sender === "me" ? "ml-auto items-end" : "items-start")}><div className={cn("px-3 py-2 rounded-md text-sm shadow-sm font-medium leading-snug", msg.sender === "me" ? "gradient-bg text-white rounded-br-none shadow-primary/10" : "bg-white text-foreground rounded-bl-none border border-border/40")}>{isGroupChat && msg.sender === 'other' && msg.senderName && (<p className="text-xs font-black text-primary/80 mb-1">{msg.senderName}</p>)}{msg.text}</div><span className="text-[9px] text-muted-foreground mt-1.5 px-1 font-bold uppercase tracking-tighter opacity-60">{msg.time}</span></motion.div>))}</AnimatePresence>{isTyping && (<motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1.5 text-muted-foreground"><div className="flex gap-1 bg-white px-3 py-2.5 rounded-md border border-border/40 shadow-sm rounded-bl-none"><span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></span><span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></span><span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]"></span></div><span className="text-[9px] font-bold uppercase tracking-widest">{t('chats.typing')}</span></motion.div>)}<div ref={messagesEndRef} /></main>
        <div className="p-4 bg-white border-t border-border shadow-[0_-10px_40px_-20px_rgba(0,0,0,0.1)] relative z-10">
          {!isGroupChat && aiIcebreakersEnabled && (<><div className="flex items-center justify-between mb-3 px-1"><button onClick={() => setShowThemeGrid(!showThemeGrid)} className={cn("flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] transition-all", showThemeGrid ? "gradient-bg text-white shadow-lg shadow-primary/20" : "bg-primary/5 text-primary border border-primary/10")}> <Sparkles size={14} className={cn(loadingIcebreakers && "animate-spin")} /> {showThemeGrid ? t('chats.close_themes') : t('chats.ai_themes')} </button>{!showThemeGrid && icebreakers.length > 0 && !loadingIcebreakers && (<p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest opacity-40 italic">{language === 'RU' ? 'Листайте →' : 'Swipe →'}</p>)}</div><AnimatePresence>{showThemeGrid && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="grid grid-cols-3 gap-2.5 mb-5 overflow-hidden">{CHAT_THEMES.map((theme) => { const Icon = theme.icon; return (<button key={theme.id} onClick={() => loadIcebreakers(selectedChat, theme.mood)} className="flex flex-col items-center justify-center p-3.5 rounded-md bg-muted/40 border border-border/50 transition-all group active:scale-95"><Icon size={22} className={cn("mb-1.5 group-hover:scale-110", theme.color)} /><span className="text-[9px] font-black uppercase tracking-tighter text-foreground/70">{language === 'RU' ? theme.label_ru : theme.label_en}</span></button>) })}</motion.div>)}</AnimatePresence>{!showThemeGrid && (<div className="flex gap-2.5 overflow-x-auto no-scrollbar mb-5 h-10 items-center px-1">{loadingIcebreakers ? (<div className="flex gap-2"><div className="h-8 w-32 bg-muted animate-pulse rounded-full"></div><div className="h-8 w-28 bg-muted animate-pulse rounded-full"></div></div>) : (icebreakers.map((text, i) => (<button key={i} onClick={() => setInputValue(text)} className="whitespace-nowrap px-4 py-2 bg-white hover:bg-muted transition-all text-[11px] font-bold rounded-full text-foreground/80 border border-border/60 shadow-sm active:scale-95">{text}</button>)))}</div>)}</>)}
          <div className="flex items-center gap-3"><div className="flex-1 relative group"><Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder={t('chats.placeholder')} className="pr-12 h-11 bg-muted/50 border-0 rounded-2xl font-medium px-6 text-sm" /><Popover><PopoverTrigger asChild><button className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"><Smile size={20} /></button></PopoverTrigger><PopoverContent className="w-full max-w-[280px] p-2 rounded-2xl border-0 shadow-2xl bg-white" side="top" align="end"><div className="grid grid-cols-5 gap-1">{QUICK_REACTIONS.map(reaction => { const ReactionIcon = reaction.icon; return (<button key={reaction.id} onClick={() => handleSendMessage(reaction.label)} className="w-10 h-10 flex items-center justify-center hover:bg-muted rounded-xl transition-all active:scale-90"><ReactionIcon size={24} className={reaction.color} /></button>); })}</div></PopoverContent></Popover></div><Button size="icon" onClick={() => handleSendMessage()} disabled={!inputValue.trim()} className="h-11 w-11 rounded-2xl gradient-bg text-white shadow-xl shadow-primary/30 active:scale-95 transition-all"><Send size={18} className="ml-0.5" /></Button></div>
        </div>
        {selectedChat && !isGroupChat && isVideoCall && <VideoCallDialog open={isVideoCall} onOpenChange={setIsVideoCall} user={selectedChat} />}
        {selectedChat && !isGroupChat && isVoiceCall && <VoiceCallDialog open={isVoiceCall} onOpenChange={setIsVoiceCall} user={selectedChat} />}
      </div>
    );
  }

  return (
    <>
      <AppHeader />
      <main className="flex-1 overflow-y-auto px-5 pt-6 pb-24 bg-[#f8f9fb]">
        <div className="flex justify-between items-center mb-6 px-1">
          <div>
            <h2 className="text-2xl font-black font-headline tracking-tight text-foreground">{t('chats.title')}</h2>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-0.5 opacity-60">{t('chats.subtitle')}</p>
          </div>
          <Badge className="gradient-bg text-white rounded-full px-3 py-1 font-black text-[10px] border-0 shadow-lg shadow-primary/20">3 {t('activity.new')}</Badge>
        </div>
        <div className="relative mb-8 px-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={16} />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-white border-0 rounded-2xl app-shadow text-sm font-medium" 
            placeholder={t('chats.search')} 
          />
        </div>
        <div className="space-y-1 px-1">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => {
              if (chat.type === 'group') {
                return (
                  <div key={`group-${chat.id}`} onClick={() => openChat(chat)} className="flex items-center gap-3 p-3 bg-white rounded-2xl app-shadow hover:bg-muted/30 transition-all cursor-pointer group border border-white">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl overflow-hidden relative border-2 border-white shadow-sm transition-transform group-hover:scale-105">
                        <Image src={chat.img} alt={chat.name} fill sizes="48px" data-ai-hint={chat.hint || ''} className="object-cover" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-lg z-20 bg-blue-500">
                          <Users size={10} className="text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-black text-sm text-foreground tracking-tight group-hover:text-primary transition-colors">{chat.name}</span>
                        <span className="text-[10px] text-muted-foreground font-bold opacity-60">{chat.time}</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <p className="text-xs truncate pr-2 font-medium text-muted-foreground opacity-80">{chat.lastMessage}</p>
                      </div>
                    </div>
                  </div>
                )
              }
              
              const hasUnread = chat.id % 3 === 0;
              return (
                <div key={`user-${chat.id}`} onClick={() => openChat(chat)} className={cn(
                  "flex items-center gap-3 p-3 rounded-2xl transition-all cursor-pointer group border border-white",
                  "bg-white app-shadow hover:bg-muted/30"
                )}>
                  <div className="relative flex-shrink-0">
                    <div className={cn(
                      "w-12 h-12 rounded-xl overflow-hidden relative border-2 border-white shadow-sm transition-transform group-hover:scale-105"
                    )}>
                      <Image src={chat.img} alt={chat.name || ''} fill sizes="48px" className="object-cover" />
                    </div>
                    {chat.online && <span className={cn(
                      "absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full shadow-md bg-[#2ecc71]"
                    )}></span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <div className="flex items-center gap-1">
                        <span className="font-black text-sm text-foreground tracking-tight group-hover:text-primary transition-colors">
                          {language === 'RU' ? (chat.name_ru || chat.name) : (chat.name_en || chat.name)}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-bold opacity-60">{chat.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {chat.id % 4 === 0 ? (
                          <CheckCheck size={12} className="text-primary flex-shrink-0" />
                        ) : (
                          <Check size={12} className="text-muted-foreground/40 flex-shrink-0" />
                        )}
                        <p className={cn(
                          "text-xs truncate pr-2 font-medium leading-snug",
                          hasUnread ? "text-foreground font-bold" : "text-muted-foreground opacity-80"
                        )}>
                          {chat.lastMessage}
                        </p>
                      </div>
                      {hasUnread && (
                        <Badge className="h-5 min-w-[20px] px-1.5 gradient-bg text-white border-0 text-[9px] font-black flex items-center justify-center rounded-full scale-90 shadow-lg shadow-primary/20">
                          2
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 opacity-30 flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Info size={24} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest">{t('activity.empty')}</p>
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </>
  );
}

export default function ChatsPage() {
  return (
    <ChatsContent />
  );
}
