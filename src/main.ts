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
import { WallService } from './services/wallService';
import { HowToScene } from './scenes/howto';
import { TurretService } from './services/turretService';



export class MyScene extends Phaser.Scene {
  private gridSize = 8;
  private cellSize = 50;
  private gridAlly: Array<Cell[]> = [];
  private gridEnemy: Array<Cell[]> = [];
  private CoreAlly: Core = new Core(Core.CORE_DEFAULT_HP, 275, 375);
  private CoreEnnemy: Core = new Core(Core.CORE_DEFAULT_HP, 1075, 375);
  private graphics!: Phaser.GameObjects.Graphics;
  private circle!: Phaser.GameObjects.Arc & { body: Phaser.Physics.Arcade.Body };
  private trajectoryPoints: Phaser.Math.Vector2[] = [];
  private corePhysic!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private corePhysicEnnemy!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private turretIsSelected: Array<Turret> = [];
  private aiEnemy!: AIBase;
  private aiPlayerEnemy!: AIPlayer;
  private aiCooldown: number = Turret.TURRET_DEFAULT_COOLDOWN;
  private userCooldown: number = Turret.TURRET_DEFAULT_COOLDOWN;
  private bulletService!: BulletService;
  private displayCoreAllyHealth!: Phaser.GameObjects.Text;
  private displayCoreEnnemyHealth!: Phaser.GameObjects.Text;
  private displayAiTurretCooldown!: Phaser.GameObjects.Text;
  private displayUserTurretCooldown!: Phaser.GameObjects.Text;
  private wallService!: WallService;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyT!: Phaser.Input.Keyboard.Key;
  private isPointerInsideSector: boolean = false;
  private music!: Phaser.Sound.HTML5AudioSound|Phaser.Sound.WebAudioSound|Phaser.Sound.NoAudioSound;
  private turretService!: TurretService;

  constructor() {
    super('my-scene');
  }

  preload() {
    this.load.image('background', 'assets/background.jpg');
    this.load.image('bullet', 'assets/test.png');
    this.load.image('core', 'assets/reactor1.png');
    this.load.image('tourelle', 'assets/tourelle1.png');
    this.load.image('tourelle_reversed', 'assets/tourelle_reversed1.png');
    this.load.image('dirt', 'assets/dirt1.png');
    this.load.image('wall', 'assets/brick1.png');
    this.load.audio('tir', 'assets/tir.mp3');
    this.load.audio('audio_background', 'assets/audio-background.mp3');
    this.load.audio('explosion', 'assets/explosion.mp3');
    this.load.audio('gameover', 'assets/gameover.mp3');
  }

  create() {
    localStorage.removeItem('score');

    this.add.image(1500 / 2, 720 / 2, 'background');
    // vider la scène, et la tourelle
    this.turretService = new TurretService(this.physics);
    this.bulletService = new BulletService(this.physics, this.turretService, this);
    this.wallService = new WallService(this.physics);
    this.trajectoryPoints = [];
    this.CoreAlly.hp = Core.CORE_DEFAULT_HP;
    this.CoreEnnemy.hp = Core.CORE_DEFAULT_HP;

    this.gameArea('ally', 100, 600 - this.gridSize * this.cellSize, 0xffffff);
    this.gameArea('ennemy', 900, 600 - this.gridSize * this.cellSize, 0xffffff);

    this.generateCore('coreAlly');
    this.generateCore('coreEnnemy');
    this.turretService.generateTurret(925, 275, 'tourelle_reversed', true, this);

    const updateCellIsEmpty = (turret: Turret, cell: Cell) => {
      if (turret.x === cell['x'] + 25 && turret.y === cell['y'] + 25) {
        cell.updateIsEmpty(false);
      }
    };

    this.turretService.turrets.forEach((turret) => {
      this.gridEnemy.forEach((row) => {
        row.forEach((cell) => {
          updateCellIsEmpty(turret, cell);
        });
      });
    });


    // Afficher la vie du coeur
    this.displayCoreAllyHealth = this.add.text(16, 16, 'Vie du core allié : ' + this.CoreAlly.hp, { fontSize: '32px', color: '#fff' });
    this.displayCoreEnnemyHealth = this.add.text(1000, 16, 'Vie du core ennemi : ' + this.CoreEnnemy.hp, { fontSize: '32px', color: '#fff' });
    
    // Afficher le cooldown de l'IA et du joueur
    this.displayUserTurretCooldown = this.add.text(16, 50, 'Cooldown Joueur : ' + (this.userCooldown > 0 ? Math.round(this.userCooldown / 60) : 0) + 's', { fontSize: '32px', color: '#fff' });
    this.displayAiTurretCooldown = this.add.text(1000, 50, 'Cooldown IA : ' + (this.aiCooldown > 0 ? Math.round(this.aiCooldown / 60) : 0) + 's', { fontSize: '32px', color: '#fff' });

    this.input.on('pointerdown', (pointer: PointerEvent) => {
      // Check if any turret is already selected
      if (this.turretIsSelected.length === 0) {
        if (this.userCooldown > 0) {
          return;
        }

        this.userCooldown = Turret.TURRET_DEFAULT_COOLDOWN;
        // Find the clicked turret
        const clickedTurret = this.turretService.turrets.find(turret => {
          return (
            !turret.isEnemy &&
            pointer.x >= turret.x - this.cellSize / 2 &&
            pointer.x <= turret.x + this.cellSize / 2 &&
            pointer.y >= turret.y - this.cellSize / 2 &&
            pointer.y <= turret.y + this.cellSize / 2
          );
        });

        if (clickedTurret) {
          this.turretIsSelected.push(clickedTurret);
        }
      } else {
        const selectedTurret = this.turretIsSelected[0];
        if(this.isPointerInsideSector){
          this.bulletService.generateBullet(selectedTurret, pointer.x, pointer.y);
          this.bulletService.addCollision(this.physics, this.corePhysic, this.corePhysicEnnemy, this.handleBulletCollision, this, this.wallService);
        }
        // Clear the selected turret
        this.turretIsSelected.length = 0;
      }
    });


    // Ajoute les graphiques de débogage
    this.graphics = this.add.graphics();

    // Ajout de l'IA
    this.aiEnemy = new AIBasic();
    this.aiPlayerEnemy = this.aiEnemy.createAI();

    this.keyW = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyT = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.T);

