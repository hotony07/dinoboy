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
    this.load.image('player', './assets/sprites/cowboy_idle1.png');
    this.load.image('enemy', './assets/Scene1/enemy.png');
    this.load.image('bullet', './assets/sprites/bullet.png')
    this.load.audio("music", './assets/Music/8TownRoad.wav');
    this.load.spritesheet('cowboy', './assets/sprites/cowboy_spritesheet.png', {
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
    this.cursors = this.input.keyboard.createCursorKeys();
    this.player.setCollideWorldBounds(true);
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    var gun, bullets, enemy, bullet, enemyGroup;
    this.nextFire = 0;
    this.fireRate = 200;
    this.speed = 1000;

    this.gun = this.add.sprite(this.player.x + 30, this.player.y + 10, 'gun');
    this.gun.setScale(0.5);


    //this.enemies = this.add.group();
    this.enemyGroup = this.physics.add.group({
      key: "soda",
      repeat: 4,
      setXY: {
        x: 100,
        y: 100,
        stepX: 0,
        stepY: 100
      }
    });

    this.enemyGroup.children.iterate(function(child) {
      child.setScale(0.1);
    });

    this.bullets = this.physics.add.group({
      defaultKey: "bullet",
      maxSize: 10
    });
    //this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);

    // Event listener for movement of mouse pointer
    this.input.on(
      "pointermove",
      function(pointer) {
        var betweenPoints = Phaser.Math.Angle.BetweenPoints;
        var angle = Phaser.Math.RAD_TO_DEG * betweenPoints(this.gun, pointer);
        this.gun.setAngle(angle);
      }, this
    );

    //When pointer is down, run function shoot
    //this.input.on("pointerdown", this.shoot, this);

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
    this.gun.x = this.player.x + 30;
    this.gun.y = this.player.y + 10;

    // Horizontal movement
    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(speed);
    }

    // Vertical movement
    if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(speed);
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    this.player.body.velocity.normalize().scale(speed);

    if (this.cursors.left.isDown) {
      this.player.anims.play("walk", true);
    } else if (this.cursors.right.isDown) {
      this.player.anims.play("walk", true);
    } else if (this.cursors.up.isDown) {
      this.player.anims.play("walk", true);
    } else if (this.cursors.down.isDown) {
      this.player.anims.play("walk", true);
    } else {
      this.player.anims.play("idle", true);
  }

  }
}
