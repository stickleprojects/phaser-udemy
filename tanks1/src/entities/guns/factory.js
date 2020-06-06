/// <reference path="../../../node_modules/phaser/types/phaser.d.ts" />
import Phaser from "phaser";

const FACTORY_COOLDOWN = 500;

export default class Factory extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame, gunConstructor) {
    super(scene, x, y, texture, frame);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(4);

    this.coolDownAmount = FACTORY_COOLDOWN;
    this.coolDown = 0;

    this.gunConstructor = gunConstructor;

    this.countDown = this.scene.add.text(x, y, "");
    this.countDown.setOrigin(0.5, 0.5);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (this.coolDown > 0) {
      this.coolDown--;
      this.countDown.setText(this.coolDown);
    } else {
      this.countDown.setText("");
      this.body.setAngularVelocity(0);
    }
    this.countDown.x = this.x;
    this.countDown.y = this.y;
  }
  spawn(tank) {
    if (this.coolDown > 0) {
      return;
    }
    this.coolDown = this.coolDownAmount;
    this.body.setAngularVelocity(150);
    return this.gunConstructor(tank);
  }
}
