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
  private CoreAlly: Core = new Core(10, 275, 375);
  private CoreEnnemy: Core = new Core(10, 1075, 375);
  private graphics!: Phaser.GameObjects.Graphics;
  private circle!: Phaser.GameObjects.Arc & { body: Phaser.Physics.Arcade.Body };
  private trajectoryPoints: Phaser.Math.Vector2[] = [];
  private bulletPhysic!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private corePhysic!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private corePhysicEnnemy!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

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

    this.generateCore('coreAlly', this.corePhysic);
    this.generateCore('coreEnnemy', this.corePhysicEnnemy);
    this.generateTurret();
    this.input.on('pointerdown', (pointer: PointerEvent) => {
      this.generateBullet(pointer)
      console.log(this.bulletPhysic, this.corePhysic);
      this.physics.add.collider(this.corePhysic, this.bulletsGroup, this.handleBulletCollision, undefined, this);
      this.physics.add.collider(this.corePhysicEnnemy, this.bulletsGroup, this.handleBulletCollision, undefined, this);
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

  generateBullet(pointer: PointerEvent) {
    let bullet = new Bullet(pointer.x, pointer.y, 300);
    let bulletPhysic = this.bulletsGroup.create(bullet.x, bullet.y, 'bullet');
    bulletPhysic.setVelocity(bullet.velocity, -bullet.velocity);
  }

  generateCore(name: string) {
    let currentCore = name === 'coreAlly' ? this.CoreAlly : this.CoreEnnemy;
    let corePhysicLocal = this.physics.add.sprite(currentCore.x, currentCore.y, 'core');
    corePhysicLocal.setName(name);
    corePhysicLocal.body.allowGravity = false;
    corePhysicLocal.body.immovable = true;
    

    // Ajuster les coordonnées du réacteur pour qu'il soit centré sur le cercle blanc
    const centerX = corePhysicLocal.x + this.cellSize / 2;
    const centerY = corePhysicLocal.y + this.cellSize / 2;

    // Placer le réacteur à l'endroit du cercle blanc
    corePhysicLocal.setPosition(centerX, centerY);

    // Ajuster la profondeur du réacteur pour le faire ressortir visuellement
    corePhysicLocal.setDepth(1);

    if (name === 'coreAlly') {
      this.corePhysic = corePhysicLocal;
    } else {
      this.corePhysicEnnemy = corePhysicLocal;
    }
  }

  generateTurret() {
    let turret = new Turret(10, 475, 275);
    let turretPhysic = this.physics.add.sprite(turret.x, turret.y, 'tourelle');
    turretPhysic.body.allowGravity = false;
    turretPhysic.body.immovable = true;
    turretPhysic.setDepth(1);
  }

  private handleBulletCollision(core: Phaser.GameObjects.GameObject, bullet: Phaser.GameObjects.GameObject) {
    let selectedCore = core['name'] === 'coreAlly' ? this.CoreAlly : this.CoreEnnemy;
    console.log('Collision entre la balle et le cœur - ' + core['name']);
    selectedCore.reduceHP(2);

    if (selectedCore.hp === 0) {
      console.log('gameOver - ' + core['name'] + ' a perdu !');
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