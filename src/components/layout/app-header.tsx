
"use client";

import { Bell, SlidersHorizontal, Languages } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/context/language-context";
import { toast } from "@/hooks/use-toast";

export function AppHeader() {
  const { language, setLanguage } = useLanguage();

  const handleLangChange = (newLang: 'RU' | 'EN') => {
    setLanguage(newLang);
    toast({
      title: newLang === "RU" ? "Язык изменен" : "Language changed",
      description: newLang === "RU" ? "Выбран русский язык" : "English language selected",
    });
  };

  return (
    <header className="sticky top-0 w-full bg-white border-b border-border px-5 py-4 flex justify-between items-center z-40">
      <Link href="/">
        <h1 className="text-2xl font-black font-headline gradient-text cursor-pointer">
          SwiftMatch
        </h1>
      </Link>
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-10 px-3 rounded-full bg-[#f5f7fa] flex items-center justify-center text-foreground hover:bg-border transition-all active:scale-95 gap-1.5 border border-transparent hover:border-border/50">
              <Languages size={16} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-tight">{language}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-[1.5rem] border-0 app-shadow p-2 min-w-[120px] bg-white z-50">
            <DropdownMenuItem 
              onClick={() => handleLangChange("RU")}
              className="rounded-xl font-bold text-[11px] uppercase tracking-wider cursor-pointer focus:bg-primary/5 focus:text-primary py-2.5"
            >
              Русский (RU)
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleLangChange("EN")}
              className="rounded-xl font-bold text-[11px] uppercase tracking-wider cursor-pointer focus:bg-primary/5 focus:text-primary py-2.5"
            >
              English (EN)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button className="w-10 h-10 rounded-full bg-[#f5f7fa] flex items-center justify-center text-foreground hover:bg-border transition-all active:scale-95">
          <SlidersHorizontal size={18} />
        </button>
        <button className="w-10 h-10 rounded-full bg-[#f5f7fa] flex items-center justify-center text-foreground hover:bg-border transition-all active:scale-95">
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
}
