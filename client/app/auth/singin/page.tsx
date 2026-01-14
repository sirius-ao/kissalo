"use client";
import emailImg from "@/assets/images/email.png";
import lockImg from "@/assets/images/lock.png";
import phoneImg from "@/assets/images/phone.png";
import Image from "next/image";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Eye, EyeOff, Loader2, User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormEvent, useState } from "react";
import { UserRole } from "@/types/enum";
import { AuthService } from "@/services/auth/login.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export default function Sigin() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole.CUSTOMER | UserRole.PROFESSIONAL>(
    UserRole.CUSTOMER
  );
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validate() {
    if (!email) return "O email é obrigatório";
    if (!name) return "O nome é obrigatório";
    if (!lastname) return "O  é obrigatório";
    if (phone.length != 9) return "O Fone é obrigatório";
    if (!email.includes("@")) return "Email inválido";
    if (!password) return "A senha é obrigatória";
    if (password.length < 6) return "A senha deve ter no mínimo 6 caracteres";
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
    const response = await service.signIn({
      avatarUrl: "https://picture.com",
      email,
      lastName: lastname,
      firstName: name,
      phone,
      password,
      role,
    });
    if (!response?.error && response?.user) {
      router.push(`/${String(response?.user?.role).toLocaleLowerCase()}`);
      localStorage.setItem("acess-x-token", response?.token);
      toast.info("Conta criada");
    } else {
      toast.info(response?.message);
    }
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex justify-center items-center flex-col gap-4"
    >
      <span className="flex flex-col md:w-[50%] w-[70%] gap-4">
        <h1 className="text-3xl text-center font-bold">Crie uma conta</h1>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <Label className="text-lg font-medium">Nome</Label>
        <InputGroup>
          <InputGroupInput
            onChange={(e) => setName(e.target.value)}
            placeholder="seu nome"
            type="text"
            required
          />
          <InputGroupAddon>
            <User className="" />
          </InputGroupAddon>
        </InputGroup>
        <Label className="text-lg font-medium">Sobrenome</Label>
        <InputGroup>
          <InputGroupInput
            onChange={(e) => setLastName(e.target.value)}
            placeholder="seu sobrenome"
            type="text"
            required
          />
          <InputGroupAddon>
            <User className="" />
          </InputGroupAddon>
        </InputGroup>

        <Label className="text-lg font-medium">Telefone</Label>
        <InputGroup>
          <InputGroupInput
            onChange={(e) => setPhone(e.target.value)}
            placeholder="seu telefone"
            type="tel"
            required
          />
          <InputGroupAddon>
            <Image className="" src={phoneImg} alt="phone" />
            +244
          </InputGroupAddon>
        </InputGroup>
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
        <span className="flex items-center gap-2">
          <Checkbox
            checked={role == UserRole.PROFESSIONAL}
            onCheckedChange={(e) => {
              if (e) {
                setRole(UserRole.PROFESSIONAL);
                return;
              }
              setRole(UserRole.CUSTOMER);
            }}
          />
          <p>Criar conta de profissional</p>
        </span>
        <Button
          size="lg"
          variant="destructive"
          type="submit"
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" /> : "Criar conta"}
        </Button>
        <p className="text-center text-sm">
          Já tem uma conta?{"  "}
          <a href="/auth/login" className="text-orange-600 underline">
            entrar
          </a>
        </p>
      </span>
    </form>
  );
}
