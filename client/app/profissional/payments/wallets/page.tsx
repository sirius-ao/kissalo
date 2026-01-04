"use client";

import { Loader } from "@/components/Loader";
import { IStats, StarsCard } from "@/components/StatsCard";
import constants from "@/constants";
import { verifyArrayDisponiblity } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { AlertCircle, CheckCheck, Loader2, Plus, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IWallet } from "@/types/interfaces";
import { walletsMock } from "@/mocks/wallets";
import { WalletCard } from "@/components/Wallets";
import { Button } from "@/components/ui/button";

export default function WalletsPage() {
  const stats: IStats[] = [
    {
      isCoin: false,
      label: "Total carteiras",
      oldValue: 5,
      title: "Total",
      value: 5,
    },
    {
      isCoin: false,
      label: "Total carteiras activas",
      oldValue: 2,
      title: "Ativas",
      value: 2,
    },
    {
      isCoin: false,
      label: "Total carteiras inactivas",
      oldValue: 1,
      title: "Inativas",
      value: 1,
    },
    {
      isCoin: false,
      label: "Total carteiras pendetes",
      oldValue: 1,
      title: "Pendetes",
      value: 1,
    },
  ];
  const [isLoading, setIsLoading] = useState(true);
  const [wallets, setWallets] = useState<IWallet[]>(walletsMock);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, constants.TIMEOUT.LOADER);
  }, []);

  return (
    <section>
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-end gap-1">
          <span className="bg-linear-to-r from-[#f7a60ed1] to-[#ec4d03e3] text-white h-10 w-10 flex justify-center items-center font-bold shadow rounded-sm">
            <h1 className="scroll-m-20 text-center text-3xl font-extrabold tracking-tight text-balance">
              C
            </h1>
          </span>

          <h1 className="scroll-m-20 text-center text-xl font-extrabold tracking-tight text-balance">
            arteiras
          </h1>
        </div>
      </header>

      {!isLoading ? (
        <article className="flex flex-col gap-5">
          <span className="lg:grid-cols-4 grid md:grid-cols-2 gap-4">
            {verifyArrayDisponiblity(stats) &&
              stats.map((item, idx) => <StarsCard data={item} key={idx} />)}
          </span>
          <form className="grid md:grid-cols-3 gap-4 ">
            <Dialog>
              <DialogTrigger asChild>
                <Button type="button" variant={"outline"} className="w-40">
                  <Plus />
                  Adcionar carteira
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cadastro de carteira</DialogTitle>
                  <DialogDescription>
                    Preenche os campos obrigatórios para que possas registrar
                    uma carteira
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <div></div>
            <span className="flex items-center gap-2">
              <InputGroup>
                <InputGroupInput placeholder="Search..." />
                <InputGroupAddon>
                  <Search size={100} />
                </InputGroupAddon>
              </InputGroup>

              <Select>
                <SelectTrigger className="bg-black text-white ">
                  <SelectValue
                    placeholder="Filtrar"
                    className="text-white placeholder:text-white "
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">
                    <Loader2 size={100} className="animate-spin" />
                    Pendentes
                  </SelectItem>
                  <SelectItem value="completed">
                    <CheckCheck size={100} />
                    Concluídos
                  </SelectItem>
                  <SelectItem value="canceled">
                    <AlertCircle size={100} />
                    Cancelados
                  </SelectItem>
                </SelectContent>
              </Select>
            </span>
          </form>

          <aside className="grid lg:grid-cols-4 md:grid-cols-2 gap-4">
            {verifyArrayDisponiblity(wallets) &&
              wallets.map((item, idx) => (
                <WalletCard wallet={item} key={idx} />
              ))}
          </aside>
        </article>
      ) : (
        <Loader />
      )}
    </section>
  );
}
