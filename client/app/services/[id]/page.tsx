"use client";

import { Loader } from "@/components/Loader";
import constants from "@/constants";
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
import { ServicesService } from "@/services/Services/index.service";
import { useUserRole } from "@/hooks/use-UserRole";

export default function ServiceDetailsPublicPage() {
  const { id } = useParams();
  const router = useRouter();
  const { role } = useUserRole();
  const [isLoading, setIsLoading] = useState(true);
  const [service, setService] = useState<any>(null);

  useEffect(() => {
    async function loadService() {
      try {
        const api = new ServicesService(
          localStorage.getItem("acess-x-token") as string
        );

        const res = await api.getById(Number(id));

        if (res?.logout) {
          return;
        }

        setService(res);
      } catch {
        setService(null);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, constants.TIMEOUT.LOADER);
      }
    }

    loadService();
  }, [id, router]);

  return (
    <section className="flex flex-col justify-center">
      {isLoading ? (
        <Loader />
      ) : !service ? (
        <Empty className="mt-40">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Box />
            </EmptyMedia>
            <EmptyTitle>Serviço não encontrado</EmptyTitle>
            <EmptyDescription>
              Serviço não encontrado. Verifique se ele existe ou se você tem
              permissão para acessá-lo.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => router.back()}>
              <ArrowLeft />
              Voltar
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <section className="flex lg:w-[50%] place-self-center w-full flex-col p-3 gap-5">
          <UnJoinedServiceCard
            service={service}
            role={!role ? UserRole.CUSTOMER : role}
          />

          <span className="flex gap-4 flex-col">
            <span className="flex items-center gap-2">
              <ShieldAlert className="text-blue-400" />
              <strong>Requiitos</strong>
            </span>

            <ol className="flex flex-col gap-1">
              {service.requirements.map((item: string, idx: number) => (
                <li key={idx} className="flex items-center gap-2">
                  <Check className="text-green-600" size={14} />
                  {item}
                </li>
              ))}
            </ol>
          </span>

          <span className="flex flex-wrap gap-2">
            {service.keywords.map((item: string, idx: number) => (
              <Badge variant="outline" key={idx}>
                <Key size={12} />
                {item}
              </Badge>
            ))}
          </span>

          <span className="grid grid-cols-2 gap-4">
            <Button asChild>
              <Link href={`/costumer/apointment/${id}`}>
                <ShoppingCart />
                Agendar agora
              </Link>
            </Button>

            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft />
              Voltar
            </Button>
          </span>
        </section>
      )}
    </section>
  );
}
