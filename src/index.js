/*global Phaser, window*/
import BootScene from './scenes/BootScene.js';
//import Scene1 from './scenes/Scene1.js';
import Config from './config/config.js';
import Preloader from './scenes/Preloader.js';
import Test2 from './scenes/Test2.js';


class Game extends Phaser.Game {
  constructor () {
    super(Config);
    this.scene.add('Boot', BootScene);
    this.scene.add('Preloader', Preloader);
    this.scene.add('Test2', Test2);
    //this.scene.add('Tutorial', Test2);


    //this.scene.add('Scene1', Scene1);
    this.scene.start('Boot');
  }
}

window.game = new Game();
