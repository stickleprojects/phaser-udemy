/// <reference path="../typings/phaser.d.ts" />
import Phaser from 'phaser';

export default class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, bullet_speed, max_life) {
      super(scene, x, y, 'bullet')
      this.born = 0
      this.bullet_speed = bullet_speed;
      this.max_life = max_life;
      scene.add.existing(this);
      scene.physics.add.existing(this);
  
    }
    fire(shooter) {
      this.setRotation(shooter.rotation  - (Math.PI /2) );

      const r = shooter.rotation - (Math.PI /2) ;

      // Offset the bullet to start a bit right of the shooter
      this.x = shooter.x + ( Math.cos(r) * 50);
      this.y = shooter.y + ( Math.sin(r) * 50);
      this.setVelocityX(this.bullet_speed * Math.cos(Math.PI * this.angle / 180));
      this.setVelocityY(this.bullet_speed * Math.sin(Math.PI * this.angle / 180));
      this.born = 0;
    }

    preUpdate(time, delta) {
      super.preUpdate(time, delta);

      this.update(time, delta);

    }
    update(time, delta) {
      this.born += delta
      if (this.born > this.max_life) {
        this.destroy()
      }
    }
  }