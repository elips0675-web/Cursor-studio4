'use client';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  useSidebar,
} from '@/components/ui/sidebar';
import { LayoutDashboard, Users, Flag, Home, Shield, LogOut, ChevronsLeft, ChevronsRight, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';

export function AdminSidebar() {
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();

  const isActive = (path: string) => pathname === path;

  return (
    <>
        <SidebarHeader className="border-b flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
                <Shield className="h-6 w-6 text-primary" />
                <span className='group-data-[state=collapsed]:hidden'>SwiftMatch</span>
            </Link>
            <Button variant="ghost" size="icon" className="hidden md:flex" onClick={toggleSidebar}>
              {state === 'expanded' ? <ChevronsLeft size={18} /> : <ChevronsRight size={18} />}
            </Button>
        </SidebarHeader>
        <SidebarContent className="p-2">
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        isActive={isActive('/admin')}
                        tooltip="Dashboard"
                    >
                        <Link href="/admin">
                            <LayoutDashboard />
                            <span>Dashboard</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        isActive={isActive('/admin/users')}
                        tooltip="Users"
                    >
                        <Link href="/admin/users">
                            <Users />
                            <span>Users</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        isActive={isActive('/admin/reports')}
                        tooltip="Reports"
                    >
                        <Link href="/admin/reports">
                            <Flag />
                            <span>Reports</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        isActive={isActive('/support-chat')}
                        tooltip="Support Chat"
                    >
                        <Link href="/support-chat">
                            <MessageSquare />
                            <span>Support Chat</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="mt-auto border-t p-2">
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Back to App">
                         <Link href="/">
                            <Home />
                            <span>Back to App</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Logout">
                         <Link href="/login">
                            <LogOut />
                            <span>Logout</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    </>
  );
}
