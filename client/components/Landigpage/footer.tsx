import Image from "next/image";
import Link from "next/link";

import logo from "@/assets/images/logoSolo.png";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
} from "@tabler/icons-react";

export function Footer() {
  return (
    <footer className="w-full bg-white border-t mt-30">
      <div className="lg:px-35 px-6 py-16 grid lg:grid-cols-4 gap-10">
        {/* Logo + descrição */}
        <div className="flex flex-col gap-4">
          <Image src={logo} alt="Kisalo Logo" className="w-12 h-12" />
          <p className="text-gray-500 text-sm">
            Todo o conteúdo deste site é protegido por direitos autorais e não
            pode ser usado sem a permissão da Kissalo.
          </p>
        </div>

        {/* Navegação */}
        <div className="flex flex-col gap-3">
          <strong className="text-sm font-semibold">Navegação</strong>
          <Link href="/">Home</Link>
          <Link href="/contacto">Contacto</Link>
          <Link href="/sobre">Sobre</Link>
          <Link href="/servicos">Serviços</Link>
          <Link href="/prestar-servicos">Prestar Serviços</Link>
        </div>

        {/* Central */}
        <div className="flex flex-col gap-3">
          <strong className="text-sm font-semibold">Central</strong>
          <Link href="/contacto">Fale connosco</Link>
          <Link href="/faq">Dúvidas frequentes</Link>
          <Link href="/suporte">Central de apoio</Link>
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-3">
          <strong className="text-sm font-semibold">Legal</strong>
          <Link href="/politica-privacidade">Política de privacidade</Link>
          <Link href="/termos">Termos de uso</Link>
          <Link href="/cookies">Políticas de Cookies</Link>
          <Link href="/seguranca">Segurança</Link>
        </div>
      </div>

      {/* Bottom */}
      <div className="lg:px-35 px-6 py-6 border-t flex flex-col lg:flex-row gap-6 items-center justify-between">
        {/* Redes sociais */}
        <div className="flex gap-4">
          <IconBrandFacebook className="h-5 w-5" />
          <IconBrandLinkedin className="h-5 w-5" />
          <IconBrandInstagram className="h-5 w-5" />
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm text-gray-400 py-4 border-t">
        © copyright - todos os direitos reservados para Kisalo 2025
      </div>
    </footer>
  );
}
