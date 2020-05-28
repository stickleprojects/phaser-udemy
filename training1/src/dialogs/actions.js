/// <reference path="../typings/phaser.d.ts" />

import { NinePatch } from '@koreez/phaser3-ninepatch';
import Phaser from 'phaser';
import { TextButton } from '../game-objects/textbutton';
import Inventory from './inventory';
import DialogBase from './dialogbase';

class Actions extends DialogBase {


  constructor(handle, cursorKeys) {
    super(handle, cursorKeys);


  }

  create() {
    super.create(0, 0);

    const menus = ['Give', 'Take', 'Pick Up', 'Drop', 'Call Lift', 'Exit'];

    this.addMenuItems(menus);


  }

  onGive(args) {
    const key = 'InventoryDialog';
    console.log("Give!!!!" + args);


    this.dialog = new Inventory(key);
    if (!this.scene.get(key)) {
      this.scene.add(key, this.dialog);
    }
    this.scene.launch(key, (data) => {
      console.log('GIVE THE ' + data.src.name);
      this.scene.resume();

    });

    this.scene.pause();

  }

  onExit(args) {
    console.log("shutting down dialog");
    this.scene.stop();
    this.closeCallback();
  }

}

export default Actions;