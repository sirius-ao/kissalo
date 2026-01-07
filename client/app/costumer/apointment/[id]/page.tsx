"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import clsx from "clsx";
import {
  ArrowLeft,
  ArrowRight,
  Copy,
  File,
  MapPinIcon,
  Search,
  Star,
  User,
} from "lucide-react";
import { useState, useEffect, FormEvent } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IServiceTemplate, IUser } from "@/types/interfaces";
import { verifyArrayDisponiblity } from "@/lib/utils";
import { useParams } from "next/navigation";
import { servicesMock } from "@/mocks/services";
import { toast } from "sonner";
import { paymentMethodConstats } from "@/mocks/payments";
import { bookingsMock } from "@/mocks/bookings";
import { PaymentAvatar } from "@/components/Payments";
import * as React from "react";
import { parseDate } from "chrono-node";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Map } from "@/components/ui/map";

// Interface para os dados do formulário
interface BookingFormData {
  priority: string;
  startDate: string;
  endDate: string;
  modality: string;
  address: string;
  professionalId: number | null;
  paymentMethod: string;
  proofFile: File | null;
  location: {
    address: string;
    coordinates: [number, number] | null;
  };
}

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function CreateBookingPage() {
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [endDateOpen, setEndDateOpen] = React.useState(false);
  const [startDateValue, setStartDateValue] = React.useState("Em 2 dias");
  const [endDateValue, setEndDateValue] = React.useState("");
  const [currentAddress, setCurrentAddress] = useState<string>("");
  const [currentPosition, setCurrentPosition] = useState<
    [number, number] | null
  >(null);

  const [startDate, setStartDate] = React.useState<Date | undefined>(
    parseDate(startDateValue) || undefined
  );
  const [endDate, setEndDate] = React.useState<Date | undefined>(undefined);
  const [month, setMonth] = React.useState<Date | undefined>(startDate);

  // Estados para os campos do formulário
  const [priority, setPriority] = useState("");
  const [modality, setModality] = useState("");
  const [paymentMethod, setPaymentMethod] = useState({
    index: 0,
    title: "",
  });
  const [selectedProfessional, setSelectedProfessional] = useState({
    id: 0,
    index: -1,
  });
  const [proofFile, setProofFile] = useState<File | null>(null);

  const users: IUser[] = [
    ...bookingsMock.map((item) => {
      return item.client;
    }),
  ];

  const [professionals, setProfessionals] = useState<IUser[]>([
    ...bookingsMock.map((item, idx) => {
      return {
        ...(item?.professional?.user as IUser),
        id: idx + 1,
      };
    }),
  ]);

  const [service, setService] = useState<IServiceTemplate>(
    servicesMock.find((item) => item.id == Number(id)) || servicesMock[0]
  );

  const [search, setSearch] = useState("");
  const steps = [
    {
      title: "Data",
      description: "Seleção das datas",
    },
    {
      title: "Localização",
      description: "Seleção da localização",
    },
    {
      title: "Profissional",
      description: "Seleção do profissional",
    },
    {
      title: "Pagamento",
      description: "Informações de pagamento",
    },
  ];

  const filteredProfessionals = professionals.filter((item) => {
    if (!search) {
      return item;
    }
    const searchLower = search.toLowerCase();
    return (
      item.firstName?.toLowerCase().includes(searchLower) ||
      item.lastName?.toLowerCase().includes(searchLower) ||
      item.email?.toLowerCase().includes(searchLower) ||
      item.id?.toString()?.includes(search)
    );
  });

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocalização não é suportada neste navegador");
      return;
    }

    toast.info("Obtendo sua localização...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition([longitude, latitude]);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          setCurrentAddress(data.display_name);
          toast.success("Localização obtida com sucesso!");
        } catch (err) {
          console.error(err);
          toast.error("Erro ao obter endereço");
        }
      },
      (error) => {
        console.error(error);
        toast.error(
          "Não foi possível obter sua localização. Permita o acesso à localização."
        );
      }
    );
  };

  // Validação para avançar para o próximo passo
  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0:
        if (!priority || !startDate || !endDate) {
          toast.error("Preencha todas as informações de data e prioridade");
          return false;
        }
        if (endDate && startDate && endDate < startDate) {
          toast.error("A data de término deve ser posterior à data de início");
          return false;
        }
        return true;

      case 1:
        if (!modality) {
          toast.error("Selecione uma modalidade");
          return false;
        }
        if (modality === "my" && !currentAddress) {
          toast.error("Informe o endereço");
          return false;
        }
        return true;

      case 2:
        // A seleção do profissional é opcional, então sempre retorna true
        return true;

      case 3:
        if (!paymentMethod.title) {
          toast.error("Selecione um método de pagamento");
          return false;
        }
        if (!proofFile) {
          toast.error("Anexe o comprovativo de pagamento");
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  // Função para coletar todos os dados do formulário
  const collectFormData = (): BookingFormData => {
    return {
      priority,
      startDate: startDate ? formatDate(startDate) : "",
      endDate: endDate ? formatDate(endDate) : "",
      modality,
      address: currentAddress,
      professionalId: selectedProfessional.id || null,
      paymentMethod: paymentMethod.title,
      proofFile,
      location: {
        address: currentAddress,
        coordinates: currentPosition,
      },
    };
  };

  // Função para validar e enviar os dados
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateCurrentStep() && currentStep === steps.length - 1) {
      return;
    }

    if (currentStep < steps.length - 1) {
      if (validateCurrentStep()) {
        setCurrentStep((prev) => prev + 1);
      }
    } else {
      // Último passo - finalizar reserva
      const formData = collectFormData();

      // Validação final
      const finalValidation = validateBookingForm(formData);

      if (finalValidation.isValid) {
        console.log("Dados da reserva:", formData);
        console.log("ID do serviço:", id);
        console.log("Preço do serviço:", service.price);

        toast.success("Reserva criada com sucesso!");
        // Aqui você faria a chamada API para criar a reserva
        // Ex: createBooking(formData);
      } else {
        toast.error(finalValidation.errorMessage);
      }
    }
  };

  // Função de validação completa do formulário
  const validateBookingForm = (
    data: BookingFormData
  ): { isValid: boolean; errorMessage?: string } => {
    if (!data.priority) {
      return { isValid: false, errorMessage: "Selecione a prioridade" };
    }

    if (!data.startDate || !data.endDate) {
      return {
        isValid: false,
        errorMessage: "Informe as datas de início e término",
      };
    }

    if (!data.modality) {
      return { isValid: false, errorMessage: "Selecione a modalidade" };
    }

    if (data.modality === "my" && !data.address) {
      return { isValid: false, errorMessage: "Informe o endereço" };
    }

    if (!data.paymentMethod) {
      return {
        isValid: false,
        errorMessage: "Selecione o método de pagamento",
      };
    }

    if (!data.proofFile) {
      return {
        isValid: false,
        errorMessage: "Anexe o comprovativo de pagamento",
      };
    }

    return { isValid: true };
  };

  return (
    <div className="flex flex-col gap-4 lg:justify-center items-center">
      <div className="flex w-full lg:w-[50%] justify-between px-4 gap-4">
        {steps.map((item, idx) => (
          <div
            key={idx}
            className={clsx(
              "flex flex-col md:justify-start md:items-start items-center justify-center opacity-40",
              {
                "opacity-100": idx === currentStep,
              }
            )}
          >
            <span
              className={clsx(
                "bg-gray-400 transition-all text-white rounded-full w-8 h-8 justify-center items-center flex font-bold",
                {
                  "bg-orange-500": idx === currentStep,
                }
              )}
            >
              {idx + 1}
            </span>
            <h1 className="font-medium">{item.title}</h1>
            <small className="text-gray-500 md:flex hidden">
              {item.description}
            </small>
          </div>
        ))}
      </div>

      <form
        className="flex w-full lg:w-[50%] flex-col gap-4 p-4"
        onSubmit={handleSubmit}
      >
        {currentStep === 0 && (
          <>
            <div className="flex w-full flex-col gap-3">
              <strong className="text-lg">Informações do serviço</strong>
              <Card className="shadow-none relative rounded-sm transition-all duration-300">
                <span className="absolute flex right-0 bg-white shadow-lg rounded-md p-1 text-sm top-3 items-center gap-1">
                  <Star className="text-amber-500" size={12} />
                  {service?.bookings?.length ?? 0}
                </span>
                <CardHeader className="px-3 py-4">
                  <div className="flex flex-col mb-4 gap-2">
                    <div className="grid grid-cols-2 gap-4">
                      <img
                        className="h-40 md:h-60 md:max-h-100 rounded-sm w-full bg-gray-500/10 object-cover"
                        src={service?.gallery[1]}
                        alt="Imagem do serviço"
                      />
                      <img
                        className="h-40 md:h-60 md:max-h-100 rounded-sm w-full bg-gray-500/10 object-cover"
                        src={service?.gallery[0]}
                        alt="Imagem do serviço"
                      />
                    </div>
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="flex items-center gap-1">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor: `${service.category.color}`,
                        }}
                      ></div>
                      <p className="text-sm">{service?.category.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, idx) => {
                        if (idx <= 3) {
                          return (
                            <Star
                              key={idx}
                              fill="gold"
                              size={15}
                              className="text-amber-300"
                            />
                          );
                        }
                        return (
                          <Star key={idx} className="text-gray-400" size={15} />
                        );
                      })}
                    </span>
                    <small className="text-gray-600">
                      4,5 (+200 avaliações)
                    </small>
                  </div>
                </CardHeader>
              </Card>
            </div>

            <Label htmlFor="priority">Prioridade *</Label>
            <Select value={priority} onValueChange={setPriority} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
              </SelectContent>
            </Select>

            <Label htmlFor="start-date">Data de início *</Label>
            <div className="flex flex-col gap-3">
              <div className="relative">
                <Input
                  id="start-date"
                  value={startDateValue}
                  placeholder="Amanhã ou próxima semana"
                  className="bg-background pr-10"
                  onChange={(e) => {
                    setStartDateValue(e.target.value);
                    const date = parseDate(e.target.value);
                    if (date) {
                      setStartDate(date);
                      setMonth(date);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setOpen(true);
                    }
                  }}
                />
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="date-picker"
                      variant="ghost"
                      className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                    >
                      <CalendarIcon className="size-3.5" />
                      <span className="sr-only">Selecionar data</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="end"
                  >
                    <Calendar
                      mode="single"
                      selected={startDate}
                      captionLayout="dropdown"
                      month={month}
                      onMonthChange={setMonth}
                      onSelect={(date) => {
                        setStartDate(date);
                        setStartDateValue(formatDate(date));
                        setOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Label htmlFor="end-date">Data de término *</Label>
            <div className="flex flex-col gap-3">
              <div className="relative">
                <Input
                  id="end-date"
                  value={endDateValue}
                  placeholder="Selecione a data de término"
                  className="bg-background pr-10"
                  onChange={(e) => {
                    setEndDateValue(e.target.value);
                    const date = parseDate(e.target.value);
                    if (date) {
                      setEndDate(date);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setEndDateOpen(true);
                    }
                  }}
                />
                <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="end-date-picker"
                      variant="ghost"
                      className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                    >
                      <CalendarIcon className="size-3.5" />
                      <span className="sr-only">Selecionar data</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="end"
                  >
                    <Calendar
                      mode="single"
                      selected={endDate}
                      month={month}
                      onMonthChange={setMonth}
                      onSelect={(date) => {
                        setEndDate(date);
                        setEndDateValue(formatDate(date));
                        setEndDateOpen(false);
                      }}
                      disabled={(date) => date < (startDate || new Date())}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </>
        )}

        {currentStep === 1 && (
          <>
            <Label htmlFor="modality">Modalidade *</Label>
            <Select value={modality} onValueChange={setModality} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma modalidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="my">Meu estabelecimento</SelectItem>
                <SelectItem value="professional">
                  Estabelecimento do prestador
                </SelectItem>
              </SelectContent>
            </Select>

            {modality === "my" && (
              <>
                <Label htmlFor="address">Endereço *</Label>
                <InputGroup>
                  <InputGroupInput
                    id="address"
                    placeholder="Informe o seu endereço"
                    value={currentAddress}
                    onChange={(e) => setCurrentAddress(e.target.value)}
                    required={modality === "my"}
                  />
                  <InputGroupAddon
                    align="inline-end"
                    className="cursor-pointer bg-accent/40 border-l pl-1 hover:bg-accent/60 transition-colors"
                    onClick={getCurrentLocation}
                  >
                    <MapPinIcon size={16} /> Endereço atual
                  </InputGroupAddon>
                </InputGroup>

                <div className="h-[400px] w-full rounded-lg overflow-hidden border">
                  <Map
                    center={currentPosition || [-74.006, 40.7128]}
                    zoom={12}
                  />
                </div>
              </>
            )}
          </>
        )}

        {currentStep === 2 && (
          <>
            <h1 className="text-xl font-bold">Profissionais</h1>
            <small className="text-sm mb-3 -mt-3 text-gray-500">
              Lista de profissionais associados a este serviço. A seleção do
              profissional é opcional.
            </small>

            <InputGroup>
              <InputGroupAddon>
                <Search size={16} />
              </InputGroupAddon>
              <InputGroupInput
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filtrar profissionais"
              />
              <InputGroupAddon align="inline-end">
                <User size={16} />
              </InputGroupAddon>
            </InputGroup>

            <div className="grid md:grid-cols-2 gap-4">
              {verifyArrayDisponiblity(filteredProfessionals) &&
                filteredProfessionals.map((item, idx) => (
                  <div
                    onClick={() => {
                      setSelectedProfessional({
                        id: item.id,
                        index: idx,
                      });
                    }}
                    key={idx}
                    className={clsx(
                      "flex flex-col gap-2 p-3 rounded-lg hover:bg-accent transition-all cursor-pointer border",
                      {
                        "border-gray-300 bg-accent":
                          selectedProfessional.index === idx,
                        "border-transparent":
                          selectedProfessional.index !== idx,
                      }
                    )}
                  >
                    <PaymentAvatar user={item} notColl={false} />
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {item.firstName} {item.lastName}
                      </span>
                      <small className="text-gray-500">{item.email}</small>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}

        {currentStep === 3 && (
          <>
            <h1 className="text-center font-bold text-3xl text-pretty">
              {service.price.toLocaleString("pt-BR")},00 {service.currency}
            </h1>

            <div className="space-y-4">
              <div>
                <Label htmlFor="iban">IBAN para transferência</Label>
                <InputGroup>
                  <InputGroupInput
                    id="iban"
                    value={"AO06004000008826114110144"}
                    disabled
                  />
                  <InputGroupAddon
                    className="bg-black text-white flex justify-center items-center p-2 rounded-sm hover:bg-gray-800 cursor-pointer transition-colors"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        "AO06004000008826114110144"
                      );
                      toast.success("IBAN copiado");
                    }}
                    align="inline-end"
                  >
                    <Copy size={16} /> Copiar
                  </InputGroupAddon>
                </InputGroup>
              </div>

              <div>
                <Label htmlFor="express">Express (USD)</Label>
                <InputGroup>
                  <InputGroupInput id="express" value={"9355555000"} disabled />
                  <InputGroupAddon
                    className="bg-black text-white flex justify-center items-center p-2 rounded-sm hover:bg-gray-800 cursor-pointer transition-colors"
                    onClick={() => {
                      navigator.clipboard.writeText("9355555000");
                      toast.success("Express copiado");
                    }}
                    align="inline-end"
                  >
                    <Copy size={16} /> Copiar
                  </InputGroupAddon>
                </InputGroup>
              </div>

              <div>
                <Label htmlFor="proof">Comprovativo de pagamento *</Label>
                <InputGroup>
                  <InputGroupAddon>
                    <File size={16} />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="proof"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setProofFile(file);
                      if (file) {
                        toast.success("Comprovativo anexado");
                      }
                    }}
                    required
                  />
                </InputGroup>
                <small className="text-gray-500">
                  Aceito: PDF, JPG, PNG (máx. 5MB)
                </small>
              </div>

              <div>
                <Label>Método de pagamento utilizado *</Label>
                <div className="grid lg:grid-cols-3 grid-cols-2 gap-4 mt-2">
                  {paymentMethodConstats.map((item, idx) => (
                    <div
                      className={clsx(
                        "flex flex-col justify-center transition-all items-center border p-3 rounded-lg cursor-pointer hover:bg-accent/50",
                        {
                          "border-gray-300 bg-accent":
                            idx === paymentMethod.index,
                          "border-gray-200": idx !== paymentMethod.index,
                        }
                      )}
                      key={idx}
                      onClick={() => {
                        setPaymentMethod({
                          index: idx,
                          title: item.title,
                        });
                      }}
                    >
                      <img
                        src={item.icon || "/placeholder-icon.png"}
                        className="h-12 w-10 object-contain rounded-sm"
                        alt={item.title}
                      />
                      <small className="mt-2">{item.title}</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex gap-3 mt-4">
          <div className="flex gap-2">
            <Button
              disabled={currentStep === 0}
              onClick={() => setCurrentStep((prev) => prev - 1)}
              type="button"
              variant="outline"
            >
              <ArrowLeft size={16} /> Anterior
            </Button>
            <Button
              disabled={currentStep >= steps.length - 1}
              type="button"
              onClick={() => {
                if (validateCurrentStep()) {
                  setCurrentStep((prev) => prev + 1);
                }
              }}
              variant="outline"
            >
              Próximo <ArrowRight size={16} />
            </Button>
          </div>
          <Button className="flex-1" type="submit">
            {currentStep < steps.length - 1 ? "Continuar" : "Finalizar Reserva"}
          </Button>
        </div>
      </form>
    </div>
  );
}
