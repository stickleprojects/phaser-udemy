/// <reference path="../typings/phaser.d.ts" />

import Phaser from 'phaser';

class Actions extends Phaser.Scene {

  constructor(handle) {
    super(handle);


  }

  preload() {
    console.log('preload');
  }
  init(args) {
    console.log('init');
    this.onClose = args;
  }
  create() {
    console.log('create');
    this.cameras.main.setViewport(0, 0, 100, 150);
    this.cursorKeys = this.input.keyboard.createCursorKeys();

    const btn = this.add.text(10, 10, 'click me!!', {
      fill: '#0f0'
    });
    btn.setInteractive();

    btn.on('pointerdown', () => {
      this.onClose();
      this.scene.stop();

    }, this);
  }

  update() { }
}

export default Actions;