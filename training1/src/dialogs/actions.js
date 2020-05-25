/// <reference path="../typings/phaser.d.ts" />

import { NinePatch } from '@koreez/phaser3-ninepatch';
import Phaser from 'phaser';
import { TextButton } from '../game-objects/textbutton';

class Actions extends Phaser.Scene {


  constructor(handle, cursorKeys) {
    super(handle);

    this.cursorKeys = cursorKeys;

    this.selectedItem = null;
  }

  loadUI() {
    this.load.multiatlas('ui', 'assets/ui/rpg_ui.json', 'assets/ui');
    this.load.bitmapFont('uifont', 'assets/ui/arcade.png', 'assets/ui/arcade.xml');

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

  hasMethod(obj, name) {
    const desc = Object.getOwnPropertyDescriptor(obj, name);
    return !!desc && typeof desc.value === 'function';
  }
  getInstanceMethodNames(obj, stop) {
    let array = [];
    let proto = Object.getPrototypeOf(obj);
    while (proto && proto !== stop) {
      Object.getOwnPropertyNames(proto)
        .forEach(name => {
          if (name !== 'constructor') {
            if (this.hasMethod(proto, name)) {
              array.push(name);
            }
          }
        });
      proto = Object.getPrototypeOf(proto);
    }
    return array;
  }

  addMenuItems(menuItems) {

    let y = 0;
    let index = 0;
    const x = 10;
    const gap = 15;


    menuItems.forEach(itm => {
      const btn = new TextButton(this, itm.replace(" ", ""), x, y, itm, undefined, (args) => {
        console.log("you clicked " + args.src.name);

        // find the click event
        const eventName = "on" + args.src.name;
        let eventTgt = args.src.scene;
        let methods = this.getInstanceMethodNames(eventTgt);
        if (methods.includes(eventName)) {
          eventTgt[eventName](args);
        }

      });

      this.add.existing(btn);
      y += gap;

    });
  }
  create() {
    const menus = ['Give', 'Take', 'Pick Up', 'Drop', 'Call Lift', 'Exit'];

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


    this.addMenuItems(menus);


  }

  onGive(args) {
    console.log("Give!!!!" + args);
  }

  onExit(args) {
    console.log("shutting down dialog");
    this.scene.stop();
  }
  update() {

    // navigate next using down arrow


  }
}

export default Actions;