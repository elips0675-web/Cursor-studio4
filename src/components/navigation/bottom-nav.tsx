"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Главная", icon: Home },
    { href: "/search", label: "Поиск", icon: Search },
    { href: "/chats", label: "Чаты", icon: MessageCircle, badge: 2 },
    { href: "/profile", label: "Профиль", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white/95 backdrop-blur-md border-t border-border flex justify-around items-center px-2 pt-2 safe-pb z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 flex-1 py-1 transition-all duration-200",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className="relative">
              <Icon size={isActive ? 24 : 22} className={cn(isActive && "translate-y-[-2px]")} />
              {item.badge && (
                <span className="absolute -top-1 -right-2 min-w-[16px] h-[16px] bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
