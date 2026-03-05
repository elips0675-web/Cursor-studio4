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

const ADMIN_USERS_DATA = [
    { id: 1, name: 'Анна', age: 24, img: PlaceHolderImages[0].imageUrl, email: 'anna@example.com', online: true, city: 'Москва', joined: '2024-05-01' },
    { id: 2, name: 'Максим', age: 28, img: PlaceHolderImages[1].imageUrl, email: 'maxim@example.com', online: true, city: 'Питер', joined: '2024-05-02' },
    { id: 3, name: 'Елена', age: 26, img: PlaceHolderImages[2].imageUrl, email: 'elena@example.com', online: false, city: 'Москва', joined: '2024-04-28' },
    { id: 4, name: 'Дмитрий', age: 31, img: PlaceHolderImages[3].imageUrl, email: 'dmitry@example.com', online: false, city: 'Казань', joined: '2024-04-25' },
    { id: 5, name: 'София', age: 22, img: PlaceHolderImages[4].imageUrl, email: 'sophia@example.com', online: true, city: 'Москва', joined: '2024-05-05' },
    { id: 6, name: 'Артем', age: 25, img: PlaceHolderImages[5].imageUrl, email: 'artem@example.com', online: true, city: 'Питер', joined: '2024-05-04' },
    { id: 7, name: 'Мария', age: 29, img: PlaceHolderImages[6].imageUrl, email: 'maria@example.com', online: true, city: 'Москва', joined: '2024-05-03' },
];

export default function AdminUsersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>Manage all users in the system.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">City</TableHead>
              <TableHead className="hidden md:table-cell">Joined</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ADMIN_USERS_DATA.map(user => (
              <TableRow key={user.id}>
                <TableCell className="hidden sm:table-cell">
                  <Image
                    alt="User avatar"
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={user.img}
                    width="64"
                  />
                </TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.online ? "default" : "outline"} className={user.online ? "bg-green-500 hover:bg-green-600 text-white border-transparent" : ""}>
                    {user.online ? "Online" : "Offline"}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{user.city}</TableCell>
                <TableCell className="hidden md:table-cell">{user.joined}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-7</strong> of <strong>{ADMIN_USERS_DATA.length}</strong> users
        </div>
      </CardFooter>
    </Card>
  );
}
