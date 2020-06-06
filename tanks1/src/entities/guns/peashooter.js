/// <reference path="../../../node_modules/phaser/types/phaser.d.ts" />
import BaseGun from "./base_gun";

const BULLET_LIFE = 3500;
const BULLET_SPEED = 800;
const MAX_BULLETS = 2;
export default class Peashooter extends BaseGun {
  constructor(scene, owner) {
    super(
      scene,
      owner,
      BULLET_SPEED,
      BULLET_LIFE,
      MAX_BULLETS,
      "tanks-sheet",
      "blue/peashooter",
      "tanks-sheet",
      "explotions/shot/bullet1",
      30
    );
  }

  shoot() {
    return super.shoot(2);
  }
}
