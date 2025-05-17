"use client";

import { useEffect, useRef } from "react";
import { BaseSprite } from "../gameAssets";

export default function AnimatedSpritePreview<T extends BaseSprite>({
  sprite,
  width,
  height,
  isStatic = false,
}: {
  sprite: T;
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
