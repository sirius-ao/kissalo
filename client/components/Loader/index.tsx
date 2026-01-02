import { Loader2 } from "lucide-react";

export function Loader() {
  return (
    <div className="flex flex-col gap-2 justify-center items-center w-full h-[50dvh]">
      <Loader2 className="animate-spin text-orange-500" />
      <small className=" animate-pulse text-gray-500">Carregando</small>
    </div>
  );
}
