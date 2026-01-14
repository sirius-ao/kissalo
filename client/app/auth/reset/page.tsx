import { Suspense } from "react";
import ResetClient from "./reset";

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ResetClient />
    </Suspense>
  );
}
