/// <reference path="../typings/phaser.d.ts" />

import Phaser from 'phaser';
import Hero from '../entities/Hero';

class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });

    this.showTileDebugging = false;
  }


  loadSounds() {
    this.load.audio('key', ['assets/sounds/Key1.wav']);
    this.load.audio('jump', 'assets/sounds/jump.wav');
    this.load.audio('die','assets/sounds/die.wav')
    this.load.audio('footstep','assets/sounds/foot.wav')

    
  }
  preload() {
    this.loadHeroSpriteSheets();

    this.loadSounds();

    this.points = 0;

    this.load.tilemapTiledJSON('level-1', 'assets/tilemaps/level-1.json');

    // we use the tiles from the world-1-sheet so we must load it as a spriesheet rather than an image
    this.load.spritesheet('world-1-sheet', 'assets/tilesets/groundtiles.png', { frameWidth: 32, frameHeight: 32, margin: 1, spacing: 2 })
    this.load.image('clouds-sheet', 'assets/tilesets/Clouds.png')

    this.load.spritesheet('key-sheet', 'assets/tiles/key.png', { frameWidth: 32, frameHeight: 32 });
  }


  addMap() {
    this.map = this.make.tilemap({ key: 'level-1' });
    const groundTiles = this.map.addTilesetImage('world-1', 'world-1-sheet');
    const backgroundTiles = this.map.addTilesetImage('clouds', 'clouds-sheet');


    const backgroundLayer = this.map.createStaticLayer('Background', backgroundTiles);
    const backgroundScrollSpeed = 0.6;
    backgroundLayer.setScrollFactor(backgroundScrollSpeed)
    const groundLayer = this.map.createStaticLayer('Ground', groundTiles);

    // tileIDs to colide with (each is offset by 1)
    groundLayer.setCollision([1, 4, 5], true);

    this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    // allow her to jump up outside the world, but not fall off the bottom
    this.physics.world.setBoundsCollision(true, true, false, true);


    if (this.showTileDebugging) {
      const debugGraphics = this.add.graphics();
      groundLayer.renderDebug(debugGraphics);
    }

    this.keyGroup = this.physics.add.group({ immovable: true, allowGravity: false });

    // default properties for the spikes
    this.spikeGroup = this.physics.add.group({ immovable: true, allowGravity: false });

    // loop all the gameobjects
    this.map.getObjectLayer("Objects").objects.forEach((itm, idx, ar) => {
      if (itm.name == "start") {
        this.spawnPos = { x: itm.x, y: itm.y };
      } else if (itm.type == "key") {
        const newKey = this.keyGroup.create(itm.x, itm.y, "key-sheet");

        newKey.anims.play('key-spinning');

        newKey.setOrigin(0, 1);
        //newKey.setSize(itm.width - 10, itm.height - 10);
        //newKey.setOffset(5, 10);
      } else if (itm.gid === 8) {
        // gid 8 is image 7, which is a spike
        // use the same image frame but -1 because it starts from 0
        // objct origin to bottom left
        const newSpike = this.spikeGroup.create(itm.x, itm.y, 'world-1-sheet', itm.gid - 1);
        newSpike.setOrigin(0, 1);
        newSpike.setSize(itm.width - 10, itm.height - 10);
        newSpike.setOffset(5, 10);

      }

    });
    this.foregroundLayer = this.map.createStaticLayer('Foreground', groundTiles);

  }

  addHud() {
    this.scorehud = this.add.text(0, 0, "SCORE: 0", { font: '12px Arial', fill: '#ffffa0' });
    this.scorehud.setScrollFactor(0);

  }
  create(data) {

    this.cursorKeys = this.input.keyboard.createCursorKeys();

    this.createKeyAnims();
    this.createHeroAnims();

    // this.addSamplePlatform();

    this.addMap();
    this.addHero();

    this.addHud();

    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);


  }

  addHero() {
    this.hero = new Hero(this, this.spawnPos.x, this.spawnPos.y);
    let tgtLayer = this.map.getLayer('Ground').tilemapLayer;
    const groundCollider = this.physics.add.collider(this.hero, tgtLayer);

    // move the hero to be drawn before the foreground

    var foregroundIndex = this.children.getIndex(this.foregroundLayer);

    this.children.moveTo(this.hero, foregroundIndex);

    // collider that doesnt prevent walking throuhg an object
    const spikesCollider = this.physics.add.overlap(this.hero, this.spikeGroup, (a, b) => {
      this.hero.kill();

    });

    const keyCollider = this.physics.add.overlap(this.hero, this.keyGroup, (a, b) => {
      b.destroy();
      this.points += 10;
      this.sound.play('key');
    })

    
    const footStepSound = this.sound.add('footstep', {
      loop: false
    });

    
    this.hero.on('run', ()=>{
      
      if(this.hero.isOnFloor()) {
      if(!footStepSound.isPlaying) {
        footStepSound.play();
      }
    }
    })
    this.hero.on('jump', ()=> {
      
      footStepSound.stop();

      this.sound.play('jump', );
    });
    this.hero.on('died', () => {
      groundCollider.destroy();
      spikesCollider.destroy();
      keyCollider.destroy();
      this.sound.play('die');
      this.hero.body.setCollideWorldBounds(false);
      this.cameras.main.stopFollow();
     
    });

    this.cameras.main.startFollow(this.hero);

  }
  addSamplePlatform() {
    const platform = this.add.rectangle(220, 240, 260, 10, 0x4BCB7C);
    this.physics.add.existing(platform, true);
    this.physics.add.collider(this.hero, platform);
  }

  loadHeroSpriteSheets() {

    var ss = ['idle', 'run', 'pivot', 'jump', { name: 'flip', image: 'spinjump' }, 'fall', { name: 'die', image: 'bonk' }];
    for (const sheet of ss) {
      let key = sheet
      let image = sheet
      if (sheet.name) {
        key = sheet.name
        image = sheet.image
      }
      this.load.spritesheet(`hero-${key}-sheet`, `assets/hero/${image}.png`, {
        frameWidth: 32,
        frameHeight: 64,
      });
    }

  }

  createKeyAnims() {
    const a = this.anims.create({
      key: 'key-spinning',
      frames: this.anims.generateFrameNumbers('key-sheet'),
      repeat: -1,
      frameRate: 15,
      showOnStart: true
    });


  }

  createHeroAnims() {

    this.anims.create({
      key: 'hero-idle',
      frames: this.anims.generateFrameNumbers('hero-idle-sheet'),
    });
    this.anims.create({
      key: 'hero-running',
      frames: this.anims.generateFrameNumbers('hero-run-sheet'),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'hero-pivoting',
      frames: this.anims.generateFrameNumbers('hero-pivot-sheet'),
    });
    this.anims.create({
      key: 'hero-jumping',
      frames: this.anims.generateFrameNumbers('hero-jump-sheet'),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'hero-flipping',
      frames: this.anims.generateFrameNumbers('hero-flip-sheet'),
      frameRate: 30,
      repeat: 0,
    });
    this.anims.create({
      key: 'hero-falling',
      frames: this.anims.generateFrameNumbers('hero-fall-sheet'),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'hero-dead',
      frames: this.anims.generateFrameNumbers('hero-die-sheet'),

    });
  }

  update(time, delta) {
    const cameraBottom = this.cameras.main.getWorldPoint(0, this.cameras.main.height).y;

    // offscreen and dead
    if (this.hero.isDead() && this.hero.getBounds().bottom > cameraBottom + 100) {
      this.hero.destroy();
      this.addHero();

    }

    this.scorehud.setText("SCORE: " + this.points);

  }

}

export default Game;