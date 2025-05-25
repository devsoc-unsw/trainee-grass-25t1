"use client";
import { useEffect, useRef, useState } from "react";
import GameController from "./GameController";
import AvatarOptions from "./components/huds/AvatarOptions";
import { BackgroundName, SpriteName } from "./gameAssets";
import BackgroundOptions from "./components/huds/BackgroundOptions";

import LevelMenu from "./components/huds/LevelMenu";
import LeaderboardDialog from "./components/huds/leaderboard/LeaderboardDialog";
import useAuth from "@/hooks/useAuth";
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



