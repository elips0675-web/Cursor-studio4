
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { 
  ChevronLeft, Send, MoreVertical, Sparkles, Smile, Heart, Laugh, Compass, Coffee, Zap, MessageSquareQuote, Flame, Star, Ghost, Rocket, Crown, Music, Phone, Video, Flag, Check, CheckCheck 
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { generateIcebreakerSuggestions } from "@/ai/flows/ai-chat-icebreaker-suggestions";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/language-context";
import { toast } from "@/hooks/use-toast";
import { useFeatureFlags } from "@/context/feature-flags-context";
import { Skeleton } from "@/components/ui/skeleton";

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
];

function ChatRoomSkeleton() {
    return (
      <div className="flex flex-col h-svh bg-[#f8f9fb]">
        <header className="flex items-center gap-2 px-3 py-2 border-b border-border sticky top-0 bg-white/90 backdrop-blur-lg z-50 h-16">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="w-10 h-10 rounded-full bg-muted" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="w-8 h-8 rounded-full" />
        </header>
        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          <Skeleton className="h-10 w-3/4 rounded-lg self-start" />
          <Skeleton className="h-12 w-1/2 rounded-lg self-end" />
          <Skeleton className="h-8 w-2/3 rounded-lg self-start" />
          <Skeleton className="h-10 w-3/4 rounded-lg self-end" />
        </main>
        <div className="p-4 bg-white border-t">
            <Skeleton className="h-11 w-full rounded-2xl" />
        </div>
      </div>
    );
}


export default function ChatPage({ params }: { params: { chatId: string } }) {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { videoCallsEnabled, aiIcebreakersEnabled } = useFeatureFlags();

  const [chatPartner, setChatPartner] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    const fetchChatData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const [messagesRes, chatsRes] = await Promise.all([
          fetch(`/api/chats/${params.chatId}/messages`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/chats', { headers: { 'Authorization': `Bearer ${token}` } }),
        ]);

        if (!messagesRes.ok || !chatsRes.ok) {
          throw new Error('Failed to fetch chat data');
        }

        const messagesData = await messagesRes.json();
        const chatsData = await chatsRes.json();

        setMessages(messagesData);
        const partner = chatsData.find((c: any) => c.chat_id.toString() === params.chatId);
        setChatPartner(partner);

      } catch (error) {
        console.error("Fetch chat data error:", error);
        toast({ title: "Ошибка", description: "Не удалось загрузить данные чата.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    if (params.chatId) {
      fetchChatData();
    }
  }, [params.chatId, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (textOverride?: string) => {
    const textToSend = textOverride || inputValue;
    if (!textToSend.trim() || isSending) return;

    setIsSending(true);
    const token = localStorage.getItem('authToken');
    
    // Optimistic UI update
    const tempId = Date.now();
    const newMessage = { id: tempId, content: textToSend, sender_id: "me", created_at: new Date().toISOString() };
    setMessages(prev => [...prev, newMessage]);
    if (!textOverride) setInputValue("");

    try {
      const response = await fetch(`/api/chats/${params.chatId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: textToSend }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const savedMessage = await response.json();
      // Replace temporary message with confirmed one from server
      setMessages(prev => prev.map(m => m.id === tempId ? savedMessage : m));

    } catch (error) {
      console.error("Send message error:", error);
      toast({ title: "Ошибка", description: "Не удалось отправить сообщение.", variant: "destructive" });
      // Revert optimistic update
      setMessages(prev => prev.filter(m => m.id !== tempId));
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return <ChatRoomSkeleton />
  }
  
  if (!chatPartner) {
    // TODO: Show a better not found state
    return <div>Чат не найден</div>
  }

  return (
    <div className="flex flex-col h-svh bg-[#f8f9fb]">
      <header className="flex items-center gap-2 px-3 py-2 border-b border-border sticky top-0 bg-white/90 backdrop-blur-lg z-50 h-16">
        <Button variant="ghost" size="icon" onClick={() => router.push('/chats')} className="rounded-full hover:bg-muted/50"><ChevronLeft size={24} /></Button>
        <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden relative border-2 border-white shadow-sm bg-muted flex items-center justify-center">
               <Image src={chatPartner.avatar || '/demo/people/ivan.png'} alt={chatPartner.name || ''} fill sizes="40px" className="object-cover" />
            </div>
        </div>
        <div className="flex-1 min-w-0">
            <h3 className="font-black text-sm leading-tight tracking-tight text-foreground truncate">{chatPartner.name}</h3>
        </div>
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:bg-muted/50"><MoreVertical size={18} /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl border-0 app-shadow p-1.5 min-w-[160px] bg-white">
                <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setIsReportDialogOpen(true); }} className="rounded-xl font-bold text-[10px] uppercase tracking-wider cursor-pointer py-2 text-destructive focus:text-destructive focus:bg-destructive/10">
                    <Flag size={14} className="mr-2" /> {t('button.report')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="text-center my-2"><Badge variant="secondary" className="bg-white/50 text-[9px] text-muted-foreground border-0 font-black uppercase tracking-widest px-2.5 py-0.5">{t('chats.today')}</Badge></div>
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div 
              key={msg.id} 
              layout
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              className={cn("flex flex-col max-w-[80%]", msg.sender_id !== chatPartner.user_id ? "ml-auto items-end" : "items-start")} >
              <div className={cn("px-3 py-2 rounded-lg text-sm shadow-sm font-medium leading-snug", msg.sender_id !== chatPartner.user_id ? "gradient-bg text-white rounded-br-none shadow-primary/10" : "bg-white text-foreground rounded-bl-none border border-border/40")}>
                {msg.content}
              </div>
              <span className="text-[9px] text-muted-foreground mt-1.5 px-1 font-bold uppercase tracking-tighter opacity-60">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </main>
      <div className="p-4 bg-white border-t border-border shadow-[0_-10px_40px_-20px_rgba(0,0,0,0.1)] relative z-10">
         <div className="flex items-center gap-3">
          <div className="flex-1 relative group">
            <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder={t('chats.placeholder')} className="pr-12 h-11 bg-muted/50 border-0 rounded-2xl font-medium px-6 text-sm" />
            <Popover>
              <PopoverTrigger asChild><button className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"><Smile size={20} /></button></PopoverTrigger>
              <PopoverContent className="w-full max-w-[280px] p-2 rounded-2xl border-0 shadow-2xl bg-white" side="top" align="end">
                <div className="grid grid-cols-5 gap-1">{QUICK_REACTIONS.map(reaction => { const ReactionIcon = reaction.icon; return (<button key={reaction.id} onClick={() => handleSendMessage(reaction.label)} className="w-10 h-10 flex items-center justify-center hover:bg-muted rounded-xl transition-all active:scale-90"><ReactionIcon size={24} className={reaction.color} /></button>); })}</div>
              </PopoverContent>
            </Popover>
          </div>
          <Button size="icon" onClick={() => handleSendMessage()} disabled={!inputValue.trim() || isSending} className="h-11 w-11 rounded-2xl gradient-bg text-white shadow-xl shadow-primary/30 active:scale-95 transition-all">
            <Send size={18} className="ml-0.5" />
          </Button>
        </div>
      </div>
      {/* Report Dialog can be added here */}
    </div>
  );
}
