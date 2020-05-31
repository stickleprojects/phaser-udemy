import Phaser from 'phaser';

class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) {}

  preload() {
    this.load.image('logo', 'assets/phaser3-logo.png');
    this.load.multiatlas('tanks-sheet', 'assets/tanks.json', 'assets');

  }

  createAnims() {
    const f = this.anims.generateFrameNames('tanks-sheet', {
      prefix:'blue/down',
      suffix:'',
      start:1,
      end:2,
      zeroPad:0
    });

    this.anims.create({
      key: 'bluedown',
      frames : f,
      frameRate: 20,
      repeat: -1
    });

  }

  verifyTexturesLoaded() {
    var textureNames=['logo','tanks-sheet']

    for(const tn of textureNames) {
      if(this.textures.get(tn).key == '__MISSING') {
        console.error('Texture ' + tn + ' not loaded correctly - is the asset path valid?');
      }
    }
  }
  create(data) {

    this.verifyTexturesLoaded();

    this.createAnims();
    this.add.image(400, 300, 'logo');

    this.tank1 = this.add.sprite(100,100,'tanks');
    this.tank1.setScale(8,8);

    this.tank1.anims.play('bluedown');
  }

  update(time, delta) {}
}

export default Game;