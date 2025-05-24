"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import {
  Background,
  BackgroundName,
  BACKGROUNDS,
  BACKGROUNDS_MAP,
} from "@/app/game/gameAssets";
import { useEffect, useState } from "react";
import GameButton from "@/app/game/components/GameButton";
import Chess from "@/components/icons/Chess";
import AnimatedSpritePreview from "../AnimatedSpritePreview";
import SpritePreviewOption from "../SpritePreviewOption";

export default function AvatarOptions({
  background,
  setBackground,
  backgroundsUnlocked,
}: {
  background: BackgroundName;
  setBackground: (b: BackgroundName) => void;
  backgroundsUnlocked: BackgroundName[];
}) {
  const [selectedBackground, setSelectedBackground] = useState<Background>(
    BACKGROUNDS_MAP.get(background)!
  );

  useEffect(() => {
    setSelectedBackground(BACKGROUNDS_MAP.get(background)!);
  }, [background]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <GameButton tooltipText="Backgrounds">
          <Chess width={32} height={32} />
        </GameButton>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="font-bold text-center text-xl">
          Change Backgrounds
        </DialogTitle>
        <div className="flex justify-center gap-4">
          {/* Avatar Preview - Shows animated version of selected avatar */}
          <div className="flex-1 flex justify-center items-center">
            <AnimatedSpritePreview
              sprite={selectedBackground}
              width={320}
              height={180}
            />
          </div>
          {/* Grid of selectable avatar options */}
          <div className="grid grid-cols-2 h-96 overflow-y-auto">
            {BACKGROUNDS.map((background) => (
              <SpritePreviewOption
                key={background.name}
                name="background-options"
                sprite={background}
                width={96}
                height={54}
                selectedSprite={selectedBackground}
                setSelectedSprite={setSelectedBackground}
                unlocked={backgroundsUnlocked.includes(background.name)}
              />
            ))}
          </div>
        </div>
        <DialogClose
          className="bg-foreground text-background w-full p-2 rounded-md cursor-pointer duration-150 disabled:opacity-15 hover:bg-foreground/85 disabled:cursor-not-allowed"
          disabled={background === selectedBackground.name}
          onClick={() =>
            setBackground(selectedBackground.name as BackgroundName)
          }
        >
          Save Background
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
