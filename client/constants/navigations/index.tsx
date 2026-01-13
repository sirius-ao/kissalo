import { UserRole } from "@/types/enum";
import { IconChecklist } from "@tabler/icons-react";
import {
  CalendarCog,
  CircleDollarSign,
  CreditCard,
  GitBranch,
  LayoutGrid,
  PaintRoller,
  Settings,
  User2,
  Users,
} from "lucide-react";
import { ReactNode } from "react";

export const navigations: Record<UserRole, INavItem[]> = {
  PROFESSIONAL: [
    {
      title: "Serviços",
      to: "/professional",
      icon: <LayoutGrid size={17} />,
    },
    {
      title: "Agendamentos",
      to: "/professional/bookings",
      icon: <CalendarCog size={17} />,
    },
    {
      title: "Pagamentos",
      to: "/professional/payments",
      icon: <CircleDollarSign size={17} />,
    },
    {
      title: "Perfil",
      to: "/professional/settings",
      icon: <Settings size={17} />,
    },
  ],
  CUSTOMER: [
    {
      title: "Inicial",
      to: "/customer",
      icon: <LayoutGrid size={17} />,
    },
    {
      title: "Históricos",
      to: "/customer/history",
      icon: <IconChecklist size={17} />,
    },
    {
      title: "Perfil",
      to: "/customer/settings",
      icon: <User2 size={17} />,
    },
  ],
  ADMIN: [
    {
      title: "Usuários",
      to: "/admin",
      icon: <Users size={17} />,
    },
    {
      title: "Agendamentos",
      to: "/admin/bookings",
      icon: <PaintRoller size={17} />,
    },
    {
      title: "Pagamentos",
      to: "/admin/payments",
      icon: <CreditCard size={17} />,
    },
    {
      title: "Serviços",
      to: "/admin/services",
      icon: <GitBranch size={17} />,
    },
    {
      title: "Configurações",
      to: "/admin/settings",
      icon: <Settings size={17} />,
    },
  ],
};

export interface INavItem {
  title: string;
  to: string;
  icon: ReactNode;
}
