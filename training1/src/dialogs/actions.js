/// <reference path="../typings/phaser.d.ts" />

import { NinePatch } from '@koreez/phaser3-ninepatch';
import Phaser from 'phaser';

class Actions extends Phaser.Scene {

  constructor(handle) {
    super(handle);


  }

  loadUI() {
    this.load.multiatlas('ui', 'assets/ui/rpg_ui.json', 'assets/ui');

  }

  preload() {
    console.log('preload');
    this.loadUI();

  }
  init(args) {
    console.log('init');
    this.onClose = args;
  }
  createBorder(dimensions) {
    var np = new NinePatch(
      this,
      0,
      0,
      46,
      46,
      "ui",
      "splitted/borders/single/single_borders", {
      top: 10
    }
    );

    const offset = 4;
    np.resize(dimensions.width + offset * 2, dimensions.height + offset * 2);
    np.x = 0 + (np.width / 2) - offset;
    np.y = 0 + (np.height / 2) - offset;

    this.add.existing(np);

  }
  create() {
    console.log('create');

    const dims = {
      width: 250,
      height: 100
    }
    this.cameras.main.setViewport(0, 0, dims.width, dims.height);
    this.cameras.main.setBackgroundColor("#ff00ff");
    this.add.image(0, 0, 'ui', 'splitted/borders/paper background');

    this.cursorKeys = this.input.keyboard.createCursorKeys();


    this.createBorder(dims);

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