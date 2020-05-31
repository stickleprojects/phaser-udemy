/// <reference path="../node_modules/phaser/types/phaser.d.ts" />

import { NinePatchPlugin } from '@koreez/phaser3-ninepatch';
import Phaser from 'phaser';

export default {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#33A5E7',
  scale: {
    width: 800,
    height: 600,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  plugins: {
    global: [
      { key: 'NinePatchPlugin', plugin: NinePatchPlugin, start: true }
    ]
  },
  render: {
    pixelArt: true
  },
  // see photonstorm.github.io/phase3-docs/phaser.physics.arcade.html
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 0,
        x: 0,
        z: 0
      },
      debug: true,
      debugShowVelocity: true,
      debugShowBody: true,
      debugShowStaticBody: true
    }
  }
};
