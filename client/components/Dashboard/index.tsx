import { ReactNode } from "react";
import { SideBar } from "../SideBar";
import { DshBoardHeader } from "../DasBoardHeader";
import { UserContextProvider } from "@/context/userContext";

export function DashBoard({ children }: { children: ReactNode }) {
  return (
    <UserContextProvider>
      <main className="w-full overflow-x-clip min-h-screen flex justify-end">
        <SideBar />
        <DshBoardHeader />
        <section className="lg:w-[85%] w-full pt-24 px-3 lg:pb-10 md:pb-30 pb-60">
          {children}
        </section>
      </main>
    </UserContextProvider>
  );
}
