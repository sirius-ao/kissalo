import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormEvent, useState } from "react";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { AuthService } from "@/services/auth/login.service";

export default function Security() {
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [processing, setProcessing] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!oldPassword || !password) {
      return toast.info("Preenche todos os campos");
    }

    setProcessing(true);
    const token = localStorage.getItem("acess-x-token") as string;

    const sericeApi = new AuthService();
    const dataRes = await sericeApi.updateCredentials(token, {
      password,
      oldPassword,
    });

    if (dataRes?.error) {
      toast.error(dataRes?.message ?? "Erro ao actualizar o perfil");
    } else {
      toast.success("Perfil actualizado");
    }
    console.log(dataRes);
    setProcessing(false);
  }
  return (
    <Card>
      <CardContent className="p-6 space-y-">
        <form onSubmit={submit} className="flex flex-col gap-2 w-full">
          <h2 className="text-lg font-semibold">Segurança</h2>
          <span className="grid lg:grid-cols-2 mt-5 gap-4 w-full">
            <div className="flex flex-col gap-3">
              <strong>Senha nova</strong>
              <Input
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required
                type={showPassword ? "text" : "password"}
                placeholder="Senha atual"
              />
            </div>
            <div className="flex flex-col gap-3">
              <strong>Senha actual</strong>
              <Input
                onChange={(e) => {
                  setOldPassword(e.target.value);
                }}
                required
                type={showPassword ? "text" : "password"}
                placeholder="Nova senha"
              />
            </div>
          </span>

          <span className="flex items-center gap-2">
            <Checkbox
              checked={showPassword}
              onCheckedChange={(e) => {
                setShowPassword((prev) => !prev);
              }}
            />
            Ver senha
          </span>
          <Button type="submit" disabled={processing} className="mt-4">
            {processing ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Salvar alterações"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
