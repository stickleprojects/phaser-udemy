/// <reference path="../../node_modules/phaser/types/phaser.d.ts" />
import Phaser from "phaser";
import StateMachine from "javascript-state-machine";

const TANK_SPEED = 400;
const ROTATION_SPEED = 200;

export default class PlayerTank extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "tanks", 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // middle bottom
    this.setOrigin(0.5, 0.5);

    this.body.setCollideWorldBounds(true);
    this.body.setSize(16, 16);
    this.body.setOffset(0, 0);
    this.body.setMaxVelocity(250, 400);
    this.body.setDragX(750);
    this.body.setAngularDrag(3500);

    this.keys = scene.cursorKeys;
    this.input = {};

    this.setupAnimations();
    this.setupMovement();

    this.debugHud = scene.add.text(0, 60, "debug");

    //  this.gun = new Repeater (scene, this);
  }

  getRemainingBullets() {
    if (!this.gun) return 0;
    return this.gun.getRemainingBullets();
  }

  setGun(newGun) {
    if (newGun) {
      if (this.gun) {
        this.gun.destroy();
      }
      this.gun = newGun;

      this.gun.on("empty", () => {
        this.gun = null;
      });
    }
  }
  shoot() {
    if (this.gun) {
      this.gun.shoot();
    }
  }
  setupAnimations() {
    this.animState = new StateMachine({
      init: "stopped",
      transitions: [
        {
          name: "stop",
          from: ["moving", "shooting"],
          to: "stopped",
        },
        { name: "move", from: "stopped", to: "moving" },
        { name: "shoot", from: "stopped", to: "shooting" },
      ],
      methods: {
        onEnterState: (lifecycle) => {
          this.anims.play("tank-" + lifecycle.to);
        },
      },
    });

    this.animPredicates = {
      stop: (tgt) => {
        return !tgt.isMoving() && !tgt.isRotating();
      },
      move: (tgt) => {
        // let facingDirectionOfWalk = Math.sign(this.body.velocity.x) === (this.flipX ? -1 : 1);
        // return this.body.onFloor() && facingDirectionOfWalk;
        return tgt.isRotating() || tgt.isMoving();
      },

      shoot: (tgt) => {
        return tgt.didPressFire;
      },
    };
  }

  isMoving() {
    return this.body.velocity.x !== 0 || this.body.velocity.y !== 0;
  }
  isRotating() {
    return this.rotating;
  }

  getMovementState() {
    return this.moveState;
  }
  getAnimationState() {
    return this.animState;
  }
  setupMovement() {
    this.moveState = new StateMachine({
      init: "stopped",
      transitions: [
        { name: "move", from: "stopped", to: "moving" },
        {
          name: "stop",
          from: ["shooting", "rotating", "moving"],
          to: "stopped",
        },
        { name: "rotate", from: "stopped", to: "rotating" },
        { name: "shoot", from: "stopped", to: "shooting" },
        { name: "die", from: "*", to: "dead" },
      ],
      methods: {
        onDie: () => {
          this.body.setVelocity(0, 0);
          this.body.setAcceleration(0);
        },
        onMove: () => {
          this.emit("jump");
        },
      },
    });

    this.movePredicates = {
      move: (tgt) => {
        return !tgt.isRotating() && tgt.isMoving();
      },
      stop: (tgt) => {
        return !tgt.isMoving() && !tgt.isRotating();
      },

      rotate: (tgt) => {
        return tgt.isRotating();
      },
      shoot: (tgt) => {
        return tgt.didPressFire;
      },
    };
  }

  kill() {
    if (this.moveState.can("die")) {
      // called by game class
      this.moveState.die();
      this.animState.die();

      // tell other objects that we died
      this.emit("died");
    }
  }

  isDead() {
    return this.moveState.is("dead");
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    this.didPressFire =
      !this.isDead() && Phaser.Input.Keyboard.JustDown(this.keys.space);

    const r = this.rotation - Math.PI / 2;

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
      this.body.setVelocity(0, 0);

      this.body.setAngularVelocity(0);

      this.rotating = false;
    }

    if (this.didPressFire) {
      this.shoot();
    }

    if (!this.isDead() && this.keys.left.isDown) {
      this.body.angularVelocity = -ROTATION_SPEED;
      this.rotating = true;
    } else if (!this.isDead() && this.keys.right.isDown) {
      this.body.angularVelocity = ROTATION_SPEED;
      this.rotating = true;
    }

    for (const t of this.moveState.transitions()) {
      if (t in this.movePredicates && this.movePredicates[t](this)) {
        this.moveState[t]();
        break;
      }
    }

    for (const t of this.animState.transitions()) {
      if (t in this.animPredicates && this.animPredicates[t](this)) {
        this.animState[t]();
        break;
      }
    }
  }
}
