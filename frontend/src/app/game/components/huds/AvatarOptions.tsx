"use client";

import CameraFace from "@/components/icons/CameraFace";
import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/Dialog";
import {
  Sprite,
  SpriteName,
  SPRITES,
  SPRITES_MAP,
} from "@/app/game/gameAssets";
import { useEffect, useState } from "react";
import GameButton from "@/app/game/components/GameButton";
import AnimatedSpritePreview from "../AnimatedSpritePreview";
import SpritePreviewOption from "../SpritePreviewOption";

export default function AvatarOptions({
  avatar,
  setAvatar,
}: {
  avatar: SpriteName;
  setAvatar: (s: SpriteName) => void;
}) {
  const [selectedAvatar, setSelectedAvatar] = useState<Sprite>(
    SPRITES_MAP.get(avatar)!
  );

  useEffect(() => {
    setSelectedAvatar(SPRITES_MAP.get(avatar)!);
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
            <AnimatedSpritePreview
              sprite={selectedAvatar}
              width={256}
              height={256}
            />
          </div>
          {/* Grid of selectable avatar options */}
          <div className="grid grid-cols-2 h-96 overflow-y-auto">
            {SPRITES.map((sprite) => (
              <SpritePreviewOption
                key={sprite.name}
                name="avatar-options"
                sprite={sprite}
                width={128}
                height={128}
                selectedSprite={selectedAvatar}
                setSelectedSprite={setSelectedAvatar}
              />
            ))}
          </div>
        </div>
        <DialogClose
          className="bg-foreground text-background w-full p-2 rounded-md cursor-pointer duration-150 disabled:opacity-15 hover:bg-foreground/85 disabled:cursor-not-allowed"
          disabled={avatar === selectedAvatar.name}
          onClick={() => setAvatar(selectedAvatar.name as SpriteName)}
        >
          Save Avatar
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
