
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  Bell, 
  Search, 
  EyeOff, 
  ShieldCheck, 
  LogOut, 
  Trash2,
  Lock,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    notifications: true,
    discovery: true,
    incognito: false,
    smartPhotos: true,
    security: true,
    location: true
  });

  const handleSave = () => {
    toast({
      title: "Настройки сохранены",
      description: "Ваши предпочтения успешно обновлены.",
    });
    router.back();
  };

  return (
    <div className="flex flex-col min-h-svh bg-white">
      <header className="flex items-center gap-3 px-4 py-4 border-b border-border sticky top-0 bg-white z-10">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ChevronLeft size={24} />
        </Button>
        <h1 className="text-xl font-bold font-headline">Настройки</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="space-y-6">
          <section className="space-y-4">
            <h5 className="text-[10px] font-black uppercase tracking-[2px] text-muted-foreground">Аккаунт</h5>
            <div className="space-y-1">
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Bell size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Уведомления</p>
                    <p className="text-[10px] text-muted-foreground">Мэтчи, сообщения, лайки</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.notifications} 
                  onCheckedChange={(val) => setSettings({...settings, notifications: val})} 
                />
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Геолокация</p>
                    <p className="text-[10px] text-muted-foreground">Использовать текущее местоположение</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.location} 
                  onCheckedChange={(val) => setSettings({...settings, location: val})} 
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Search size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Показывать меня</p>
                    <p className="text-[10px] text-muted-foreground">Ваш профиль в поиске</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.discovery} 
                  onCheckedChange={(val) => setSettings({...settings, discovery: val})} 
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h5 className="text-[10px] font-black uppercase tracking-[2px] text-muted-foreground">Приватность</h5>
            <div className="space-y-1">
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                    <EyeOff size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Инкогнито</p>
                    <p className="text-[10px] text-muted-foreground">Скрывать посещения</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.incognito} 
                  onCheckedChange={(val) => setSettings({...settings, incognito: val})} 
                />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Безопасность</p>
                    <p className="text-[10px] text-muted-foreground">Верификация профиля</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] text-primary border-primary/20">OK</Badge>
              </div>
            </div>
          </section>

          <section className="space-y-2 pt-4">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground font-semibold h-12 gap-3 px-0">
              <LogOut size={18} /> Выйти из аккаунта
            </Button>
            <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive/80 font-semibold h-12 gap-3 px-0">
              <Trash2 size={18} /> Удалить профиль
            </Button>
          </section>
        </div>

        <div className="pt-6">
          <Button onClick={handleSave} className="w-full h-14 rounded-full gradient-bg text-white font-bold shadow-xl shadow-primary/20 active:scale-[0.98] transition-all">
            Сохранить настройки
          </Button>
        </div>
      </main>
    </div>
  );
}
