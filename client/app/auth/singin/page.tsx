"use client";
import eamail from "@/assets/images/email.png";
import lock from "@/assets/images/lock.png";
import phone from "@/assets/images/phone.png";
import Image from "next/image";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Eye, User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
export default function Sigin() {
  return (
    <form action="" className="flex justify-center items-center flex-col gap-4">
      <span className="flex flex-col md:w-[50%] w-[50%] gap-4">
        <h1 className="text-3xl text-center font-bold">Crie uma conta</h1>
        <Label className="text-lg font-medium">Nome</Label>
        <InputGroup>
          <InputGroupInput placeholder="seu nome" type="text" required />
          <InputGroupAddon>
            <User className="" />
          </InputGroupAddon>
        </InputGroup>
        <Label className="text-lg font-medium">Email</Label>
        <InputGroup>
          <InputGroupInput placeholder="seu email" type="email" required />
          <InputGroupAddon>
            <Image className="" src={eamail} alt="eamail" />
          </InputGroupAddon>
        </InputGroup>

        <Label className="text-lg font-medium">Telefone</Label>
        <InputGroup>
          <InputGroupInput placeholder="seu telefone" type="tel" required />
          <InputGroupAddon>
            <Image className="" src={phone} alt="phone" />
            +244
          </InputGroupAddon>
        </InputGroup>
        <Label className="text-lg font-medium">Senha</Label>
        <InputGroup>
          <InputGroupInput placeholder="********" type="password" required />
          <InputGroupAddon>
            <Image className="" src={lock} alt="lock" />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Eye />
          </InputGroupAddon>
        </InputGroup>
        <span className="flex items-center gap-2">
          <Checkbox />
          <p>Aceito os termos de privacidade e política</p>
        </span>
        <Button size={"lg"} variant={"destructive"}>
          Acessar
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
