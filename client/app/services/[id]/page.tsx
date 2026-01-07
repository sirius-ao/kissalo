"use client";

import { Loader } from "@/components/Loader";
import constants from "@/constants";
import { servicesMock } from "@/mocks/services";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  ArrowLeft,
  Box,
  Check,
  Key,
  ShieldAlert,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UnJoinedServiceCard } from "@/components/Service";
import { UserRole } from "@/types/enum";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
export default function ServiceDetailsPublicPage() {
  const { id } = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, constants.TIMEOUT.LOADER);
  }, []);

  const service = servicesMock.filter((item) => {
    return item.id == Number(id);
  })[0];

  return (
    <section className="flex flex-col justify-center ">
      {isLoading ? (
        <Loader />
      ) : (
        <span>
          {!service ? (
            <Empty className="mt-50">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Box />
                </EmptyMedia>
                <EmptyTitle>Serviço não encontrado</EmptyTitle>
                <EmptyDescription>
                  Serviço não encontrado , certifique de que tens a permissão
                  para ver o mesmo e que o mesmo existe
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  onClick={() => {
                    router.back();
                  }}
                >
                  Voltar
                </Button>
              </EmptyContent>
            </Empty>
          ) : (
            <section className="flex lg:w-[50%] place-self-center w-full flex-col p-3 gap-5">
              <UnJoinedServiceCard service={service} role={UserRole.CUSTOMER} />
              <span className="flex gap-4 flex-col">
                <span className="flex items-center gap-2">
                  <ShieldAlert className="text-blue-400" />
                  <strong>O que está Incluído</strong>
                </span>
                <ol>
                  {service.requirements.map((item, idx) => (
                    <li className="flex items-center gap-2" key={idx}>
                      <Check className="text-green-600" size={14} />
                      {item}
                    </li>
                  ))}
                </ol>
              </span>

              <span className="flex flex-wrap gap-2">
                {service.keywords.map((item, idx) => (
                  <Badge variant={"outline"} key={idx}>
                    <Key />
                    {item}
                  </Badge>
                ))}
              </span>
              <span className="grid grid-cols-2 gap-4">
                <Button asChild>
                  <Link href={`/costumer/apointment/${id}`}>
                    <ShoppingCart /> Agendar agora
                  </Link>
                </Button>
                <Button
                  variant={"outline"}
                  onClick={() => {
                    router.back();
                  }}
                >
                  <ArrowLeft />
                  Voltar
                </Button>
              </span>
            </section>
          )}
        </span>
      )}
    </section>
  );
}
