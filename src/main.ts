import 'phaser';
import { MenuScene } from './menu';
import { Cell } from './models/Cell';
import { Core } from './models/Core';



export class MyScene extends Phaser.Scene {
  private gridSize = 8;
  private cellSize = 50;
  private gridAlly: Array<Cell[]> = [];
  private gridEnemy: Array<Cell[]> = [];
  private CoreAlly: Core = new Core(10,4,4);
  private graphics!: Phaser.GameObjects.Graphics;
  private circle!: Phaser.GameObjects.Arc & { body: Phaser.Physics.Arcade.Body };
  private trajectoryPoints: Phaser.Math.Vector2[] = [];



  get getGridSize(){
    return this.gridSize;
  }  constructor() {
        super('my-scene');
    }

    preload() {
        // Préchargement des ressources si nécessaire
    }

    create() {
      this.gameArea(this.gridAlly,100,600 - this.gridSize * this.cellSize,0xffffff);
    this.gameArea(this.gridEnemy,900,600  - this.gridSize * this.cellSize,0xffffff);
        this.input.on('pointerdown', (pointer: PointerEvent) => {
            // Crée un cercle blanc
            const circle = this.add.circle(pointer.x, pointer.y, 5, 0xff0066);
            this.physics.add.existing(circle);
            this.circle = circle as Phaser.GameObjects.Arc & { body: Phaser.Physics.Arcade.Body };
            this.circle.body.velocity.x = 200;
            this.circle.body.velocity.y = -200;

            // Réinitialise le tableau des points de trajectoire
            this.trajectoryPoints = [];
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


  private gameArea(grid: Array<Cell[]>, startX:number, startY:number,colorLine:any){
    let gridSize = 8;
    let cellSize = 50;
    let cell;
    grid = [];
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
        // Dessiner le cercle inscrit
      // Dessiner le cercle inscrit dans le grand rectangle 2x2
      if (
        i === this.CoreAlly['x'] &&
        j === this.CoreAlly['y']
      ) {
        const centerX = x + cellSize -50
        const centerY = y + cellSize  -50
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
}

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1500,
    height: 1000,
    scene: [MenuScene,MyScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 } // Définit la gravité vers le bas (y positif)
        }
    }
};

const game = new Phaser.Game(config);