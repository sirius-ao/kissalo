"use client";
import whaterMArk from "@/assets/images/selo.png";
import login1 from "@/assets/images/login.png";
import login2 from "@/assets/images/login4.png";
import login3 from "@/assets/images/login3.png";
import logo from "@/assets/images/whiteLogo.png";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { GitBranch, Play } from "lucide-react";

export default function LandingPageHome() {
  const images = [login1, login2, login3];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    localStorage.clear();
    sessionStorage.clear();
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative flex  min-h-screen w-screen">
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
      {/* Content */}
      <div className="absolute  h-full w-full flex flex-col md:justify-center  md:px-20  p-10 ">
        <span className="w-full lg:w-[50%] text-white flex flex-col gap-2 lg:pb-30 md:pt-0 pt-30">
          <Image className="w-32" src={whaterMArk} alt="Watermark" />
          <h1 className="md:text-7xl text-5xl font-black leading-tight ">
            Conectamos clientes e prestadores de
            <span className="text-orange-500"> serviços imobiliários</span>.
          </h1>
          <p className="lg:w-[80%] w-full">
            Aqui, você encontrará uma plataforma inovadora e prática,criada para
            facilitar a vida das pessoas, com a Kísalo, tens menos Salo
          </p>
          <div className="grid lg:w-[80%] w-full mt-4 grid-cols-2 gap-2">
            <Button
              size={"lg"}
              className="p-2 bg-orange-500 hover:bg-orange-600"
            >
              <Play />
              Acessar
            </Button>
            <Button
              size={"lg"}
              className="p-2 bg-white hover:bg-white text-orange-500"
            >
              <GitBranch />
              Explorar
            </Button>
          </div>
        </span>
      </div>

      <div className="flex gap-3 absolute bottom-20 right-10">
        {images.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-500 ${
              current === index ? "w-16 bg-orange-500" : "w-6 bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
