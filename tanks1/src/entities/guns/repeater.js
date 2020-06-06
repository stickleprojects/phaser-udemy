/// <reference path="../../../node_modules/phaser/types/phaser.d.ts" />
import BaseGun from "./base_gun";

const BULLET_LIFE = 3500;
const BULLET_SPEED = 400;
const MAX_BULLETS = 10;
export default class Repeater extends BaseGun {
  constructor(scene, owner) {
    super(
      scene,
      owner,
      BULLET_SPEED,
      BULLET_LIFE,
      MAX_BULLETS,
      "tanks-sheet",
      "blue/repeater",
      "tanks-sheet",
      "explotions/shot/rocket1",
      30
    );
  }

  shoot() {
    super.shoot(2);
  }
}
