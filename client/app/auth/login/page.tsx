"use client";

import eamail from "@/assets/images/email.png";
import lock from "@/assets/images/lock.png";
import Image from "next/image";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { Eye, Lock, MessageCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
export default function Login() {
  return (
    <form action="" className="flex justify-center items-center flex-col gap-4">
      <span className="flex flex-col md:w-[50%] w-[50%] gap-4">
        <h1 className="text-3xl text-center font-bold">Bem vindo de volta</h1>
        <Label className="text-lg font-medium">Email</Label>
        <InputGroup>
          <InputGroupInput placeholder="seu email" type="email" required />
          <InputGroupAddon>
            <Image className="" src={eamail} alt="eamail" />
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

        <a
          href="/auth/recovery"
          className="text-end text-sm text-blue-400 hover:underline cursor-pointer"
        >
          Esqueceu sua senha?
        </a>
        <span className="flex items-center gap-2">
          <Checkbox />
          <p>Me manter logado</p>
        </span>
        <Button size={"lg"} variant={"destructive"}>
          Acessar
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
