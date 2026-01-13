"use client";

import { About } from "@/components/Landigpage/about";
import { Faq } from "@/components/Landigpage/flaqs";
import { Footer } from "@/components/Landigpage/footer";
import LandingPageHeader from "@/components/Landigpage/header";
import LandingPageHome from "@/components/Landigpage/home";

export default function Home() {
  return (
    <main className="overflow-x-hidden max-w-screen flex flex-col gap-5 pb-10">
      <LandingPageHeader />
      <LandingPageHome />
      <About />
      <Faq />
      <Footer />
    </main>
  );
}
