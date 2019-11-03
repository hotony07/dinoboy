/*global Phaser, window*/
import BootScene from './scenes/BootScene.js';
//import Scene1 from './scenes/Scene1.js';
import Config from './config/config.js';
import PreloaderScene from './scenes/PreloaderScene.js';
import Test2 from './scenes/Test2.js';
import Tutorial1 from './scenes/Tutorial1.js';

class Game extends Phaser.Game {
  constructor () {
    super(Config);
    this.scene.add('Boot', BootScene);
    this.scene.add('Preloader', PreloaderScene);
    this.scene.add('Test2', Test2);
    this.scene.add('Tutorial1', Tutorial1);


    //this.scene.add('Scene1', Scene1);
    this.scene.start('Boot');
  }
}

window.game = new Game();
