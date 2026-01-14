"use client";
import emailImg from "@/assets/images/email.png";
import Image from "next/image";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormEvent, useState } from "react";
import { AuthService } from "@/services/auth/login.service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
export default function Login() {
  const [email, setEmail] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  function validate() {
    if (!email) return "O email é obrigatório";
    if (!email.includes("@")) return "Email inválido";
    return null;
  }

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
    const response = await service.requestForRecovery(email);
    toast.info(response?.message);
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex justify-center items-center flex-col gap-4"
    >
      <span className="flex flex-col md:w-[50%] w-[50%] gap-4">
        <h1 className="text-3xl text-center font-bold">Recupere sua conta</h1>
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
        <Button
          size="lg"
          variant="destructive"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            " Enviar recuperador"
          )}
        </Button>
        <p className="text-center text-sm">
          Ainda não tem uma conta?{"  "}
          <a href="/auth/singin" className="text-orange-600 underline">
            criar
          </a>
        </p>
      </span>
    </form>
  );
}
