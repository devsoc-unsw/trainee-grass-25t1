type ExtractKeyValues<
  T extends ReadonlyArray<unknown>,
  Key extends string,
> = Extract<T[number], { [key in Key]: unknown }>[Key];

export type Background = {
  name: string;
  displayName: string;
  path: string;
  sliceX: number;
  sliceY: number;
  anims: {
    idle: { frames: number[]; loop: boolean; speed: number };
  };
};

export const BACKGROUNDS = defineBackgrounds([
  {
    name: "futuristic_city",
    displayName: "Futuristic City",
    path: "/backgrounds/futuristic_city.png",
    sliceX: 4,
    sliceY: 6,
    anims: {
      idle: {
        frames: Array.from({ length: 4 * 6 }, (_, i) => i),
        loop: true,
        speed: 6,
      },
    },
  },
  {
    name: "mcdonalds",
    displayName: "McDonalds",
    path: "/backgrounds/mcdonalds.png",
    sliceX: 4,
    sliceY: 6,
    anims: {
      idle: {
        frames: Array.from({ length: 4 * 6 }, (_, i) => i),
        loop: true,
        speed: 6,
      },
    },
  },
  {
    name: "mountain",
    displayName: "Mountain View",
    path: "/backgrounds/mountain.png",
    sliceX: 3,
    sliceY: 4,
    anims: {
      idle: {
        frames: Array.from({ length: 3 * 4 }, (_, i) => i),
        loop: true,
        speed: 6,
      },
    },
  },
  {
    name: "night_sky",
    displayName: "Night Sky",
    path: "/backgrounds/night_sky.png",
    sliceX: 4,
    sliceY: 6,
    anims: {
      idle: {
        frames: Array.from({ length: 4 * 6 }, (_, i) => i),
        loop: true,
        speed: 6,
      },
    },
  },
  {
    name: "sea_life",
    displayName: "Sea Life",
    path: "/backgrounds/sea_life.png",
    sliceX: 4,
    sliceY: 6,
    anims: {
      idle: {
        frames: Array.from({ length: 4 * 6 }, (_, i) => i),
        loop: true,
        speed: 6,
      },
    },
  },
] as const);

export type BackgroundName = ExtractKeyValues<typeof BACKGROUNDS, "name">;

export const BACKGROUNDS_MAP = new Map<string, Background>(
  BACKGROUNDS.map((background) => [background.name, background])
);

export type Sprite = {
  name: string;
  displayName: string;
  path: string;
  sliceX: number;
  sliceY: number;
  anims: {
    idle: { frames: number[]; loop: boolean; speed: number };
    left: { frames: number[]; loop: boolean; speed: number };
    right: { frames: number[]; loop: boolean; speed: number };
  };
  offset: number;
};

export const SPRITES = defineSprites([
  {
    name: "default",
    displayName: "Default",
    path: "/sprites/default.png",
    sliceX: 3,
    sliceY: 3,
    anims: {
      idle: { frames: [0, 1], loop: true, speed: 4 },
      left: { frames: [3, 4, 3, 5], loop: true, speed: 4 },
      right: { frames: [6, 7, 6, 8], loop: true, speed: 4 },
    },
    offset: 72,
  },
  {
    name: "cinnamoroll",
    displayName: "Cinnamoroll",
    path: "/sprites/cinnamoroll.png",
    sliceX: 3,
    sliceY: 3,
    anims: {
      idle: { frames: [0, 1], loop: true, speed: 4 },
      left: { frames: [3, 4, 3, 5], loop: true, speed: 4 },
      right: { frames: [6, 7, 6, 8], loop: true, speed: 4 },
    },
    offset: 8,
  },
  {
    name: "mcdonalds_worker",
    displayName: "McDonalds Worker",
    path: "/sprites/mcdonalds_worker.png",
    sliceX: 3,
    sliceY: 3,
    anims: {
      idle: { frames: [0, 1], loop: true, speed: 4 },
      left: { frames: [3, 4, 3, 5], loop: true, speed: 4 },
      right: { frames: [6, 7, 6, 8], loop: true, speed: 4 },
    },
    offset: 16,
  },
  {
    name: "pikachu",
    displayName: "Pikachu",
    path: "/sprites/pikachu.png",
    sliceX: 3,
    sliceY: 3,
    anims: {
      idle: { frames: [0, 1], loop: true, speed: 4 },
      left: { frames: [3, 4, 3, 5], loop: true, speed: 4 },
      right: { frames: [6, 7, 6, 8], loop: true, speed: 4 },
    },
    offset: 16,
  },
  {
    name: "skibidi_toilet",
    displayName: "Skibidi Toilet",
    path: "/sprites/skibidi_toilet.png",
    sliceX: 3,
    sliceY: 3,
    anims: {
      idle: { frames: [0, 1], loop: true, speed: 4 },
      left: { frames: [3, 4, 3, 5], loop: true, speed: 4 },
      right: { frames: [6, 7, 6, 8], loop: true, speed: 4 },
    },
    offset: 16,
  },
  {
    name: "beginner_sprout",
    displayName: "Beginner Sprout",
    path: "/sprites/beginner_sprout.png",
    sliceX: 3,
    sliceY: 3,
    anims: {
      idle: { frames: [0, 1], loop: true, speed: 4 },
      left: { frames: [3, 4, 3, 5], loop: true, speed: 4 },
      right: { frames: [6, 7, 6, 8], loop: true, speed: 4 },
    },
    offset: 40,
  },
] as const);

export type SpriteName = ExtractKeyValues<typeof SPRITES, "name">;

export const SPRITES_MAP = new Map<string, Sprite>(
  SPRITES.map((sprite) => [sprite.name, sprite])
);

function defineBackgrounds<T extends readonly Background[]>(backgrounds: T) {
  return backgrounds;
}

function defineSprites<T extends readonly Sprite[]>(sprites: T) {
  return sprites;
}
