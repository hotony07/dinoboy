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
    this.load.image('logo', './assets/Scene1/logo.png');
    this.load.image('title', './assets/Scene1/dinoboi.png');
    this.load.image('title2', './assets/Scene1/boy.png');
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
    this.cameras.main.setBackgroundColor(0x3a6b0a);


    var logo = this.add.image(this.centerX , this.centerY - 150, "logo");
    var title = this.add.sprite(this.centerX -150, this.centerY + 100, "title");
    var title2 = this.add.sprite(this.centerX + 150, this.centerY + 60, "title2");
    //title.setFrame(0.5);

    var button = this.add.sprite(this.centerX, this.centerY + 150, "button", 0).setInteractive();
    button.setScale(0.5);
    button.on("pointerover", function() {
      this.setFrame(1);
    });

    button.on("pointerout", function () {
      this.setFrame(0);
    });

    var start = this.add.text(this.centerX-50, this.centerY+133, "START",{
      fontSize: '30px'
    });

    button.on("pointerup", function () {
       this.scene.start('Preloader');
     }, this
    );
  }

  update (time, delta) {
    // Update the scene
  }
}
