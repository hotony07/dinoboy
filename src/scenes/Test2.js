/*global Phaser*/
export default class Test2 extends Phaser.Scene {
  constructor () {
    super('Test2');
  }

  init (data) {
    // Initialization code goes here
  }

  preload () {
    // Preload assets
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
    this.load.image('stego', './assets/dinosaur/stego.png')


    this.load.image('gun', './assets/sprites/gun.png');
    this.load.image('lasso', './assets/sprites/lasso.png');
    this.load.image('uplasso', './assets/sprites/uplasso.png');

    this.load.image('tree', './assets/Scene1/tree.png');
    this.load.image('ammo', './assets/sprites/ammo.png');

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
      repeat: 10
    });

    this.enemyGroup.children.iterate(function(child) {
      child.setScale(0.7);
      child.x = Math.floor(Math.random() * 900) ,
      child.y = Math.floor(Math.random() * 900)
      child.health = 1;
    });

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
    /*Music
    this.music = this.sound.add("music");
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
    */
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

    this.playerGroup = this.physics.add.group();
    this.playerGroup.add(this.player);
    // this.playerGroup.add(this.gun);

    this.physics.add.collider(this.enemyGroup, this.enemyGroup);

  }

  update (time, delta) {
    // Update the scene
    const speed = 175;
    const prevVelocity = this.player.body.velocity.clone();

    var timeElapsed = 0;
    //timeElapsed += game.Time.elapsed();
    if (timeElapsed >= 0.5) {
      timeElapsed = 0;
      this.lasso.disableBody(true, true);
    }

    // Stop any previous movement from the last frame
    this.player.body.setVelocity(0);
    this.gun.x = this.player.x + 13;
    this.gun.y = this.player.y + 5;

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
    } else if (this.d.isDown) {
      this.player.anims.play("walk", true);
    } else if (this.w.isDown) {
      this.player.anims.play("walk", true);
    } else if (this.s.isDown) {
      this.player.anims.play("walk", true);
    } else {
      this.player.anims.play("idle", true);
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
    if (this.enemyGroup.countActive(true) == 0) {
      this.enemyGroup = this.physics.add.group({
        key: "enemy",
        repeat: 10
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
  }

  hitEnemy (bullet, enemy) {
    console.log('hit');
    bullet.disableBody(true, true);
    enemy.health -= 1;
    console.log(enemy.health);
    if (enemy.health == 0) {
      enemy.disableBody(true, true);
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

  pickAmmo (player, ammo) {
    ammo.disableBody(true, true);
    this.ammo += 20;
    console.log('bullets remaining: ', this.ammo);
  }

  deadBullet (layer, bullet) {
    bullet.disableBody(true, true);
  }
}
