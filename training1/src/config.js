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
  // see photonstorm.github.io/phase3-docs/phaser.physics.arcade.html
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y:750
      }

    }
  }
};
