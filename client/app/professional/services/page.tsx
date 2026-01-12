import { Suspense } from "react";
import ServiceProfissionalPage from ".";

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ServiceProfissionalPage />
    </Suspense>
  );
}
