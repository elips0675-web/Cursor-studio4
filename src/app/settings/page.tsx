"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Bell, 
  Search, 
  EyeOff, 
  ShieldCheck, 
  LogOut, 
  Trash2,
  MapPin,
  MessageSquare,
  ChevronRight
} from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";

export default function SettingsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [settings, setSettings] = useState({
    notifications: true,
    discovery: true,
    incognito: false,
    smartPhotos: true,
    security: true,
    location: true,
    photoVerification: true
  });

  const handleLogout = () => {
    toast({
      title: t('logout.title') || "Вы вышли из системы",
    });
    router.push("/login");
  };

  return (
    <div className="flex flex-col min-h-svh bg-white">
      <AppHeader />
      
      <main className="flex-1 overflow-y-auto p-6 flex flex-col">
        <div className="space-y-6 flex-1">
          <section className="space-y-4">
            <h5 className="text-[10px] font-black uppercase tracking-[2px] text-muted-foreground">{t('settings.account') || 'Аккаунт'}</h5>
            <div className="space-y-1">
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Bell size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{t('settings.notifications') || 'Уведомления'}</p>
                  </div>
                </div>
                <Switch checked={settings.notifications} onCheckedChange={(val) => setSettings({...settings, notifications: val})} />
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{t('settings.location') || 'Геолокация'}</p>
                  </div>
                </div>
                <Switch checked={settings.location} onCheckedChange={(val) => setSettings({...settings, location: val})} />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Search size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{t('settings.discovery') || 'Показывать меня'}</p>
                  </div>
                </div>
                <Switch checked={settings.discovery} onCheckedChange={(val) => setSettings({...settings, discovery: val})} />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h5 className="text-[10px] font-black uppercase tracking-[2px] text-muted-foreground">{t('settings.privacy') || 'Приватность'}</h5>
            <div className="space-y-1">
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                    <EyeOff size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{t('settings.incognito') || 'Инкогнито'}</p>
                  </div>
                </div>
                <Switch checked={settings.incognito} onCheckedChange={(val) => setSettings({...settings, incognito: val})} />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{t('settings.security') || 'Безопасность'}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] text-primary border-primary/20">{t('settings.security.status') || 'OK'}</Badge>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h5 className="text-[10px] font-black uppercase tracking-[2px] text-muted-foreground">{t('settings.support') || 'Поддержка'}</h5>
            <div className="space-y-1">
              <div className="flex items-center justify-between py-3 border-b border-border/50 cursor-pointer hover:bg-muted/30 -mx-6 px-6 transition-colors" onClick={() => router.push('/support-chat')}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{t('settings.support.chat_title') || 'Написать в поддержку'}</p>
                    <p className="text-xs text-muted-foreground">{t('settings.support.chat_desc') || 'Чат с нашей командой'}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </div>
            </div>
          </section>

        </div>

        <div className="space-y-3 pt-8 mt-auto">
            <Button 
                onClick={handleLogout}
                className="w-full h-12 rounded-full gradient-bg text-white font-black uppercase tracking-wider shadow-lg shadow-primary/20 active:scale-95 transition-all border-0">
                <LogOut size={16} className="mr-2" /> {t('logout.button') || 'Выйти'}
            </Button>
            <Button 
                variant="ghost" 
                className="w-full justify-center text-muted-foreground/60 hover:text-destructive text-xs font-normal h-auto py-3 gap-2 px-0 transition-colors">
                <Trash2 size={14} /> {t('delete_profile.button') || 'Удалить профиль'}
            </Button>
        </div>
      </main>
    </div>
  );
}