    // Ajout de la musique de fond
    this.music = this.sound.add('audio_background');
    this.music.play();
    this.music.loop = true;
    this.music.volume = 0.1;
  }

  isPointerInSector = (pointerX: number, pointerY:number, centerX: number, centerY: number) => {
    const angleStart = Phaser.Math.Angle.Between(centerX, centerY, this.trajectoryPoints[0].x, this.trajectoryPoints[0].y);
    const angleEnd = Phaser.Math.Angle.Between(centerX, centerY, this.trajectoryPoints[this.trajectoryPoints.length - 1].x, this.trajectoryPoints[this.trajectoryPoints.length - 1].y);
    const pointerAngle = Phaser.Math.Angle.Between(centerX, centerY, pointerX, pointerY);

    // Normalize angles to be between 0 and 2*PI
    const normalizedStartAngle = Phaser.Math.Wrap(angleStart, 0, Math.PI * 2);
    const normalizedEndAngle = Phaser.Math.Wrap(angleEnd, 0, Math.PI * 2);
    const normalizedPointerAngle = Phaser.Math.Wrap(pointerAngle, 0, Math.PI * 2);

    // Check if the pointer angle is between the start and end angles of the sector
    if (normalizedStartAngle < normalizedEndAngle) {
      return normalizedPointerAngle >= normalizedStartAngle && normalizedPointerAngle <= normalizedEndAngle;
    } else {
      return normalizedPointerAngle >= normalizedStartAngle || normalizedPointerAngle <= normalizedEndAngle;
    }
  };

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
    for (let i = 1; i < this.trajectoryPoints.length; i++) {
      const startPoint = this.trajectoryPoints[i - 1];
      const endPoint = this.trajectoryPoints[i];
      this.graphics.lineBetween(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
    }

    // Check if a turret is selected
    if (this.turretIsSelected.length !== 0) {
      const selectedTurret = this.turretIsSelected[0];
      const centerX = selectedTurret.x;
      const centerY = selectedTurret.y;

      // Clear the previous trajectory points
      this.trajectoryPoints = [];

      // Generate the trajectory points for the 40-degree arc
      const startAngle = -20;
      const endAngle = 20;
      const distanceFromCell = 100; // Distance to move the arc away from the cell in pixels
      for (let angle = startAngle; angle <= endAngle; angle++) {
        const angleInRadians = Phaser.Math.DegToRad(angle);
        const endPointX = centerX + Math.cos(angleInRadians) * (this.cellSize + distanceFromCell);
        const endPointY = centerY + Math.sin(angleInRadians) * (this.cellSize + distanceFromCell);
        this.trajectoryPoints.push(new Phaser.Math.Vector2(endPointX, endPointY));
      }

      // Draw the arc trajectory
      this.graphics.clear();
      this.graphics.lineStyle(2, 0xffffff, 1);
      for (let i = 1; i < this.trajectoryPoints.length; i++) {
        const startPoint = this.trajectoryPoints[i - 1];
        const endPoint = this.trajectoryPoints[i];
        this.graphics.lineBetween(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
      }

      // Draw line segments from the center of the cell to the endpoints of the arc
      const startSegmentX = centerX;
      const startSegmentY = centerY;
      const endSegmentX = this.trajectoryPoints[0].x;
      const endSegmentY = this.trajectoryPoints[0].y;

      this.graphics.lineStyle(2, 0xffffff, 1);
      this.graphics.lineBetween(startSegmentX, startSegmentY, endSegmentX, endSegmentY);

      const startSegmentX2 = centerX;
      const startSegmentY2 = centerY;
      const endSegmentX2 = this.trajectoryPoints[this.trajectoryPoints.length - 1].x;
      const endSegmentY2 = this.trajectoryPoints[this.trajectoryPoints.length - 1].y;

      this.graphics.lineBetween(startSegmentX2, startSegmentY2, endSegmentX2, endSegmentY2);

      // Draw a line segment from the center of the cell to the pointer
      const pointerX = this.input.activePointer.x;
      const pointerY = this.input.activePointer.y;



      // Check if the pointer is inside the sector
      const isPointerInsideSector = this.isPointerInSector(pointerX, pointerY, centerX, centerY);
      this.isPointerInsideSector = isPointerInsideSector;

      if (isPointerInsideSector) {
        if(pointerX <= this.trajectoryPoints[(this.trajectoryPoints.length-1)/2].x){
          this.graphics.lineBetween(centerX, centerY, pointerX, pointerY);
        }
      }
    } else {
      this.trajectoryPoints = [];
    }

    if (this.aiCooldown <= 0) {
      this.aiCooldown = Turret.TURRET_DEFAULT_COOLDOWN;
      this.aiPlayerEnemy.doStuff(this.bulletService, this.turretService.turrets, this.cellSize, this.CoreAlly, this.physics, this.corePhysic, this.corePhysicEnnemy, this.handleBulletCollision, this, this.wallService, this.gridEnemy, this.turretService);
    }

    this.aiCooldown--;
    this.userCooldown--;


    if(this.keyW !== null && this.keyW.isDown){
      let cell: Cell|null = null;

      this.gridAlly.forEach((row) => {
        row.forEach((currentCell) => {
          if (
            (this.input.mousePointer.x >= currentCell['x'] && this.input.mousePointer.x <= currentCell['x'] + this.cellSize) &&
            (this.input.mousePointer.y >= currentCell['y'] && this.input.mousePointer.y <= currentCell['y'] + this.cellSize)
          ) {
            cell = currentCell;
          }
        });
      });

      if (cell !== null && cell['isEmpty']) {
        let theCell: Cell = cell;
        this.wallService.generateWall(theCell['x'] + 25, theCell['y'] + 25);
        theCell.updateIsEmpty(false);
      }
    }

    if(this.keyT !== null && this.keyT.isDown){
      let cell: Cell|null = null;

      this.gridAlly.forEach((row) => {
        row.forEach((currentCell) => {
          if (
            (this.input.mousePointer.x >= currentCell['x'] && this.input.mousePointer.x <= currentCell['x'] + this.cellSize) &&
            (this.input.mousePointer.y >= currentCell['y'] && this.input.mousePointer.y <= currentCell['y'] + this.cellSize)
          ) {
            cell = currentCell;
          }
        });
      });

      if (cell !== null && cell['isEmpty']) {
        let theCell: Cell = cell;
        this.turretService.generateTurret(theCell['x'] + 25, theCell['y'] + 25, 'tourelle', false, this);
        theCell.updateIsEmpty(false);
      }
    }
  }


  generateCore(name: string) {
    let currentCore = name === 'coreAlly' ? this.CoreAlly : this.CoreEnnemy;
    let corePhysicLocal = this.physics.add.sprite(currentCore.x, currentCore.y, 'core');
    corePhysicLocal.setName(name);
    corePhysicLocal.body.setAllowGravity(false);
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

  private handleBulletCollision(core: Phaser.GameObjects.GameObject, bullet: Phaser.GameObjects.GameObject) {
    let selectedCore = core['name'] === 'coreAlly' ? this.CoreAlly : this.CoreEnnemy;
    selectedCore.reduceHP(Turret.TURRET_DEFAULT_DAMAGE * 2);

    if (selectedCore.hp <= 0) {
      localStorage.setItem('score', this.calculateScore().toString());

      this.music.stop();
      this.scene.start('GameOverScene');
    }

    bullet.destroy();
  }
  calculateScore() {
    const VICTORY_BONUS = 1000;
    const TURRET_BONUS = 100;
    const HP_BONUS = 100;

    let score = 0;

    if (this.CoreEnnemy.hp <= 0) {
      score += VICTORY_BONUS;
    }

    score += this.turrets.filter(turret => !turret.isEnemy).length * TURRET_BONUS;
    score += this.CoreAlly.hp * HP_BONUS;

    return score;
  }



  private gameArea(gridName: string = "ally", startX: number, startY: number, colorLine: any) {
    let gridSize = 8;
    let cellSize = 50;
    let cell;

    if (gridName === "ally") {
      this.gridAlly = [];
    } else {
      this.gridEnemy = [];
    }

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
          basePhysics.body.setAllowGravity(false);
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
      if (gridName === "ally") {
        this.gridAlly.push(row);
      } else {
        this.gridEnemy.push(row);
      }
    }
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1500,
  height: 720,
  scene: [MenuScene, MyScene, GameOverScene, HowToScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 } // Définit la gravité vers le bas (y positif)
    }
  },
};

export const game = new Phaser.Game(config);
