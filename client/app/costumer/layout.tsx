"use client";

import { DashBoard } from "@/components/Dashboard";

export default function DashBoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashBoard children={children} />;
}
