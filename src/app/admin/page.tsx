
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, UserCheck, UserPlus, Heart } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function AdminDashboardPage() {
  const { t } = useLanguage();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t('admin.total_users')}</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-black tracking-tighter">10,234</div>
          <p className="text-[10px] text-muted-foreground font-bold mt-1">+20.1% from last month</p>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t('admin.online_users')}</CardTitle>
          <UserCheck className="h-4 w-4 text-[#2ecc71]" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-black tracking-tighter">1,257</div>
          <p className="text-[10px] text-muted-foreground font-bold mt-1">Currently active</p>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t('admin.new_users')}</CardTitle>
          <UserPlus className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-black tracking-tighter">+128</div>
          <p className="text-[10px] text-muted-foreground font-bold mt-1">+15% since yesterday</p>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t('admin.total_matches')}</CardTitle>
          <Heart className="h-4 w-4 text-primary" fill="currentColor" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-black tracking-tighter">23,489</div>
          <p className="text-[10px] text-muted-foreground font-bold mt-1">+19.2% from last month</p>
        </CardContent>
      </Card>
    </div>
  );
}
