"use client";
import lock from "@/assets/images/lock.png";
import Image from "next/image";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Eye } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
export default function Login() {
  return (
    <form action="" className="flex justify-center items-center flex-col gap-4">
      <span className="flex flex-col md:w-[50%] w-[50%] gap-4">
        <h1 className="text-3xl text-center font-bold">Altera sua senha</h1>
        <Label className="text-lg font-medium">Nova senha</Label>
        <InputGroup>
          <InputGroupAddon>
            <Image className="" src={lock} alt="lock" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="sua nova senha"
            type="password"
            required
          />
          <InputGroupAddon align={"inline-end"}>
            <Eye />
          </InputGroupAddon>
        </InputGroup>{" "}
        <Label className="text-lg font-medium">Confirme a senha</Label>
        <InputGroup>
          <InputGroupAddon>
            <Image className="" src={lock} alt="lock" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="sua nova senha"
            type="password"
            required
          />
          <InputGroupAddon align={"inline-end"}>
            <Eye />
          </InputGroupAddon>
        </InputGroup>
        <Button size={"lg"} variant={"destructive"}>
          Enviar recuperador
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
