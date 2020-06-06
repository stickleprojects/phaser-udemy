/// <reference path="../../../node_modules/phaser/types/phaser.d.ts" />
import Phaser from 'phaser';
import Bullet from '../bullet';


export default class BaseGun  extends Phaser.GameObjects.Sprite {
    
    constructor(scene, owner, bullet_speed, bullet_life, max_bullets, gun_texture, gun_frame, bullet_texture, bullet_frame) {
        super(scene, owner.x, owner.y, gun_texture, gun_frame);

        scene.add.existing(this);

        this.setScale(4);

        this.owner = owner;
        
        this.bullet_texture = bullet_texture;
        this.bullet_frame = bullet_frame;
        this.bullet_speed = bullet_speed;
        this.bullet_life = bullet_life;
        this.max_bullets = max_bullets;
        this.bullets=new Set();
        
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        this.x = this.owner.x;
        this.y = this.owner.y;
        this.rotation = this.owner.rotation;

    }
    shoot(scale) {

        // dont shoot
        if(this.bullets.size >= this.max_bullets) {
            return false;
        }
        const b = new Bullet(this.scene, this.x, this.y, this.bullet_speed, this.bullet_life, this.bullet_texture, this.bullet_frame );
    
        b.fire(this, scale);
        
        b.setCollideWorldBounds(true);
        b.setBounce(0.5, 0.5);
        b.on("dead", ()=>{
            this.bullets.delete(b);
        })
        this.bullets.add(b);

      }
}
