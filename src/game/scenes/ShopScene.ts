import Phaser from "phaser";

export class ShopScene extends Phaser.Scene {
  constructor() {
    super("ShopScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#f5dfbd");
  }
}
