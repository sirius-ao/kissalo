import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FormEvent, useContext, useState } from "react";
import { UserContext } from "@/context/userContext";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { IUser } from "@/types/interfaces";
import { toast } from "sonner";
import { AuthService } from "@/services/auth/login.service";

export default function PersonalProfile() {
  const context = useContext(UserContext);

  if (!context) return;
  const { user, setUser } = context;
  const [processing, setProcessing] = useState(false);
  const [currentUser, setCurrentUser] = useState<IUser>(user as IUser);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!currentUser) return;
    console.log(currentUser);

    if (
      !currentUser?.email ||
      !currentUser?.firstName ||
      !currentUser?.lastName ||
      !currentUser?.phone
    ) {
      return toast.info("Preenche todos os campos");
    }

    setProcessing(true);
    const token = localStorage.getItem("acess-x-token") as string;

    const sericeApi = new AuthService();
    const dataRes = await sericeApi.updateProfile(token, {
      lastName: currentUser?.lastName,
      firstName: currentUser?.firstName,
      email: currentUser?.email,
      phone: currentUser?.phone,
      avatarUrl: currentUser?.avatarUrl ?? "htps://dd.d",
    });

    if (dataRes?.error) {
      toast.error(dataRes?.message ?? "Erro ao actualizar o perfil");
    } else {
      setUser(currentUser);
      toast.success("Perfil actualizado");
    }
    console.log(dataRes);
    setProcessing(false);
  }
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <form onSubmit={submit}>
          <h2 className="text-lg font-semibold">Perfil pessoal</h2>

          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={currentUser?.avatarUrl ?? "d"} />
              <AvatarFallback className="uppercase">
                {currentUser &&
                  currentUser?.firstName.charAt(0) +
                    currentUser?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <Button variant="outline">Alterar foto</Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Label>Nome</Label>
            <Input
              placeholder="Nome"
              onChange={(e) => {
                if (currentUser) {
                  setCurrentUser(() => ({
                    ...currentUser,
                    firstName: e.target.value,
                  }));
                }
              }}
              value={currentUser?.firstName}
            />
            <Label>Sobrenome</Label>
            <Input
              placeholder="Sobrenome"
              onChange={(e) => {
                if (currentUser) {
                  setCurrentUser(() => ({
                    ...currentUser,
                    lastName: e.target.value,
                  }));
                }
              }}
              value={currentUser?.lastName}
            />
            <Label>Email</Label>
            <Input
              onChange={(e) => {
                if (currentUser) {
                  setCurrentUser(() => ({
                    ...currentUser,
                    email: e.target.value,
                  }));
                }
              }}
              placeholder="Email"
              value={currentUser?.email}
            />
            <Label>Celular</Label>
            <Input
              onChange={(e) => {
                if (currentUser) {
                  setCurrentUser(() => ({
                    ...currentUser,
                    phone: e.target.value,
                  }));
                }
              }}
              placeholder="Telefone"
              value={currentUser?.phone}
            />
          </div>

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
