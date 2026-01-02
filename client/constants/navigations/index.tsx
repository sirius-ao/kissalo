import {
  CalendarCog,
  CircleDollarSign,
  CreditCard,
  LayoutGrid,
  PaintRoller,
  Settings,
} from "lucide-react";
import { ReactNode } from "react";

export const navigations: Record<string, INavItem[]> = {
  PROFISSIONAL: [
    {
      title: "Inicial",
      to: "/profissional",
      icon: <LayoutGrid size={17} />,
    },
    {
      title: "Serviços",
      to: "/profissional/services",
      icon: <PaintRoller size={17} />,
    },
    {
      title: "Agendamentos",
      to: "/profissional/bookings",
      icon: <CalendarCog size={17} />,
    },
    {
      title: "Pagamentos",
      to: "/profissional/payments",
      icon: <CircleDollarSign size={17} />,
    },
    {
      title: "Perfil",
      to: "/profissional/settings",
      icon: <Settings size={17} />,
    },
  ],
  CUSTOMER: [],
};

export interface INavItem {
  title: string;
  to: string;
  icon: ReactNode;
}
