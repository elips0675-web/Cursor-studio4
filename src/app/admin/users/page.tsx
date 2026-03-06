
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";

const INITIAL_USERS = [
    { id: 1, name: 'Анна', age: 24, img: PlaceHolderImages[0].imageUrl, email: 'anna@example.com', online: true, city: 'Москва', joined: '2024-05-01' },
    { id: 2, name: 'Максим', age: 28, img: PlaceHolderImages[1].imageUrl, email: 'maxim@example.com', online: true, city: 'Питер', joined: '2024-05-02' },
    { id: 3, name: 'Елена', age: 26, img: PlaceHolderImages[2].imageUrl, email: 'elena@example.com', online: false, city: 'Москва', joined: '2024-04-28' },
    { id: 4, name: 'Дмитрий', age: 31, img: PlaceHolderImages[3].imageUrl, email: 'dmitry@example.com', online: false, city: 'Казань', joined: '2024-04-25' },
    { id: 5, name: 'София', age: 22, img: PlaceHolderImages[4].imageUrl, email: 'sophia@example.com', online: true, city: 'Москва', joined: '2024-05-05' },
    { id: 6, name: 'Артем', age: 25, img: PlaceHolderImages[5].imageUrl, email: 'artem@example.com', online: true, city: 'Питер', joined: '2024-05-04' },
    { id: 7, name: 'Мария', age: 29, img: PlaceHolderImages[6].imageUrl, email: 'maria@example.com', online: true, city: 'Москва', joined: '2024-05-03' },
];

export default function AdminUsersPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [users, setUsers] = useState(INITIAL_USERS);

  const handleDeleteUser = (userId: number, userName: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    toast({
      variant: "destructive",
      title: language === 'RU' ? "Пользователь удален" : "User deleted",
      description: `${userName} ${language === 'RU' ? 'был удален из системы' : 'has been removed'}.`,
    });
  };

  const usersList = useMemo(() => users, [users]);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-black">{t('admin.users')}</CardTitle>
        <CardDescription>{t('admin.manage_users')}</CardDescription>
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[80px] sm:table-cell">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead>{t('admin.status')}</TableHead>
              <TableHead className="hidden md:table-cell">{t('admin.city')}</TableHead>
              <TableHead className="hidden md:table-cell">{t('admin.joined')}</TableHead>
              <TableHead className="text-right">{t('admin.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersList.map(user => (
              <TableRow key={user.id} className="group transition-colors">
                <TableCell className="hidden sm:table-cell">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border">
                    <Image
                      alt={user.name}
                      src={user.img}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-bold">{user.name}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground text-xs">{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.online ? "default" : "outline"} className={user.online ? "bg-[#2ecc71] hover:bg-[#27ae60] text-white border-transparent text-[10px]" : "text-[10px]"}>
                    {user.online ? "Online" : "Offline"}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell text-xs">{user.city}</TableCell>
                <TableCell className="hidden md:table-cell text-xs opacity-60">{user.joined}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuLabel>{t('admin.actions')}</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => router.push(`/user?id=${user.id}`)}>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteUser(user.id, user.name)} className="text-destructive focus:text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="bg-muted/5 border-t">
        <div className="text-[10px] uppercase font-black tracking-widest text-muted-foreground py-2">
          Total: <strong>{usersList.length}</strong> users
        </div>
      </CardFooter>
    </Card>
  );
}
