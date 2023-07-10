import 'phaser';
import { MenuScene } from './menu';
import { Cell } from './models/Cell';
import { Core } from './models/Core';
import { Turret } from './models/Turret';
import { GameOverScene } from './gameover';
import { AIBase } from './ai/interfaces/AIBase';
import { AIBasic } from './ai/factories/AIBasic';
import { AIPlayer } from './ai/interfaces/AIPlayer';
import { BulletService } from './services/bulletService';



export class MyScene extends Phaser.Scene {
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
  private turrets: Array<Turret> = [];
  private aiEnemy!: AIBase;
  private aiPlayerEnemy!: AIPlayer;
  private aiCooldown: number = Turret.TURRET_DEFAULT_COOLDOWN;
  private userCooldown: number = 0;
  private bulletService!: BulletService;
  private displayCoreAllyHealth!: Phaser.GameObjects.Text;
  private displayCoreEnnemyHealth!: Phaser.GameObjects.Text;
  private displayAiTurretCooldown!: Phaser.GameObjects.Text;
  private displayUserTurretCooldown!: Phaser.GameObjects.Text;

  get getGridSize() {
    return this.gridSize;
  } constructor() {
    super('my-scene');
  }

  preload() {
    this.load.image('background', 'assets/background.jpg');
    this.load.image('bullet', 'assets/test.png');
    this.load.image('core', 'assets/reactor1.png');
    this.load.image('tourelle', 'assets/tourelle1.png');
    this.load.image('tourelle_reversed', 'assets/tourelle_reversed1.png');
    this.load.image('dirt', 'assets/dirt1.png');
  }

  create() {
      
    this.add.image(1500 / 2, 720 / 2, 'background');
    // vider la scène, et la tourelle
    this.bulletService = new BulletService(this.physics);
    this.trajectoryPoints = [];
    this.turrets = [];
    this.CoreAlly.hp = 10;
    this.CoreEnnemy.hp = 10;

  
    this.gameArea(this.gridAlly, 100, 600 - this.gridSize * this.cellSize, 0xffffff);
    this.gameArea(this.gridEnemy, 900, 600 - this.gridSize * this.cellSize, 0xffffff);

    this.generateCore('coreAlly');
    this.generateCore('coreEnnemy');
    this.generateTurret( 475, 275);
    this.generateTurret(925, 275, 'tourelle_reversed', true);


    // Afficher la vie du coeur
    this.displayCoreAllyHealth = this.add.text(16, 16, 'Vie du core allié : ' + this.CoreAlly.hp, { fontSize: '32px', fill: '#fff' });
    this.displayCoreEnnemyHealth = this.add.text(1000, 16, 'Vie du core ennemi : ' + this.CoreEnnemy.hp, { fontSize: '32px', fill: '#fff' });
    
    // Afficher le cooldown de l'IA et du joueur
    this.displayUserTurretCooldown = this.add.text(16, 50, 'Cooldown Joueur : ' + (this.userCooldown > 0 ? Math.round(this.userCooldown / 60) : 0) + 's', { fontSize: '32px', fill: '#fff' });
    this.displayAiTurretCooldown = this.add.text(1000, 50, 'Cooldown IA : ' + (this.aiCooldown > 0 ? Math.round(this.aiCooldown / 60) : 0) + 's', { fontSize: '32px', fill: '#fff' });

    this.input.on('pointerdown', (pointer: PointerEvent) => {
      if (this.userCooldown > 0) {
        return;
      }
      
      this.userCooldown = 0;
      this.turrets.forEach(turret => {
        if (turret.isEnemy) {
          return;
        }


        if (
          (pointer.x >= turret.x - (this.cellSize / 2) && pointer.x <= turret.x + (this.cellSize / 2)) &&
          (pointer.y >= turret.y - (this.cellSize / 2) && pointer.y <= turret.y + (this.cellSize / 2))
        ) {
          this.bulletService.generateBullet(turret, pointer.x, pointer.y);
          console.log(this.bulletPhysic,this.corePhysic);
          this.bulletService.addCollision(this.physics, this.corePhysic, this.corePhysicEnnemy, this.handleBulletCollision, this);  
        }
      });
    });

    // Ajoute les graphiques de débogage
    this.graphics = this.add.graphics();

    // Ajout de l'IA
    this.aiEnemy = new AIBasic();
    this.aiPlayerEnemy = this.aiEnemy.createAI();
  }

  update() {
    // Efface le tracé précédent
    this.graphics.clear();

    // Ajoute la position actuelle du cercle aux points de trajectoire
    if (this.circle) {
      this.trajectoryPoints.push(new Phaser.Math.Vector2(this.circle.x, this.circle.y));
    }

    // Mettre à jour le texte de la vie des coeurs
    this.displayCoreAllyHealth.setText('Vie du coeur allié : ' + this.CoreAlly.hp);
    this.displayCoreEnnemyHealth.setText('Vie du coeur ennemi : ' + this.CoreEnnemy.hp);

    // Mettre à jour le texte du cooldown de l'IA et du joueur
    this.displayAiTurretCooldown.setText('Cooldown IA : ' + (this.aiCooldown > 0 ? Math.round(this.aiCooldown / 60) : 0) + 's');
    this.displayUserTurretCooldown.setText('Cooldown joueur : ' + (this.userCooldown > 0 ? Math.round(this.userCooldown / 60) : 0) + 's');

    // Dessine le tracé de la trajectoire
    this.graphics.lineStyle(2, 0x00ff00, 1);
    for (let i = 1; i < this.trajectoryPoints.length; i++) {
      const startPoint = this.trajectoryPoints[i - 1];
      const endPoint = this.trajectoryPoints[i];
      this.graphics.lineBetween(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
    }

    if (this.aiCooldown <= 0) {
      this.aiCooldown = Turret.TURRET_DEFAULT_COOLDOWN;
      this.aiPlayerEnemy.doStuff(this.bulletService, this.turrets, this.cellSize, this.CoreAlly, this.physics, this.corePhysic, this.corePhysicEnnemy, this.handleBulletCollision, this);
    }
    
    this.aiCooldown--;
    this.userCooldown--;
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

  generateTurret(x: number, y: number, sprite: string = 'tourelle', isEnemy: boolean = false) {
    let turret = new Turret(10, x, y, isEnemy);
    const graphics = this.add.graphics();
    graphics.setAlpha(0.7);
    graphics.fillStyle(0xf4f4f4);
    graphics.fillRect(x - 25, y - 25, this.cellSize, this.cellSize);
    let turretPhysic = this.physics.add.sprite(turret.x, turret.y, sprite);
    turretPhysic.body.allowGravity = false;
    turretPhysic.body.immovable = true;
    turretPhysic.setDepth(1);

    this.turrets.push(turret);
  }

  private handleBulletCollision(core: Phaser.GameObjects.GameObject, bullet: Phaser.GameObjects.GameObject) {
    let selectedCore = core['name'] === 'coreAlly' ? this.CoreAlly : this.CoreEnnemy;
    console.log('Collision entre la balle et le cœur - ' + core['name']);
    selectedCore.reduceHP(2);
    console.log(selectedCore)

    if (selectedCore.hp <= 0) {
      this.scene.start('GameOverScene');
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

          let basePhysics = this.physics.add.sprite(x + 25, y + 25, 'dirt');
          basePhysics.body.allowGravity = false;
          basePhysics.body.immovable = true;


          let graphics = this.add.graphics();
          graphics.setAlpha(0.2);
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
  height: 720,
  scene: [MenuScene, MyScene, GameOverScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 } // Définit la gravité vers le bas (y positif)
    }
  }
};

export const game = new Phaser.Game(config);