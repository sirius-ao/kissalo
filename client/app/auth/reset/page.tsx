"use client";

import lock from "@/assets/images/lock.png";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthService } from "@/services/auth/login.service";
import { toast } from "sonner";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!token) {
      router.push("/auth/login");
      return;
    }

    // 🔥 aqui tu validas o token (API)
    console.log("TOKEN:", token);

    // exemplo:
    // authService.validateResetToken(token)
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.info("As senhas não coincidem");
      return;
    }

    console.log({
      token,
      password,
    });
    if (!token) {
      router.push("/auth/login");
      return;
    }
    const service = new AuthService();
    setLoading(true);
    const response = await service.resetPassFromToken(token, password);
    toast.info(response?.message ?? "Senha redefinida");
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex justify-center items-center flex-col gap-4"
    >
      <span className="flex flex-col md:w-[50%] w-[50%] gap-4">
        <h1 className="text-3xl text-center font-bold">Alterar sua senha</h1>
        <Label className="text-lg font-medium">Nova senha</Label>
        <InputGroup>
          <InputGroupAddon>
            <Image src={lock} alt="lock" />
          </InputGroupAddon>

          <InputGroupInput
            placeholder="Sua nova senha"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <InputGroupAddon
            align="inline-end"
            className="cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </InputGroupAddon>
        </InputGroup>
        <Label className="text-lg font-medium">Confirme a senha</Label>
        <InputGroup>
          <InputGroupAddon>
            <Image src={lock} alt="lock" />
          </InputGroupAddon>

          <InputGroupInput
            placeholder="Confirme a senha"
            type={showPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <InputGroupAddon
            align="inline-end"
            className="cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </InputGroupAddon>
        </InputGroup>
        <div className="grid md:grid-cols-2 gap-3">
          <Button
            size="lg"
            variant="destructive"
            type="submit"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Alterar senha"}
          </Button>
          <a href="/auth/recovery" className="text-orange-600 underline w-full">
            <Button type="button" className="w-full">
              {" "}
              Solicitar
            </Button>
          </a>
        </div>
        <p className="text-center text-sm">
          Acessar conta{" "}
          <a href="/auth/singin" className="text-orange-600 underline">
            Criar
          </a>
        </p>{" "}
      </span>
    </form>
  );
}
