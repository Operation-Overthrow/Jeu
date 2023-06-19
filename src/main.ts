import 'phaser';
import { Cell } from './models/Cell';



class MyScene extends Phaser.Scene {
  private gridAlly: Array<Cell[]> = [];
  private gridEnemy: Array<Cell[]> = [];
  private gridSize = 8;
  private cellSize = 50;
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
    let cellSize = 50

    grid = [];
    for (let i = 0; i < gridSize; i++) {
      
      let row = [];
      
      for (let j = 0; j < gridSize; j++) {
        // Calculer les coordonnées de la cellule
        let x = startX + i * cellSize;
        let y = startY + j * cellSize;

        let cell = new Cell(x,y,false)  
        
        // Créer une instance de la classe Cell pour représenter la cellule
        
        let graphics = this.add.graphics();
        // Dessiner la cellule
        cell.colorEmpty();
        if(!!cell['color']){
          graphics.fillStyle(cell['color'])
        }
        // graphics.fillRect(x,y,50,50)
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
    scene: MyScene
  };


const game = new Phaser.Game(config);