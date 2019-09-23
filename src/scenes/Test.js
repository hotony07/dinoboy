/*global Phaser*/
export default class Test extends Phaser.Scene {
  constructor () {
    super('Test');
  }

  init (data) {
    // Initialization code goes here
  }

  preload () {
    // Preload assets
    this.load.image('bullet', './assets/sprites/bullet.png')
    this.load.audio("music", './assets/Music/8TownRoad.wav');
    this.load.spritesheet('cowboy', './assets/sprites/cowboy_spritesheet.png', {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet('enemy', './assets/dinosaur/smallDino.png', {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.image('gun', './assets/sprites/gun.png');


    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {

    this.player = this.physics.add.sprite(this.centerX, this.centerY, 'player');
    this.player.setCollideWorldBounds(true);
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    var gun, bullets, enemy, bullet, enemyGroup;
    this.nextFire = 0;
    this.fireRate = 200;
    this.speed = 1000;

    this.gun = this.add.sprite(this.player.x, this.player.y, 'gun');
    this.gun.setOrigin(0, 1);
    this.gun.setScale(0.5);

    //this.enemies = this.add.group();
    this.enemyGroup = this.physics.add.group({
      key: "enemy",
      repeat: 4,
      setXY: {
        x: 100,
        y: 100,
        stepX: 0,
        stepY: 100
      }
    });

    this.enemyGroup.children.iterate(function(child) {
      child.setScale(.75);
    });

    this.bullets = this.physics.add.group({
      defaultKey: "bullet",
      maxSize: 10
    });
    //this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);

    this.ammoDrops = this.physics.add.group();
    this.availDrop = true;
    this.physics.add.overlap(this.player, this.ammoDrops, this.pickAmmo, null, this);


    // Event listener for movement of mouse pointer
    this.input.on(
      "pointermove",
      function(pointer) {
        var betweenPoints = Phaser.Math.Angle.BetweenPoints;
        var angle = Phaser.Math.RAD_TO_DEG * betweenPoints(this.gun, pointer);
        this.gun.setAngle(angle);
      }, this
    );
    this.ammo = 10;
    //When pointer is down and you have ammo, run function shoot
      this.input.on("pointerdown", function(pointer) {
        if (this.ammo > 0){
          this.shoot(pointer);
          this.ammo -= 1;
        } else {
          console.log('out of ammo');
        }
        console.log('bullets remaining: ', this.ammo);
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
    //Music
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

  }

  update (time, delta) {
    // Update the scene
    const speed = 175;
    const prevVelocity = this.player.body.velocity.clone();

    // Stop any previous movement from the last frame
    this.player.body.setVelocity(0);
    this.gun.x = this.player.x + 15;
    this.gun.y = this.player.y + 17;

    // Horizontal movement
    if (this.a.isDown) {
      this.player.body.setVelocityX(-speed);
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
    if (this.ammoDrops.countActive(true) == 0) {
      this.availDrop = true;
    }
    if (this.ammo == 0 && this.availDrop) {
      var ammoDrop = this.physics.add.sprite(16, 16, 'bullet');
      ammoDrop.setScale(2);
      this.ammoDrops.add(ammoDrop);
      ammoDrop.setRandomPosition(0, 0, game.config.width, game.config.height);
      this.availDrop = false;
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
      .setVelocity(velocity.x, velocity.y);
  }

  hitEnemy (bullet, enemy) {
    console.log('hit');
    enemy.disableBody(true, true);
    bullet.disableBody(true, true);
    // Random ammo drop after enemy kill
    //dropRate increases when you're low on bullets
    var dropRate = Math.max((10 - this.ammo) / 15, 0);
    if (Math.random() < dropRate) {
      console.log('the enemy dropped some bullets!');
      var ammoDrop = this.physics.add.sprite(enemy.x, enemy.y, 'bullet');
      ammoDrop.setScale(2);
      this.ammoDrops.add(ammoDrop);
    }

  }

  pickAmmo (player, ammo) {
    ammo.disableBody(true, true);
    this.ammo += 5;
    console.log('bullets remaining: ', this.ammo);
  }
}
