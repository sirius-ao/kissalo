import { UserRole } from "@/types/enum";
import { IServiceTemplate } from "@/types/interfaces";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { EllipsisVertical, Eye, PaintRoller, Star } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";

export function UnJoinedServiceCard({
  service,
  role,
}: {
  service: IServiceTemplate;
  role: UserRole;
}) {
  return (
    <Card className="shadow-none relative  rounded-sm transition-all duration-300">
      <span className="absolute flex left-[92%] bg-white shadow-2xl rounded-md p-1 text-sm top-3 items-center gap-1">
        <Star className="text-amber-500" size={12} />
        {service.bookings.length}
      </span>
      <CardHeader className="px-3 py-0">
        <span className="grid grid-cols-2 gap-2">
          <img
            className="h-70 rounded-sm bg-gray-500/10 object-fill"
            src={service.gallery[2] ?? service.bannerUrl}
          />
          <div className="flex  justify-between flex-col w-full">
            <img
              className="h-34 rounded-sm bg-gray-500/10 object-fill"
              src={service.gallery[1]}
            />
            <img
              className="h-34  rounded-sm bg-gray-500/10 object-fill"
              src={service.gallery[0]}
            />
          </div>
        </span>
        <CardTitle>{service.title}</CardTitle>
        <CardDescription>{service.description}</CardDescription>
        <small>{service.shortDescription}</small>
        <span className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <div
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor: `${service.category.color}`,
              }}
            ></div>
            <p>{service?.category.title}</p>
          </div>
          <small>{String(service?.category?.description)}</small>
        </span>
      </CardHeader>

      <CardFooter>
        <div className="w-full">
          <span className="flex md:flex-row justify-between gap-1">
            <Button>{Number(service.price).toLocaleString("pt")},00 Kz</Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"outline"}>
                  Detalhes
                  <EllipsisVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuGroup>
                  <Link href={`/services/${service.id}`} prefetch>
                    <DropdownMenuItem>
                      Detalhes
                      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </Link>
                  {role === UserRole.PROFESSIONAL && (
                    <DropdownMenuItem>
                      Anexar Serviço
                      <DropdownMenuShortcut>⇧⌘A</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  )}
                  {role == UserRole.CUSTOMER && (
                    <DropdownMenuItem>
                      Agendar Serviço
                      <DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
                {role === UserRole.ADMIN && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      Adicionar Profissional
                      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      Remover Serviço
                      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </span>
          <div className=" gap-2 flex items-center ">
            <DropdownMenu>
              <DropdownMenuContent>
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Eye />
                  Detalhes
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <PaintRoller /> Ser anexado
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
