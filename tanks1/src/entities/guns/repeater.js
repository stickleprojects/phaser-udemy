/// <reference path="../../../node_modules/phaser/types/phaser.d.ts" />
import BaseGun from './base_gun';

const BULLET_LIFE = 3500;
const BULLET_SPEED = 800;
const MAX_BULLETS = 6;
export default class Repeater  extends BaseGun {
    
    constructor(scene, owner) {
        super(scene, owner, BULLET_SPEED, BULLET_LIFE, MAX_BULLETS, 'tanks-sheet', 'explotions/shot/rocket1');

    }

    shoot() {
        super.shoot(2);        
    }
}

