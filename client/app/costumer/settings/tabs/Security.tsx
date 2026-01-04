import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Security() {
  return (
    <Card>
      <CardContent className="p-6 space-y-4 max-w-md">
        <h2 className="text-lg font-semibold">Segurança</h2>

        <Input type="password" placeholder="Senha atual" />
        <Input type="password" placeholder="Nova senha" />
        <Input type="password" placeholder="Confirmar nova senha" />

        <Button variant="destructive">Alterar senha</Button>
      </CardContent>
    </Card>
  );
}
