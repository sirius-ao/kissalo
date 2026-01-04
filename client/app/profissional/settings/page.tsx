"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, Briefcase, Star, LogOut } from "lucide-react";

import PersonalProfile from "./tabs/PersonalProfile";
import ProfessionalProfile from "./tabs/ProfessionalProfile";
import Security from "./tabs/Security";
import Reviews from "./tabs/Reviews";
import LogoutTab from "./tabs/Logout";

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">⚙️ Configurações</h1>

      <Tabs defaultValue="personal" className="flex gap-6 overflow-visible">
        <TabsList className="ld:flex grid grid-cols-2 w-full gap-3 h-auto bg-transparent border">
          <TabsTrigger value="personal" className="justify-start gap-2 ">
            <User size={16} /> Perfil pessoal
          </TabsTrigger>

          <TabsTrigger value="professional" className="justify-start gap-2 ">
            <Briefcase size={16} /> Perfil profissional
          </TabsTrigger>

          <TabsTrigger value="security" className="justify-start gap-2 ">
            <Lock size={16} /> Segurança
          </TabsTrigger>

          <TabsTrigger value="reviews" className="justify-start gap-2 ">
            <Star size={16} /> Avaliações
          </TabsTrigger>

          <TabsTrigger value="logout" className="justify-start gap-2">
            <LogOut size={16} /> Logout
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 lg:pt-10 pt-10 ">
          <TabsContent value="personal">
            <PersonalProfile />
          </TabsContent>

          <TabsContent value="professional">
            <ProfessionalProfile />
          </TabsContent>

          <TabsContent value="security">
            <Security />
          </TabsContent>

          <TabsContent value="reviews">
            <Reviews />
          </TabsContent>

          <TabsContent value="logout">
            <LogoutTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
