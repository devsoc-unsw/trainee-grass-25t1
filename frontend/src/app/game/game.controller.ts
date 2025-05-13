import {
  BackgroundName,
  BACKGROUNDS,
  BACKGROUNDS_MAP,
  SpriteName,
  SPRITES,
  SPRITES_MAP,
} from "@/app/game/gameAssets";
import kaplay, { Game, GameObj, KAPLAYCtx } from "kaplay";
import { Init } from "v8";

type InitializedGameController = GameController & {
  k: NonNullable<GameController["k"]>;
  player: NonNullable<GameController["player"]>;
  background: NonNullable<GameController["background"]>;
};

export default class GameController {
  protected k: KAPLAYCtx<{}, never> | null = null;
  protected player: GameObj | null = null;
  protected background: GameObj | null = null;

  // Configuration constants
  private readonly width = 1920;
  private readonly height = 1080;
  private readonly playerScale = 10;
  private readonly backgroundScale = 10;
  private readonly playerInitialPosition = { x: 24, y: 790 };
  private readonly backgroundInitialPosition = { x: -10, y: -10 };
  private readonly playerWalkingSpeed = 400; // walking speed by pixels per second

  public initGame(
    canvas: HTMLCanvasElement,
    player: SpriteName,
    background: BackgroundName
  ) {
    // Initialize kaplay context
    this.k = kaplay({
      width: this.width,
      height: this.height,
      letterbox: true,
      global: false,
      debug: true,
      debugKey: "f1",
      canvas: canvas,
      pixelDensity: devicePixelRatio,
    });

    // Load assets
    this.loadAssets();

    // TODO: Change sprite dynamically based on database/local storage
    this.background = this.changeBackground("mcdonalds");
    this.player = this.changePlayer("mcdonalds_worker");
  }

  public changeBackground(backgroundName: BackgroundName): GameObj | null {
    this.checkInitialization();

    // Destroy the previous background if it exists
    if (this.background) {
      this.background.destroy();
    }

    // Add background
    const targetSprite = BACKGROUNDS_MAP.get(backgroundName)!;
    const background = this.k.add([
      this.k.sprite(targetSprite.name, { anim: "idle" }),
      this.k.pos(
        this.backgroundInitialPosition.x,
        this.backgroundInitialPosition.y
      ),
      this.k.scale(this.backgroundScale),
    ]);

    return background;
  }

  public changePlayer(spriteName: SpriteName): GameObj | null {
    this.checkInitialization();

    // Destroy the previous sprite if it exists
    if (this.background) {
      this.background.destroy();
    }

    // Add sprite
    const targetPlayer = SPRITES_MAP.get(spriteName)!;
    const player = this.k.add([
      this.k.sprite(targetPlayer.name, { anim: "idle" }),
      this.k.pos(this.playerInitialPosition.x, this.playerInitialPosition.y),
      this.k.scale(this.playerScale),
      {
        speed: this.playerWalkingSpeed, // walking speed by pixels per second
        direction: this.k.vec2(0, 0), // walking direction
      },
    ]);

    this.setupPlayerMovement(player);

    return player;
  }

  protected checkInitialization(): asserts this is InitializedGameController {
    if (!this.k) {
      throw new Error("Game not initialized. Call initGame() first.");
    }
  }

  private loadAssets() {
    this.checkInitialization();

    // Load backgrounds
    BACKGROUNDS.forEach((background) => {
      this.k.loadSprite(background.name, background.path, {
        sliceX: background.sliceX,
        sliceY: background.sliceY,
        anims: background.anims,
      });
    });
    // Load sprites
    SPRITES.forEach((sprite) => {
      this.k.loadSprite(sprite.name, sprite.path, {
        sliceX: sprite.sliceX,
        sliceY: sprite.sliceY,
        anims: sprite.anims,
      });
    });
  }

  private setupPlayerMovement(player: GameObj) {
    this.checkInitialization();

    player.onUpdate(() => {
      player.direction.x = 0;
      player.direction.y = 0;

      if (this.k.isKeyDown("left")) player.direction.x = -1;
      if (this.k.isKeyDown("right")) player.direction.x = 1;

      const currentAnim = player.getCurAnim().name ?? "";

      if (player.direction.eq(this.k.vec2(-1, 0)) && currentAnim == "left") {
        player.play("left");
      }

      if (player.direction.eq(this.k.vec2(1, 0)) && currentAnim == "right") {
        player.play("right");
      }

      if (player.direction.eq(this.k.vec2(0, 0)) && currentAnim == "idle") {
        player.play("idle");
      }

      // Move the player
      player.move(player.direction.scale(player.speed));

      // Clamp player position within canvas bounds
      player.pos.x = this.k.clamp(
        player.pos.x,
        0,
        this.k.width() - player.width * player.scale.x
      );
    });
  }
}
