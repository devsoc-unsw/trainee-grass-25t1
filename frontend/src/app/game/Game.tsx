"use client";

import { useEffect, useRef, useState } from "react";
import GameController from "./GameController";
import AvatarOptions from "./components/huds/AvatarOptions";
import { BackgroundName, SpriteName } from "./gameAssets";
import BackgroundOptions from "./components/huds/BackgroundOptions";
import LevelMenu from "./components/huds/LevelMenu";
import LeaderboardDialog from "./components/huds/leaderboard/LeaderboardDialog";
import useAuth from "@/hooks/useAuth";
import UserProfile from "./components/huds/UserProfile";

export default function Game() {
  // States
  const [gameController] = useState<GameController>(() => new GameController());
  const [avatar, setAvatar] = useState<SpriteName>("default");
  const [background, setBackground] = useState<BackgroundName>("mountain");

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // User data
  const { user } = useAuth();

  useEffect(() => {
    if (canvasRef.current) {
      const gameWidth = 1920;
      const gameHeight = 1080;

      // Initialise the game with the canvas, player sprite, and background
      gameController.initGame(canvasRef.current, avatar, background);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef, gameController]);

  useEffect(() => {
    gameController.changeBackground(background);
  }, [gameController, background]);

  useEffect(() => {
    gameController.changePlayer(avatar);
  }, [gameController, avatar]);

  useEffect(() => {
    if (user?.activeAvatar) {
      setAvatar(user.activeAvatar as SpriteName);
    }
    if (user?.activeBackground) {
      setBackground(user.activeBackground as BackgroundName);
    }
  }, [user]);

  return (
    <div className="bg-foreground overflow-hidden relative flex items-center justify-center">
      <nav className="absolute top-0 flex justify-between p-4 w-full">
        {/* TODO: Left section of Navbar */}
        <div className="flex gap-2 items-center">
          <AvatarOptions
            avatar={avatar}
            setAvatar={setAvatar}
            avatarsUnlocked={(user?.avatarUnlocked as SpriteName[]) || []}
          />
          <BackgroundOptions
            background={background}
            setBackground={setBackground}
            backgroundsUnlocked={
              (user?.backgroundUnlocked as BackgroundName[]) || []
            }
          />
          <LevelMenu user={user} />
        </div>
        {/* TODO: Right section of Navbar */}
        <div className="flex gap-2 items-center">
          <LeaderboardDialog />
          <UserProfile userName={user?.username} />
        </div>
      </nav>
      <canvas ref={canvasRef} id="game" />
    </div>
  );
}
