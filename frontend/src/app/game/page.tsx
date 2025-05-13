"use client";

import { useEffect, useRef } from "react";
import initGame from "./initGame";

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      initGame(canvasRef.current);
    }
  }, [canvasRef.current]);

  return <canvas ref={canvasRef} id="game" />;
}
