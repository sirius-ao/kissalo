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
import { ArrowLeft, Box, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UnJoinedServiceCard } from "@/components/Service";
import { UserRole } from "@/types/enum";
import Link from "next/link";
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
    <section>
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
            <section className="flex flex-col p-4 gap-3">
              <UnJoinedServiceCard
                service={service}
                role={UserRole.CUSTOMER}
                autoHigth={true}
              />
              <span className="grid grid-cols-2 gap-4">
                <Button asChild>
                  <Link href={`/services/apointement/${id}`}>
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
