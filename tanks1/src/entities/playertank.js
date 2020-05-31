/// <reference path="../typings/phaser.d.ts" />
import Phaser from 'phaser';
import StateMachine from 'javascript-state-machine';

const TANK_SPEED = 1000;

class PlayerTank extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y) {
    super(scene, x, y, 'tanks', 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // middle bottom
    this.setOrigin(0.5, 1);

    this.body.setCollideWorldBounds(true);
    this.body.setSize(12, 40);
    this.body.setOffset(12, 23);
    this.body.setMaxVelocity(250, 400);
    this.body.setDragX(750);

    this.keys = scene.cursorKeys;
    this.input = {};

    this.setupAnimations();
    this.setupMovement();
  }

  setupAnimations() {
    this.animState = new StateMachine({
      init: 'idle',
      transitions: [
        { name: 'idle', from: [ 'running', 'rotating'], to: 'idle' },
        { name: 'run', from: [ 'idle', 'rotating'], to: 'running' },
        { nanme: 'rotate', from:'idle', to:'rotating'}
      ],
      methods: {
        onEnterState: (lifecycle) => {
          this.anims.play('tank-' + lifecycle.to);
          
        },
      },
    });

    this.animPredicates = {
      idle: () => {
        return this.body.velocity.x === 0;
      },
      run: () => {
        // let facingDirectionOfWalk = Math.sign(this.body.velocity.x) === (this.flipX ? -1 : 1);
        // return this.body.onFloor() && facingDirectionOfWalk;
        return true;
      },
      rotate: ()=>{
        return true;
      }
      
    };
  }

  
  setupMovement() {
    this.moveState = new StateMachine({
      init: 'standing',
      transitions: [
        { name: 'move', from: 'idle', to: 'moving' },
        { name: 'stop', from: 'running', to: 'stop' },
        { name: 'rotate', from: 'stop', to: 'rotating' },
        { name: 'shoot', from:'stop', to:'shooting'},
        { name: 'die', from: '*', to: 'dead' },
      ],
      methods: {
        onDie: () => {
          this.body.setVelocity(0, 0);
          this.body.setAcceleration(0);
        },
        onMove: () => {
          this.body.
          this.emit('jump');
        },
        onFlip: () => {
          this.body.setVelocityY(-300);
        }
      },
    });

    this.movePredicates = {
      jump: () => {
        return this.input.didPressJump;
      },
      flip: () => {
        return this.input.didPressJump;
      },
      fall: () => {
        return !this.body.onFloor();
      },
      touchdown: () => {
        return this.body.onFloor();
      },
    };
  }

  kill() {
    if (this.moveState.can('die')) {
      // called by game class
      this.moveState.die();
      this.animState.die();

      // tell other objects that we died
      this.emit('died');
      
    }
  }

  isDead() {
    return this.moveState.is('dead');
  }
  preUpdate(time, delta) {
    super.preUpdate(time, delta);


    if (!this.isDead() && this.keys.up.isDown) {
      this.body.setVelocityX(TANK_SPEED * Math.cos(Math.PI * this.rotation));
      this.body.setVelocityY(TANK_SPEED * Math.sin(Math.PI * this.rotation));
      
    } else if (!this.isDead() && this.keys.down.isDown) {
      this.body.setVelocityX(-TANK_SPEED * Math.cos(Math.PI * this.rotation));
      this.body.setVelocityY(-TANK_SPEED * Math.sin(Math.PI * this.rotation));
    } else {
      this.body.setAccelerationX(0);
      this.body.setAccelerationY(0);
    }

    for (const t of this.moveState.transitions()) {
      if (t in this.movePredicates && this.movePredicates[t]()) {
        this.moveState[t]();
        break;
      }
    }

    for (const t of this.animState.transitions()) {
      if (t in this.animPredicates && this.animPredicates[t]()) {
        this.animState[t]();
        break;
      }
    }
  }

}

export default Hero;