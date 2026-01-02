import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ProfessionalProfile() {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Perfil profissional</h2>
          <Badge variant="outline">Verificado</Badge>
        </div>

        <Input placeholder="Título profissional" />
        <Textarea placeholder="Descrição dos serviços" />

        <Input placeholder="Anos de experiência" type="number" />
        <Input placeholder="Portfólio (URL)" />

        <Button>Atualizar perfil profissional</Button>
      </CardContent>
    </Card>
  );
}
