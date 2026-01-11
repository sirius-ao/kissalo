import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useContext } from "react";
import { UserContext } from "@/context/userContext";
import { Label } from "@/components/ui/label";

export default function PersonalProfile() {
  const context = useContext(UserContext);

  if (!context) return;
  const { user } = context;
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">Perfil pessoal</h2>

        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.avatarUrl ?? "d"} />
            <AvatarFallback>FP</AvatarFallback>
          </Avatar>

          <Button variant="outline">Alterar foto</Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Label>Nome</Label>
          <Input placeholder="Nome" defaultValue={user?.firstName} />
          <Label>Sobrenome</Label>
          <Input placeholder="Sobrenome" defaultValue={user?.lastName} />
          <Label>Email</Label>
          <Input placeholder="Email" defaultValue={user?.email} />
          <Label>Celular</Label>
          <Input placeholder="Telefone" defaultValue={user?.phone} />
        </div>

        <Button className="mt-4">Salvar alterações</Button>
      </CardContent>
    </Card>
  );
}
