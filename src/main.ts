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


  get getGridSize(){
    return this.gridSize;
  }

  constructor() {
    super('my-scene');
  }

  preload() {
    
  }

  create() {
    this.gameArea(this.gridAlly,100,600 - this.gridSize * this.cellSize,0xffffff);
    this.gameArea(this.gridEnemy,900,600  - this.gridSize * this.cellSize,0xffffff);
  }

  update() {
    
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
    scene: [MenuScene,MyScene]
  };


const game = new Phaser.Game(config);