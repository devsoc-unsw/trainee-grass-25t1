import {
  BackgroundName,
  BACKGROUNDS,
  BACKGROUNDS_MAP,
  SpriteName,
  SPRITES,
  SPRITES_MAP,
} from "@/app/game/gameAssets";
import kaplay, { GameObj, KAPLAYCtx } from "kaplay";

type InitializedGameController = GameController & {
  k: NonNullable<GameController["k"]>;
  player: NonNullable<GameController["player"]>;
  background: NonNullable<GameController["background"]>;
};

export default class GameController {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  protected k: KAPLAYCtx<{}, never> | null = null;
  protected player: GameObj | null = null;
  protected background: GameObj | null = null;
  private width = 1920; // Default game width
  private height = 1080; // Default game height

  // Configuration constants
  private readonly playerScale = 10;
  private readonly backgroundScale = 10;
  private readonly playerInitialPosition = { x: 0, y: 748 };
  private readonly backgroundInitialPosition = { x: -10, y: -10 };
  private readonly playerWalkingSpeed = 400; // walking speed by pixels per second
  private readonly platformHeight = 96;
  private readonly platformColor = [167, 111, 61];

  /**
   * Initialize the game with the specified canvas, player sprite, and background
   * @param canvas - The HTML canvas element to render the game on
   * @param player - The sprite to use for the player
   * @param background - The background to use for the game
   * @param width - Optional custom width for the game
   * @param height - Optional custom height for the game
   */
  public initGame(
    canvas: HTMLCanvasElement,
    player: SpriteName,
    background: BackgroundName,
    width?: number,
    height?: number
  ) {
    // Initialize kaplay context
    this.k = kaplay({
      width: width ?? this.width,
      height: height ?? this.height,
      stretch: false,
      global: false,
      debug: true,
      debugKey: "f1",
      canvas: canvas,
      pixelDensity: devicePixelRatio,
    });

    // Load all game assets (sprites and backgrounds)
    this.loadAssets();

    // Change background and sprite
    this.changeBackground(background);
    this.changePlayer(player);

    // Add the ground platform
    this.addPlatform();
  }

  /**
   * Change the game background
   * @param backgroundName - The name of the background to use
   */
  public changeBackground(backgroundName: BackgroundName) {
    // Ensure the game is initialized before changing the background
    this.checkInitialization();

    // Destroy the previous background if it exists
    if (this.background) {
      this.background.destroy();
    }

    // Add the new background to the game
    const targetSprite = BACKGROUNDS_MAP.get(backgroundName)!;
    this.background = this.k.add([
      this.k.sprite(targetSprite.name, { anim: "idle" }),
      this.k.pos(
        this.backgroundInitialPosition.x,
        this.backgroundInitialPosition.y
      ),
      this.k.scale(this.backgroundScale),
    ]);
  }

  /**
   * Change the player sprite
   * @param spriteName - The name of the sprite to use for the player
   */
  public changePlayer(spriteName: SpriteName) {
    // Ensure the game is initialized before changing the player
    this.checkInitialization();

    // Destroy the previous sprite if it exists
    let previousPosition = this.playerInitialPosition;
    if (this.player) {
      previousPosition = { x: this.player.pos.x, y: this.player.pos.y };
      this.player.destroy();
    }

    // Add the new player to the game
    const targetPlayer = SPRITES_MAP.get(spriteName)!;
    const { left } = this.getBoundingPosition();
    this.player = this.k.add([
      this.k.sprite(targetPlayer.name, { anim: "idle" }),
      this.k.pos(left + previousPosition.x, previousPosition.y),
      this.k.scale(this.playerScale),
      {
        speed: this.playerWalkingSpeed, // walking speed by pixels per second
        direction: this.k.vec2(0, 0), // walking direction
        offset: targetPlayer.offset, // offset for the sprite
      },
    ]);

    this.setupPlayerMovement();
  }

  /**
   * Type guard that ensures the game has been initialized
   * Throws an error if the game hasn't been initialized yet
   */
  protected checkInitialization(): asserts this is InitializedGameController {
    if (!this.k) {
      throw new Error("Game not initialized. Call initGame() first.");
    }
  }

