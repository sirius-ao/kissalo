"use client";

import { useParams, useRouter } from "next/navigation";
import { usersCustomersMock, usersProfessionalsMock } from "@/mocks/users";
import {
  Briefcase,
  ShieldCheck,
  FileText,
  IdCard,
  Link as LinkIcon,
} from "lucide-react";
import {
  IProfessionalServiceRequest,
  IUser,
  IWallet,
} from "@/types/interfaces";
import { ApprovalStatus, UserRole, UserStatus } from "@/types/enum";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Calendar, Star, Wallet, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Loader } from "@/components/Loader";
import constants from "@/constants";
import { UsersService } from "@/services/Users/index.service";
import { verify } from "crypto";
import { verifyArrayDisponiblity } from "@/lib/utils";

export default function UserDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<IUser>({} as any);
  const [load, setIsLoading] = useState(true);
  const [isProfessional, setisProfessional] = useState(false);

  useEffect(() => {
    if (user) {
      setisProfessional(user.role === UserRole.PROFESSIONAL);
    }
    async function get() {
      const serviceApi = new UsersService(
        localStorage.getItem("acess-x-token") as string
      );
      const data = await serviceApi.getById(Number(id));
      if (data?.logout) {
        router.push("/auth/login");
        return;
      }
      if (data?.data) {
        setUser(data?.data);
      }
      setTimeout(() => {
        setIsLoading(false);
      }, constants.TIMEOUT.LOADER);
    }
    get();
  }, [user]);

  return (
    <section className="space-y-6">
      {load ? (
        <Loader />
      ) : (
        <>
          {user ? (
            <>
              <Card>
                <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback>
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <h1 className="text-2xl font-bold">
                      {user.firstName} {user.lastName}
                    </h1>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge>{user.role}</Badge>
                      <Badge
                        variant={
                          user.status === UserStatus.ACTIVE
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {user.status}
                      </Badge>
                      {user.isEmailVerified && (
                        <Badge variant="default">Email verificado</Badge>
                      )}
                    </div>

                    <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Mail className="h-4 w-4" /> {user.email}
                      </span>
                      <span className="flex items-center gap-2">
                        <Phone className="h-4 w-4" /> {user.phone}
                      </span>
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> Criado em{" "}
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Saldo disponível
                    </p>
                    <p className="text-xl font-semibold">
                      {user.amountAvaliable.toLocaleString()} Kz
                    </p>
                  </div>
                </CardContent>
              </Card>
              {/* TABS */}
              <Tabs defaultValue={isProfessional ? "professional" : "bookings"}>
                <TabsList>
                  {isProfessional ? (
                    <>
                      <TabsTrigger value="professional">
                        Profissional
                      </TabsTrigger>
                      <TabsTrigger value="services">Serviços</TabsTrigger>
                      <TabsTrigger value="reviews">Avaliações</TabsTrigger>
                      <TabsTrigger value="wallets">Carteiras</TabsTrigger>
                    </>
                  ) : (
                    <>
                      <TabsTrigger value="bookings">
                        Serviços contratados
                      </TabsTrigger>
                      <TabsTrigger value="reviews">
                        Avaliações feitas
                      </TabsTrigger>
                    </>
                  )}
                </TabsList>

                {isProfessional && user.professional && (
                  <TabsContent value="professional">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Briefcase className="w-5 h-5 text-primary" />
                          Dados profissionais
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="space-y-4 text-sm">
                        {/* Título */}
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">Título:</span>
                          <span>{user.professional.title}</span>
                        </div>

                        {/* Experiência */}
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">Experiência:</span>
                          <span>{user.professional.yearsExperience} anos</span>
                        </div>

                        {/* Tipo */}
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">Tipo:</span>
                          <Badge variant="secondary">
                            {user.professional.type}
                          </Badge>
                        </div>

                        {/* Verificação */}
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">Verificação:</span>
                          <Badge
                            variant={
                              user.professional.verificationStatus ===
                              ApprovalStatus.APPROVED
                                ? "default"
                                : "outline"
                            }
                          >
                            {user.professional.verificationStatus}
                          </Badge>
                        </div>

                        {/* Documento */}
                        <div className="flex items-center gap-2">
                          <IdCard className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">Documento:</span>
                          <span>{user.professional.documentNumber}</span>
                        </div>

                        {/* CV */}
                        {user.professional.cvUrl && (
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">CV:</span>
                            <a
                              href={user.professional.cvUrl}
                              target="_blank"
                              className="text-blue-500 hover:underline flex items-center gap-1"
                            >
                              Ver CV <LinkIcon size={12} />
                            </a>
                          </div>
                        )}

                        {/* Portfólio */}
                        {user.professional.portfolioUrl && (
                          <div className="flex items-center gap-2">
                            <LinkIcon className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">Portfólio:</span>
                            <a
                              href={user.professional.portfolioUrl}
                              target="_blank"
                              className="text-blue-500 hover:underline"
                            >
                              Acessar
                            </a>
                          </div>
                        )}

                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Star className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">Especialidades</span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {user.professional.specialties.map((s) => (
                              <Badge key={s} variant="outline">
                                {s}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}

                {isProfessional &&
                  verifyArrayDisponiblity(
                    user.professional
                      ?.serviceRequests as IProfessionalServiceRequest[]
                  ) && (
                    <TabsContent value="services">
                      <Card>
                        <CardHeader>
                          <CardTitle>Serviços anexados</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {user.professional?.serviceRequests.length ? (
                            <ul className="space-y-3">
                              {user.professional.serviceRequests.map((s) => (
                                <li key={s.id} className="flex justify-between">
                                  <span>{s.service.title}</span>
                                  <Badge>{s.status}</Badge>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-muted-foreground">
                              Nenhum serviço anexado
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  )}

                {/* REVIEWS */}
                <TabsContent value="reviews">
                  <Card>
                    <CardHeader>
                      <CardTitle>Avaliações</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {verifyArrayDisponiblity(user.reviews) &&
                      user.reviews.length ? (
                        <ul className="space-y-4">
                          {user.reviews.map((r) => (
                            <li key={r.id} className="rounded border p-3">
                              <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <strong>{r.rating}</strong>
                              </div>
                              <p className="text-sm">{r.comment}</p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground">
                          Nenhuma avaliação registrada
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* CARTEIRAS */}
                {isProfessional && (
                  <TabsContent value="wallets">
                    <Card>
                      <CardHeader>
                        <CardTitle>Carteiras</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {verifyArrayDisponiblity(
                          user.professional?.wallets as IWallet[]
                        ) && user.professional?.wallets.length ? (
                          <ul className="space-y-3">
                            {user.professional.wallets.map((w) => (
                              <li
                                key={w.id}
                                className="flex items-center gap-2"
                              >
                                <Wallet className="h-4 w-4" />
                                {w.bankName} — {w.accountNumber}
                                {w.isVerified && (
                                  <Badge variant="default">Verificada</Badge>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted-foreground">
                            Nenhuma carteira cadastrada
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}

                {/* BOOKINGS CLIENTE */}
                {!isProfessional && (
                  <TabsContent value="bookings">
                    <Card>
                      <CardHeader>
                        <CardTitle>Serviços contratados</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {verifyArrayDisponiblity(user.bookings) &&
                        user.bookings.length ? (
                          <ul className="space-y-3">
                            {user.bookings.map((b) => (
                              <li key={b.id} className="flex justify-between">
                                <span>{b.service.title}</span>
                                <Badge>{b.status}</Badge>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted-foreground">
                            Nenhum serviço contratado
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}
              </Tabs>
            </>
          ) : (
            <p className="text-muted-foreground">Usuário não encontrado</p>
          )}
          <Button
            onClick={() => {
              router.back();
            }}
            variant={"outline"}
          >
            <ArrowLeft />
            Voltar
          </Button>
        </>
      )}
    </section>
  );
}
