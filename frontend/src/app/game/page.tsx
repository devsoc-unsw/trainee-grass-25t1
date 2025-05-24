"use client";

import dynamic from "next/dynamic";

// Prevents SSR and hydration issues
const Game = dynamic(() => import("./Game"), { ssr: false });

export default function Page() {
  return (
    <main suppressHydrationWarning>
      <Game />
    </main>
  );
}
