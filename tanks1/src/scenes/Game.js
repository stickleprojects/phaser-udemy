import Phaser from 'phaser';
import  PlayerTank from '../entities/playertank';

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
      prefix:'blue/up',
      suffix:'',
      start:1,
      end:2,
      zeroPad:0
    });

    this.anims.create({
      key: 'tank-moving',
      frames : f,
      frameRate: 20,
      repeat: -1
    });

    
    this.anims.create({
      key: 'tank-idle',
      frames : this.anims.generateFrameNames('tanks-sheet', {
        prefix:'blue/up',
        suffix:'',
        start:1,
        end:1,
        zeroPad:0
      }),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: 'tank-rotating',
      frames : this.anims.generateFrameNames('tanks-sheet', {
        prefix:'blue/up',
        suffix:'',
        start:1,
        end:1,
        zeroPad:0
      }),
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

    this.cursorKeys = this.input.keyboard.createCursorKeys();

    this.createAnims();
    
    this.tank1 = new PlayerTank (this, 400,400);
    this.tank1.setScale(4,4);

    this.hud = this.add.text(0,0,'tank deetz: ');
    
  }

  update(time, delta) {
    this.hud.setText('x: ' + this.tank1.x + ", y: " + this.tank1.y );

  }
}

export default Game;