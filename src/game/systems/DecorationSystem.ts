import Phaser from "phaser";

export class DecorationSystem {
  constructor(private readonly scene: Phaser.Scene) {}

  addWarmAmbientLight(layer: Phaser.GameObjects.Layer) {
    const width = this.scene.scale.width;
    const height = this.scene.scale.height;
    const glow = this.scene.add.graphics();
    glow.fillStyle(0xffd889, 0.2);
    glow.fillEllipse(width * 0.52, height * 0.18, width * 0.42, height * 0.28);
    glow.fillStyle(0xffffff, 0.12);
    glow.fillEllipse(width * 0.2, height * 0.34, width * 0.28, height * 0.18);
    layer.add(glow);
  }

  addCoinPop(x: number, y: number, amount: number) {
    const label = this.scene.add.text(x, y, `+${amount}`, {
      fontFamily: "Microsoft YaHei, sans-serif",
      fontSize: "26px",
      fontStyle: "900",
      color: "#f8b84a",
      stroke: "#7a432b",
      strokeThickness: 4,
    });
    label.setDepth(200);
    this.scene.tweens.add({
      targets: label,
      y: y - 56,
      alpha: 0,
      duration: 900,
      ease: "Cubic.Out",
      onComplete: () => label.destroy(),
    });
  }
}
