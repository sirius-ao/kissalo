"use client";

import { useParams, useRouter } from "next/navigation";
import { usersCustomersMock, usersProfessionalsMock } from "@/mocks/users";
import { IUser } from "@/types/interfaces";
import { UserRole, UserStatus } from "@/types/enum";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Calendar, Star, Wallet, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Loader } from "@/components/Loader";
import constants from "@/constants";

export default function UserDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const users: IUser[] = [...usersCustomersMock, ...usersProfessionalsMock];
  const [load, setIsLoading] = useState(true);
  const [isProfessional, setisProfessional] = useState(false);
  const user = users.find((u) => {
    return u.id === Number(id);
  });

  useEffect(() => {
    if (user) {
      setisProfessional(user.role === UserRole.PROFESSIONAL);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, constants.TIMEOUT.LOADER);
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
                        {user.createdAt.toLocaleDateString()}
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
              <Tabs defaultValue="profile">
                <TabsList>
                  <TabsTrigger value="profile">Perfil</TabsTrigger>

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

                {/* PERFIL */}
                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informações do perfil</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                      <p>
                        <strong>Último login:</strong>{" "}
                        {user.lastLoginAt
                          ? user.lastLoginAt.toLocaleString()
                          : "Nunca"}
                      </p>
                      <p>
                        <strong>Total de pagamentos:</strong>{" "}
                        {user.payments.length}
                      </p>
                      <p>
                        <strong>Total de notificações:</strong>{" "}
                        {user.notifications.length}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* PROFISSIONAL */}
                {isProfessional && user.professional && (
                  <TabsContent value="professional">
                    <Card>
                      <CardHeader>
                        <CardTitle>Dados profissionais</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p>
                          <strong>Título:</strong> {user.professional.title}
                        </p>
                        <p>
                          <strong>Experiência:</strong>{" "}
                          {user.professional.yearsExperience} anos
                        </p>
                        <p>
                          <strong>Tipo:</strong> {user.professional.type}
                        </p>
                        <p>
                          <strong>Status de verificação:</strong>{" "}
                          <Badge>{user.professional.verificationStatus}</Badge>
                        </p>

                        <div>
                          <strong>Especialidades:</strong>
                          <div className="mt-1 flex flex-wrap gap-2">
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

                {/* SERVIÇOS PRESTADOS */}
                {isProfessional && (
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
                      {user.reviews.length ? (
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
                        {user.professional?.wallets.length ? (
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
                        {user.bookings.length ? (
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
