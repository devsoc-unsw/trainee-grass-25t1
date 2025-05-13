"use client";

import { useEffect, useRef, useState } from "react";
import GameController from "./game.controller";

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameController] = useState<GameController>(() => new GameController());

  useEffect(() => {
    if (canvasRef.current) {
      gameController.initGame(canvasRef.current, "beginner_sprout", "mountain");
    }
  }, [canvasRef.current]);

  return <canvas ref={canvasRef} id="game" />;
}
