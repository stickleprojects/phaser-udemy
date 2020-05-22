/// <reference path="../typings/phaser.d.ts" />

import Phaser from 'phaser';
import Hero from '../entities/Hero';

class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });

    this.showTileDebugging = false;
  }


  preload() {
    this.loadHeroSpriteSheets();

    this.load.tilemapTiledJSON('level-1', 'assets/tilemaps/level-1.json');

    // we use the tiles from the world-1-sheet so we must load it as a spriesheet rather than an image
    this.load.spritesheet('world-1-sheet', 'assets/tilesets/groundtiles.png', { frameWidth:32, frameHeight: 32, margin: 1, spacing: 2})
    this.load.image('clouds-sheet', 'assets/tilesets/Clouds.png')

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

    // default properties for the spikes
    this.spikeGroup = this.physics.add.group({ immovable: true, allowGravity: false});

    // loop all the gameobjects
    this.map.getObjectLayer("Objects").objects.forEach((itm, idx, ar) => {
      if (itm.name == "start") {
        this.spawnPos = { x: itm.x, y: itm.y };
      }


      // tileid 7 is a spike, (we add 1 because they start from 1)
      if (itm.gid === 8) {
        // use the same image frame but -1 because it starts from 0
        // objct origin to bottom left
        const newSpike = this.spikeGroup.create(itm.x, itm.y, 'world-1-sheet', itm.gid-1 );
        newSpike.setOrigin(0,1);
        newSpike.setSize(itm.width-10, itm.height-10);
        newSpike.setOffset(5,10);

      }

    });
    this.foregroundLayer = this.map.createStaticLayer('Foreground', groundTiles);

  }
  create(data) {

    this.cursorKeys = this.input.keyboard.createCursorKeys();

    this.createHeroAnims();

    // this.addSamplePlatform();

    this.addMap();
    this.addHero();

    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.hero);

  }

  addHero() {
    this.hero = new Hero(this, this.spawnPos.x, this.spawnPos.y);
    let tgtLayer = this.map.getLayer('Ground').tilemapLayer;
    this.physics.add.collider(this.hero, tgtLayer);

    // move the hero to be drawn before the foreground

    var foregroundIndex = this.children.getIndex(this.foregroundLayer);

    this.children.moveTo(this.hero, foregroundIndex);

    setTimeout(()=>{
      this.hero.kill();
    }, 3000);
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

  update(time, delta) { }
}

export default Game;