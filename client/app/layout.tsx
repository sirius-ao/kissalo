import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kissalo.onrender.com"),

  title: {
    default: "Kissalo – Encontre e Contrate Profissionais Qualificados",
    template: "%s | Kissalo",
  },

  description:
    "Kissalo é uma plataforma digital para encontrar, comparar e contratar profissionais qualificados de forma rápida, segura e eficiente.",

  keywords: [
    "Kissalo",
    "profissionais qualificados",
    "contratar profissionais",
    "serviços profissionais",
    "freelancers",
    "prestadores de serviços",
    "plataforma de serviços",
  ],

  authors: [{ name: "Kissalo" }],
  creator: "Kissalo",
  publisher: "Kissalo",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "pt_PT",
    url: "https://kissalo.onrender.com",
    siteName: "Kissalo",
    title: "Kissalo – Encontre e Contrate Profissionais Qualificados",
    description:
      "Descubra profissionais altamente qualificados em diversas áreas e contrate com confiança através da plataforma Kissalo.",
    images: [
      {
        url: "/Group 39737.png",
        width: 1200,
        height: 630,
        alt: "Kissalo – Plataforma de Profissionais Qualificados",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Kissalo – Encontre Profissionais Qualificados",
    description:
      "A plataforma ideal para encontrar, comparar e contratar profissionais qualificados online.",
    images: ["/Group 39737.png"],
    creator: "@kissalo",
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/Group 39737.png",
    apple: "/apple-touch-icon.png",
  },

  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
