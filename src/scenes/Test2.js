/*global Phaser*/
export default class Test2 extends Phaser.Scene {
  constructor () {
    super('Test2');
  }

  init (data) {
    // Initialization code goes here
    //this.kills = data.kills;
  }

  preload () {
    // Preload assets
    this.load.image('back2', './assets/dinosaur/background.png');
    this.load.image('bullet', './assets/sprites/bullet.png')
    this.load.audio("gunshot", './assets/sfx/gun/shoot.mp3');
    this.load.audio("gun_empty", './assets/sfx/gun/gun_empty.mp3');

    this.load.audio("theme", './assets/Music/DinoBoyV2.mp3');
    this.load.audio("baby_dino_growl_1", './assets/sfx/dinosaur/baby_dino_growl_01.mp3');
    this.load.audio("baby_dino_growl_2", './assets/sfx/dinosaur/baby_dino_growl_02.mp3');
    this.load.audio("dino_hurt", './assets/sfx/dinosaur/dino_hurt.mp3');
    this.load.audio("dino_roar", './assets/sfx/dinosaur/dino_roar.mp3');
    this.load.audio("dino_spit", './assets/sfx/dinosaur/dino_spit.mp3');
    this.load.audio("dino_step_1", './assets/sfx/dinosaur/dino_step_01.mp3');
    this.load.audio("dino_step_2", './assets/sfx/dinosaur/dino_step_02.mp3');
    this.load.audio("lasso_hit", './assets/sfx/lasso/lasso_hit.mp3');
    this.load.audio("lasso_miss", './assets/sfx/lasso/lasso_miss.mp3');
    this.load.audio("healthPickup", './assets/sfx/heal.mp3')
    this.load.audio("ammoPickup", './assets/sfx/ammo.mp3')
    this.load.video("cutscene1", './assets/cutscene1.mp4');
    this.load.spritesheet("chomp", "./assets/dinosaur/dinoChomp.png",{
      frameWidth: 580,
      frameHeight: 253
    });

    this.load.spritesheet('cowboyIdle', './assets/sprites/cowboy_idle_spritesheet.png', {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet('cowboyWalk', './assets/sprites/cowboy_walk_spritesheet.png', {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet('cowboyRoll', './assets/sprites/cowboy_roll_spritesheet.png', {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet('enemy', './assets/dinosaur/smallDino.png', {
      frameWidth: 35,
      frameHeight: 43
    });
    this.load.image('stego', './assets/dinosaur/newStego.png')
    this.load.spritesheet('stegoWalk', './assets/dinosaur/dinoWalk2.png', {
      frameWidth: 1244,
      frameHeight: 524
    });
    this.load.spritesheet('backWalk', './assets/dinosaur/backStego.png', {
      frameWidth: 512,
      frameHeight: 539
    });
    this.load.spritesheet('frontWalk', './assets/dinosaur/frontWalk.png', {
      frameWidth: 445,
      frameHeight: 445
    });

    this.load.image('gun', './assets/sprites/gun.png');
    this.load.image('gun_forward', './assets/sprites/gun_forward.png');
    this.load.image('gun_backward', './assets/sprites/gun_backward.png');
    this.load.image('lasso', './assets/sprites/lasso.png');
    this.load.image('uplasso', './assets/sprites/uplasso.png');
    this.load.spritesheet("lasso_ss", './assets/sprites/lasso_spritesheet.png', {
      frameWidth: 128,
      frameHeight: 64
    });
    this.load.spritesheet("uplasso_ss", './assets/sprites/uplasso_spritesheet.png', {
      frameWidth: 64,
      frameHeight: 128
    });

    this.load.image('tree', './assets/Scene1/tree.png');
    this.load.image('ammo', './assets/sprites/ammo.png');
    this.load.image('health', './assets/Scene1/Heart.png');
    this.load.image('trex', './assets/dinosaur/trex.png');
    this.load.image('spit', './assets/sprites/dino_spit_purple.png');


    this.load.image("tiles", "./assets/Tilemaps/tiles.png");
    this.load.tilemapTiledJSON("map", "./assets/Tilemaps/bgmap2.json");


    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    this.cutscene1 = this.add.video(this.cameras.main.x, this.cameras.main.y, 'cutscene1');
    this.cutscene1.alpha = 0;

    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("sheet", "tiles");

    const belowLayer = map.createStaticLayer("Below", tileset, 0, 0).setDepth(-10);

    const spawnPoint = map.findObject(
    "Spawns",
    obj => obj.name === "Player Spawn"
    );

    this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'player');
    this.player.body.setSize(64, 64, 0 ,0);
    this.player.setScale(.5);
    this.player.isMounted = false;
    this.maxHealth = 5;
    this.currentHealth = this.maxHealth;
    this.playerHitTimer = 0;
    this.playerDodgeTimer = 0;
    this.kills = 0;
    this.player.isHit = false;
    this.stegoSpawned = false;
    this.lassoTimer = 0;
    this.mobMaxHealth = 3;
    this.playerHurtTimer = 0;
    this.playerIsHurt = false;

    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.shift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.esc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    this.cursors = this.input.keyboard.createCursorKeys();

    const camera = this.cameras.main;
    camera.setZoom(5);
    camera.startFollow(this.player);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels + 40);

    var gun, bullets, enemy, bullet, enemyGroup;
    this.nextFire = 0;
    this.fireRate = 200;
    this.speed = 1000;
    this.lastDirection = "";

    this.gun = this.physics.add.sprite(this.player.x + 10, this.player.y + 4, 'gun');
    this.gun.setDebug(false);
    this.gun.setScale(0.15);

    //this.enemies = this.add.group();
    this.enemyGroup = this.physics.add.group({
      key: "enemy",
      repeat: 40
    });
    //this.enemyGroup.setDepth(-1)
    this.enemyGroup.children.iterate(function(child) {
      child.setScale(0.7);
      child.x = 200 + Math.floor(Math.random() * (map.widthInPixels - 200));
      child.y = 200 + Math.floor(Math.random() * (map.heightInPixels - 200));
      child.health = 3;
      child.boss = false;
      child.boss2 = false;
      child.isStunned = false;
      child.stunTimer = 0;
      child.shootTimer = 0;
      child.reload = false;
      child.isHurt = false;
      child.hurtTimer = 0;
      child.canStomp = true;
    });

    this.mountGroup = this.physics.add.group();

    //
    // var enemy = this.physics.add.sprite(100, 100, 'enemy');
    // var enemy2 = this.physics.add.sprite(100, 200, 'enemy');
    // var enemy3 = this.physics.add.sprite(100, 300, 'enemy');
    // var enemy4 = this.physics.add.sprite(100, 400, 'enemy');
    //
    //
    // var tween = this.tweens.add({
    //   targets: [enemy, enemy3],
    //   props: {
    //     x: { value: '+=600', duration: 7000, flipX: true},
    //     y: { value: '570', duration: 7500, ease: 'Sine.easeInOut'}
    //   },
    //   delay: 100,
    //   yoyo: true,
    //   loop: -1
    // })
    //
    // this.tweens.add({
    //   targets: [enemy2, enemy4],
    //   props: {
    //     x: { value: '500', duration: 7000, flipX: true},
    //     y: { value: '170', duration: 7500, ease: 'Sine.easeInOut'}
    //   },
    //   delay: 100,
    //   yoyo: true,
    //   loop: -1
    // })
    //
    // this.enemyGroup.add(enemy);
    // this.enemyGroup.add(enemy2);
    // this.enemyGroup.add(enemy3);
    // this.enemyGroup.add(enemy4);
    // enemy.health = 1;
    // enemy2.health = 1;
    // enemy3.health = 1;
    // enemy4.health = 1;

    //stegosaurus
    const stegoSpawn = map.findObject(
    "Spawns",
    obj => obj.name === "Stego Spawn"
    );

    this.sStegoX = stegoSpawn.x;
    this.sStegoY = stegoSpawn.y;

    this.bullets = this.physics.add.group({
      defaultKey: "bullet",
      maxSize: 20
    });

    //change the enemy projectile asset here
    this.enemyBullets = this.physics.add.group({
      defaultKey: "spit",
    });

    this.lassos = this.physics.add.group({
      defaultKey: "lasso",
      maxSize: 1
    });

    this.ammoDrops = this.physics.add.group();
    this.healthDrops = this.physics.add.group();
    this.availDrop = true;
    this.physics.add.overlap(this.player, this.ammoDrops, this.pickAmmo, null, this);
    this.physics.add.overlap(this.player, this.healthDrops, this.pickHealth, null, this);


    // Event listener for movement of mouse pointer
    this.input.on(
      "pointermove",
      function(pointer) {
        var betweenPoints = Phaser.Math.Angle.BetweenPoints;
        var angle = Phaser.Math.RAD_TO_DEG * betweenPoints(this.gun, pointer.positionToCamera(camera));
        this.gun.setAngle(angle);
      }, this
    );

    this.ammo = 20;
    //When pointer is down and you have ammo, run function shoot
      this.input.on("pointerdown", function(pointer) {
        if (pointer.leftButtonDown()) {
          if (this.ammo > 0){
            this.shoot(pointer.positionToCamera(camera));
            this.ammo -= 1;
          } else {
            this.gunEmpty.play(this.defaultSoundConfig);
          }
        } else {
          var betweenPoints = Phaser.Math.Angle.BetweenPoints;
          var angle = Phaser.Math.RAD_TO_DEG * betweenPoints(this.player, pointer.positionToCamera(camera));
          //console.log(angle);
          var roundAngle;
          if (angle < 45 || angle > -45) {
            roundAngle = 0;
          }
          if (angle < 135 && angle > 45) {
            roundAngle = 90;
          }
          if (angle < -135 || angle > 135) {
            roundAngle = 180;
          }
          if (angle > -135 && angle < -45) {
            roundAngle = -90;
          }

          if (roundAngle == 0 && this.lassos.countActive(true) < 1) {
            //this.lasso = this.physics.add.sprite(this.player.x + 75, this.player.y, 'lasso').setAngle(roundAngle);
            this.lasso = this.makeLasso(75, 0, 0);

          }
          if (roundAngle == 180 && this.lassos.countActive(true) < 1) {
            //this.lasso = this.physics.add.sprite(this.player.x - 75, this.player.y, 'lasso').setAngle(roundAngle);
            this.lasso = this.makeLasso(-75, 0, 180);

          }
          if (roundAngle == 90 && this.lassos.countActive(true) < 1) {
            //this.lasso = this.physics.add.sprite(this.player.x, this.player.y + 75, 'uplasso').setAngle(roundAngle - 90);
            this.lasso = this.makeLasso2(0, 75, 0);
          }
          if (roundAngle == -90 && this.lassos.countActive(true) < 1) {
            //this.lasso = this.physics.add.sprite(this.player.x, this.player.y - 75, 'uplasso').setAngle(roundAngle - 90);
            this.makeLasso2(0, -75, 180);
          }
        }

      }, this);


    //#region Anims
    const anims = this.anims;
    this.anims.create({
      key: "walkForward",
      frames: this.anims.generateFrameNumbers("cowboyWalk", { start: 0, end: 1 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "walkBackward",
      frames: this.anims.generateFrameNumbers("cowboyWalk", { start: 2, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "walkLeft",
      frames: this.anims.generateFrameNumbers("cowboyWalk", { start: 4, end: 5 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "walkRight",
      frames: this.anims.generateFrameNumbers("cowboyWalk", { start: 6, end: 7 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "idleForward",
      frames: [{ key: "cowboyIdle", frame: 0 }],
      frameRate: 1,
      repeat: -1
    });
    this.anims.create({
      key: "idleBackward",
      frames: [{ key: "cowboyIdle", frame: 1 }],
      frameRate: 1,
      repeat: -1
    });
    this.anims.create({
      key: "idleLeft",
      frames: [{ key: "cowboyIdle", frame: 2 }],
      frameRate: 1,
      repeat: -1
    });
    this.anims.create({
      key: "idleRight",
      frames: [{ key: "cowboyIdle", frame: 3 }],
      frameRate: 1,
      repeat: -1
    });
    this.anims.create({
      key: "dodge",
      frames: this.anims.generateFrameNumbers("cowboyRoll", { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "step",
      frames: this.anims.generateFrameNumbers("stegoWalk", { start: 0, end: 1 }),
      frameRate: 5,
      repeat: -1

    });
    this.anims.create({
      key: "stepBack",
      frames: this.anims.generateFrameNumbers("backWalk", { start: 0, end: 1 }),
      frameRate: 3,
      repeat: -1
    });
    this.anims.create({
      key: "stepFront",
      frames: this.anims.generateFrameNumbers("frontWalk", { start: 0, end: 1 }),
      frameRate: 3,
      repeat: -1
    });

    this.anims.create({
      key: "chomp",
      frames: this.anims.generateFrameNumbers("chomp", { start: 0, end: 1 }),
      frameRate: 2,
      repeat: 2
    });
    this.anims.create({
      key: "lasso",
      frames: this.anims.generateFrameNumbers("lasso_ss", { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "uplasso",
      frames: this.anims.generateFrameNumbers("uplasso_ss", { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1
    });

    //#endregion

    this.music = this.sound.add("theme");
    var musicConfig = {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0
    }
    this.music.play(musicConfig);

    this.gunshot = this.sound.add("gunshot");
    this.gunEmpty = this.sound.add("gun_empty");
    this.babyDinoGrowl1 = this.sound.add("baby_dino_growl_1");
    this.babyDinoGrowl2 = this.sound.add("baby_dino_growl_2");
    this.dinoHurt = this.sound.add("dino_hurt");
    this.dinoRoar = this.sound.add("dino_roar");
    this.dinoSpit = this.sound.add("dino_spit");
    this.dinoStep1 = this.sound.add("dino_step_1");
    this.dinoStep2 = this.sound.add("dino_step_2");
    this.lassoHit = this.sound.add("lasso_hit");
    this.lassoMiss = this.sound.add("lasso_miss");
    this.healthPickup = this.sound.add("healthPickup");
    this.ammoPickup = this.sound.add("ammoPickup");

    //trees
    this.treeGroup = this.physics.add.group(
      {
      key: "tree",
      repeat: 10,
      setXY: {
        x: Math.floor(Math.random() * 900) ,
        y: Math.floor(Math.random() * 800) ,
      }
    });
    this.treeGroup.setDepth(2);
    this.treeGroup.children.iterate(function(child) {
      child.setScale(0.7);
      child.x = Math.floor(Math.random() * 900) ,
      child.y = Math.floor(Math.random() * 800)
      child.body.setSize(15, 30);
      child.body.setOffset(32, 50);
      child.body.immovable = true;
    });

    //Colliders
    this.physics.add.collider(this.player, this.treeGroup);
    this.physics.add.collider(this.enemyGroup, this.treeGroup);
    this.physics.add.collider(
      this.treeGroup,
      this.bullets,
      this.deadBullet,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.enemyGroup,
      this.takeDamage,
      null,
      this
    );

    this.healthScore = this.add.text(this.centerX - 120, this. centerY + 75,

      'Health', { font: '10px Georgia', fill: "#000000",}).setScrollFactor(0).setDepth(3);

    this.healthGroup = this.add.group({
      key: 'health',
      repeat: this.currentHealth - 1,
      setXY: {
        x: this.centerX - 120,
        y: this.centerY + 95,
        stepX: 10,
        stepY: 0
      }
    });
    this.healthGroup.setDepth(3);

    this.backText = this.add.sprite(this.centerX - 20, this. centerY + 100, 'back2');
    this.backText.setScrollFactor(0);
    this.backText.setScale(0.3);
    this.backText.setDepth(2);


    // this.healthGroup = this.add.group({
    //   key: 'health',
    //   repeat: this.currentHealth - 1,
    //   setXY: {
    //     x: this.centerX - 120,
    //     y: this.centerY + 60,
    //     stepX: 20,
    //     stepY: 0
    //   }
    // });

    this.healthGroup.children.iterate(function(child) {
      child.setScrollFactor(0);
      child.setScale(0.3);
      child.setDepth(3);
    });

    this.playerGroup = this.physics.add.group();
    this.playerGroup.add(this.player);
    // this.playerGroup.add(this.gun);

    this.ammoScore = this.add.text(this.centerX - 40, this. centerY + 75, 'Ammo: '+ this.ammo, { font: '10px Georgia' , fill: "#000000"}).setScrollFactor(0).setDepth(2);
    this.killScore = this.add.text(this.centerX + 50, this. centerY + 75, 'Kills: '+ this.kills, { fontSize: '10px Georgia', fill: "#000000" }).setScrollFactor(0).setDepth(2);
    this.controls = this.add.text(this.centerX + 110, this. centerY + 70, 'Lasso: RMB \nDodge: Shift\nGoal: kill 40', {font: '9px Georgia', fill: "#000000" }).setScrollFactor(0).setDepth
    (2);

    this.player.dodgeLock = true;
    this.player.setCollideWorldBounds(true);


    const bigSpawn1 = map.findObject(
    "Spawns",
    obj => obj.name === "Big Spawn 1"
    );

    this.B1X = bigSpawn1.x;
    this.B1Y = bigSpawn1.y;

    const bigSpawn2 = map.findObject(
    "Spawns",
    obj => obj.name === "Big Spawn 2"
    );

    this.B2X = bigSpawn2.x;
    this.B2Y = bigSpawn2.y;

    const bigSpawn3 = map.findObject(
    "Spawns",
    obj => obj.name === "Big Spawn 3"
    );

    this.B3X = bigSpawn3.x;
    this.B3Y = bigSpawn3.y;


  }

  update (time, delta) {
    if (this.currentHealth != this.healthGroup.getChildren().length) {
      while (this.healthGroup.getChildren().length > 0) {
        this.healthGroup.getChildren()[this.healthGroup.getChildren().length - 1].destroy();
      }
      if (this.isMounted) {
        this.backText.x = this.centerX  ;
        this.backText.y = this.centerY + 400 ;
        this.backText.setScrollFactor(0);
        this.backText.setScale(2);

        this.backText.setDepth(2);

        this.healthGroup = this.add.group({
          key: 'health',
          repeat: this.currentHealth - 1,
          setXY: {
            x: this.centerX - 300,
            y: this.centerY + 235,
            stepX: 20,
            stepY: 0
          }
        });
        this.healthGroup.children.iterate(function(child) {
          child.setScrollFactor(0);
          child.setScale(0.6);
          child.setDepth(3);
        });
      } else {
        this.healthGroup = this.add.group({
          key: 'health',
          repeat: this.currentHealth - 1,
          setXY: {
            x: this.centerX - 120,
            y: this.centerY + 95,
            stepX: 10,
            stepY: 0
          }
        });
        this.healthGroup.children.iterate(function(child) {
          child.setScrollFactor(0);
          child.setScale(0.3);
          child.setDepth(3);
        });
      }
    }
    // is spawned
    if (!this.stegoSpawned && this.kills == 1) {
      this.stegoSpawned = true;

          this.stego = this.physics.add.sprite(this.sStegoX, this.sStegoY, 'stego');
          this.stego.setCollideWorldBounds(true);
          this.stego.body.setSize(256, 128, this.sStegoX, this.sStegoY);
          this.stego.setScale(0.2);
          this.stego.setDepth(-1);
          this.stego.health = 50;
          this.stego.boss = false;
          this.stego.boss2 = true;
          this.stego.flipX = true;
          this.stego.stunTimer = 0;
          this.stego.isStunned = false;
          this.stego.canStomp = true;
          this.enemyGroup.add(this.stego);
          this.stego.anims.play('step', true);
    }
    if (this.stegoSpawned && this.kills == 15) {
      this.stegoSpawned = false;

          this.stego1 = this.physics.add.sprite(this.B1X, this.B1Y, 'stego');
          this.stego1.setCollideWorldBounds(true);
          this.stego1.body.setSize(256, 128, this.B1X, this.B1Y);
          this.stego1.setScale(0.2);
          this.stego1.setDepth(-1);
          this.stego1.health = 50;
          this.stego1.boss = true;
          this.stego1.boss2 = false;
          this.stego1.stunTimer = 0;
          this.stego1.isStunned = false;
          this.stego1.canStomp = true;
          this.enemyGroup.add(this.stego1);
          this.stego1.anims.play('step', true);
    }


    if (!this.stegoSpawned && this.kills == 30) {

      this.stegoSpawned = true;

          this.stego2 = this.physics.add.sprite(this.B2X, this.B2Y, 'stego');
          this.stego2.setCollideWorldBounds(true);
          this.stego2.body.setSize(256, 128, this.B2X, this.B2Y);
          this.stego2.setScale(0.25);
          this.stego2.setDepth(-1);
          this.stego2.health = 50;
          this.stego2.boss = true;
          this.stego2.boss2 = false;
          this.stego2.stunTimer = 0;
          this.stego2.isStunned = false;
          this.stego2.canStomp = true;
          this.enemyGroup.add(this.stego2);
          this.stego2.anims.play('step', true);

          this.stego3 = this.physics.add.sprite(this.B3X, this.B3Y, 'stego');
          this.stego3.setCollideWorldBounds(true);
          this.stego3.body.setSize(256, 128, this.B3X, this.B3Y);
          this.stego3.setScale(0.25);
          this.stego3.setDepth(-1);
          this.stego3.health = 50;
          this.stego3.boss = true;
          this.stego3.stunTimer = 0;
          this.stego3.isStunned = false;
          this.stego3.canStomp = true;
          this.enemyGroup.add(this.stego3);
          this.stego3.anims.play('step', true);
    }


    if (this.cutscene1.video.ended) {
      this.cutscene1.alpha = 0;
      this.cameras.main.setZoom(2);
      this.ammoScore.x = this.centerX - 100;
      this.ammoScore.y = this.centerY + 200;
      this.ammoScore.setFontSize(24);
      this.ammoScore.setDepth(5);

      this.killScore.x = this.centerX + 120;
      this.killScore.y = this.centerY + 200;
      this.killScore.setFontSize(24);
      this.killScore.setDepth(5);

      this.controls.x = this.centerX + 280;
      this.controls.y = this.centerY + 200;
      this.controls.setFontSize(20);
      this.controls.setDepth(5);

      this.healthScore.x = this.centerX - 300;
      this.healthScore.y = this.centerY + 200;
      this.healthScore.setFontSize(24);
      this.healthScore.setDepth(5);
      while (this.healthGroup.getChildren().length > 0) {
        this.healthGroup.getChildren()[this.healthGroup.getChildren().length - 1].destroy();
      }
      this.backText.x = this.centerX  ;
      this.backText.y = this.centerY + 400 ;
      this.backText.setScrollFactor(0);
      this.backText.setScale(2);
      this.backText.setDepth(4);
      this.healthGroup = this.add.group({
        key: 'health',
        repeat: this.currentHealth - 1,
        setXY: {
          x: this.centerX - 300,
          y: this.centerY + 235,
          stepX: 20,
          stepY: 0
        }
      });
      this.healthGroup.children.iterate(function(child) {
        child.setScrollFactor(0);
        child.setScale(0.6);
        child.setDepth(5);
      });

      this.playerHitTimer++;
      if (this.playerHitTimer >= 120) {
        this.playerHit = false;
        this.playerHitTimer = 0;
      }
    }

    this.ammoScore.setText('Ammo: ' + this.ammo);
    this.killScore.setText('Kills: ' + this.kills);
    //Game over
    if (this.gameOver) {
      while (this.healthGroup.getChildren().length > 0) {
        this.healthGroup.getChildren()[this.healthGroup.getChildren().length - 1].destroy();
      }
      this.player.disableBody(false, false);
      //this.gun.destroy();
      this.gameOverText = this.add.text(this.player.x - 40, this.player.y - 40, 'Game Over');
      this.finalScore = this.add.text(this.player.x - 40, this.player.y + 25, 'Kills: ' + this.kills);
      this.restartText = this.add.text(this.player.x - 150, this.player.y + 75, 'Press ESC to restart the game', {
        font: "18px monospace",
        fill: "#000000",
        padding: { x: 20, y: 10 },
        backgroundColor: "#ffffff"
      });
      this.input.enabled = false;
      if (this.esc.isDown) {
        this.music.stop();
        this.gameOver = false;
        this.scene.restart();
        }
      this.input.enabled = false;
    }
    else {
      if (this.esc.isDown) {
        this.music.stop();
        this.gameOver = false;
        this.scene.start('Boot');
      }
    }

    if (this.kills > 39) {
      this.restartText = this.add.text(this.centerX - 125, this.centerY + 75, 'Press ENTER to go next', {
        font: "18px monospace",
        fill: "#000000",
        padding: { x: 20, y: 10 },
        backgroundColor: "#ffffff"
      }).setScrollFactor(0);
      if (this.enter.isDown) {
        this.music.stop();
        this.scene.start("Level2");
      }
    }
    // Update the scene
    const speed = 175;
    const prevVelocity = this.player.body.velocity.clone();

    this.input.on("pointermove", function (pointer) {
        var betweenPoints = Phaser.Math.Angle.BetweenPoints;
        var angle = Phaser.Math.RAD_TO_DEG * betweenPoints(this.gun, pointer.positionToCamera(this.cameras.main));
        this.gun.setAngle(angle);

        if (angle < 45 || angle > -45)
        {
          this.lastDirection = "right";
          this.player.anims.play("walkRight", true);
        }
        if (angle < 135 && angle > 45)
        {
          this.lastDirection = "forward";
          this.player.anims.play("walkForward", true);
        }
        if (angle < -135 || angle > 135)
        {
          this.lastDirection = "left";
          this.player.anims.play("walkLeft", true);
        }
        if (angle > -135 && angle < -45)
        {
          this.lastDirection = "backward";
          this.player.anims.play("walkBackward", true);
        }
      }, this
    );

    switch (this.lastDirection)
    {
      case "left":
        this.gun.body.setOffset(this.player.x - 10, this.player.y + 4);
        this.gun.x = this.player.x - 10;
        this.gun.y = this.player.y + 4;
        this.gun.setTexture('gun');
        this.gun.flipY = true;
        break;
      case "right":
        this.gun.body.setOffset(this.player.x + 10, this.player.y + 4);
        this.gun.x = this.player.x + 10;
        this.gun.y = this.player.y + 4;
        this.gun.setTexture('gun');
        this.gun.flipY = false;
        break;
      case "forward":
        this.gun.body.setOffset(this.player.x - 10, this.player.y + 8);
        this.gun.x = this.player.x - 10;
        this.gun.y = this.player.y + 8;
        this.gun.flipY = false;
        this.gun.setTexture('gun_forward');
        this.gun.setRotation(Phaser.Math.DegToRad(0));
        this.gun.setDepth(this.player.depth + 1);
        break;
      case "backward":
        this.gun.body.setOffset(this.player.x + 10, this.player.y + 5);
        this.gun.x = this.player.x + 10;
        this.gun.y = this.player.y + 5;
        this.gun.flipY = false;
        this.gun.setTexture('gun_backward');
        this.gun.setRotation(Phaser.Math.DegToRad(0));
        this.gun.setDepth(this.player.depth - 1);
        break;
      default:
        break;
    }

    // var timeElapsed = 0;
    // timeElapsed += game.timer.elapsed();
    // if (timeElapsed >= 0.5) {
    //   timeElapsed = 0;
    //   this.lasso.disableBody(true, true);
    // }

    // Stop any previous movement from the last frame
    this.player.body.setVelocity(0);
    this.gun.body.setVelocity(0);
    try {
      if (this.mount.boss = true){
        this.mount.x = this.player.x - 5;
        this.mount.y = this.player.y + 50;
      } else if (this.mount.boss2 = true){
        this.mount.x = this.player.x ;
        this.mount.y = this.player.y - 50;
      }

    } catch {}


    if (this.player.isHit) {
      this.playerHitTimer++;
      if (this.playerHitTimer >= 80) {
        this.playerHit = false;
        this.player.isHit = false;
        this.playerHitTimer = 0;
      }
    }

    // Horizontal movement
    if (this.a.isDown || this.cursors.left.isDown) {
      this.walk(this.lastDirection);
      if (this.player.isMounted){
        this.player.body.setVelocityX(-300);
        this.gun.body.setVelocityX(-300);
        //console.log('mounted');
      } else {
      this.player.body.setVelocityX(-speed);
      this.gun.body.setVelocityX(-speed);
    }
    } else if (this.d.isDown || this.cursors.right.isDown) {
      this.walk(this.lastDirection);
      if (this.player.isMounted){
        this.player.body.setVelocityX(300);
        this.gun.body.setVelocityX(300);
      } else {
      this.player.body.setVelocityX(speed);
      this.gun.body.setVelocityX(speed);
    }
    }

    // Vertical movement
    if (this.w.isDown || this.cursors.up.isDown) {
      this.walk(this.lastDirection);
      if (this.player.isMounted) {
        this.player.body.setVelocityY(-300);

        this.gun.body.setVelocityY(-300);
      } else {
      this.player.body.setVelocityY(-speed);
      this.gun.body.setVelocityY(-speed);
      }
    } else if (this.s.isDown || this.cursors.down.isDown) {
      this.walk(this.lastDirection);
        if (this.player.isMounted){
          this.player.body.setVelocityY(300);
          this.gun.body.setVelocityY(300);
        } else {
        this.player.body.setVelocityY(speed);
        this.gun.body.setVelocityY(speed);
      }
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    if (this.player.isMounted) {
      this.player.body.velocity.normalize().scale(300);
      this.gun.body.velocity.normalize().scale(300);
    } else {
      this.player.body.velocity.normalize().scale(speed);
      this.gun.body.velocity.normalize().scale(speed);
    }

    if (this.a.isDown || this.cursors.left.isDown) {
      if(this.player.isMounted){
      this.mount.anims.play('step', true);
      }
      try {
        this.mount.flipX = true;
        this.mount.body.setOffset(250, 420);

      }
      catch {}

      //dodge roll
      if (this.shift.isDown && this.player.dodgeLock) {
        this.tweens.add({
          targets: [this.player],
          props: {
            x: { value: '-=150', duration: 200},
          },
        });
        this.player.dodgeLock = false;
        this.player.rollInvuln = true;
        this.player.anims.play("cowboyRoll", true);
      }

      // //summon lasso
      // if (this.spacebar.isDown && this.lassos.countActive(true) < 1) {
      //   this.lasso = this.makeLasso(-75, 0, 180);
      //   //this.lasso = this.physics.add.sprite(this.player.x - 75, this.player.y, 'lasso').setAngle(0);
      // }
    } else if (this.d.isDown || this.cursors.right.isDown) {
      if(this.player.isMounted){
      this.mount.anims.play('step', true);
      }
      try {
        this.mount.flipX = false;
        this.mount.body.setOffset(450, 420);
      }
      catch {}

      //dodge roll
      if (this.shift.isDown && this.player.dodgeLock) {
        this.tweens.add({
          targets: [this.player],
          props: {
            x: { value: '+=150', duration: 200},
          },
        });
        this.player.dodgeLock = false;
        this.player.rollInvuln = true;
        this.player.anims.play("dodge", true);
      }

      // //summon lasso
      // if (this.spacebar.isDown && this.lassos.countActive(true) < 1) {
      //   this.lasso = this.makeLasso(75, 0, 0);
      //   //this.lasso = this.physics.add.sprite(this.player.x + 75, this.player.y, 'lasso').setAngle(0);
      // }
    } else if (this.w.isDown || this.cursors.up.isDown) {
      if(this.player.isMounted){
      this.mount.anims.play('stepBack', true);
      this.mount.body.setOffset(150, 420);
      }

      //dodge roll
      if (this.shift.isDown && this.player.dodgeLock) {
        this.tweens.add({
          targets: [this.player],
          props: {
            y: { value: '-=150', duration: 200},
          },
        });
        this.player.dodgeLock = false;
        this.player.rollInvuln = true;
        this.player.anims.play("dodge", true);
      }

      // //summon lasso
      // if (this.spacebar.isDown && this.lassos.countActive(true) < 1) {
      //   this.makeLasso2(0, -75, 180);
      //   //this.lasso = this.physics.add.sprite(this.player.x, this.player.y - 75, 'uplasso').setAngle(-90-90);
      // }
    } else if (this.s.isDown || this.cursors.down.isDown) {
      if(this.player.isMounted){
      this.mount.anims.play('stepFront', true);
      }

      //dodge roll
      if (this.shift.isDown && this.player.dodgeLock) {
        this.tweens.add({
          targets: [this.player],
          props: {
            y: { value: '+=150', duration: 200},
          },
        });
        this.player.dodgeLock = false;
        this.player.rollInvuln = true;
        this.player.anims.play("dodge", true);
      }

      // //summon lasso
      // if (this.spacebar.isDown && this.lassos.countActive(true) < 1) {
      //   this.lasso = this.makeLasso2(0, 75, 0);
      //   //this.lasso = this.physics.add.sprite(this.player.x, this.player.y + 75, 'uplasso').setAngle(90-90);
      // }
    } else {
      switch (this.lastDirection)
      {
        case "forward":
          this.player.anims.play("idleForward", true);
          break;
        case "backward":
          this.player.anims.play("idleBackward", true);
          break;
        case "left":
          this.player.anims.play("idleLeft", true);
          break;
        case "right":
          this.player.anims.play("idleRight", true);
          break;
        default:
          this.player.anims.play("idleForward", true);
          break;
      }

      if(this.player.isMounted){
      this.mount.anims.stop();
      }

      // //summon lasso
      // if (this.spacebar.isDown && this.lassos.countActive(true) < 1) {
      //   this.lasso = this.makeLasso(75, 0, 0);
      //   //this.lasso = this.physics.add.sprite(this.player.x + 75, this.player.y, 'lasso').setAngle(0);
      // }
  }

  if (this.playerIsHurt)
  {
    this.playerHurtTimer++;
  }

  if (this.playerHurtTimer >= 3)
  {
    this.playerHurtTimer = 0;
    this.playerIsHurt = false;
    this.player.setTint(0xffffff);
  }

  if (this.player.rollInvuln) {
    this.playerDodgeTimer++;
    this.playerHit = true;
    //console.log(this.playerDodgeTimer);
    if (this.playerDodgeTimer >= 40) {
      this.playerHit = false;
    }
    if (this.playerDodgeTimer >= 60) {
      this.playerDodgeTimer = 0;
      this.player.dodgeLock = true;
      //console.log('dodge ready');
      this.player.rollInvuln = false;
    }
  }  // Update the scene
    this.bullets.children.each(
      function (b) {
        if (b.active) {
          this.physics.add.overlap(
            b,
            this.enemyGroup,
            this.hitEnemy,
            null,
            this
          );
          if (b.y < 0) {
            b.setActive(false);
          } else if (b.y > this.cameras.main.height) {
            b.setActive(false);
          } else if (b.x < 0) {
            b.setActive(false);
          } else if (b.x > this.cameras.main.width) {
            b.setActive(false);
          }
        }
      }.bind(this)
    );

    this.enemyBullets.children.each(
      function (b) {
        if (b.active) {
          this.physics.add.overlap(
            b,
            this.player,
            this.hitPlayer,
            null,
            this
          )
          if (b.y < 0) {
            b.disableBody(true, true);
          } else if (b.y > game.config.height) {
            b.disableBody(true, true);
          } else if (b.x < 0) {
            b.disableBody(true, true);
          } else if (b.x > game.config.width) {
            b.disableBody(true, true);
          }
        }
      }.bind(this)
    );

    this.mountGroup.children.each(
      function (b) {
        if (b.active) {
          this.physics.add.overlap(
            b,
            this.enemyGroup,
            this.chompEnemy,
            null,
            this
          );
        }
      }.bind(this)
    );

    this.mountGroup.children.each(
      function (b) {
        if (b.active) {
          this.physics.add.overlap(
            b,
            this.enemyBullets,
            this.deadBullet,
            null,
            this
          );
        }
      }.bind(this)
    );

    this.mountGroup.children.each(
      function (b) {
        if (b.active) {
          this.physics.add.overlap(
            b,
            this.treeGroup,
            this.stompTree,
            null,
            this
          );
        }
      }.bind(this)
    );



    this.lassos.children.each(
      function (l) {
        if (l.active) {
          this.physics.add.overlap(
            l,
            this.enemyGroup,
            this.tameCheck,
            null,
            this
          );
        }
      }.bind(this)
    );

    this.lassos.children.each(
      function (l) {
        if (l.active) {
          this.physics.add.overlap(
            l,
            this.enemyBullets,
            this.deadBullet,
            null,
            this
          );
        }
      }.bind(this)
    );

    if (this.ammoDrops.countActive(true) != 0) {
      this.availDrop = false;
    } else {
      this.availDrop = true;
    }
    if (this.ammo == 0 && this.availDrop) {
      var ammoDrop = this.physics.add.sprite(16, 16, 'ammo');
      ammoDrop.setScale(0.3);
      this.ammoDrops.add(ammoDrop);
      ammoDrop.setRandomPosition(0, 0, game.config.width, game.config.height);
      this.availDrop = false;
    }


    //If there ar eno enemies left, create more
    // if (this.enemyGroup.countActive(true) < 40) {
    //   this.enemyGroup = this.physics.add.group({
    //     key: "enemy",
    //     repeat: 20
    //   });
    //
    //   this.enemyGroup.children.iterate(function(child) {
    //     child.setScale(0.7);
    //     child.x = Math.floor(Math.random() * 900) ,
    //     child.y = Math.floor(Math.random() * 900)
    //     child.health = 1;
    //   });
    // }

    this.enemyGroup.children.iterate(function(child) {
        this.tweens.add({
          targets: child,
          x: this.player.x,
          y: this.player.y,
          duration: 50000
        });
      if (child.health < this.mobMaxHealth && Math.abs(child.x - this.player.x) < 250 && Math.abs(child.y - this.player.y) < 250 ) {
        this.tweens.add({
          targets: child,
          x: this.player.x,
          y: this.player.y,
          duration: 1000
        });
        if (child.reload == false && child.health > 0) {
          child.reload = true;
          this.spit(this.player, child);
        }

      }

      if (Math.abs(child.x - this.player.x) < 150 && Math.abs(child.y - this.player.y) < 150 && child.isStunned == false) {
          this.tweens.add({
            targets: child,
            x: this.player.x,
            y: this.player.y,
            duration: 1000 + Math.floor(Math.random() * 2000)
          });
          if (child.reload == false && child.health > 0) {
            child.reload = true;
            this.spit(this.player, child);
          }
      }

      if (child.reload) {
        child.shootTimer++
        if (child.shootTimer > 120) {
          child.shootTimer = 0;
          child.reload = false;
        }
      }

      if (child.isStunned) {
        this.tweens.add({
          targets: child,
          x: child.x,
          y: child.y,
          duration: 1
        });
        child.stunTimer++;
        if (child.stunTimer > 50) {
          child.isStunned = false;
          child.canStomp = true;
          child.stunTimer = 0;
        }
      }

      if (child.isHurt)
      {
        child.hurtTimer++;
      }

      if (child.hurtTimer >= 3)
      {
        child.hurtTimer = 0;
        child.isHurt = false;
        child.setTint(0xffffff);
      }

    }.bind(this));

    if (this.lassos.getChildren().length > 0) {
      this.lassoTimer++
      if (this.lassoTimer > 20) {
        this.lassos.getChildren()[0].disableBody(true, true);
        this.lassos.getChildren()[0].destroy();
        this.lassoTimer = 0;
      }
    }
    //this.timedEvent = this.time.delayedCall(5000, this.deleteLasso, [], this);

    //this.ammoCount = this.add.text(this.centerX - 100, this. centerY + 100, 'Ammo: '+ this.ammo).setScrollFactor(0);
  }

  shoot (pointer) {
    var betweenPoints = Phaser.Math.Angle.BetweenPoints;
    var angle = betweenPoints(this.gun, pointer);
    var velocityFromRotation = this.physics.velocityFromRotation;
    //Create a variable called velocity from a Vector2
    var velocity = new Phaser.Math.Vector2();
    velocityFromRotation(angle, this.speed, velocity);
    //Get the bullet group
    var bullet = this.bullets.get();
    bullet.setAngle(Phaser.Math.RAD_TO_DEG * angle);
    bullet
      .enableBody(true, this.gun.x, this.gun.y, true, true)
      .setVelocity(velocity.x, velocity.y)
      .setScale(.5);

    this.gunshot.play(this.defaultSoundConfig);
    //this.bullet.setCollideWorldBounds(true);
  }

  spit (player, enemy) {
    var betweenPoints = Phaser.Math.Angle.BetweenPoints;
    var angle = betweenPoints(enemy, player);
    var velocityFromRotation = this.physics.velocityFromRotation;
    //Create a variable called velocity from a Vector2
    var velocity = new Phaser.Math.Vector2();
    velocityFromRotation(angle, this.speed/6, velocity);
    //Get the bullet group
    var bullet = this.enemyBullets.get();
    bullet.setAngle(Phaser.Math.RAD_TO_DEG * angle);
    bullet
      .enableBody(true, enemy.x, enemy.y, true, true)
      .setVelocity(velocity.x, velocity.y)
      .setScale(.2);

    var dinoSpitSoundConfig = this.defaultSoundConfig;
    this.dinoSpit.volume = 0.5;

    this.dinoSpit.play(this.dinoSpitSoundConfig);

    //this.bullet.setCollideWorldBounds(true);
  }


  takeDamage (player, enemy) {
    if (!this.playerHit && !this.player.isHit && this.currentHealth > 0 && !enemy.isStunned) {
      this.playerIsHurt = true;
      this.player.setTint(0xff0000);
      this.currentHealth--;
      this.playerHit = true;
      this.player.isHit = true;
      this.healthGroup.getChildren()[this.healthGroup.getChildren().length - 1].destroy();
      if (this.currentHealth == 0) {
        this.gameOver = true;
      }
    }
  }

  hitEnemy (bullet, enemy) {
    bullet.disableBody(true, true);
    enemy.health -= 1;
    enemy.setTint(0xff0000);

    var distFromPlayerToEnemy = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
    var deltaVolume = (0.1 - 0.5) / 500         // (vol_far - vol_close) / max_distance
    var volume = deltaVolume * distFromPlayerToEnemy + 1

    var dinoHurtSoundConfig = this.defaultSoundConfig;
    this.dinoHurt.volume = volume

    this.dinoHurt.play(this.dinoHurtSoundConfig);

    if (Math.abs(enemy.x - this.player.x) < 120 && Math.abs(enemy.y - this.player.y) < 80 && enemy.isStunned == false) {
    this.tweens.add({
      targets: enemy,
      x: this.player.x,
      y: this.player.y,
      duration: 2500
    });
  }

    if (enemy.health == 0) {
      enemy.disableBody(true, true);
      this.kills += 1;
      // Random ammo drop after enemy kill
      //dropRate increases when you're low on bullets
      var healthDropRate = 0.30;
      var ammoDropRate = 0.7;
      if (Math.random() < healthDropRate) {
        var healthDrop = this.physics.add.sprite(enemy.x, enemy.y, 'health');
        healthDrop.setDepth(-1);
        healthDrop.setScale(0.3);
        this.healthDrops.add(healthDrop);
      } else if (Math.random() < ammoDropRate) {
        var ammoDrop = this.physics.add.sprite(enemy.x, enemy.y, 'ammo');
        ammoDrop.setScale(0.3);
        this.ammoDrops.add(ammoDrop);
      }
    }
  }

  hitPlayer (bullet, enemy) {
    bullet.disableBody(true, true);
    if (!this.playerHit && !this.player.isHit && this.currentHealth > 0) {
      this.playerIsHurt = true;
      this.player.setTint(0xff0000);
      this.currentHealth--;
      this.playerHit = true;
      this.player.isHit = true;
      this.healthGroup.getChildren()[this.healthGroup.getChildren().length - 1].destroy();
      if (this.currentHealth == 0) {
        this.gameOver = true;
      }
    }
  }

  chompEnemy (dino, enemy) {
    //10 damage chomp
    if (enemy.health < 11) {
      enemy.health = 0;
      var distFromPlayerToEnemy = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
      var deltaVolume = (0.1 - 0.5) / 500         // (vol_far - vol_close) / max_distance
      var volume = deltaVolume * distFromPlayerToEnemy + 1

      var dinoHurtSoundConfig = this.defaultSoundConfig;
      this.dinoHurt.volume = volume


      this.dinoHurt.play(this.dinoHurtSoundConfig);
    } else {
      if(!enemy.isStunned && enemy.canStomp)
      {
        enemy.canStomp = false;
        enemy.isStunned = true;
        enemy.health -= 10;
        var distFromPlayerToEnemy = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
        var deltaVolume = (0.1 - 0.5) / 500         // (vol_far - vol_close) / max_distance
        var volume = deltaVolume * distFromPlayerToEnemy + 1

        var dinoHurtSoundConfig = this.defaultSoundConfig;
        this.dinoHurt.volume = volume

        this.dinoHurt.play(this.dinoHurtSoundConfig);
      }
    }
    // if(this.player.isMounted){
    // this.mount.anims.pause();
    // this.mount.anims.play('chomp', true);
    // this.mount.anims.resume();
    // }
    // try {
    //   this.mount.flipX = false;
    //   this.mount.body.setOffset(570, 350);
    // }
    // catch {}


    if (enemy.health == 0) {
      enemy.disableBody(true, true);
      this.kills += 1;
      // Random ammo drop after enemy kill
      //dropRate increases when you're low on bullets
      var healthDropRate = 0.30;
      var ammoDropRate = 0.7;
      if (Math.random() < healthDropRate) {
        var healthDrop = this.physics.add.sprite(enemy.x, enemy.y, 'health');
        healthDrop.setDepth(-1);
        healthDrop.setScale(0.3);
        this.healthDrops.add(healthDrop);
      } else if (Math.random() < ammoDropRate) {
        var ammoDrop = this.physics.add.sprite(enemy.x, enemy.y, 'ammo');
        ammoDrop.setScale(0.3);
        this.ammoDrops.add(ammoDrop);
      }
    }
  }

  stompTree (dino, tree) {
    tree.disableBody(true, true);
  }

  walk(direction)
  {
    if (!this.shift.isDown) {
      switch (direction)
      {
        case "forward":
          this.player.anims.play("walkForward", true);
          break;
        case "backward":
          this.player.anims.play("walkBackward", true);
          break;
        case "left":
          this.player.anims.play("walkLeft", true);
          break;
        case "right":
          this.player.anims.play("walkRight", true);
          break;
        default:
          this.player.anims.play("walkForward", true);
          break;
      }
    }
  }

  makeLasso (xCo, yCo, angle) {
    this.lassoMiss.play(this.defaultSoundConfig);
    this.lasso = this.physics.add.sprite(this.player.x + xCo, this.player.y + yCo, 'lasso');
    var x = this.lasso.widthInPixels;
    var y = this.lasso.heightInPixels;
    this.lasso.setAngle(angle);
    this.lasso.setSize(120, 50);
    //this.lasso.setOffset(-x/2, -y/2);
    this.lassos.add(this.lasso);
    this.lasso.anims.play("lasso", true);
  }
  makeLasso2 (xCo, yCo, angle) {
    this.lassoMiss.play(this.defaultSoundConfig);
    this.lasso = this.physics.add.sprite(this.player.x + xCo, this.player.y + yCo, 'uplasso');
    var x = this.lasso.widthInPixels;
    var y = this.lasso.heightInPixels;
    this.lasso.setAngle(angle);
    this.lasso.setSize(50, 120);
    //this.lasso.setOffset(x/2, -y/2);
    this.lassos.add(this.lasso);
    this.lasso.anims.play("uplasso", true);
  }

  pickAmmo (player, ammo) {
    ammo.disableBody(true, true);
    this.ammo += 20;
    this.ammoPickup.play(this.defaultSoundConfig);
  }

  pickHealth (player, health) {
    if (this.currentHealth < this.maxHealth){
      this.healthPickup.play(this.defaultSoundConfig);
      health.disableBody(true, true);
      this.currentHealth++;
    } else {
      //console.log('full health!');
    }
  }

  deadBullet (layer, bullet) {
    bullet.disableBody(true, true);
  }

  tameCheck (lasso, enemy) {
    var tameRate;
      if (enemy.boss && !this.player.isMounted) {
        //tameRate = Math.max(100);
        tameRate = Math.max((45 - enemy.health) / 10, 0);
        if (Math.random() < tameRate) {
          //console.log('enemy tamed');
          this.lassoHit.play(this.defaultSoundConfig);

          // this.scene.pause();
          this.cutscene1.alpha = 1;
          this.cameras.main.setZoom(1);
          this.cutscene1.setScale(this.cameras.main.displayWidth / this.cutscene1.width, this.cameras.main.displayHeight / this.cutscene1.height);
          this.cutscene1.setPosition(this.cameras.main.displayWidth / 2, this.cameras.main.displayHeight / 2);
          this.cutscene1.depth = 100;
          this.cutscene1.play();
          this.playerHit = true;

          enemy.disableBody(true, true);
          this.mount = this.physics.add.sprite(this.player.x, this.player.y, 'stegoWalk');
          this.mount.setScale(.25);
          this.mount.setDepth(-10);
          this.mount.body.setSize(100, 100);
          this.mount.body.setOffset(1150, 330 );
          this.player.isMounted = true;
          this.mount.boss = false;
          this.mount.boss2 = true;
          this.mount.setCollideWorldBounds(true);
          this.mountGroup.add(this.mount);
        } else {
          //console.log('attempt failed');
        }
      } else if (enemy.boss2 && !this.player.isMounted){
        tameRate = Math.max(100);
        // tameRate = Math.max((45 - enemy.health) / 25, 0);
        if (Math.random() < tameRate) {
          //console.log('enemy tamed');
          this.lassoHit.play(this.defaultSoundConfig);

          // this.scene.pause();
          this.cutscene1.alpha = 1;
          this.cameras.main.setZoom(1);
          this.cutscene1.setScale(this.cameras.main.displayWidth / this.cutscene1.width, this.cameras.main.displayHeight / this.cutscene1.height);
          this.cutscene1.setPosition(this.cameras.main.displayWidth / 2, this.cameras.main.displayHeight / 2);
          this.cutscene1.depth = 100;
          this.cutscene1.play();
          this.playerHit = true;

          enemy.disableBody(true, true);
          this.mount = this.physics.add.sprite(this.player.x, this.player.y, 'stego');
          this.mount.setScale(.25);
          this.mount.setDepth(-10);
          this.mount.body.setSize(600, 70);
          this.mount.body.setOffset(470, 850);
          this.player.isMounted = true;
          this.mount.boss = false;
          this.mount.boss2 = true;
          this.mountGroup.add(this.mount);
        } else {
          //console.log('attempt failed');
        }

      } else{
        this.lassoHit.play(this.defaultSoundConfig);
        enemy.isStunned = true;
        if (this.ammo == 0) {
          enemy.health--;
        }
        if (enemy.health == 0) {
          enemy.disableBody(true, true);
          this.kills += 1;
          // Random ammo drop after enemy kill
          //dropRate increases when you're low on bullets
          var healthDropRate = 0.30;
          var ammoDropRate = 0.7;
          if (Math.random() < healthDropRate) {
            var healthDrop = this.physics.add.sprite(enemy.x, enemy.y, 'health');
            healthDrop.setDepth(-1);
            healthDrop.setScale(0.3);
            this.healthDrops.add(healthDrop);
          } else if (Math.random() < ammoDropRate) {
            var ammoDrop = this.physics.add.sprite(enemy.x, enemy.y, 'ammo');
            ammoDrop.setScale(0.3);
            this.ammoDrops.add(ammoDrop);
          }
        }
      }
  }
}
