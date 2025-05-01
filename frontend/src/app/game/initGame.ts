import kaplay, { GameObj, KAPLAYCtx } from "kaplay";

export default function initGame(canvas: HTMLCanvasElement) {
  const k = initKaplay(canvas);

  // TODO: Change sprite dynamically based on database/local storage
  loadSprites(k);
  const player = k.add([
    k.sprite("default_sprite", { anim: "idle" }),
    k.pos(24, 810),
    k.scale(8),
    {
      speed: 400,
      direction: k.vec2(0, 0),
    },
  ]);

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
  k.loadSprite("default_sprite", "/sprites/default.png", {
    sliceX: 3,
    sliceY: 3,
    anims: {
      idle: { from: 0, to: 1, loop: true, speed: 4 },
      right: { frames: [3, 4, 3, 5], loop: true, speed: 4 },
      left: { frames: [6, 7, 6, 8], loop: true, speed: 4 },
    },
  });
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
