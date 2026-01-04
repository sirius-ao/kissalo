import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function PersonalProfile() {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">Perfil pessoal</h2>

        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="https://i.pravatar.cc/300" />
            <AvatarFallback>FP</AvatarFallback>
          </Avatar>

          <Button variant="outline">Alterar foto</Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input placeholder="Nome" />
          <Input placeholder="Sobrenome" />
          <Input placeholder="Email" />
          <Input placeholder="Telefone" />
        </div>

        <Button className="mt-4">Salvar alterações</Button>
      </CardContent>
    </Card>
  );
}
