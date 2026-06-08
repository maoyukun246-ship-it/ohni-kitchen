import Phaser from "phaser";
import { DecorationSystem } from "../systems/DecorationSystem";
import { FurnitureSystem, type FurnitureDefinition } from "../systems/FurnitureSystem";
import { SaveSystem } from "../systems/SaveSystem";

const furnitureAssets: FurnitureDefinition[] = [
  { id: "oak-round-table", category: "tables", asset: "/assets_v2/furniture/oak-round-table.png" },
  { id: "mint-round-table", category: "tables", asset: "/assets_v2/furniture/mint-round-table.png" },
  { id: "industrial-square-table", category: "tables", asset: "/assets_v2/furniture/industrial-square-table.png" },
  { id: "sakura-round-table", category: "tables", asset: "/assets_v2/furniture/sakura-round-table.png" },
  { id: "wood-chair", category: "chairs", asset: "/assets_v2/furniture/wood-chair.png" },
  { id: "mint-chair", category: "chairs", asset: "/assets_v2/furniture/mint-chair.png" },
  { id: "iron-chair", category: "chairs", asset: "/assets_v2/furniture/iron-chair.png" },
  { id: "pink-bow-chair", category: "chairs", asset: "/assets_v2/furniture/pink-bow-chair.png" },
  { id: "warm-pendant", category: "lights", asset: "/assets_v2/furniture/warm-pendant.png" },
  { id: "mint-pendant", category: "lights", asset: "/assets_v2/furniture/mint-pendant.png" },
  { id: "industrial-pendant", category: "lights", asset: "/assets_v2/furniture/industrial-pendant.png" },
  { id: "sakura-pendant", category: "lights", asset: "/assets_v2/furniture/sakura-pendant.png" },
  { id: "hanok-wall", category: "walls", asset: "/assets_v2/wallpaper/hanok-wall.png" },
  { id: "mint-wall", category: "walls", asset: "/assets_v2/wallpaper/mint-wall.png" },
  { id: "dopamine-wall", category: "walls", asset: "/assets_v2/wallpaper/dopamine-wall.png" },
  { id: "industrial-wall", category: "walls", asset: "/assets_v2/wallpaper/industrial-wall.png" },
  { id: "cream-flower-wall", category: "walls", asset: "/assets_v2/wallpaper/cream-flower-wall.png" },
  { id: "wood-floor", category: "floors", asset: "/assets_v2/flooring/wood-floor.png" },
  { id: "mint-tile-floor", category: "floors", asset: "/assets_v2/flooring/mint-tile-floor.png" },
  { id: "marble-floor", category: "floors", asset: "/assets_v2/flooring/marble-floor.png" },
  { id: "checker-floor", category: "floors", asset: "/assets_v2/flooring/checker-floor.png" },
  { id: "menu-board", category: "decor", asset: "/assets_v2/furniture/menu-board.png" },
  { id: "wind-chime", category: "decor", asset: "/assets_v2/furniture/wind-chime.png" },
  { id: "large-ornament", category: "decor", asset: "/assets_v2/furniture/large-ornament.png" },
  { id: "wall-clock", category: "decor", asset: "/assets_v2/furniture/wall-clock.png" },
  { id: "open-kitchen", category: "kitchen", asset: "/assets_v2/furniture/open-kitchen.png" },
  { id: "mint-kitchen", category: "kitchen", asset: "/assets_v2/furniture/mint-kitchen.png" },
  { id: "dopamine-kitchen", category: "kitchen", asset: "/assets_v2/furniture/dopamine-kitchen.png" },
  { id: "industrial-kitchen", category: "kitchen", asset: "/assets_v2/furniture/industrial-kitchen.png" },
  { id: "cream-kitchen", category: "kitchen", asset: "/assets_v2/furniture/cream-kitchen.png" },
  { id: "window-plant", category: "plants", asset: "/assets_v2/furniture/window-plant.png" },
  { id: "big-monstera", category: "plants", asset: "/assets_v2/furniture/big-monstera.png" },
  { id: "tulip-pot", category: "plants", asset: "/assets_v2/furniture/tulip-pot.png" },
  { id: "lavender-pot", category: "plants", asset: "/assets_v2/furniture/lavender-pot.png" },
  { id: "daisy-pot", category: "plants", asset: "/assets_v2/furniture/daisy-pot.png" },
];

type RestaurantUpdateEvent = {
  equippedItems: string[];
  coins?: number;
};

export class RestaurantScene extends Phaser.Scene {
  private backgroundLayer!: Phaser.GameObjects.Layer;
  private floorLayer!: Phaser.GameObjects.Layer;
  private wallLayer!: Phaser.GameObjects.Layer;
  private furnitureLayer!: Phaser.GameObjects.Layer;
  private decorationLayer!: Phaser.GameObjects.Layer;
  private lightingLayer!: Phaser.GameObjects.Layer;
  private furnitureSystem!: FurnitureSystem;
  private decorationSystem!: DecorationSystem;
  private equippedItems: string[] = [];

