import {
  BackgroundName,
  BACKGROUNDS,
  BACKGROUNDS_MAP,
  Sprite,
  SpriteName,
  SPRITES,
  SPRITES_MAP,
} from "@/app/game/gameAssets";
import kaplay, { GameObj, KAPLAYCtx } from "kaplay";

const SPRITE_SCALE = 12;
const BACKGROUND_SCALE = 10;
const SPRITE_INITIAL_POSITION = { x: 24, y: 810 };
const BACKGROUND_INITIAL_POSITION = { x: -10, y: -10 };
const SPRITE_WALKING_SPEED = 400; // walking speed by pixels per second

export default function initGame(canvas: HTMLCanvasElement) {
  const k = initKaplay(canvas);

  // TODO: Change sprite dynamically based on database/local storage
  loadBackgrounds(k);
  loadSprites(k);

  const background = addBackground(k, "sea_life");
  const player = addSprite(k, "default");

  // Move sprites with arrow keys
  setupPlayerMovement(k, player);
}

function initKaplay(canvas: HTMLCanvasElement) {
  return kaplay({
    width: 1920,
    height: 1080,
    letterbox: true,
    global: false,
    debug: true,
    debugKey: "f1",
    canvas: canvas,
    pixelDensity: devicePixelRatio,
  });
}

function loadSprites(k: KAPLAYCtx<{}, never>) {
  SPRITES.forEach((sprite) => {
    k.loadSprite(sprite.name, sprite.path, {
      sliceX: sprite.sliceX,
      sliceY: sprite.sliceY,
      anims: sprite.anims,
    });
  });
}

function addSprite(k: KAPLAYCtx<{}, never>, spriteName: SpriteName) {
  const targetSprite = SPRITES_MAP.get(spriteName)!;

  const sprite = k.add([
    k.sprite(targetSprite.name, { anim: "idle" }),
    k.pos(SPRITE_INITIAL_POSITION.x, SPRITE_INITIAL_POSITION.y),
    k.scale(SPRITE_SCALE),
    {
      speed: SPRITE_WALKING_SPEED, // walking speed by pixels per second
      direction: k.vec2(0, 0), // walking direction
    },
  ]);

  return sprite;
}

function loadBackgrounds(k: KAPLAYCtx<{}, never>) {
  BACKGROUNDS.forEach((background) => {
    k.loadSprite(background.name, background.path, {
      sliceX: background.sliceX,
      sliceY: background.sliceY,
      anims: background.anims,
    });
  });
}

function addBackground(
  k: KAPLAYCtx<{}, never>,
  backgroundName: BackgroundName
) {
  const targetSprite = BACKGROUNDS_MAP.get(backgroundName)!;

  const background = k.add([
    k.sprite(targetSprite.name, { anim: "idle" }),
    k.pos(BACKGROUND_INITIAL_POSITION.x, BACKGROUND_INITIAL_POSITION.y),
    k.scale(BACKGROUND_SCALE),
  ]);

  return background;
}

function setupPlayerMovement(k: KAPLAYCtx<{}, never>, player: GameObj) {
  player.onUpdate(() => {
    player.direction.x = 0;
    player.direction.y = 0;

    if (k.isKeyDown("left")) player.direction.x = -1;
    if (k.isKeyDown("right")) player.direction.x = 1;

    const currentAnim = player.getCurAnim().name ?? "";

    if (player.direction.eq(k.vec2(-1, 0)) && currentAnim !== "left") {
      player.play("left");
    }

    if (player.direction.eq(k.vec2(1, 0)) && currentAnim !== "right") {
      player.play("right");
    }

    if (player.direction.eq(k.vec2(0, 0)) && currentAnim !== "idle") {
      player.play("idle");
    }

    // Move the player
    player.move(player.direction.scale(player.speed));

    // Clamp player position within canvas bounds
    player.pos.x = k.clamp(
      player.pos.x,
      0,
      k.width() - player.width * player.scale.x
    );
  });
}
