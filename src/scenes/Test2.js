/*global Phaser*/
export default class Test2 extends Phaser.Scene {
  constructor () {
    super('Test2');
  }

  init (data) {
    // Initialization code goes here
    //this.kils = data.kills;
  }

  //TODO: implement all sounds
  //TODO: create and implement UI art

  preload () {
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

    this.load.image('tree', './assets/Scene1/tree.png');
    this.load.image('ammo', './assets/sprites/ammo.png');
    this.load.image('health', './assets/Scene1/Heart.png');


    this.load.image("tiles", "./assets/Tilemaps/tiles.png");
    this.load.tilemapTiledJSON("map", "./assets/Tilemaps/bgmap.json");


    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    const map = this.make.tilemap({ key: "map" });
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
    this.player.setCollideWorldBounds(true);
    this.maxHealth = 5;
    this.currentHealth = this.maxHealth;
    this.playerHitTimer = 0;
    this.kills = 0;


    this.physics.add.collider(this.player, worldLayer);

    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    const camera = this.cameras.main;
    camera.setZoom(3);
    camera.startFollow(this.player);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    var gun, bullets, enemy, bullet, enemyGroup;
    this.nextFire = 0;
    this.fireRate = 200;
    this.speed = 1000;

    this.gun = this.add.sprite(this.player.x, this.player.y, 'gun');
    this.gun.setOrigin(0.5);
    this.gun.setScale(0.25);

    //this.enemies = this.add.group();
    this.enemyGroup = this.physics.add.group({
      key: "enemy",
      repeat: 100
    });

    this.enemyGroup.children.iterate(function(child) {
      child.setScale(0.7);
      child.x = 200 + Math.floor(Math.random() * 700) ,
      child.y = 200 + Math.floor(Math.random() * 700)
      child.health = 1;
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
          if (this.ammo > 0){
            this.shoot(pointer.positionToCamera(camera));
            this.ammo -= 1;
          } else {
            this.gunEmpty.play(this.defaultSoundConfig);
            console.log('out of ammo');
          }
          console.log('bullets remaining: ', this.ammo);
        } else {
          var betweenPoints = Phaser.Math.Angle.BetweenPoints;
          var angle = Phaser.Math.RAD_TO_DEG * betweenPoints(this.player, pointer.positionToCamera(camera));
          console.log(angle);
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

          if (roundAngle == 0) {
            this.lasso = this.physics.add.sprite(this.player.x + 75, this.player.y, 'lasso').setAngle(roundAngle);
          }
          if (roundAngle == 180) {
            this.lasso = this.physics.add.sprite(this.player.x - 75, this.player.y, 'lasso').setAngle(roundAngle);
          }
          if (roundAngle == 90) {
            this.lasso = this.physics.add.sprite(this.player.x, this.player.y + 75, 'uplasso').setAngle(roundAngle - 90);
          }
          if (roundAngle == -90) {
            this.lasso = this.physics.add.sprite(this.player.x, this.player.y - 75, 'uplasso').setAngle(roundAngle - 90);
          }
          console.log(roundAngle);
        }

      }, this);


