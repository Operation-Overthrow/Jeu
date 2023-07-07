import 'phaser';
import { MenuScene } from './menu';
import { Cell } from './models/Cell';
import { Core } from './models/Core';
import { Bullet } from './models/Bullet';
import { Turret } from './models/Turret';



export class MyScene extends Phaser.Scene {
  private bulletsGroup!: Phaser.Physics.Arcade.Group;
  private gridSize = 8;
  private cellSize = 50;
  private gridAlly: Array<Cell[]> = [];
  private gridEnemy: Array<Cell[]> = [];
  private CoreAlly: Core = new Core(10, 1075, 375);
  private graphics!: Phaser.GameObjects.Graphics;
  private circle!: Phaser.GameObjects.Arc & { body: Phaser.Physics.Arcade.Body };
  private trajectoryPoints: Phaser.Math.Vector2[] = [];
  private bulletPhysic!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private corePhysic!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private turrets: Array<Turret> = [];

  get getGridSize() {
    return this.gridSize;
  } constructor() {
    super('my-scene');
  }

  preload() {
    this.load.image('bullet', 'assets/test.png');
    this.load.image('core', 'assets/reactor1.png');
    this.load.image('tourelle', 'assets/tourelle1.png');
  }

  create() {
    this.gameArea(this.gridAlly, 100, 600 - this.gridSize * this.cellSize, 0xffffff);
    this.gameArea(this.gridEnemy, 900, 600 - this.gridSize * this.cellSize, 0xffffff);
    this.bulletsGroup = this.physics.add.group();

    this.generateCore();
    this.generateTurret();
    this.input.on('pointerdown', (pointer: PointerEvent) => {
      this.turrets.forEach(turret => {
        if (
          (pointer.x >= turret.x - (this.cellSize / 2) && pointer.x <= turret.x + (this.cellSize / 2)) &&
          (pointer.y >= turret.y - (this.cellSize / 2) && pointer.y <= turret.y + (this.cellSize / 2))
        ) {
          this.generateBullet(turret, pointer)
          console.log(this.bulletPhysic,this.corePhysic);
          this.physics.add.collider(this.corePhysic, this.bulletsGroup, this.handleBulletCollision, undefined, this);
        }
      });

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

  generateBullet(turret: Turret, pointer: PointerEvent) {
    let bullet = new Bullet(turret.x, turret.y, 300);
    let bulletPhysic = this.bulletsGroup.create(bullet.x, bullet.y, 'bullet');

    // calculer la vélocité de la balle en fonction de la position de la souris par rapport au centre du cercle
    const xPosition =  turret.x - pointer.x;
    const yPosition =  turret.y - pointer.y;

    bulletPhysic.setVelocity(xPosition * 20, yPosition * 20);
  }

  generateCore() {
    let core = this.CoreAlly;
    let corePhysic = this.physics.add.sprite(core.x, core.y, 'core');
    corePhysic.body.allowGravity = false;
    corePhysic.body.immovable = true;
    this.corePhysic = corePhysic;

    // Ajuster les coordonnées du réacteur pour qu'il soit centré sur le cercle blanc
    const centerX = this.corePhysic.x + this.cellSize / 2;
    const centerY = this.corePhysic.y + this.cellSize / 2;

    // Placer le réacteur à l'endroit du cercle blanc
    this.corePhysic.setPosition(centerX, centerY);

    // Ajuster la profondeur du réacteur pour le faire ressortir visuellement
    this.corePhysic.setDepth(1);
  }

  generateTurret() {
    let turret = new Turret(10, 475, 275);
    let turretPhysic = this.physics.add.sprite(turret.x, turret.y, 'tourelle');
    turretPhysic.body.allowGravity = false;
    turretPhysic.body.immovable = true;
    turretPhysic.setDepth(1);

    this.turrets.push(turret);
  }

  private handleBulletCollision(core: Phaser.GameObjects.GameObject, bullet: Phaser.GameObjects.GameObject) {
    console.log('Collision entre la balle et le cœur');
    this.CoreAlly.reduceHP(2);
    console.log(this.CoreAlly);

    if (this.CoreAlly.hp === 0) {
      console.log('gameOver');
    }

    bullet.destroy();
  }



















  private gameArea(grid: Array<Cell[]>, startX: number, startY: number, colorLine: any) {

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