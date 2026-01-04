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

export default function CreateApointMent() {
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

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, constants.TIMEOUT.LOADER);
  }, []);

  return <Loader />;
}
