import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Flag } from "lucide-react";

export default function AdminReportsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reports</CardTitle>
        <CardDescription>Review user-submitted reports.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-4 text-center h-64 border-2 border-dashed border-muted rounded-lg">
            <Flag className="w-12 h-12 text-muted-foreground"/>
            <p className="text-muted-foreground">No active reports at the moment.</p>
        </div>
      </CardContent>
    </Card>
  );
}
