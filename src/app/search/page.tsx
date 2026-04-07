
"use client";

import { useState, useMemo, useEffect } from "react";
import { X, Heart, Sparkles, Filter, ChevronLeft, ChevronRight, Info } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";
import MatchDialog from "@/components/dialogs/match-dialog";
import SearchLoading from "./loading";

const CARD_SWIPE_THRESHOLD = 100;

export default function SearchPage() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastAction, setLastAction] = useState<"like" | "nope" | null>(null);
  const [matchData, setMatchData] = useState<any>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('authToken');
    if (!token) { return; } // TODO: handle auth redirect

    try {
      const res = await fetch('/api/search/users', { headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
      setCurrentIndex(data.length - 1); // Start from the top of the stack
    } catch (error) {
      console.error(error);
      toast({ title: "Ошибка", description: "Не удалось загрузить пользователей.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAction = async (action: "like" | "nope") => {
    if (currentIndex < 0) return;

    setLastAction(action);
    const userToRate = users[currentIndex];
    
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ to_user_id: userToRate.id, status: action === 'like' ? 'liked' : 'disliked' })
      });

      const result = await res.json();

      if (result.match) {
        setMatchData({ currentUser: { name: "You" }, matchedUser: userToRate });
      }

    } catch (error) {
      console.error("Error processing action:", error);
      toast({ title: "Ошибка", description: "Не удалось выполнить действие.", variant: "destructive" });
      // Revert animation state if needed?
      return; // Prevent advancing the card
    }
    
    // Timeout to allow card swipe-out animation to finish
    setTimeout(() => {
      setCurrentIndex(prev => prev - 1);
      setLastAction(null);
    }, 300);
  };

  const activeUser = useMemo(() => (currentIndex >= 0 && users.length > 0) ? users[currentIndex] : null, [currentIndex, users]);

  if (isLoading) {
    return <SearchLoading />;
  }

  return (
    <>
      <AppHeader />
      <main className="flex-1 flex flex-col justify-between items-center bg-[#f8f9fb] overflow-hidden">
        <div className="w-full flex justify-end px-4 py-2">
          <Button variant="outline" className="rounded-full border-muted bg-white shadow-sm"><Filter size={16} className="mr-2" /> {t('search.filters')}</Button>
        </div>

        <div className="flex-1 w-full max-w-sm flex items-center justify-center relative p-4">
          <AnimatePresence>
            {activeUser ? (
              <motion.div
                key={currentIndex} // Important for re-rendering on index change
                className="absolute w-full h-full max-h-[550px]"
                drag="x"
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                onDragEnd={(event, { offset, velocity }) => {
                  if (offset.x > CARD_SWIPE_THRESHOLD) {
                    handleAction("like");
                  } else if (offset.x < -CARD_SWIPE_THRESHOLD) {
                    handleAction("nope");
                  }
                }}
                animate={{
                  x: lastAction === "like" ? 300 : lastAction === "nope" ? -300 : 0,
                  opacity: lastAction ? 0 : 1,
                  rotate: lastAction === "like" ? 15 : lastAction === "nope" ? -15 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <UserCard user={activeUser} />
              </motion.div>
            ) : (
                <div className="text-center opacity-50 flex flex-col items-center gap-4">
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center"><Info size={40} /></div>
                    <h3 className="font-bold text-lg">{t('search.no_more_users')}</h3>
                    <p className="text-sm text-muted-foreground w-2/3">{t('search.no_more_users_desc')}</p>
                    <Button onClick={fetchUsers} className="mt-4">{t('button.refresh')}</Button>
                </div>
            )}
          </AnimatePresence>
        </div>

        <div className="pb-24 pt-4 flex items-center justify-center gap-4">
          <ActionButton type="nope" onClick={() => handleAction("nope")} />
          <ActionButton type="like" onClick={() => handleAction("like")} />
        </div>

      </main>
      <BottomNav />
      {matchData && (
        <MatchDialog 
          isOpen={!!matchData} 
          onClose={() => setMatchData(null)} 
          currentUser={matchData.currentUser} 
          matchedUser={matchData.matchedUser} 
        />
      )}
    </>
  );
}

function UserCard({ user }: { user: any }) {
  return (
    <div className="w-full h-full rounded-3xl shadow-2xl shadow-primary/10 bg-white cursor-grab active:cursor-grabbing overflow-hidden relative">
      <Image src={user.avatar || "/img/user-fallback.png"} alt={user.name} fill sizes="100vw" className="object-cover pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
        <h2 className="text-white text-3xl font-black tracking-tight">{user.name}, {user.age}</h2>
        <p className="text-white/80 font-medium text-sm mt-1">{user.city || 'Unknown Location'}</p>
      </div>
    </div>
  );
}

function ActionButton({ type, onClick }: { type: 'like' | 'nope', onClick: () => void }) {
  const Icon = type === 'like' ? Heart : X;
  return (
    <Button
      onClick={onClick}
      size="icon"
      className={cn(
        "w-20 h-20 rounded-full shadow-2xl transition-transform active:scale-90",
        type === 'like'
          ? "bg-gradient-to-br from-red-500 to-pink-600 text-white shadow-pink-500/40"
          : "bg-white text-gray-700 shadow-gray-400/20"
      )}
    >
      <Icon size={32} fill={type === 'like' ? 'currentColor' : 'none'} />
    </Button>
  );
}
