import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Flag, MoreHorizontal } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

const REPORTS_DATA = [
    {
        id: 1,
        reporter: { name: 'Елена', id: 3 },
        reportedUser: { name: 'Дмитрий', id: 4, img: PlaceHolderImages[3].imageUrl },
        reason: 'Фейковый профиль',
        description: 'Фотографии выглядят неестественно, и профиль пустой.',
        date: '2024-05-20',
        status: 'new'
    },
    {
        id: 2,
        reporter: { name: 'София', id: 5 },
        reportedUser: { name: 'Артем', id: 6, img: PlaceHolderImages[5].imageUrl },
        reason: 'Оскорбительное поведение',
        description: 'Использовал грубые выражения в чате.',
        date: '2024-05-19',
        status: 'resolved'
    },
    {
        id: 3,
        reporter: { name: 'Анна', id: 1 },
        reportedUser: { name: 'Никита', id: 10, img: PlaceHolderImages[9].imageUrl },
        reason: 'Спам',
        description: 'Присылает ссылки на сторонние сайты.',
        date: '2024-05-21',
        status: 'new'
    }
];


export default function AdminReportsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Жалобы</CardTitle>
        <CardDescription>Просмотр и управление жалобами от пользователей.</CardDescription>
      </CardHeader>
      <CardContent>
        {REPORTS_DATA.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Пользователь</TableHead>
                <TableHead className="hidden sm:table-cell">Пожаловался</TableHead>
                <TableHead>Причина</TableHead>
                <TableHead className="hidden md:table-cell">Дата</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>
                  <span className="sr-only">Действия</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {REPORTS_DATA.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                        <Image
                            alt="User avatar"
                            className="aspect-square rounded-full object-cover"
                            height="32"
                            src={report.reportedUser.img}
                            width="32"
                        />
                        <span className="font-medium">{report.reportedUser.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{report.reporter.name}</TableCell>
                  <TableCell>{report.reason}</TableCell>
                  <TableCell className="hidden md:table-cell">{report.date}</TableCell>
                  <TableCell>
                    <Badge variant={report.status === 'new' ? 'destructive' : 'secondary'}>
                      {report.status === 'new' ? 'Новая' : 'Решена'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Действия</DropdownMenuLabel>
                        <DropdownMenuItem>Просмотреть жалобу</DropdownMenuItem>
                        <DropdownMenuItem>Заблокировать</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Удалить пользователя</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 text-center h-64 border-2 border-dashed border-muted rounded-lg">
            <Flag className="w-12 h-12 text-muted-foreground" />
            <p className="text-muted-foreground">На данный момент активных жалоб нет.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
