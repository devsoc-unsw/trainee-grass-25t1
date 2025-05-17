import { BaseSprite } from "../gameAssets";
import AnimatedSpritePreview from "./AnimatedSpritePreview";

export default function SpritePreviewOption<T extends BaseSprite>({
  name,
  sprite,
  selectedSprite,
  setSelectedSprite,
  width,
  height,
}: {
  name: string;
  sprite: T;
  selectedSprite: T;
  setSelectedSprite: (s: T) => void;
  width: number;
  height: number;
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
      />
      <div className="p-1 rounded-md border-4 border-foreground/25 peer-checked:border-green-500">
        <AnimatedSpritePreview
          sprite={sprite}
          width={width}
          height={height}
          isStatic={true}
        />
      </div>
      <p
        className={`text-sm text-center text-ellipsis peer-checked:text-green-500 ${
          selected && "font-bold"
        }`}
      >
        {sprite.displayName}
      </p>
    </label>
  );
}