  constructor() {
    super("RestaurantScene");
  }

  preload() {
    this.load.image("lv1-wall", "/assets_v2/wallpaper/lv1-cream-wall.png");
    this.load.image("lv1-floor", "/assets_v2/flooring/lv1-wood-floor.png");
    this.load.image("lv1-window", "/assets_v2/decorations/lv1-window.png");
    this.load.image("lv1-door", "/assets_v2/decorations/lv1-door.png");
    for (const item of furnitureAssets) {
      this.load.image(item.id, item.asset);
    }
  }

  create() {
    const saved = SaveSystem.read();
    this.equippedItems = saved.equippedItems;

    this.backgroundLayer = this.add.layer();
    this.floorLayer = this.add.layer();
    this.wallLayer = this.add.layer();
    this.furnitureLayer = this.add.layer();
    this.decorationLayer = this.add.layer();
    this.lightingLayer = this.add.layer();

    this.furnitureSystem = new FurnitureSystem(this, this.furnitureLayer, this.decorationLayer, this.lightingLayer);
    this.decorationSystem = new DecorationSystem(this);
    this.renderEmptyShop();
    this.renderEquippedFurniture();

    window.addEventListener("ohni:restaurant:update", this.handleRestaurantUpdate);
  }

  destroy() {
    window.removeEventListener("ohni:restaurant:update", this.handleRestaurantUpdate);
  }

  private handleRestaurantUpdate = (event: Event) => {
    const detail = (event as CustomEvent<RestaurantUpdateEvent>).detail;
    this.equippedItems = detail.equippedItems ?? [];
    this.renderEmptyShop();
    this.renderEquippedFurniture();
    if (typeof detail.coins === "number") {
      this.decorationSystem.addCoinPop(this.scale.width * 0.5, this.scale.height * 0.42, detail.coins);
    }
  };

  private renderEmptyShop() {
    this.backgroundLayer.removeAll(true);
    this.floorLayer.removeAll(true);
    this.wallLayer.removeAll(true);
    this.decorationLayer.removeAll(true);
    this.lightingLayer.removeAll(true);

    const width = this.scale.width;
    const height = this.scale.height;
    this.cameras.main.setBackgroundColor("#f1d2a4");

    const wall = this.add.image(width / 2, height * 0.28, "lv1-wall");
    wall.setOrigin(0.5);
    wall.setDisplaySize(width, height * 0.6);
    wall.setDepth(1);
    this.wallLayer.add(wall);

    const floor = this.add.image(width / 2, height * 0.79, "lv1-floor");
    floor.setOrigin(0.5);
    floor.setDisplaySize(width, height * 0.45);
    floor.setDepth(2);
    this.floorLayer.add(floor);

    const backLine = this.add.rectangle(width / 2, height * 0.58, width, 8, 0xb47b46, 0.45);
    backLine.setDepth(4);
    this.backgroundLayer.add(backLine);

    const window = this.add.image(width * 0.18, height * 0.32, "lv1-window");
    window.setOrigin(0.5);
    window.setScale(0.72);
    window.setDepth(12);
    this.decorationLayer.add(window);

    const door = this.add.image(width * 0.82, height * 0.43, "lv1-door");
    door.setOrigin(0.5);
    door.setScale(0.82);
    door.setDepth(12);
    this.decorationLayer.add(door);

    this.decorationSystem.addWarmAmbientLight(this.lightingLayer);
  }

  private renderEquippedFurniture() {
    const equipped = furnitureAssets.filter((item) => this.equippedItems.includes(item.id));
    const wall = equipped.find((item) => item.category === "walls");
    const floor = equipped.find((item) => item.category === "floors");

    if (wall) this.replaceWall(wall.id);
    if (floor) this.replaceFloor(floor.id);
    this.furnitureSystem.render(equipped);
  }

  private replaceWall(assetKey: string) {
    this.wallLayer.removeAll(true);
    const wall = this.add.image(this.scale.width / 2, this.scale.height * 0.28, assetKey);
    wall.setDisplaySize(this.scale.width, this.scale.height * 0.6);
    wall.setDepth(1);
    this.wallLayer.add(wall);
  }

  private replaceFloor(assetKey: string) {
    this.floorLayer.removeAll(true);
    const floor = this.add.image(this.scale.width / 2, this.scale.height * 0.79, assetKey);
    floor.setDisplaySize(this.scale.width, this.scale.height * 0.45);
    floor.setDepth(2);
    this.floorLayer.add(floor);
  }
}
