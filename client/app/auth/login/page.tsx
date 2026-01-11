"use client";

import emailImg from "@/assets/images/email.png";
import lockImg from "@/assets/images/lock.png";
import Image from "next/image";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormEvent, useEffect, useState } from "react";
import { AuthService } from "@/services/auth/login.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validate() {
    if (!email) return "O email é obrigatório";
    if (!email.includes("@")) return "Email inválido";
    if (!password) return "A senha é obrigatória";
    if (password.length < 6) return "A senha deve ter no mínimo 6 caracteres";
    return null;
  }

  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    const service = new AuthService();
    const response = await service.login(email, password);
    toast.info(response?.message);
    if (!response?.error && response?.user) {
      router.push(`/${String(response?.user?.role).toLocaleLowerCase()}`);
      localStorage.setItem("acess-x-token", response?.token);
    }
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex justify-center items-center flex-col gap-4"
    >
      <span className="flex flex-col md:w-[50%] w-[90%] gap-4">
        <h1 className="text-3xl text-center font-bold">Bem vindo de volta</h1>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <Label className="text-lg font-medium">Email</Label>
        <InputGroup>
          <InputGroupInput
            placeholder="seu email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputGroupAddon>
            <Image src={emailImg} alt="email" />
          </InputGroupAddon>
        </InputGroup>

        <Label className="text-lg font-medium">Senha</Label>
        <InputGroup>
          <InputGroupInput
            placeholder="********"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputGroupAddon>
            <Image src={lockImg} alt="lock" />
          </InputGroupAddon>
          <InputGroupAddon
            align="inline-end"
            className="cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </InputGroupAddon>
        </InputGroup>

        <a
          href="/auth/recovery"
          className="text-end text-sm text-blue-400 hover:underline"
        >
          Esqueceu sua senha?
        </a>

        <Button
          size="lg"
          variant="destructive"
          type="submit"
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" /> : "Acessar"}
        </Button>

        <p className="text-center text-sm">
          Ainda não tem uma conta?{" "}
          <a href="/auth/singin" className="text-orange-600 underline">
            criar
          </a>
        </p>
      </span>
    </form>
  );
}