    //Anims
    const anims = this.anims;
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("cowboy", { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "idle",
      frames: [{ key: "cowboy", frame: 0 }],
      frameRate: 20,
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
    this.dinoStep1 = this.sound.add("dino_step1");
    this.dinoStep2 = this.sound.add("dino_step2");
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

    this.healthScore = this.add.text(this.centerX - 290, this. centerY + 120, 'Health').setScrollFactor(0);
    this.healthGroup = this.add.group({
      key: 'health',
      repeat: 4,
      setXY: {
        x: this.centerX - 300,
        y: this.centerY + 145,
        stepX: 20,
        stepY: 0
      }
    });

    this.healthGroup.children.iterate(function(child) {
      child.setScrollFactor(0);
      child.setScale(0.6);
    });

    this.playerGroup = this.physics.add.group();
    this.playerGroup.add(this.player);
    // this.playerGroup.add(this.gun);

    this.physics.add.collider(this.enemyGroup, this.enemyGroup);

    this.ammoScore = this.add.text(this.centerX - 100, this. centerY + 120, 'Ammo: '+ this.ammo).setScrollFactor(0);
    this.killScore = this.add.text(this.centerX + 100, this. centerY + 120, 'Kills: '+ this.kills).setScrollFactor(0);

  }

  update (time, delta) {
    this.ammoScore.setText('Ammo: ' + this.ammo);
    this.killScore.setText('Kills: ' + this.kills);

    //Game over
    if (this.gameOver) {
      this.player.disableBody(false, false);
      //this.gun.destroy();
      var text = this.add.text(this.player.x - 30, this.player.y - 40, 'Game Over');
      var score = this.add.text(this.player.x - 30, this.player.y + 25, 'Kills: ' + this.kills);
      this.input.enabled = false;
    }
    // Update the scene
    const speed = 175;
    const prevVelocity = this.player.body.velocity.clone();

    // var timeElapsed = 0;
    // timeElapsed += game.timer.elapsed();
    // if (timeElapsed >= 0.5) {
    //   timeElapsed = 0;
    //   this.lasso.disableBody(true, true);
    // }

    // Stop any previous movement from the last frame
    this.player.body.setVelocity(0);
    this.gun.x = this.player.x + 13;
    this.gun.y = this.player.y + 5;

    if (this.playerHit) {
      this.playerHitTimer++;
      if (this.playerHitTimer >= 60) {
        this.playerHit = false;
        this.playerHitTimer = 0;
      }
    }

    // Horizontal movement
    if (this.a.isDown) {
      this.player.body.setVelocityX(-speed);
      if (this.spacebar.isDown && this.lasso) {

      }
    } else if (this.d.isDown) {
      this.player.body.setVelocityX(speed);
    }

    // Vertical movement
    if (this.w.isDown) {
      this.player.body.setVelocityY(-speed);
    } else if (this.s.isDown) {
      this.player.body.setVelocityY(speed);
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    this.player.body.velocity.normalize().scale(speed);

    if (this.a.isDown) {
      this.player.anims.play("walk", true);
      if (this.spacebar.isDown && this.lassos.countActive(true) < 1) {
        this.lasso = this.makeLasso(-75, 0, 180);
        //this.lasso = this.physics.add.sprite(this.player.x - 75, this.player.y, 'lasso').setAngle(0);
      }
    } else if (this.d.isDown) {
      this.player.anims.play("walk", true);
      if (this.spacebar.isDown && this.lassos.countActive(true) < 1) {
        this.lasso = this.makeLasso(75, 0, 0);
        //this.lasso = this.physics.add.sprite(this.player.x + 75, this.player.y, 'lasso').setAngle(0);
      }
    } else if (this.w.isDown) {
      this.player.anims.play("walk", true);
      if (this.spacebar.isDown && this.lassos.countActive(true) < 1) {
        this.lasso = this.makeLasso2(0, -75, 180);
        //this.lasso = this.physics.add.sprite(this.player.x, this.player.y - 75, 'uplasso').setAngle(-90-90);
      }
    } else if (this.s.isDown) {
      this.player.anims.play("walk", true);
      if (this.spacebar.isDown && this.lassos.countActive(true) < 1) {
        this.lasso = this.makeLasso2(0, 75, 0);
        //this.lasso = this.physics.add.sprite(this.player.x, this.player.y + 75, 'uplasso').setAngle(90-90);
      }
    } else {
      this.player.anims.play("idle", true);
      if (this.spacebar.isDown && this.lassos.countActive(true) < 1) {
        this.lasso = this.makeLasso(75, 0, 0);
        //this.lasso = this.physics.add.sprite(this.player.x + 75, this.player.y, 'lasso').setAngle(0);
      }
  }
  // Update the scene
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

    this.enemyGroup.children.iterate(function(child) {
      if (Math.abs(child.x - this.player.x) < 150 && Math.abs(child.y - this.player.y) < 150) {
          this.tweens.add({
            targets: child,
            x: this.player.x,
            y: this.player.y,
            duration: 1000 + Math.floor(Math.random() * 2000)
          });
      }
    }.bind(this));

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
      .setVelocity(velocity.x, velocity.y);

    this.gunshot.play(this.defaultSoundConfig);
  }

  takeDamage (player, enemy) {
    if (!this.playerHit && this.currentHealth > 0) {
      this.currentHealth--;
      this.playerHit = true;
      this.healthGroup.getChildren()[this.healthGroup.getChildren().length - 1].destroy();
      if (this.currentHealth == 0) {
        this.gameOver = true;
      }
    }
    console.log(this.currentHealth);
  }

  hitEnemy (bullet, enemy) {
    console.log('hit');
    bullet.disableBody(true, true);
    enemy.health -= 1;
    console.log(enemy.health);

    var distFromPlayerToEnemy = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
    var deltaVolume = (0.1 - 0.5) / 500         // (vol_far - vol_close) / max_distance
    var volume = deltaVolume * distFromPlayerToEnemy + 1

    var dinoHurtSoundConfig = this.defaultSoundConfig;
    this.dinoHurt.volume = volume

    this.dinoHurt.play(this.dinoHurtSoundConfig);
    if (enemy.health == 0) {
      enemy.disableBody(true, true);
      this.kills += 1;
      // Random ammo drop after enemy kill
      //dropRate increases when you're low on bullets
      var dropRate = Math.max((20 - this.ammo) / 25, 0);
      if (Math.random() < dropRate) {
        console.log('the enemy dropped some bullets!');
        var ammoDrop = this.physics.add.sprite(enemy.x, enemy.y, 'ammo');
        ammoDrop.setScale(0.5);
        this.ammoDrops.add(ammoDrop);
      }
    }
  }

  makeLasso (xCo, yCo, angle) {
    this.lassos.add(this.physics.add.sprite(this.player.x + xCo, this.player.y + yCo, 'lasso').setAngle(angle));
  }
  makeLasso2 (xCo, yCo, angle) {
    this.lassos.add(this.physics.add.sprite(this.player.x + xCo, this.player.y + yCo, 'uplasso').setAngle(angle));
  }

  pickAmmo (player, ammo) {
    ammo.disableBody(true, true);
    this.ammo += 20;
    console.log('bullets remaining: ', this.ammo);
  }

  deadBullet (layer, bullet) {
    bullet.disableBody(true, true);
  }
}
