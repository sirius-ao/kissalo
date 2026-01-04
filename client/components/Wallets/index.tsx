import { IWallet } from "@/types/interfaces";
import chip from "@/assets/images/chip.png";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, EllipsisVertical, Pencil } from "lucide-react";
interface Props {
  wallet: IWallet;
  showElips?: boolean;
}

export function WalletCard({ wallet, showElips = true }: Props) {
  const lastDigits = wallet.accountNumber.slice(-4);

  return (
    <div
      className={`
        relative  w-full rounded-2xl p-5 text-white shadow-xl
        bg-linear-to-br
        ${
          wallet.isVerified
            ? "from-orange-500 to-amber-400"
            : "from-gray-500 to-gray-700"
        }
      `}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm opacity-80">{wallet.bankName}</p>
          <p className="text-xs opacity-60">
            {wallet.isActive ? "Conta ativa" : "Conta inativa"}
          </p>
        </div>

        {showElips && (
          <DropdownMenu>
            <DropdownMenuTrigger className="text-xs bg-white/20 px-3 py-1 rounded-full">
              <Ellipsis size={14} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{wallet.bankName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Editar
                <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Remover
                <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Consolidações
                <DropdownMenuShortcut>⌘G</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="flex items-center md:gap-9 gap-3 my-5">
        <Image className="h-10 w-10 object-fit" src={chip} alt="chip" />
        <h1 className="text-center font-semibold  text-2xl">
          ************** {lastDigits}
        </h1>
      </div>
      <div className="mt-10">
        <p className="text-xs opacity-70">Titular</p>
        <h2 className="text-lg font-semibold ">{wallet.accountHolder}</h2>
      </div>

      <div className="flex justify-between text-xs opacity-80">
        <span>
          {wallet.isVerified ? "✔ Conta verificada" : "⏳ Em verificação"}
        </span>
        <span>{wallet.bankName}</span>
      </div>
    </div>
  );
}
