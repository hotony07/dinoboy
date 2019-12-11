export default class Boot extends Phaser.Scene {
  constructor () {
    super('Booter');
  }

  preload () {
  }

  create () {
    this.scene.start('Preloader');
  }
};
