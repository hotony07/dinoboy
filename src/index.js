/*global Phaser, window*/
import BootScene from './scenes/BootScene.js';
//import Scene1 from './scenes/Scene1.js';
import Config from './config/config.js';
import Test from './scenes/Test.js';
import Preloader from './scenes/Preloader.js';

class Game extends Phaser.Game {
  constructor () {
    super(Config);
    this.scene.add('Boot', BootScene);
    this.scene.add('Preloader', Preloader);
    this.scene.add('Test', Test);
    this.scene.add('Test2', Test2);


    //this.scene.add('Scene1', Scene1);
    this.scene.start('Test2');
  }
}

window.game = new Game();
