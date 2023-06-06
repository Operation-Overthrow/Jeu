import 'phaser';

class MyScene extends Phaser.Scene {
  

  constructor() {
    super('my-scene');
  }

  preload() {
    
  }

  create() {

  }

  update() {
    
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1500,
  height: 1000,
  scene: MyScene
};

const game = new Phaser.Game(config);