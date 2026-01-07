"use client";

import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";

import whaterMArk from "@/assets/images/selo.png";
import login1 from "@/assets/images/login.png";
import login2 from "@/assets/images/login4.png";
import login3 from "@/assets/images/login3.png";
import logo from "@/assets/images/whiteLogo.png";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const images = [login1, login2, login3];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000); // ⏱️ 5 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="h-screen w-screen overflow-hidden grid lg:grid-cols-2">
      {/* LEFT SIDE */}
      <aside className="relative hidden lg:flex">
        {/* Background slider */}
        {images.map((img, index) => (
          <Image
            key={index}
            src={img}
            alt="Login background"
            fill
            priority={index === 0}
            className={`object-cover transition-opacity duration-1000 ${
              current === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Logo */}
        <Image
          className="absolute top-6 left-6 h-10 w-auto z-10"
          src={logo}
          alt="Logo"
        />

        {/* Watermark */}
        <Image
          className="absolute top-[40%] left-[40%] w-52 opacity-30 z-10"
          src={whaterMArk}
          alt="Watermark"
        />

        {/* Content */}
        <div className="absolute bottom-20 left-6 z-10 flex flex-col gap-8">
          <h1 className="text-white text-5xl font-black leading-tight max-w-xl">
            Conectamos clientes e prestadores de
            <span className="text-orange-500"> serviços imobiliários</span>.
          </h1>

          {/* Indicators */}
          <div className="flex gap-3">
            {images.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-500 ${
                  current === index ? "w-16 bg-orange-500" : "w-6 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </aside>

      {/* RIGHT SIDE */}
      {children}
    </section>
  );
}
