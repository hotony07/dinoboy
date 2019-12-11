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

    this.cameras.main.setBackgroundColor(0x41734d);

      // add logo image
    this.load.image('logo', './assets/Scene1/logo.png');
    //var logo = this.add.image(this.width/2, 270, 'logo');
    //logo.setScale(0.8);

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
        targets: 'logo',
        x: this.width/2,
        y: 120,
        scale: 0.7,
        ease: 'Cubic',
        duration: 2000,
        //repeat: -1,
        //yoyo: true
    });

    }.bind(this));

    this.timedEvent = this.time.delayedCall(3000, this.ready, [], this);



    // load assets needed in our game
    // Preload assets
    this.load.image('bullet', './assets/sprites/bullet.png')
    this.load.audio("gunshot", './assets/sfx/gun/shoot.mp3');
    this.load.audio("gun_empty", './assets/sfx/gun/gun_empty.mp3');

    this.load.audio("baby_dino_growl_1", './assets/sfx/dinosaur/baby_dino_growl_01.mp3');
    this.load.audio("baby_dino_growl_2", './assets/sfx/dinosaur/baby_dino_growl_02.mp3');
    this.load.audio("dino_hurt", './assets/sfx/dinosaur/dino_hurt.mp3');
    this.load.audio("dino_roar", './assets/sfx/dinosaur/dino_roar.mp3');
    this.load.audio("dino_step_1", './assets/sfx/dinosaur/dino_step_01.mp3');
    this.load.audio("dino_step_2", './assets/sfx/dinosaur/dino_step_02.mp3');
    this.load.audio("lasso_hit", './assets/sfx/lasso/lasso_hit.mp3');
    this.load.audio("lasso_miss", './assets/sfx/lasso/lasso_miss.mp3');
    this.load.video("cutscene1", './assets/cutscene1.mp4');
    this.load.image('back', './assets/dinosaur/background.png');


    this.load.spritesheet('enemy', './assets/dinosaur/smallDino.png', {
      frameWidth: 35,
      frameHeight: 43
    });


    this.load.image('gun', './assets/sprites/gun.png');
    this.load.image('lasso', './assets/sprites/lasso.png');
    this.load.image('uplasso', './assets/sprites/uplasso.png');
    this.load.spritesheet("lasso_ss", './assets/sprites/lasso_spritesheet.png', {
      frameWidth: 124,
      frameHeight: 44
    });

    this.load.image('tree', './assets/Scene1/tree.png');
    this.load.image('ammo', './assets/sprites/ammo.png');
    this.load.image('health', './assets/Scene1/Heart.png');


    this.load.image("tiles", "./assets/Tilemaps/tiles.png");
    this.load.tilemapTiledJSON("map", "./assets/Tilemaps/bgmap2.json");


    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;


  }

  create(data){
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();

    var logo = this.add.image(this.centerX , this.centerY - 200, "logo");

  }

  ready () {
    //this.scene.start('Title');
    this.readyCount++;
    if (this.readyCount === 2) {
      this.scene.start('Boot');
    }
  }
};
