/// <reference path="../typings/phaser.d.ts" />
import Phaser from 'phaser';

export default class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
      super(scene, x, y, 'bullet')
      this.born = 0
    }
    fire(shooter) {
      this.setRotation(shooter.rotation)
      // Offset the bullet to start a bit right of the shooter
      this.x = shooter.x + (50 * Math.cos(this.rotation))
      this.y = shooter.y + (50 * Math.sin(this.rotation))
      this.setVelocityX(BULLET_SPEED * Math.cos(Math.PI * this.angle / 180))
      this.setVelocityY(BULLET_SPEED * Math.sin(Math.PI * this.angle / 180))
      this.born = 0
    }
    update(time, delta) {
      this.born += delta
      if (this.born > 1500) {
        this.destroy()
      }
    }
  }