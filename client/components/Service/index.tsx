import { UserRole } from "@/types/enum";
import { IServiceTemplate } from "@/types/interfaces";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { EllipsisVertical, Eye, ShoppingCart, Star } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";

export function UnJoinedServiceCard({
  service,
  role,
  autoHigth = false,
}: {
  service: IServiceTemplate;
  role: UserRole;
  autoHigth?: boolean;
}) {
  return (
    <Card className="shadow-none relative  rounded-sm transition-all duration-300">
      <span className="absolute flex right-0 bg-white shadow-2xl rounded-md p-1 text-sm top-3 items-center gap-1">
        <Star className="text-amber-500" size={12} />
        {service?.bookings?.length ?? 0}
      </span>
      <CardHeader className="px-3 py-0">
        {!autoHigth ? (
          <span className="grid grid-cols-2 mb-4 gap-2">
            <img
              className="h-84 md:h-90 md:max-h-100 rounded-sm w-full bg-gray-500/10 object-cover"
              src={service?.bannerUrl}
            />
            <div className="flex  justify-between gap-2 flex-col w-full">
              <img
                className="h-40 md:h-43  md:max-h-100 rounded-sm w-full bg-gray-500/10 object-cover"
                src={service?.gallery[1]}
              />
              <img
                className="h-40 md:h-43  md:max-h-100  rounded-sm w-full bg-gray-500/10 object-cover"
                src={service?.gallery[0]}
              />
            </div>
          </span>
        ) : (
          <span className="flex flex-col mb-4 gap-2">
            <div className="grid grid-cols-2  gap-4">
              <img
                className="h-40 md:h-60  md:max-h-100 rounded-sm w-full bg-gray-500/10 object-cover"
                src={service?.gallery[1]}
              />
              <img
                className="h-40 md:h-60  md:max-h-100  rounded-sm w-full bg-gray-500/10 object-cover"
                src={service?.gallery[0]}
              />
            </div>
            <img
              className="h-84 md:h-90 md:max-h-100 rounded-sm w-full bg-gray-500/10 object-cover"
              src={service?.bannerUrl}
            />
          </span>
        )}
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
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((item, idx) => {
              if (idx <= 3) {
                return (
                  <Star
                    key={idx}
                    fill="gold"
                    size={15}
                    className="text-amber-300 shadow-2xl shadow-amber-200"
                  />
                );
              }
              return <Star key={idx} className="text-gray-500" size={15} />;
            })}
          </span>
          <small>4,5 (+200 Avaliações)</small>
        </div>
      </CardHeader>

      <CardFooter>
        <div className="w-full">
          <span className="flex md:flex-row justify-between gap-1">
            <Button>{Number(service.price).toLocaleString("pt")},00 Kz</Button>
            {role === UserRole.CUSTOMER ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"outline"}>
                    <ShoppingCart />
                    Agendas
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 " align="start">
                  <DropdownMenuGroup>
                    <Link href={`/services/${service.id}`} prefetch>
                      <DropdownMenuItem>
                        <Eye />
                        Detalhes
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuGroup>
                  <DropdownMenuGroup>
                    <Link href={`/costumer/apointment/${service.id}`} prefetch>
                      <DropdownMenuItem>
                        <ShoppingCart />
                        Agendar
                        <DropdownMenuShortcut>⇧⌘A</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                {!autoHigth && (
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
                )}
              </>
            )}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
