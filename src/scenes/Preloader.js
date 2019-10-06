export default class PreloaderScene extends Phaser.Scene {
  constructor () {
    super('Preloader');
  }

  init () {
    this.readyCount = 0;

    this.width = this.cameras.main.width;
    this.height = this.cameras.main.height;
  }

  preload () {

    this.cameras.main.setBackgroundColor(0x3a6b0a);

      // add logo image
    this.load.image('logo', './assets/Scene1/logo.png');
    var logo = this.add.image(this.width/2, 270, 'logo');
    logo.setScale(0.8);


    // display progress bar
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(this.width/2 -250, 470, this.width/2 - 30, 50);


    var loadingText = this.make.text({
      x: this.width / 2,
      y: this.height / 2 + 150,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
      x: this.width / 2,
      y: this.height / 2 + 195,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
      x: this.width / 2,
      y: this.height / 2 + 250,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    assetText.setOrigin(0.5, 0.5);

    // update progress bar
    this.load.on('progress', function (value) {
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(this.width/2 -240, 480, (this.width/2 -50) * value, 30);
    });

    // update file progress text
    this.load.on('fileprogress', function (file) {
      assetText.setText('Loading asset: ' + file.key);
    });

    // remove progress bar when complete
    this.load.on('complete', function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
      this.ready();
//move logo
        this.tweens.add({
        targets: logo,
        x: this.width/2,
        y: 120,
        scale: 0.4,
        ease: 'Cubic',
        duration: 2000,
        //repeat: -1,
        //yoyo: true
    });

    }.bind(this));

    this.timedEvent = this.time.delayedCall(3000, this.ready, [], this);


    // load assets needed in our game
    //Test Assets
    this.load.image('bullet', './assets/sprites/bullet.png')
    //this.load.audio("music", './assets/Music/8TownRoad.wav');
    this.load.spritesheet('cowboy', './assets/sprites/cowboy_spritesheet.png', {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet('enemy', './assets/dinosaur/smallDino.png', {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.image('gun', './assets/sprites/gun.png');
    this.load.image('tree', './assets/Scene1/tree.png');
    this.load.image('ammo', './assets/sprites/ammo.png');
    this.load.spritesheet('boss1', './assets/dinosaur/stego.png', {
      frameWidth: 512,
      frameHeight: 512
    });
    this.load.audio('theme', './assets/Music/DinoBoyTheme.mp3');

    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;

  }

  ready () {
    //this.scene.start('Title');
    this.readyCount++;
    if (this.readyCount === 2) {
      this.scene.start('Test2');
    }
  }
};
