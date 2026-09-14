import { Suspense } from "react";
import StartProjectPage from "./start-client";

export default function StartPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-dvh items-center justify-center bg-[#fafafa] pt-24 text-sm text-neutral-500">
          Loading…
        </main>
      }
    >
      <StartProjectPage />
    </Suspense>
  );
}
