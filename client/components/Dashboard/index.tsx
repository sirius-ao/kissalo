import { ReactNode } from "react";
import { SideBar } from "../SideBar";
import { DshBoardHeader } from "../DasBoardHeader";

export function DashBoard({ children }: { children: ReactNode }) {
  return (
    <main className="w-full min-h-screen flex justify-end">
      <SideBar />
      <DshBoardHeader />
      <section className="lg:w-[85%] w-full pt-24 px-3 lg:pb-10 pb-30">
        {children}
      </section>
    </main>
  );
}
