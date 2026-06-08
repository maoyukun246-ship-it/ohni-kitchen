import Phaser from "phaser";
import { LearningScene } from "./scenes/LearningScene";
import { RestaurantScene } from "./scenes/RestaurantScene";
import { ShopScene } from "./scenes/ShopScene";

export function createRestaurantGame(parent: HTMLElement) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    backgroundColor: "#f0d2a5",
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: parent.clientWidth || 960,
      height: parent.clientHeight || 560,
    },
    render: {
      antialias: true,
      pixelArt: false,
      roundPixels: false,
    },
    scene: [RestaurantScene, ShopScene, LearningScene],
  });
}
