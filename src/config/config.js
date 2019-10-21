/*global Phaser*/

export default {
  type: Phaser.AUTO,
  parent: 'Dino Boy',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
  width: 1920,
  height: 1080,
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 0 },
        //debug: true
    }
  },
pixelArt: true
};
