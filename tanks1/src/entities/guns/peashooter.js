/// <reference path="../../typings/phaser.d.ts" />
import BaseGun from './base_gun';

const BULLET_LIFE = 3500;
const BULLET_SPEED = 800;
const MAX_BULLETS = 2;
export default class Peashooter  extends BaseGun {
    
    constructor(scene, owner) {
        super(scene, owner, BULLET_SPEED, BULLET_LIFE, MAX_BULLETS);

    }

    shoot() {
        return super.shoot();
        // const b = new Bullet(this.scene, this.x, this.y, this.bullet_speed, this.bullet_life );
    
        // b.fire(this);
        
        // b.setCollideWorldBounds(true);
        // b.setBounce(0.5, 0.5);
    
      }
}
