import oko from "@/assets/images/oko 1.png";
import dd from "@/assets/images/dd.png";
import { Button } from "../ui/button";
import {
  ArrowUp,
  CheckCircle,
  GitBranch,
  Loader2,
  Play,
  PlayCircleIcon,
  Star,
  User,
} from "lucide-react";
import { ICategory, IServiceTemplate } from "@/types/interfaces";
import { useEffect, useState } from "react";
import { CategoriesService } from "@/services/Categories/index.service";
import { ServicesService } from "@/services/Services/index.service";
import { toast } from "sonner";
import constants from "@/constants";
import { verifyArrayDisponiblity } from "@/lib/utils";
import { UnJoinedServiceCard } from "../Service";
import { UserRole } from "@/types/enum";
import Image from "next/image";

export function About() {
  const dataAbout = [
    {
      title: "Um ambiente online, intuitivo e completo",
      description:
        "Encontre informações detalhadas sobre os serviços disponíveis para imóveis no nosso aplicativo.",
    },
    {
      title: "O seu balcão único para todos os serviços",
      description:
        "Necessidades imobiliárias, com apenas alguns cliques você terá ampla gama de serviços.",
    },
    {
      title: "Prestador de serviços e profissionais qualificados",
      description:
        "Profissionais experientes e confiáveis garantindo a excelência em cada serviço.",
    },
    {
      title: "Conveniência, acesse a Kisalo a qualquer hora",
      description:
        "E em qualquer lugar garantindo que você tenha total controle sobre suas escolhas.",
    },
  ];
  const resourceData = [
    {
      title: "1. Solicitar serviço",
      description:
        "Escolhendo o tipo de serviço e especificando o local e a hora exata que o serviço será prestado.",
    },
    {
      title: "2. Pesquisa e categorias",
      description:
        "Pesquise por diferentes serviços e filtre pela categoria que desejas, encontrando de forma mais fácil.",
    },
    {
      title: "3. Propostas de orçamentos",
      description:
        "Após cada solicitação receba a melhor proposta custo-benefício para o serviço que deseja.",
    },
    {
      title: "4. Histórico de pedidos",
      description:
        "Tenha acesso a um histórico detalhado de tudo que já solicitaste dentro do aplicativo Kisalo.",
    },
  ];

  const [isLoading, setIsLoading] = useState(true);

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [allServices, setAllServices] = useState<IServiceTemplate[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const token = localStorage.getItem("acess-x-token") as string;

        const categoriesApi = new CategoriesService(token);
        const servicesApi = new ServicesService(token);

        const [cats, servs] = await Promise.all([
          categoriesApi.get(),
          servicesApi.get(),
        ]);

        if (cats?.logout || servs?.logout) {
          toast.error("Sessão expirada");
          return;
        }

        setCategories(cats?.data ?? []);
        setAllServices(servs?.data ?? []);
      } catch {
        toast.error("Erro ao carregar serviços");
      } finally {
        setTimeout(() => setIsLoading(false), constants.TIMEOUT.LOADER);
      }
    }

    loadData();
  }, []);

  return (
    <section
      id="about"
      className="min-h-screen flex flex-col gap-10  justify-center overflow-hidden pt-3"
    >
      <span
        className="grid lg:grid-cols-2 gap-10 w-full lg:px-30 lg:pt-0 pt-20 px-10
      "
      >
        <div className="">
          <span className="flex  items-center h-2 gap-2">
            <span className="h-1 w-10 bg-orange-500 rounded-full"></span>
            <h1 className="text-xl">Quem somos?</h1>
          </span>
        </div>
        <div className="flex flex-col gap-5">
          <strong className="text-3xl lg:text-5xl">
            A conexão perfeita entre clientes e prestadores de serviços.
          </strong>
          <p>
            Somos uma empresa especializada em prestar serviços de alta
            qualidade, com um time de profissionais experientes e comprometidos.
            Oferecemos soluções personalizadas em diversas áreas, como limpeza,
            eletricidade, reparos e muito mais, com foco na eficiência,
            segurança e satisfação do cliente. Nossa missão é fornecer um
            atendimento confiável, rápido e sem complicações, garantindo que
            cada tarefa seja realizada com o mais alto padrão de excelência.{" "}
          </p>
          <Button
            size={"lg"}
            className="p-2 bg-orange-500 hover:bg-orange-600 place-self-end lg:w-60 w-full "
          >
            <PlayCircleIcon />
            Saiba mais
          </Button>
        </div>
      </span>

      <span className="flex flex-col gap-10 justify-center items-center lg:mt-30 mt-10">
        <strong className="text-2xl text-gray-400 text-center">
          Transformamos a forma como encontras e contratas serviços imobiliários
        </strong>

        <span className="grid lg:grid-cols-4 gap-8 md:grid-cols-2 lg:px-35 px-10 ">
          {dataAbout.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-4 bg-gray-100 p-3 rounded-lg"
            >
              <span className="h-10 w-10 bg-orange-500 rounded-md"></span>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </div>
          ))}
        </span>
      </span>

      <span
        className="grid lg:grid-cols-2 gap-10 w-full lg:px-30 lg:pt-20 pt-20 px-10
      "
      >
        <div className="">
          <span className="flex  items-center h-2 gap-2">
            <span className="h-1 w-10 bg-orange-500 rounded-full"></span>
            <h1 className="text-xl">Nossos serviços</h1>
          </span>
        </div>
        <div className="flex flex-col gap-5">
          <strong className="text-3xl text-center">
            Soluções Profissionais para Cada Necessidade
          </strong>
        </div>
      </span>

      {isLoading ? (
        <div className="flex w-full justify-center items-center p-5">
          <Loader2 className="animate-spin text-orange-500" />
        </div>
      ) : (
        <span className="flex flex-col gap-10 justify-center items-center mt-10 ">
          <span className="grid lg:grid-cols-3 gap-8 px-10 lg:px-30 w-full">
            {!isLoading &&
              verifyArrayDisponiblity(allServices) &&
              allServices.map((item, idx) => {
                if (idx >= 10) return;
                return (
                  <UnJoinedServiceCard
                    key={idx}
                    service={item}
                    role={UserRole.CUSTOMER}
                  />
                );
              })}
          </span>
          <a href="/auth/login">
            <span className="flex  gap-1 font-semibold text-lg">
              Quer acessar acessar mais serviços? Ver mais{" "}
              <ArrowUp className="text-orange-500 rotate-36" />
            </span>
          </a>
        </span>
      )}

      <span className="lg:px-35 px-4 mt-40">
        <span className="bg-linear-to-r from-[#f7a60ed1] to-[#ec4d03e3] text-white  rounded-md grid lg:grid-cols-2 gap-3 lg:max-h-100 overflow-visible">
          <div>
            <Image
              className="h-full object-contain lg:-mt-30 -mt-10"
              src={oko}
              alt="Oko Image"
            />
          </div>
          <div className="flex flex-col p-4 gap-5 lg:items-center lg:pt-20 lg:pr-20 ">
            <h1 className="text-3xl  font-bold text-pretty">
              Baixe Nosso Aplicativo e Tenha Nossos Serviços Sempre à Mão.
            </h1>
            <p>
              Agora ficou ainda mais fácil acessar nossos serviços! Com o nosso
              aplicativo, você pode solicitar limpeza, design, tecnologia,
              eletricidade e muito mais de forma rápida e segura. Tenha tudo ao
              seu alcance, onde e quando precisar. Baixe agora e aproveite a
              melhor experiência!
            </p>

            <div className="grid  w-full mt-4 grid-cols-2 gap-2">
              <Button
                size={"lg"}
                className="p-2 bg-white hover:bg-white text-orange-500"
              >
                <Play fill="orange" />
                Começar
              </Button>
              <Button
                size={"lg"}
                className="p-2 bg-transparent hover:bg-transparent text-white border border-white"
              >
                <Play />
                Acessar
              </Button>
            </div>
          </div>
        </span>
      </span>

      <span className="flex flex-col gap-10 justify-center items-center lg:mt-30 mt-10">
        <span className="text-center flex flex-col gap-3">
          <strong className="text-3xl font-bold">
            Conheça o aplicativo Kisalo
          </strong>
          <p className="text-lg text-gray-400 ">
            O aplicativo que te ajudará a encontrar e solicitar todos os
            serviços imobiliários que precisas, economizando tempo e recurso
          </p>
        </span>

        <span className="grid gap-8 md:grid-cols-2 lg:px-105 px-10 ">
          {resourceData.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-4 bg-gray-50 p-3 rounded-lg"
            >
              <span className="h-10 w-10 bg-amber-500 rounded-md"></span>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </div>
          ))}
        </span>
      </span>

      <span className="flex flex-col gap-10 justify-center items-center lg:mt-30 mt-10">
        {/* Seção Nossa Visão - 3 Passos */}
        <div className="lg:px-30 px-10 mt-20">
          <div className="flex flex-col gap-10">
            {/* Cabeçalho */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Nossa visão
              </h1>
              <h2 className="lg:text-xl text-gray-600 font-medium">
                Com três passos simples resolva tarefas do dia a dia com a
                Kissalo
              </h2>
            </div>

            {/* Grid dos 3 passos */}
            <div className="grid lg:grid-cols-3 gap-10">
              {/* Passo 01 */}
              <div className="flex flex-col items-center text-center gap-6">
                <div className="relative">
                  <div className="flex items-center justify-center h-20 w-20 bg-linear-to-br from-amber-500 to-orange-600 text-white rounded-full lg:text-3xl text-xl font-bold ">
                    01
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-xl text-gray-900">Login ou Regista-se</h3>
                  <p className="text-gray-700 text-sm lg:text-lg leading-relaxed px-4">
                    Faça login no Aplicativo usando seu número de telefone,
                    senha e o seu nome.
                  </p>
                </div>
              </div>

              {/* Passo 02 */}
              <div className="flex flex-col items-center text-center gap-6">
                <div className="relative">
                  <div className="flex items-center justify-center h-20 w-20 bg-linear-to-br from-amber-500 to-orange-600 text-white rounded-full lg:text-3xl text-xl font-bold ">
                    02
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-xl text-gray-900">Escolha o Serviço</h3>
                  <p className="text-gray-700 text-sm lg:text-lg leading-relaxed px-4">
                    Escolha o serviço que deseja usar e reserve o mesmo em
                    apenas alguns passos.
                  </p>
                </div>
              </div>

              {/* Passo 03 */}
              <div className="flex flex-col items-center text-center gap-6">
                <div className="relative">
                  <div className="flex items-center justify-center h-20 w-20 bg-linear-to-br from-amber-500 to-orange-600 text-white rounded-full lg:text-3xl text-xl font-bold ">
                    03
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-xl text-gray-900">
                    Acompanhe o seu pedido
                  </h3>
                  <p className="text-gray-700 text-sm lg:text-lg leading-relaxed px-4">
                    Rastreie os provedores de serviços em tempo real! Mapa e
                    receba notificações no Aplicativo.
                  </p>
                </div>
              </div>
            </div>

            {/* Linha divisória */}
            <div className="flex justify-center mt-16 mb-10">
              <div className="w-32 h-1 bg-linear-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Seção Testemunhos */}
        <div className="lg:px-30 px-10 mt-10 mb-20">
          <div className="flex flex-col gap-10">
            {/* Cabeçalho */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                Testemunhos
              </h1>
              <h2 className="lg:text-xl text-gray-600 font-medium mb-8">
                O quê os nossos clientes dizem sobre nós?
              </h2>

              {/* Badge de satisfação */}
              <div className="inline-flex items-center gap-2 bg-orange-100 text-amber-900 px-6 py-3 rounded-full  mb-10">
                <span className="lg:text-xl font-bold">+1000</span>
                <span className="text-lg font-medium">
                  Mais de 1k pessoas satisfeitas
                </span>
              </div>
            </div>

            {/* Grid de testemunhos */}
            <div className="grid lg:grid-cols-2 gap-10">
              {/* Testemunho 1 */}
              <div className="bg-linear-to-br from-white to-gray-50 rounded-2xl p-8  border border-gray-100">
                <div className="mb-6">
                  {/* Estrelas - não mostradas na imagem, mas adicionando por padrão */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-amber-500 text-amber-500"
                      />
                    ))}
                  </div>

                  <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                    "Preciso de um serviço de eletricidade e fiquei
                    impressionado com a rapidez, a eficiência e o
                    profissionalismo da equipe. Resolvem o problema sem
                    complicações e com muita qualidade. Recomendo a todos!"
                  </p>

                  <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
                    <div className="h-12 w-12 rounded-full bg-linear-to-r from-gray-300 to-gray-400"></div>
                    <div>
                      <p className="font-bold text-gray-900">Mariane Delfino</p>
                      <p className="text-gray-600 text-sm">
                        Cliente satisfeita
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testemunho 2 */}
              <div className="bg-linear-to-br from-white to-gray-50 rounded-2xl p-8  border border-gray-100">
                <div className="mb-6">
                  {/* Estrelas */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-amber-500 text-amber-500"
                      />
                    ))}
                  </div>

                  <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                    "Preciso de um serviço de eletricidade e fiquei
                    impressionado com a rapidez, a eficiência e o
                    profissionalismo da equipe. Resolvem o problema sem
                    complicações e com muita qualidade. Recomendo a todos!"
                  </p>

                  <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
                    <div className="h-12 w-12 rounded-full bg-linear-to-r from-gray-300 to-gray-400"></div>
                    <div>
                      <p className="font-bold text-gray-900">
                        Crisivan Van-dúrrim
                      </p>
                      <p className="text-gray-600 text-sm">
                        Cliente satisfeito
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Indicadores de navegação (dots) */}
            <div className="flex justify-center gap-2 mt-10">
              <div className="h-3 w-3 rounded-full bg-amber-500"></div>
              <div className="h-3 w-3 rounded-full bg-gray-300"></div>
              <div className="h-3 w-3 rounded-full bg-gray-300"></div>
            </div>
          </div>
        </div>
      </span>
    </section>
  );
}
