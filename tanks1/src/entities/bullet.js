/// <reference path="../../node_modules/phaser/types/phaser.d.ts" />
import Phaser from 'phaser';

export default class Bullet extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, bullet_speed, max_life, texture, frame) {
      super(scene, x, y, texture, frame)
      this.born = 0
      this.bullet_speed = bullet_speed;
      this.max_life = max_life;
      scene.add.existing(this);
      scene.physics.add.existing(this);
  
    }
    fire(shooter, scale) {
      this.setRotation(shooter.rotation   );

      const r = shooter.rotation - (Math.PI /2) ;

      // Offset the bullet to start a bit right of the shooter
      this.x = shooter.x + ( Math.cos(r) * 50);
      this.y = shooter.y + ( Math.sin(r) * 50);
      this.setVelocityX(this.bullet_speed * Math.cos(r ));
      this.setVelocityY(this.bullet_speed * Math.sin(r ));

      if(scale) {
        this.setScale(scale, scale);
      }
      this.born = 0;
    }

    preUpdate(time, delta) {
      super.preUpdate(time, delta);

      this.update(time, delta);

    }
    update(time, delta) {
      this.born += delta
      if (this.born > this.max_life) {
        this.emit("dead");
        this.destroy()
      }
    }
  }