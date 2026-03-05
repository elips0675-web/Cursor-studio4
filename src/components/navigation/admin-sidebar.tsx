'use client';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from '@/components/ui/sidebar';
import { LayoutDashboard, Users, Flag, Settings, LogOut, Home, Shield } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <>
        <SidebarHeader className="border-b">
            <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
                <Shield className="h-6 w-6 text-primary" />
                <span>SwiftMatch</span>
            </Link>
        </SidebarHeader>
        <SidebarContent className="p-2">
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        isActive={isActive('/admin')}
                    >
                        <Link href="/admin">
                            <LayoutDashboard />
                            Dashboard
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        isActive={isActive('/admin/users')}
                    >
                        <Link href="/admin/users">
                            <Users />
                            Users
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        isActive={isActive('/admin/reports')}
                    >
                        <Link href="/admin/reports">
                            <Flag />
                            Reports
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="mt-auto border-t p-2">
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                         <Link href="/">
                            <Home />
                            Back to App
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                         <Link href="/login">
                            <LogOut />
                            Logout
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    </>
  );
}
