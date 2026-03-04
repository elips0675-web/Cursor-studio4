
"use client";

import { Bell, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

export function AppHeader() {
  return (
    <header className="sticky top-0 w-full bg-white border-b border-border px-5 py-4 flex justify-between items-center z-40">
      <Link href="/">
        <h1 className="text-2xl font-black font-headline gradient-text cursor-pointer">
          SwiftMatch
        </h1>
      </Link>
      <div className="flex gap-2">
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
