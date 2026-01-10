"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader } from "@/components/Loader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { paymentsMock } from "@/mocks/payments"; // seus mocks
import { IPayment, IWallet } from "@/types/interfaces";
import { toast } from "sonner";

export default function PaymentConsolidationCreatePage() {
  const router = useRouter();
  const { id } = useParams();

  const [payment, setPayment] = useState<IPayment | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<IWallet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const found = paymentsMock.find((p) => p.id.toString() === id);
      setPayment(found || null);
      setLoading(false);
    }, 800);
  }, [id]);

  if (loading) return <Loader />;
  if (!payment)
    return (
      <p className="text-center py-10 text-red-500">Pagamento não encontrado</p>
    );

  const handleCreateConsolidation = () => {
    if (!selectedWallet) {
      toast.info("Selecione uma carteira para consolidação!");
      return;
    }

    // Aqui você chamaria sua API para criar a consolidação
    console.log("Criando consolidação com:", {
      id: payment.id,
      walletId: selectedWallet.id,
    });

    toast.info("Consolidação criada com sucesso!");
    router.push("/payments");
  };

  return (
    <section className="space-y-6 max-w-3xl mx-auto py-6">
      <h1 className="text-2xl font-bold">Criar Consolidação de Pagamento</h1>

      {/* INFORMAÇÕES DO PAGAMENTO */}
      <div className="border rounded-lg p-4 space-y-2">
        <h2 className="font-semibold">Informações do Pagamento</h2>
        <p>
          <strong>Cliente:</strong> {payment.client.firstName}{" "}
          {payment.client.lastName} ({payment.client.email})
        </p>
        <p>
          <strong>Serviço:</strong> {payment.booking.service.title}
        </p>
        <p>
          <strong>Valor:</strong> {payment.amount.toLocaleString()}{" "}
          {payment.currency}
        </p>
        <p>
          <strong>Status:</strong> {payment.status}
        </p>
      </div>

      {/* SELECIONAR CARTEIRA */}
      {payment.professional && (
        <div className="border rounded-lg p-4 space-y-2">
          <h2 className="font-semibold">Selecionar Carteira do Profissional</h2>
          <Select
            value={selectedWallet?.id.toString() || ""}
            onValueChange={(val) => {
              const wallet = payment.professional?.wallets.find(
                (w) => w.id.toString() === val
              );
              setSelectedWallet(wallet || null);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma carteira" />
            </SelectTrigger>
            <SelectContent>
              {payment.professional?.wallets?.map((wallet) => (
                <SelectItem key={wallet.id} value={wallet.id.toString()}>
                  {wallet.accountHolder} - {wallet.bankName} (
                  {wallet.accountNumber})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* CONFIRMAR VALOR */}
      {selectedWallet && (
        <div className="border rounded-lg p-4 space-y-2">
          <h2 className="font-semibold">Valor a ser consolidado</h2>
          <Input value={`${payment.amount} ${payment.currency}`} readOnly />
        </div>
      )}

      {/* BOTÃO CRIAR CONSOLIDAÇÃO */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => router.push("/admin/payments")}>
          Cancelar
        </Button>
        <Button variant="default" onClick={handleCreateConsolidation}>
          Criar Consolidação
        </Button>
      </div>
    </section>
  );
}
