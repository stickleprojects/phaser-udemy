/// <reference path="../typings/phaser.d.ts" />

import Phaser from 'phaser';


const MAX_V = { x:250, y:400};
const ACCELERATION_X = MAX_V.x * 4;   // reach max speed in 1/4 of a second
const JUMP_SPEED = MAX_V.y * 2.5;

class Hero extends Phaser.GameObjects.Sprite {


    constructor(scene, x, y) {
        super(scene, x, y, "hero-run-sheet", 0)

        scene.add.existing(this);
        scene.physics.add.existing(this);

        //this.player = this.physics.add.sprite(250, 160, 'hero-run-sheet', 5);
        this.anims.play('hero-running');

        this.body.setCollideWorldBounds(true);
        this.body.setSize(12, 40);
        this.body.setOffset(12, 23);

        this.body.setDragX(ACCELERATION_X * 0.75);

        this.body.setMaxVelocity (MAX_V.x, MAX_V.y);
        this.keys = scene.cursorKeys;

    }


    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.keys.left.isDown) {
            this.body.setAccelerationX(-ACCELERATION_X);
            this.flipX = true;
            this.body.setOffset.x = 8;
        } else if (this.keys.right.isDown) {
            this.body.setAccelerationX(ACCELERATION_X);
            this.flipX = false;
            this.body.setOffset.x = 12;
        } else {
            this.body.setAccelerationX(0);
        }

        const didPressJump = Phaser.Input.Keyboard.JustDown(this.keys.up);

        if (didPressJump ) {
            // single jump if on the floor
            if (this.body.onFloor()) {
                this.canDoubleJump=true;
                this.body.setVelocityY(-JUMP_SPEED);
            } else if (this.canDoubleJump) {
                // doublejump
                this.body.setVelocityY(-JUMP_SPEED * 1.75);
                this.canDoubleJump = false;
            }
        }

        if (!this.keys.up.isDown && this.body.velocity.y < -150) {
            this.body.setVelocityY (-150);
        }
    }
}

export default Hero;

