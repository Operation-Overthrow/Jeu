import 'phaser';
import { MenuScene } from './menu';
import { Cell } from './models/Cell';
import { Core } from './models/Core';
import { Bullet } from './models/Bullet';



export class MyScene extends Phaser.Scene {
  private gridSize = 8;
  private cellSize = 50;
  private gridAlly: Array<Cell[]> = [];
  private gridEnemy: Array<Cell[]> = [];
  private CoreAlly: Core = new Core(10, 4, 4);
  private graphics!: Phaser.GameObjects.Graphics;
  private circle!: Phaser.GameObjects.Arc & { body: Phaser.Physics.Arcade.Body };
  private trajectoryPoints: Phaser.Math.Vector2[] = [];
  private bulletPhysic!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private corePhysic!:Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;




  get getGridSize() {
    return this.gridSize;
  } constructor() {
    super('my-scene');
  }

  preload() {
    this.load.image('bullet','assets/bullet.png');
    this.load.image('core','assets/reactor1.png')
  }

  create() {
    this.gameArea(this.gridAlly, 100, 600 - this.gridSize * this.cellSize, 0xffffff);
    this.gameArea(this.gridEnemy, 900, 600 - this.gridSize * this.cellSize, 0xffffff);
    this.generateCore();
    this.input.on('pointerdown', (pointer: PointerEvent) => {
      this.generateBullet(pointer)
      console.log(this.bulletPhysic,this.corePhysic);
      this.physics.add.collider(this.corePhysic, this.bulletPhysic, this.handleBulletCollision, undefined, this);
    });
    
    // Ajoute les graphiques de débogage
    this.graphics = this.add.graphics();
  }

  update() {
    // Efface le tracé précédent
    this.graphics.clear();

    // Ajoute la position actuelle du cercle aux points de trajectoire
    if (this.circle) {
      this.trajectoryPoints.push(new Phaser.Math.Vector2(this.circle.x, this.circle.y));
    }

    // Dessine le tracé de la trajectoire
    this.graphics.lineStyle(2, 0x00ff00, 1);
    for (let i = 1; i < this.trajectoryPoints.length; i++) {
      const startPoint = this.trajectoryPoints[i - 1];
      const endPoint = this.trajectoryPoints[i];
      this.graphics.lineBetween(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
    }
  }


  private gameArea(grid: Array<Cell[]>, startX: number, startY: number, colorLine: any) {
    
    let gridSize = 8;
    let cellSize = 50;
    let cell;
    grid = [];
    this.CoreAlly = new Core(10,4,4)
    for (let i = 0; i < gridSize; i++) {

      let row = [];

      for (let j = 0; j < gridSize; j++) {
        // Calculer les coordonnées de la cellule
        let x = startX + i * cellSize;
        let y = startY + j * cellSize;
        if (
          (i <= this.CoreAlly['x'] && i + 1 >= this.CoreAlly['x']) &&
          (j <= this.CoreAlly['y'] && j + 1 >= this.CoreAlly['y'])
        ) {
          cell = new Cell(x, y, false);
        } else {
          cell = new Cell(x, y, true);
        }

        cell.colorEmpty();
        let graphics = this.add.graphics();
        // Dessiner la cellule
        if (!!cell['color']) {
          graphics.fillStyle(cell['color']);
          graphics.fillRect(x, y, cellSize, cellSize);
        }
        // Dessiner le cercle inscrit dans le grand rectangle 2x2
        if (
          i === this.CoreAlly['x'] &&
          j === this.CoreAlly['y']
        ) {
          const centerX = x + cellSize - 50
          const centerY = y + cellSize - 50
          const radius = cellSize;
          graphics.fillStyle(0xffffff); // Couleur du cercle (noir dans cet exemple)
          graphics.fillCircle(centerX, centerY, radius);
        }

        graphics.lineStyle(2, colorLine);
        graphics.strokeRect(x, y, cellSize, cellSize);
        // Ajouter la cellule à la grille
        row.push(cell);
      }
      grid.push(row);


    }
  }

  generateBullet(pointer: PointerEvent) {
    let bullet = new Bullet(pointer.x, pointer.y, 300);
    let bulletPhysic = this.physics.add.sprite(bullet.x, bullet.y, 'bullet');
    bulletPhysic.setVelocity(bullet.velocity, -bullet.velocity);
    this.bulletPhysic = bulletPhysic; // Store a reference to the bullet sprite
  }
  
  generateCore() {
    let core = new Core(400, 800, 500);
    let corePhysic = this.physics.add.sprite(core.x, core.y, 'core');
    corePhysic.body.allowGravity = false;
    this.corePhysic = corePhysic;
  }

  private handleBulletCollision() {
    console.log('Collision entre la balle et le cœur');
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1500,
  height: 1000,
  scene: [MenuScene, MyScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 } // Définit la gravité vers le bas (y positif)
    }
  }
};

const game = new Phaser.Game(config);