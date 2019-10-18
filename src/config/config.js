/*global Phaser*/

export default {
  type: Phaser.AUTO,
  parent: 'Dino Boy',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
  width: 1920,
  height: 955,
  dom: {
    createContainer: true
  },
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 0 },
        debug: false
    }
  },
pixelArt: true
};
