"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Button } from "../ui/button";

const faqs = [
  {
    question: "O meu pedido atrasou, o que devo fazer?",
    answer:
      "Caso o seu pedido atrase, recomendamos entrar em contacto com o prestador de serviços diretamente pelo aplicativo ou através do nosso suporte.",
  },
  {
    question: "Tive um problema com o meu pedido e agora?",
    answer:
      "Por questões legais todos os pagamentos feitos pelos clientes vão para as contas da plataforma. Após validação, aprovação e término do serviço, o pagamento é efetuado ao prestador.",
  },
  {
    question: "Fiz um pedido e logo me arrependi, até quando posso cancelar?",
    answer:
      "O cancelamento pode ser feito antes do prestador iniciar o serviço. Após o início, podem aplicar-se taxas conforme os termos da plataforma.",
  },
  {
    question: "Como é o processo de pagamento dos serviços?",
    answer:
      "Os pagamentos são feitos de forma segura dentro da plataforma, utilizando os métodos disponíveis no aplicativo.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(index: number) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <section className="w-full lg:px-35 px-6 mt-30">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">Dúvidas frequentes</h2>
        <p className="text-gray-500 mt-2">
          Selecionamos algumas questões que pode ser sua dúvida.
        </p>
      </div>

      {/* FAQ list */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg divide-y">
        {faqs.map((item, index) => (
          <div key={index} className="py-4">
            <button
              onClick={() => toggle(index)}
              className="w-full flex justify-between items-center text-left"
            >
              <span className="font-medium text-gray-800">{item.question}</span>

              <span className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                {openIndex === index ? <Minus /> : <Plus />}
              </span>
            </button>

            {openIndex === index && (
              <p className="mt-3 text-gray-500 text-sm leading-relaxed">
                {item.answer}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col justify-center items-center my-10 gap-5">
        <strong className="text-2xl">Ainda tem dúvidas?</strong>
        <p className="text-sm text-neutral-500">
          O aplicativo que te ajudará a encontrar e solicitar todos os serviços
          imobiliários que precisas, economizando tempo e recurso
        </p>
        <Button variant={"outline"} className="rounded-full">
          Entrar em contacto
        </Button>
      </div>
    </section>
  );
}
