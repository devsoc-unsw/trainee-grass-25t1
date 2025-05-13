"use client";

import { useEffect, useRef, useState } from "react";
import GameController from "./GameController";
import AvatarOptions from "./components/huds/AvatarOptions";
import { SpriteName } from "./gameAssets";

export default function Game() {
  // States
  const [gameController] = useState<GameController>(() => new GameController());
  const [avatar, setAvatar] = useState<SpriteName>("default");

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const gameWidth = 1920;
      const gameHeight = 1080;

      // Initialise the game with the canvas, player sprite, and background
      gameController.initGame(canvasRef.current, avatar, "night_sky");

      /**
       * Function to resize the canvas to fit the window height
       * @param canvas - The canvas element to resize
       * @param gameWidth - The internal game width
       * @param gameHeight - The internal game height
       */
      const resizeFitToHeight = (
        canvas: HTMLCanvasElement,
        gameWidth: number,
        gameHeight: number
      ) => {
        // Get the current window height
        const screenHeight = window.innerHeight;

        // Calculate how much we need to scale to fit the window height
        const scaleFactor = screenHeight / gameHeight;

        // Calculate the proportional width based on the scale factor
        const scaledWidth = gameWidth * scaleFactor;

        // Apply the new dimensions to the canvas style
        // Note: This changes the display size, not the internal canvas resolution
        canvas.style.height = `${screenHeight}px`;
        canvas.style.width = `${scaledWidth}px`;
      };

      const handleResize = () =>
        resizeFitToHeight(canvasRef.current!, gameWidth, gameHeight);

      // Resize the canvas to fit the window height immediately
      handleResize();

      // Resize the canvas when the window is resized
      window.addEventListener("resize", handleResize);

      // Clean up function
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [canvasRef, gameController, avatar]);

  useEffect(() => {
    gameController.changePlayer(avatar);
  }, [gameController, avatar]);

  return (
    <div className="overflow-hidden relative flex items-center justify-center">
      <nav className="absolute top-0 flex justify-between p-4">
        {/* TODO: Left section of Navbar */}
        <div>
          <AvatarOptions avatar={avatar} setAvatar={setAvatar} />
        </div>
        {/* TODO: Right section of Navbar */}
        <div></div>
      </nav>
      <canvas ref={canvasRef} id="game" />
    </div>
  );
}
