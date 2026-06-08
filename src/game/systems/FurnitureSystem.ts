import Phaser from "phaser";

export type FurnitureCategory =
  | "tables"
  | "chairs"
  | "lights"
  | "walls"
  | "floors"
  | "decor"
  | "kitchen"
  | "plants";

export type FurnitureDefinition = {
  id: string;
  category: FurnitureCategory;
  asset: string;
};

type Placement = {
  x: number;
  y: number;
  scale: number;
  depth: number;
  shadow?: { width: number; height: number; alpha: number; yOffset: number };
};

const placements: Record<FurnitureCategory, Placement> = {
  tables: { x: 0.5, y: 0.76, scale: 0.95, depth: 60, shadow: { width: 250, height: 34, alpha: 0.24, yOffset: 54 } },
  chairs: { x: 0.38, y: 0.77, scale: 0.62, depth: 70, shadow: { width: 92, height: 20, alpha: 0.2, yOffset: 42 } },
  lights: { x: 0.5, y: 0.08, scale: 0.58, depth: 80 },
  walls: { x: 0.5, y: 0.27, scale: 1, depth: 2 },
  floors: { x: 0.5, y: 0.78, scale: 1, depth: 3 },
  decor: { x: 0.75, y: 0.3, scale: 0.55, depth: 45, shadow: { width: 58, height: 12, alpha: 0.12, yOffset: 64 } },
  kitchen: { x: 0.66, y: 0.55, scale: 0.62, depth: 35, shadow: { width: 260, height: 24, alpha: 0.18, yOffset: 68 } },
  plants: { x: 0.86, y: 0.67, scale: 0.62, depth: 65, shadow: { width: 84, height: 22, alpha: 0.2, yOffset: 70 } },
};

const itemOverrides: Record<string, Partial<Placement>> = {
  "window-plant": { x: 0.2, y: 0.49, scale: 0.32, depth: 43, shadow: { width: 44, height: 10, alpha: 0.12, yOffset: 18 } },
  "big-monstera": { x: 0.84, y: 0.72, scale: 0.78, depth: 66, shadow: { width: 118, height: 28, alpha: 0.22, yOffset: 78 } },
  "tulip-pot": { x: 0.25, y: 0.7, scale: 0.42, depth: 62, shadow: { width: 58, height: 14, alpha: 0.18, yOffset: 42 } },
  "lavender-pot": { x: 0.24, y: 0.7, scale: 0.42, depth: 62, shadow: { width: 58, height: 14, alpha: 0.18, yOffset: 42 } },
  "daisy-pot": { x: 0.24, y: 0.7, scale: 0.42, depth: 62, shadow: { width: 58, height: 14, alpha: 0.18, yOffset: 42 } },
  "menu-board": { x: 0.77, y: 0.28, scale: 0.48, depth: 42 },
  "wind-chime": { x: 0.29, y: 0.18, scale: 0.48, depth: 50 },
  "large-ornament": { x: 0.82, y: 0.74, scale: 0.62, depth: 68, shadow: { width: 86, height: 20, alpha: 0.18, yOffset: 26 } },
  "wall-clock": { x: 0.74, y: 0.25, scale: 0.44, depth: 44 },
  "mint-kitchen": { x: 0.66, y: 0.55, scale: 0.62 },
  "dopamine-kitchen": { x: 0.66, y: 0.55, scale: 0.62 },
  "industrial-kitchen": { x: 0.66, y: 0.55, scale: 0.62 },
  "cream-kitchen": { x: 0.66, y: 0.55, scale: 0.62 },
  "industrial-square-table": { scale: 0.82 },
};

export class FurnitureSystem {
  constructor(
    private readonly scene: Phaser.Scene,
    private readonly furnitureLayer: Phaser.GameObjects.Layer,
    private readonly decorationLayer: Phaser.GameObjects.Layer,
    private readonly lightingLayer: Phaser.GameObjects.Layer,
  ) {}

  render(items: FurnitureDefinition[]) {
    this.furnitureLayer.removeAll(true);
    this.decorationLayer.removeAll(true);
    this.lightingLayer.removeAll(true);

    for (const item of items) {
      if (item.category === "walls" || item.category === "floors") continue;
      this.addFurniture(item);
    }
  }

  private addFurniture(item: FurnitureDefinition) {
    const base = placements[item.category];
    const override = itemOverrides[item.id] ?? {};
    const placement = { ...base, ...override };
    const width = this.scene.scale.width;
    const height = this.scene.scale.height;
    const x = placement.x * width;
    const y = placement.y * height;
    const targetLayer =
      item.category === "lights" ? this.lightingLayer : item.category === "decor" ? this.decorationLayer : this.furnitureLayer;

    if (placement.shadow) {
      const shadow = this.scene.add.ellipse(
        x,
        y + placement.shadow.yOffset,
        placement.shadow.width,
        placement.shadow.height,
        0x5b3218,
        placement.shadow.alpha,
      );
      shadow.setScale(Math.max(0.62, placement.scale));
      shadow.setDepth(placement.depth - 1);
      targetLayer.add(shadow);
    }

    const sprite = this.scene.add.image(x, y, item.id);
    sprite.setOrigin(0.5, 1);
    sprite.setScale(placement.scale);
    sprite.setDepth(placement.depth);
    sprite.setAlpha(0);
    targetLayer.add(sprite);

    this.scene.tweens.add({
      targets: sprite,
      alpha: 1,
      y: y - 4,
      duration: 360,
      ease: "Back.Out",
    });
  }
}
