/*global Phaser*/

export default {
  type: Phaser.AUTO,
  parent: 'Dino Boy',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
  width: 960,
  height: 960,
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 0 },
        debug: false
    }
  },
pixelArt: true
};
