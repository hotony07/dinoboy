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
    this.load.spritesheet('button', './assets/sprites/button_1_spritesheet.png',{
      frameWidth: 256,
      frameHeight: 72
    });
    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Create the scene
    this.cameras.main.setBackgroundColor(0x3a6b0a);


    var logo = this.add.image(this.centerX , this.centerY - 200, "logo");
    var title = this.add.sprite(this.centerX -150, this.centerY + 90, "title");
    var title2 = this.add.sprite(this.centerX + 150, this.centerY + 50, "title2");
    //title.setFrame(0.5);

    var button = this.add.sprite(this.centerX - 100, this.centerY + 150, "button", 0).setInteractive();
    button.setScale(0.65);
    button.on("pointerout", function () {
      this.setFrame(0);
    });

    button.on("pointerover", function() {
      this.setFrame(1);
    });

    button.on("pointerdown", function() {
      this.setFrame(2);
    });

    var start = this.add.text(this.centerX-145, this.centerY+133, "START",{
      fontSize: '30px'
    });

    button.on("pointerup", function () {
       this.scene.start('Preloader');
     }, this
    );

    var tutButton = this.add.sprite(this.centerX + 100, this.centerY + 150, "button", 0).setInteractive();
    tutButton.setScale(0.65);
    tutButton.on("pointerout", function () {
      this.setFrame(0);
    });

    tutButton.on("pointerover", function() {
      this.setFrame(1);
    });

    tutButton.on("pointerdown", function() {
      this.setFrame(2);
    });

    var tutorial = this.add.text(this.centerX+30, this.centerY+133, "TUTORIAL",{
      fontSize: '30px'
    });

    button.on("pointerup", function () {
       //this.scene.start('Preloader');
     }, this
    );
  }

  update (time, delta) {
    // Update the scene
  }
}
