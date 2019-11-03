/*global Phaser*/
export default class Tutorial1 extends Phaser.Scene {
  constructor () {
    super('Tutorial1');
  }

  init() {

  }

  preload () {
    // Preload assets
    this.load.audio('theme', './assets/Music/DinoBoyV2.mp3');
    this.load.image('bullet', './assets/sprites/bullet.png')
    this.load.audio("gunshot", './assets/sfx/gun/shoot.mp3');
    this.load.audio("gun_empty", './assets/sfx/gun/gun_empty.mp3');

    this.load.audio("baby_dino_growl_1", './assets/sfx/dinosaur/baby_dino_growl_01.mp3');
    this.load.audio("baby_dino_growl_2", './assets/sfx/dinosaur/baby_dino_growl_02.mp3');
    this.load.audio("dino_hurt", './assets/sfx/dinosaur/dino_hurt.mp3');
    this.load.audio("dino_roar", './assets/sfx/dinosaur/dino_roar.mp3');
    this.load.audio("lasso_hit", './assets/sfx/lasso/lasso_hit.mp3');
    this.load.audio("lasso_miss", './assets/sfx/lasso/lasso_miss.mp3');

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
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.image('stego', './assets/dinosaur/stego2.png')


    this.load.image('gun', './assets/sprites/gun.png');
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


    this.load.image("tiles", "./assets/Tilemaps/tiles.png");
    this.load.tilemapTiledJSON("tutorialMap", "./assets/Tilemaps/bgmap.json");
    this.load.tilemapTiledJSON("map", "./assets/Tilemaps/bgmap2.json");

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    const map = this.make.tilemap({ key: "tutorialMap" });
    const tileset = map.addTilesetImage("sheet", "tiles");

    const belowLayer = map.createStaticLayer("Below", tileset, 0, 0).setDepth(-10);
    const worldLayer = map.createStaticLayer("World", tileset, 0, 0);

    worldLayer.setCollisionByProperty({ collides: true });

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
    this.lassoTimer = 0;


    this.physics.add.collider(this.player, worldLayer);

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
    camera.setZoom(3);
    camera.startFollow(this.player);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    var gun, bullets, enemy, bullet, enemyGroup;
    this.nextFire = 0;
    this.fireRate = 200;
    this.speed = 1000;
    this.lastMoveKey = "";

    this.gun = this.add.sprite(this.player.x, this.player.y, 'gun');
    this.gun.setOrigin(0.5);
    this.gun.setScale(0.15);

    //this.enemies = this.add.group();
    this.enemyGroup = this.physics.add.group({
      key: "enemy",
      repeat: 40
    });

    this.enemyGroup.children.iterate(function(child) {
      child.setScale(0.7);
      child.x = 200 + Math.floor(Math.random() * 700);
      child.y = 200 + Math.floor(Math.random() * 700);
      child.health = 1;
      child.boss = false;
    });

    var enemy = this.physics.add.sprite(100, 100, 'enemy');
    var enemy2 = this.physics.add.sprite(100, 200, 'enemy');
    var enemy3 = this.physics.add.sprite(100, 300, 'enemy');
    var enemy4 = this.physics.add.sprite(100, 400, 'enemy');


    var tween = this.tweens.add({
      targets: [enemy, enemy3],
      props: {
        x: { value: '+=600', duration: 7000, flipX: true},
        y: { value: '570', duration: 7500, ease: 'Sine.easeInOut'}
      },
      delay: 100,
      yoyo: true,
      loop: -1
    })

    this.tweens.add({
      targets: [enemy2, enemy4],
      props: {
        x: { value: '500', duration: 7000, flipX: true},
        y: { value: '170', duration: 7500, ease: 'Sine.easeInOut'}
      },
      delay: 100,
      yoyo: true,
      loop: -1
    })

    this.enemyGroup.add(enemy);
    this.enemyGroup.add(enemy2);
    this.enemyGroup.add(enemy3);
    this.enemyGroup.add(enemy4);
    enemy.health = 1;
    enemy2.health = 1;
    enemy3.health = 1;
    enemy4.health = 1;

    //stegosaurus
    const stegoSpawn = map.findObject(
    "Spawns",
    obj => obj.name === "Stego Spawn"
    );

    this.stego = this.physics.add.sprite(stegoSpawn.x, stegoSpawn.y, 'stego');
    this.stego.setCollideWorldBounds(true);
    this.stego.body.setSize(256, 128, stegoSpawn.x, stegoSpawn.y);
    this.stego.setScale(.5);
    this.stego.setDepth(-1);
    this.stego.health = 50;
    this.stego.boss = true;
    this.enemyGroup.add(this.stego);

    this.bullets = this.physics.add.group({
      defaultKey: "bullet",
      maxSize: 20
    });

    this.lassos = this.physics.add.group({
      defaultKey: "lasso",
      maxSize: 1
    });

    this.ammoDrops = this.physics.add.group();
    this.healthDrops = this.physics.add.group();
    this.availDrop = true;
    this.physics.add.overlap(this.player, this.ammoDrops, this.pickAmmo, null, this);

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
        if (this.didWalk) {
          this.tutorial_shoot.destroy();
          this.didShoot = true;
        }
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


    //Anims
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
    this.lassoHit = this.sound.add("lasso_hit");
    this.lassoMiss = this.sound.add("lasso_miss");

    //trees
    this.treeGroup = this.physics.add.group(
      {
      key: "tree",
      repeat: 10,
      setXY: {
        x: Math.floor(Math.random() * 900) ,
        y: Math.floor(Math.random() * 900) ,
      }
    });

    this.treeGroup.children.iterate(function(child) {
      child.setScale(0.7);
      child.x = Math.floor(Math.random() * 900) ,
      child.y = Math.floor(Math.random() * 900)
      child.body.setSize(32, 30);
      child.body.setOffset(72, 130);
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
    this.physics.add.collider(
      worldLayer,
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

    this.playerGroup = this.physics.add.group();
    this.playerGroup.add(this.player);

    this.physics.add.collider(this.enemyGroup, this.enemyGroup);
    this.ammoScore = this.add.text(this.centerX - 20, this. centerY + 150, 'Ammo: '+ this.ammo, { fontSize: '12' }).setScrollFactor(0);

    this.player.dodgeLock = true;
    this.player.setCollideWorldBounds(true);

    this.tutorial_wasd = this.add.text(this.player.x, this.player.y - 100, "W, S - up, down\nA, D - left, right\n[SHIFT] - dodge\nTry walking and dodging!", {
      fontSize: '20px'
    });

    this.tutorial_shoot = this.add.text(this.player.x, this.player.y - 100, "Left click - shoot\nShoot one of the baby dinos!\nWatch your ammo!");

    this.tutorial_lasso = this.add.text(this.player.x, this.player.y - 100, "Right click - lasso\nUse it to interact with dinosaurs!\nTry taming a giant Stego!");

    this.tutorial_complete = this.add.text(this.player.x, this.player.y - 100, "[ESC] to go back to menu\nOR\n[ENTER] to start game!");

    // tutorial checkpoints
    this.didWalk = false;
    this.didW = false;
    this.didA = false;
    this.didS = false;
    this.didD = false;
    this.didDodge = false;

    this.didShoot = false;
    this.didLasso = false;
  }

  update (time, delta) {
    this.ammoScore.setText('Ammo: ' + this.ammo);
    this.tutorial_wasd.x = this.player.x;
    this.tutorial_wasd.y = this.player.y - 100;

    if (!this.didWalk) {
      this.tutorial_shoot.alpha = 0;
    }
    else {
      this.tutorial_shoot.alpha = 1;
      this.tutorial_shoot.x = this.player.x;
      this.tutorial_shoot.y = this.player.y - 100;
    }

    if (!this.didShoot) {
      this.tutorial_lasso.alpha = 0;
    }
    else {
      this.tutorial_lasso.alpha = 1;
      this.tutorial_lasso.x = this.player.x;
      this.tutorial_lasso.y = this.player.y - 100;
    }

    if (this.didW && this.didA && this.didS && this.didD && this.didDodge) {
      this.tutorial_wasd.destroy();
      this.didWalk = true;
    }

    if (!this.didLasso) {
      this.tutorial_complete.alpha = 0;
    }
    else {
      try {
        this.tutorial_wasd.destroy();
        this.tutorial_shoot.destroy();
      } catch {}
      this.tutorial_lasso.destroy();
      this.tutorial_complete.alpha = 1;
      this.tutorial_complete.x = this.player.x;
      this.tutorial_complete.y = this.player.y - 100;

      if (this.esc.isDown) {
        this.scene.start("Boot");
      }
      else if(this.enter.isDown) {
        this.scene.start("Test2");
      }
    }

    // Update the scene
    const speed = 175;
    const prevVelocity = this.player.body.velocity.clone();

    // Stop any previous movement from the last frame
    this.player.body.setVelocity(0);
    this.gun.x = this.player.x + 10;
    this.gun.y = this.player.y + 4;
    try {
      this.mount.x = this.player.x;
      this.mount.y = this.player.y + 50;
    } catch {}


    if (this.player.isHit) {
      this.playerHitTimer++;
      if (this.playerHitTimer >= 60) {
        this.playerHit = false;
        this.player.isHit = false;
        this.playerHitTimer = 0;
      }
    }

    // Horizontal movement
    if (this.a.isDown || this.cursors.left.isDown) {
        this.lastMoveKey = "a";
      this.didA = true;
      if (this.player.isMounted){
        this.player.body.setVelocityX(-300);
      } else {
      this.player.body.setVelocityX(-speed);
    }
    } else if (this.d.isDown || this.cursors.right.isDown) {
        this.lastMoveKey = "d";
      this.didD = true;
      if (this.player.isMounted){
        this.player.body.setVelocityX(300);
      } else {
      this.player.body.setVelocityX(speed);
    }
    }

    // Vertical movement
    if (this.w.isDown || this.cursors.up.isDown) {
        this.lastMoveKey = "w";
      this.didW = true;
      if (this.player.isMounted){
        this.player.body.setVelocityY(-300);
      } else {
      this.player.body.setVelocityY(-speed);
    }
    } else if (this.s.isDown || this.cursors.down.isDown) {
        this.lastMoveKey = "s";
      this.didS = true;
      if (this.player.isMounted){
        this.player.body.setVelocityY(300);
      } else {
      this.player.body.setVelocityY(speed);
    }
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    if (this.player.isMounted) {
      this.player.body.velocity.normalize().scale(300);
    } else {
      this.player.body.velocity.normalize().scale(speed);
    }

    if (this.a.isDown || this.cursors.left.isDown) {
      this.player.anims.play("walkLeft", true);

      //dodge roll
      if (this.shift.isDown && this.player.dodgeLock) {
        this.didDodge = true;
        this.tweens.add({
          targets: [this.player],
          props: {
            x: { value: '-=100', duration: 200},
          },
        });
        this.player.dodgeLock = false;
        this.player.rollInvuln = true;
        this.player.anims.play("dodge", true);
      }

      //summon lasso
      if (this.spacebar.isDown && this.lassos.countActive(true) < 1) {
        this.lasso = this.makeLasso(-75, 0, 180);
      }
    } else if (this.d.isDown || this.cursors.right.isDown) {
      this.player.anims.play("walkRight", true);

      //dodge roll
      if (this.shift.isDown && this.player.dodgeLock) {
        this.didDodge = true;
        this.tweens.add({
          targets: [this.player],
          props: {
            x: { value: '+=100', duration: 200},
          },
        });
        this.player.dodgeLock = false;
        this.player.rollInvuln = true;
        this.player.anims.play("dodge", true);
      }

      //summon lasso
      if (this.spacebar.isDown && this.lassos.countActive(true) < 1) {
        this.lasso = this.makeLasso(75, 0, 0);
      }
    } else if (this.w.isDown || this.cursors.up.isDown) {
      this.player.anims.play("walkBackward", true);

      //dodge roll
      if (this.shift.isDown && this.player.dodgeLock) {
        this.didDodge = true;
        this.tweens.add({
          targets: [this.player],
          props: {
            y: { value: '-=100', duration: 200},
          },
        });
        this.player.dodgeLock = false;
        this.player.rollInvuln = true;
        this.player.anims.play("dodge", true);
      }

      //summon lasso
      if (this.spacebar.isDown && this.lassos.countActive(true) < 1) {
        this.lasso = this.makeLasso2(0, -75, 180);
      }
    } else if (this.s.isDown || this.cursors.down.isDown) {
      this.player.anims.play("walkForward", true);

      //dodge roll
      if (this.shift.isDown && this.player.dodgeLock) {
        this.didDodge = true;
        this.tweens.add({
          targets: [this.player],
          props: {
            y: { value: '+=100', duration: 200},
          },
        });
        this.player.dodgeLock = false;
        this.player.rollInvuln = true;
        this.player.anims.play("dodge", true);
      }

      //summon lasso
      if (this.spacebar.isDown && this.lassos.countActive(true) < 1) {
        this.lasso = this.makeLasso2(0, 75, 0);
      }
    } else {
      switch (this.lastMoveKey) {
        case "s":
          this.player.anims.play("idleForward", true);
          break;
        case "w":
          this.player.anims.play("idleBackward", true);
          break;
        case "a":
          this.player.anims.play("idleLeft", true);
          break;
        case "d":
          this.player.anims.play("idleRight", true);
          break;
        default:
          this.player.anims.play("idleForward", true);
          break;
      }
      //summon lasso
      if (this.spacebar.isDown && this.lassos.countActive(true) < 1) {
        this.lasso = this.makeLasso(75, 0, 0);
      }
  }

  if (this.player.rollInvuln) {
    this.playerDodgeTimer++;
    this.playerHit = true;
    if (this.playerDodgeTimer >= 25) {
      this.playerHit = false;
    }
    if (this.playerDodgeTimer >= 50) {
      this.playerDodgeTimer = 0;
      this.player.dodgeLock = true;
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
    if (this.ammoDrops.countActive(true) != 0) {
      this.availDrop = false;
    } else {
      this.availDrop = true;
    }
    if (this.ammo == 0 && this.availDrop) {
      var ammoDrop = this.physics.add.sprite(16, 16, 'bullet');
      ammoDrop.setScale(2);
      this.ammoDrops.add(ammoDrop);
      ammoDrop.setRandomPosition(0, 0, game.config.width, game.config.height);
      this.availDrop = false;
    }

    //If there ar eno enemies left, create more
    if (this.enemyGroup.countActive(true) < 4) {
      this.enemyGroup = this.physics.add.group({
        key: "enemy",
        repeat: 100
      });

      this.enemyGroup.children.iterate(function(child) {
        child.setScale(0.7);
        child.x = Math.floor(Math.random() * 900) ,
        child.y = Math.floor(Math.random() * 900)
        child.health = 1;
      });
    }

    if (this.lassos.getChildren().length > 0) {
      this.lassoTimer++
      if (this.lassoTimer > 20) {
        this.lassos.getChildren()[0].disableBody(true, true);
        this.lassos.getChildren()[0].destroy();
        this.lassoTimer = 0;
      }
    }
  }

  deleteLasso() {
    if (this.lassos.getChildren().length > 0) {
      this.lassos.getChildren()[0].disableBody(true, true);
      this.lassos.getChildren()[0].destroy();
    }
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
      .setScale(0.5);

    this.gunshot.play(this.defaultSoundConfig);
  }

  takeDamage (player, enemy) {
    if (!this.playerHit && !this.player.isHit && this.currentHealth > 0) {
      this.currentHealth--;
      this.playerHit = true;
      this.player.isHit = true;
    }
  }

  hitEnemy (bullet, enemy) {
    bullet.disableBody(true, true);
    enemy.health -= 1;

    var distFromPlayerToEnemy = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
    var deltaVolume = (0.1 - 0.5) / 500
    var volume = deltaVolume * distFromPlayerToEnemy + 1

    var dinoHurtSoundConfig = this.defaultSoundConfig;
    this.dinoHurt.volume = volume

    this.dinoHurt.play(this.dinoHurtSoundConfig);
    if (enemy.health == 0) {
      enemy.disableBody(true, true);
      this.kills += 1;
      // Random ammo drop after enemy kill
      // dropRate increases when you're low on bullets
      var dropRate = Math.max((20 - this.ammo) / 25, 0);
      if (Math.random() < dropRate) {
        var ammoDrop = this.physics.add.sprite(enemy.x, enemy.y, 'ammo');
        ammoDrop.setScale(0.5);
        this.ammoDrops.add(ammoDrop);
      }
    }
  }

  makeLasso (xCo, yCo, angle) {
    this.lassoMiss.play(this.defaultSoundConfig);
    this.lasso = this.physics.add.sprite(this.player.x + xCo, this.player.y + yCo, 'lasso');
    this.lassos.add(this.lasso.setAngle(angle));
    this.lasso.anims.play("lasso", true);
  }
  makeLasso2 (xCo, yCo, angle) {
    this.lassoMiss.play(this.defaultSoundConfig);
    this.lasso = this.physics.add.sprite(this.player.x + xCo, this.player.y + yCo, 'uplasso');
    this.lassos.add(this.lasso.setAngle(angle));
    this.lasso.anims.play("uplasso", true);
  }

  pickAmmo (player, ammo) {
    ammo.disableBody(true, true);
    this.ammo += 20;
  }

  deadBullet (layer, bullet) {
    bullet.disableBody(true, true);
  }

  tameCheck (lasso, enemy) {
    var tameRate;
      if (enemy.boss) {
        tameRate = Math.max(100);
        // tameRate = Math.max((45 - enemy.health) / 25, 0);
        if (Math.random() < tameRate) {
          this.lassoHit.play(this.defaultSoundConfig);
          this.didLasso = true;
          enemy.disableBody(true, true);
          this.mount = this.physics.add.sprite(this.player.x, this.player.y, 'stego');
          this.mount.setScale(.7);
          this.mount.setDepth(-10);
          this.mount.body.setSize(64, 64);
          this.mount.body.setOffset(570, 350);
          this.player.isMounted = true;
        } else {
          console.log('attempt failed');
        }
      } else{
        this.lassoHit.play(this.defaultSoundConfig);
        enemy.health--;
        if (enemy.health == 0) {
          enemy.disableBody(true, true);
          this.kills += 1;
          // Random ammo drop after enemy kill
          //dropRate increases when you're low on bullets
          var dropRate = Math.max((20 - this.ammo) / 25, 0);
          if (Math.random() < dropRate) {
            var ammoDrop = this.physics.add.sprite(enemy.x, enemy.y, 'ammo');
            ammoDrop.setScale(0.5);
            this.ammoDrops.add(ammoDrop);
          }
        }
      }
  }
}
