import Phaser from "phaser";
import PlayerTank from "../entities/playertank";
import Peashooter from "../entities/guns/peashooter";
import Repeater from "../entities/guns/repeater";
import Factory from "../entities/guns/factory";

class Game extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  init(data) {}

  preload() {
    this.load.multiatlas("tanks-sheet", "assets/tanks.json", "assets");
  }

  createAnims() {
    const f = this.anims.generateFrameNames("tanks-sheet", {
      prefix: "blue/up",
      suffix: "",
      start: 1,
      end: 2,
      zeroPad: 0,
    });

    this.anims.create({
      key: "tank-moving",
      frames: f,
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: "tank-shooting",
      frames: this.anims.generateFrameNames("tanks-sheet", {
        prefix: "blue/up",
        suffix: "",
        start: 1,
        end: 1,
        zeroPad: 0,
      }),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: "tank-stopped",
      frames: this.anims.generateFrameNames("tanks-sheet", {
        prefix: "blue/up",
        suffix: "",
        start: 1,
        end: 1,
        zeroPad: 0,
      }),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: "tank-rotating",
      frames: this.anims.generateFrameNames("tanks-sheet", {
        prefix: "blue/up",
        suffix: "",
        start: 1,
        end: 1,
        zeroPad: 0,
      }),
      frameRate: 20,
      repeat: -1,
    });
  }

  getSpawnLocation() {
    const x = Math.floor(Math.random() * this.cameras.main.width);
    const y = Math.floor(Math.random() * this.cameras.main.height);

    return {
      x: x,
      y: y,
    };
  }
  createGunSpawner(group, ctor) {
    const location = this.getSpawnLocation();

    const factory = new Factory(
      this,
      location.x,
      location.y,
      "tanks-sheet",
      "blue/factory",
      ctor
    );
    group.add(factory);

    return factory;
  }
  spawnGuns() {
    this.guns = [];
    this.spawnerGroup = this.physics.add.group({
      immovable: true,
      allowGravity: false,
    });
    this.guns.push(
      this.createGunSpawner(
        this.spawnerGroup,
        (owner) => new Peashooter(this, owner)
      )
    );
    this.guns.push(
      this.createGunSpawner(
        this.spawnerGroup,
        (owner) => new Repeater(this, owner)
      )
    );

    const spawnCollider = this.physics.add.collider(
      this.tank1,
      this.spawnerGroup,
      (a, b) => {
        a.setGun(b.spawn(a));
      }
    );
  }
  verifyTexturesLoaded() {
    var textureNames = ["tanks-sheet"];

    for (const tn of textureNames) {
      if (this.textures.get(tn).key == "__MISSING") {
        console.error(
          "Texture " + tn + " not loaded correctly - is the asset path valid?"
        );
      }
    }
  }
  create(data) {
    this.verifyTexturesLoaded();

    this.cursorKeys = this.input.keyboard.createCursorKeys();

    this.createAnims();

    this.tank1 = new PlayerTank(this, 400, 400);
    this.tank1.setScale(4, 4);

    this.spawnGuns();

    this.hud = this.add.text(0, 0, "tank deetz: ");
  }

  update(time, delta) {
    const t =
      "x: " +
      this.tank1.x.toFixed(2) +
      ", y: " +
      this.tank1.y.toFixed(2) +
      ", r: " +
      this.tank1.rotation.toFixed(2) +
      " anim:" +
      this.tank1.getAnimationState().state +
      " mov:" +
      this.tank1.getMovementState().state +
      " bullets:" +
      this.tank1.getRemainingBullets();

    this.hud.setText(t);
  }
}

export default Game;
