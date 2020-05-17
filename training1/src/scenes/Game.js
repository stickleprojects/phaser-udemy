/// <reference path="../typings/phaser.d.ts" />

import Phaser from 'phaser';
import Hero from '../entities/hero';

class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) { }

  preload() {

    this.load.spritesheet('hero-run-sheet', 'assets/hero/run.png', {
      frameWidth: 32,
      frameHeight: 64
    });

  }

  create(data) {

    this.cursorKeys = this.input.keyboard.createCursorKeys();

    this.anims.create({
      key: 'hero-running',
      frames: this.anims.generateFrameNumbers('hero-run-sheet'),
      frameRate: 10,
      repeat: -1
    });

    this.hero = new Hero(this, 250, 160);


    // this.player = this.physics.add.sprite(250,160, 'hero-run-sheet',5 );
    // this.player.anims.play  ('hero-running');

    // this.player.body.setCollideWorldBounds(true);
    // this.player.body.setSize(12,40);
    // this.player.body.setOffset(12,23);
  }

  update(time, delta) { }
}

export default Game;