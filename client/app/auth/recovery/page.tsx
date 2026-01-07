"use client";
import eamail from "@/assets/images/email.png";
import Image from "next/image";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
export default function Login() {
  return (
    <form action="" className="flex justify-center items-center flex-col gap-4">
      <span className="flex flex-col md:w-[50%] w-[50%] gap-4">
        <h1 className="text-3xl text-center font-bold">Recupere sua conta</h1>
        <Label className="text-lg font-medium">Email</Label>
        <InputGroup>
          <InputGroupInput placeholder="seu email" type="email" required />
          <InputGroupAddon>
            <Image className="" src={eamail} alt="eamail" />
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
