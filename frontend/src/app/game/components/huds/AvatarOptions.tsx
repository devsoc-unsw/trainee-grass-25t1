"use client";

import CameraFace from "@/components/icons/CameraFace";
import { Dialog } from "@/components/ui/Dialog";
import { DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { DialogClose, DialogTitle } from "@radix-ui/react-dialog";
import {
  Sprite,
  SpriteName,
  SPRITES,
  SPRITES_MAP,
} from "@/app/game/gameAssets";
import { useEffect, useRef, useState } from "react";
import GameButton from "@/app/game/components/GameButton";

export default function AvatarOptions({
  avatar,
  setAvatar,
}: {
  avatar: SpriteName;
  setAvatar: (s: SpriteName) => void;
}) {
  const [selectedAvatar, setSelectedAvatar] = useState<SpriteName>(avatar);

  useEffect(() => {
    setSelectedAvatar(avatar);
  }, [avatar]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <GameButton tooltipText="Avatars">
          <CameraFace width={32} height={32} />
        </GameButton>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="font-bold text-center text-xl">
          Change Avatar
        </DialogTitle>
        <div className="flex justify-center gap-4">
          {/* Avatar Preview - Shows animated version of selected avatar */}
          <div className="flex-1 flex justify-center items-center">
            <AnimatedAvatarPreview
              sprite={SPRITES_MAP.get(selectedAvatar)!}
              width={256}
              height={256}
              isStatic={false} // Animation enabled for the preview
            />
          </div>
          {/* Grid of selectable avatar options */}
          <div className="grid grid-cols-2 h-96 overflow-y-auto">
            {SPRITES.map((sprite) => (
              <AvatarOption
                key={sprite.name}
                sprite={sprite}
                selectedAvatar={selectedAvatar}
                setSelectedAvatar={setSelectedAvatar}
              />
            ))}
          </div>
        </div>
        <DialogClose
          className="bg-foreground text-background w-full p-2 rounded-md cursor-pointer duration-150 disabled:opacity-15 hover:bg-foreground/85 disabled:cursor-not-allowed"
          disabled={avatar === selectedAvatar}
          onClick={() => setAvatar(selectedAvatar)}
        >
          Save Avatar
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

function AnimatedAvatarPreview({
  sprite,
  width,
  height,
  isStatic = true,
}: {
  sprite: Sprite;
  width: number;
  height: number;
  isStatic?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0); // Tracks the current animation frame
  const intervalRef = useRef<number | null>(null); // Holds the animation interval ID for cleanup

  useEffect(() => {
    // Get canvas drawing context
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    // Disable smoothing to keep pixel art crisp
    ctx.imageSmoothingEnabled = false;

    // Load the sprite sheet image
    const image = new Image();
    image.src = sprite.path;

    /**
     * Draws the current frame of the sprite animation to canvas
     * Uses sprite slicing to extract individual frames from a sprite sheet
     */
    const draw = () => {
      if (!canvasRef.current || !image.complete) return;

      // Get the frame ID from the sprite's idle animation sequence
      const frameId = sprite.anims.idle.frames[frameRef.current];

      // Calculate the position of this frame on the sprite sheet
      const frameX = frameId % sprite.sliceX;
      const frameY = Math.floor(frameId / sprite.sliceX);

      // Calculate the width and height of each frame on the sprite sheet
      const frameWidth = image.width / sprite.sliceX;
      const frameHeight = image.height / sprite.sliceY;

      // Clear the canvas before drawing new frame
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // Draw the specific frame from the sprite sheet to the canvas
      ctx.drawImage(
        image,
        frameX * frameWidth,
        frameY * frameHeight,
        frameWidth,
        frameHeight,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    };

    // When image loads, set up animation loop
    image.onload = () => {
      frameRef.current = 0;
      draw();

      // Skip animation setup if static
      if (isStatic) return;

      // Clear any existing animation interval
      if (intervalRef.current) clearInterval(intervalRef.current);

      // Set up animation loop
      intervalRef.current = window.setInterval(() => {
        frameRef.current =
          (frameRef.current + 1) % sprite.anims.idle.frames.length;
        draw();
      }, 1000 / sprite.anims.idle.speed); // Convert speed to milliseconds
    };

    // Clear canvas on initial render
    ctx.clearRect(0, 0, width, height);

    // Cleanup function
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [canvasRef, sprite, width, height, isStatic]);

  return (
    <canvas ref={canvasRef} id="sprite-preview" width={width} height={height} />
  );
}

function AvatarOption({
  sprite,
  selectedAvatar,
  setSelectedAvatar,
}: {
  sprite: Sprite;
  selectedAvatar: SpriteName;
  setSelectedAvatar: (s: SpriteName) => void;
}) {
  return (
    <label
      key={sprite.displayName}
      htmlFor={sprite.displayName}
      className="flex flex-col justify-center items-center p-2"
    >
      <input
        type="radio"
        id={sprite.displayName}
        name="avatar-options"
        value={sprite.name}
        checked={sprite.name === selectedAvatar}
        onChange={() => setSelectedAvatar(sprite.name as SpriteName)}
        className="sr-only peer" // Hidden visually but accessible to screen readers
      />
      <div className="p-1 rounded-md border-4 border-foreground/25 peer-checked:border-green-500">
        <AnimatedAvatarPreview sprite={sprite} width={128} height={128} />
      </div>
      <p
        className={`text-sm text-center text-ellipsis peer-checked:text-green-500 ${
          sprite.name === selectedAvatar && "font-bold"
        }`}
      >
        {sprite.displayName}
      </p>
    </label>
  );
}
