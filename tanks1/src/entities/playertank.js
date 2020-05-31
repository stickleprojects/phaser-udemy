/// <reference path="../typings/phaser.d.ts" />
import Phaser from 'phaser';
import StateMachine from 'javascript-state-machine';
import Bullet from './bullet';

const TANK_SPEED = 100;
const ROTATION_SPEED = 200;
const BULLET_LIFE = 3500;
const BULLET_SPEED = 800;
export default class PlayerTank extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y) {
    super(scene, x, y, 'tanks', 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // middle bottom
    this.setOrigin(0.5, 0.5);

    this.body.setCollideWorldBounds(true);
    this.body.setSize(16, 16);
    this.body.setOffset(0, 0);
    this.body.setMaxVelocity(250, 400);
    this.body.setDragX(750);
    this.body.setAngularDrag (3500);

    this.keys = scene.cursorKeys;
    this.input = {};

    this.setupAnimations();
    this.setupMovement();

    this.debugHud = scene.add.text(0, 60, 'debug');

    
  }

  shoot() {

    const b = new Bullet(this.scene, this.x, this.y, BULLET_SPEED, BULLET_LIFE );

    b.fire(this);
    
    b.setCollideWorldBounds(true);
    b.setBounce(0.5, 0.5);

  }
  setupAnimations() {
    this.animState = new StateMachine({
      init: 'idle',
      transitions: [
        { name: 'idle', from: [ 'running', 'rotating'], to: 'idle' },
        { name: 'move', from: [ 'idle', 'rotating'], to: 'moving' },
        { name: 'rotate', from:'idle', to:'rotating'}
      ],
      methods: {
        onEnterState: (lifecycle) => {
          this.anims.play('tank-' + lifecycle.to);
          
        },
      },
    });

    this.animPredicates = {
      idle: () => {
        return this.body.velocity.x === 0 && this.body.velocity.y === 0;
      },
      run: () => {
        // let facingDirectionOfWalk = Math.sign(this.body.velocity.x) === (this.flipX ? -1 : 1);
        // return this.body.onFloor() && facingDirectionOfWalk;
        return true;
      },
      rotate: ()=>{
        return this.isRotating();
      }
      
    };
  }

  isRotating() {
    return this.rotation != this.rotateTarget;
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
          
          this.emit('jump');
        },
        
      },
    });

    this.movePredicates = {
      move: () => {
        return !this.isRotating() && (this.velocity.x > 0 || this.velocity.y > 0)
      },
      stop: () => {
        return (this.velocity.x === 0 && this.velocity.y === 0);
      },
      shoot: ()=>{
        return false;
      }
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

    this.didPressFire = !this.isDead() && Phaser.Input.Keyboard.JustDown(this.keys.space);

    const r = this.rotation - (Math.PI /2) ;
    
    const v = this.body.world.scene.physics.velocityFromRotation(r, TANK_SPEED);

    if (!this.isDead() && this.keys.up.isDown) {
  
      this.body.velocity.x = v.x;
      this.body.velocity.y = v.y;

      this.rotating = false;
    } else if (!this.isDead() && this.keys.down.isDown) {
   
      const vx = -v.x;
      const vy = -v.y;

      this.body.velocity.x = -v.x;
      this.body.velocity.y = -v.y;
  
      this.rotating = false;
    } else {
      this.body.setVelocity(0,0);
      
      this.body.setAngularVelocity(0);
      
      this.rotating = false;
    }

    if(this.didPressFire) {
      this.shoot();
    }

    if(!this.isDead() && this.keys.left.isDown) {

      this.body.angularVelocity = -ROTATION_SPEED;
      
    } else if(!this.isDead() && this.keys.right.isDown) {

      this.body.angularVelocity = ROTATION_SPEED;
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

