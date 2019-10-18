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
    this.enemyGroup = this.physics.add.group(
      {
      key: "enemy",
      repeat: 10,
      setXY: {
        x: 30,
        y: 20,
        stepX: 100,
        stepY: 100
      }
  });

      this.enemyGroup = this.physics.add.group(
        {
        key: "enemy",
        repeat: 10,
        setXY: {
          x: 300,
          y: 20,
          stepX: 100,
          stepY: 100
        }
    });

    this.enemyGroup = this.physics.add.group(
      {
      key: "enemy",
      repeat: 7,
      setXY: {
        x: 30,
        y: 300,
        stepX: 100,
        stepY: 100
      }
  });

    this.enemyGroup = this.physics.add.group(
      {
      key: "enemy",
      repeat: 10,
      setXY: {
        x: 600,
        y: 30,
        stepX: 100,
        stepY: 100
      }
  });

    this.enemyGroup = this.physics.add.group(
      {
      key: "enemy",
      repeat: 4,
      setXY: {
        x: 30,
        y: 600,
        stepX: 100,
        stepY: 100
      }
  });

    this.enemyGroup = this.physics.add.group(
      {
      key: "enemy",
      repeat: 1,
      setXY: {
        x: 30,
        y: 900,
        stepX: 100,
        stepY: 100
      }
  });
    this.enemyGroup = this.physics.add.group(
      {
      key: "enemy",
      repeat: 10,
      setXY: {
        x: 900,
        y: 30,
        stepX: 100,
        stepY: 100
      }
  });

    this.enemyGroup = this.physics.add.group(
      {
      key: "enemy",
      repeat: 10,
      setXY: {
        x: 1200,
        y: 30,
        stepX: 100,
        stepY: 100
      }
  });
    this.enemyGroup = this.physics.add.group(
      {
      key: "enemy",
      repeat: 10,
      setXY: {
        x: 1500,
        y: 30,
        stepX: 100,
        stepY: 100
      }
  });

    this.enemyGroup = this.physics.add.group(
      {
      key: "enemy",
      repeat: 4,
      setXY: {
        x: 1800,
        y: 30,
        stepX: 100,
        stepY: 100
      }
  });

      // add logo image
      this.load.image('logo', './assets/Scene1/logo.png');
      var logo = this.add.image(this.width/2, this.height/2 -200, 'logo');
      //logo.setScale(0.8);
      // Preload assets
      this.load.image('bullet', './assets/sprites/bullet.png')
      //this.load.audio("music", './assets/Music/8TownRoad.wav');
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

      this.load.spritesheet('cowboy', './assets/sprites/cowboy_spritesheet.png', {
        frameWidth: 64,
        frameHeight: 64
      });
      this.load.spritesheet('enemy', './assets/dinosaur/smallDino.png', {
        frameWidth: 64,
        frameHeight: 64
      });
      this.load.image('stego', './assets/dinosaur/stego2.png')


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
      this.load.tilemapTiledJSON("map", "./assets/Tilemaps/bgmap.json");


      // Declare variables for center of the scene
      this.centerX = this.cameras.main.width / 2;
      this.centerY = this.cameras.main.height / 2;


    // display progress bar
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(this.width/2 - 450, 470, this.width/2 - 30, 50);


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
        y: 300,
        scale: 2,
        ease: 'Cubic',
        duration: 1000,
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
