/*global Phaser*/
export default class BootScene extends Phaser.Scene {
  constructor () {
    super('Boot');
  }

  init (data) {
    // Initialization code goes here
  }

  preload () {
    // Preload assets
    this.load.image('logo', './assets/logo.png');
    this.load.spritesheet('button', './assets/buttonSheet.png',{
      frameHeight: 166,
      frameWidth: 299
    });
    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Create the scene
    var button = this.add.sprite(this.centerX, this.centerY + 150, "button", 0).setInteractive();
    button.setScale(0.7);
    button.on("pointerover", function() {
      this.setFrame(1);
    });

    button.on("pointerout", function () {
      this.setFrame(0);
    });

    var start = this.add.text(this.centerX-50, this.centerY+130, "START",{
      fontSize: '32px'
    });
  }

  update (time, delta) {
    // Update the scene
  }
}
