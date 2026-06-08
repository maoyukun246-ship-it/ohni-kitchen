import Phaser from "phaser";

export class LearningScene extends Phaser.Scene {
  constructor() {
    super("LearningScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#f8ebd5");
  }
}
