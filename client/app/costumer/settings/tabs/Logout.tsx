import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LogoutTab() {
  return (
    <Card className="border-red-500">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-lg font-semibold text-red-500">Encerrar sessão</h2>

        <p className="text-sm text-muted-foreground">
          Tens certeza que desejas sair da tua conta?
        </p>

        <Button variant="destructive">Logout</Button>
      </CardContent>
    </Card>
  );
}
