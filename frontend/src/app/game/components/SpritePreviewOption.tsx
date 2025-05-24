import Lock from "@/components/icons/Lock";
import { BaseSprite } from "../gameAssets";
import AnimatedSpritePreview from "./AnimatedSpritePreview";

export default function SpritePreviewOption<T extends BaseSprite>({
  name,
  sprite,
  selectedSprite,
  setSelectedSprite,
  width,
  height,
  unlocked = false,
}: {
  name: string;
  sprite: T;
  selectedSprite: T;
  setSelectedSprite: (s: T) => void;
  width: number;
  height: number;
  unlocked: boolean;
}) {
  const selected = sprite.name === selectedSprite.name;
  return (
    <label
      key={sprite.displayName}
      htmlFor={sprite.displayName}
      className="flex flex-col justify-center items-center p-2"
    >
      <input
        type="radio"
        id={sprite.displayName}
        name={name}
        value={sprite.name}
        checked={selected}
        onChange={() => setSelectedSprite(sprite)}
        className="sr-only peer" // Hidden visually but accessible to screen readers
        disabled={!unlocked} // Disable input if not unlocked
      />
      <div
        className={`relative p-1 rounded-md border-4 border-foreground/25 peer-checked:border-green-500 ${
          !unlocked && "cursor-not-allowed"
        }`}
      >
        <AnimatedSpritePreview
          sprite={sprite}
          width={width}
          height={height}
          isStatic={true}
        />
        {!unlocked && (
          <div className="absolute w-full h-full inset-0 flex justify-center items-center bg-foreground/25">
            <Lock color="#ffffff" width={32} height={32} />
          </div>
        )}
      </div>
      <p
        className={`text-sm text-center w-full truncate peer-checked:text-green-500 ${
          selected && "font-bold"
        }`}
      >
        {sprite.displayName}
      </p>
    </label>
  );
}
