"use client";

import { useState } from "react";
import logowhite from "@/assets/images/whiteLogo.png";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function LandingPageHeader() {
  const [open, setOpen] = useState(false);

  const links = [
    { title: "Home", to: "/" },
    { title: "Sobre", to: "#about" },
    { title: "Contacto", to: "#contacts" },
    { title: "Serviços", to: "/services" },
  ];

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-black/30 backdrop-blur text-white">
      <div className="flex items-center justify-between p-4 lg:px-10">
        {/* Logo */}
        <Image className="h-12 w-auto" src={logowhite} alt="LogoWhite" />

        {/* Desktop menu */}
        <div className="hidden lg:flex items-center gap-20">
          <nav className="flex items-center gap-6">
            {links.map((item, idx) => (
              <Link
                key={idx}
                href={item.to}
                className="hover:text-red-500 transition"
              >
                {item.title}
              </Link>
            ))}
          </nav>
          <Link href={"/auth/login"} onClick={() => setOpen(false)}>
            <Button className="w-full" variant="destructive">
              Acessar
            </Button>
          </Link>
        </div>

        {/* Mobile button */}
        <button className="lg:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-black/30 px-6 py-6 space-y-4">
          {links.map((item, idx) => (
            <Link
              key={idx}
              href={item.to}
              onClick={() => setOpen(false)}
              className="block text-lg hover:text-red-500"
            >
              {item.title}
            </Link>
          ))}
          <Link href={"/auth/login"} onClick={() => setOpen(false)}>
            <Button className="w-full" variant="destructive">
              Acessar
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}