  /**
   * Add the ground platform to the game
   * Creates both the platform and its outline
   */
  private addPlatform() {
    this.checkInitialization();

    // Extract RGB values for the platform color
    const [r, g, b] = this.platformColor;

    // Create the main platform
    const platform = this.k.add([
      this.k.rect(this.k.width(), this.platformHeight),
      this.k.color(r, g, b),
      this.k.pos(0, this.k.height() - this.platformHeight),
    ]);

    // Add a black outline/border at the top of the platform
    platform.add([
      this.k.rect(this.k.width(), 8),
      this.k.color(0, 0, 0),
      this.k.pos(0, 0),
    ]);
  }

  /**
   * Load all sprites and backgrounds needed for the game
   */
  private loadAssets() {
    this.checkInitialization();

    // Load all background sprites defined in BACKGROUNDS array
    BACKGROUNDS.forEach((background) => {
      this.k.loadSprite(background.name, background.path, {
        sliceX: background.sliceX,
        sliceY: background.sliceY,
        anims: background.anims,
      });
    });

    // Load all character sprites defined in SPRITES array
    SPRITES.forEach((sprite) => {
      this.k.loadSprite(sprite.name, sprite.path, {
        sliceX: sprite.sliceX,
        sliceY: sprite.sliceY,
        anims: sprite.anims,
      });
    });
  }

  /**
   * Set up event handlers for player movement
   * Handles keyboard input and animation changes
   */
  private setupPlayerMovement() {
    this.checkInitialization();

    // Update function that runs every frame
    this.player.onUpdate(() => {
      // Reset direction vector to zero each frame
      this.player.direction.x = 0;
      this.player.direction.y = 0;

      // Check for left/right key presses and set direction accordingly
      if (this.k.isKeyDown("left")) this.player.direction.x = -1;
      if (this.k.isKeyDown("right")) this.player.direction.x = 1;

      // Get the current animation name, or empty string if none
      const currentAnim = this.player.getCurAnim().name ?? "";

      // Change animation based on movement direction
      // If moving left and not already in "left" animation
      if (
        this.player.direction.eq(this.k.vec2(-1, 0)) &&
        currentAnim !== "left"
      ) {
        this.player.play("left");
      }

      // If moving right and not already in "right" animation
      if (
        this.player.direction.eq(this.k.vec2(1, 0)) &&
        currentAnim !== "right"
      ) {
        this.player.play("right");
      }

      // If not moving and not already in "idle" animation
      if (
        this.player.direction.eq(this.k.vec2(0, 0)) &&
        currentAnim !== "idle"
      ) {
        this.player.play("idle");
      }

      // Move the player based on direction and speed
      this.player.move(this.player.direction.scale(this.player.speed));

      // Restrict player position to stay within the visible boundaries
      // Takes into account the sprite's offset and width to prevent clipping at the edges
      const { left, right } = this.getBoundingPosition();
      this.player.pos.x = this.k.clamp(
        this.player.pos.x,
        left - this.player.offset,
        right - this.player.width * this.player.scale.x + this.player.offset
      );
    });
  }

  /**
   * Calculate the left and right boundaries of the visible game area
   * Used to restrict player movement and ensure they stay on screen
   * @returns { left: number, right: number } containing left and right boundary positions
   */
  private getBoundingPosition(): { left: number; right: number } {
    this.checkInitialization();

    // Get the width of the visible game area
    const visibleGameWidth = this.getVisibleGameWidth();

    // Calculate the horizontal offset to center the game
    const offset = (this.k.width() - visibleGameWidth) / 2;

    return {
      left: Math.max(offset, 0),
      right: Math.min(offset + visibleGameWidth, this.k.width()),
    };
  }

  /**
   * Calculate the width of the visible game area based on the window size and scaling
   * @returns The width of the visible game area in game units
   */
  private getVisibleGameWidth() {
    this.checkInitialization();

    // Get the current window width
    const visibleWidth = window.innerWidth;

    // Calculate the scale factor between canvas display size and internal game size
    const scale = this.k.canvas.clientWidth / this.k.width();

    // Convert window width to game units by dividing by the scale factor
    return visibleWidth / scale;
  }
}
