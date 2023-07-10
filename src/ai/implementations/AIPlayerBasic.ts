import { Cell } from "../../models/Cell";
import { Core } from "../../models/Core";
import { Turret } from "../../models/Turret";
import { BulletService } from "../../services/bulletService";
import { TurretService } from "../../services/turretService";
import { WallService } from "../../services/wallService";
import { AIPlayer } from "../interfaces/AIPlayer";

export class AIPlayerBasic implements AIPlayer {
    private goodShot: Array<{x: number, y:number}> = [];
  doStuff(
    bulletService: BulletService,
    turrets: Array<Turret>,
    cellSize: number,
    enemyCore: Core,
    physics: Phaser.Physics.Arcade.ArcadePhysics,
    corePhysic: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    corePhysicEnnemy: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    handleBulletCollision: any,
    scene: Phaser.Scene,
    wallService: WallService,
    grid: Array<Cell[]>,
    turretService: TurretService
  ): void {
    // générer un nombre aléatoire entre 0 et 2
    let action = Math.floor(Math.random() * 3);

    // vérifier si toutes les cellules sont occupées
    let allCellsOccupied = true;
    grid.forEach((row) => {
      row.forEach((cell) => {
        if (cell['isEmpty']) {
          allCellsOccupied = false;
        }
      });
    });

    // si oui, on peux seulement tirer
    if (allCellsOccupied) {
      action = 0;
    }

    console.log(action);

    switch (action) {
      case 0:
        this.shotTurret(turrets, bulletService, cellSize, enemyCore, physics, corePhysic, corePhysicEnnemy, handleBulletCollision, scene, wallService);
        break;
      case 1:
        this.buildWall(wallService, grid);
        break;
      case 2:
        this.buildTurret(turretService, scene, grid);
        break;
    }
  }

  private shotTurret(turrets: Array<Turret>, bulletService: BulletService, cellSize: number, enemyCore: Core, physics: Phaser.Physics.Arcade.ArcadePhysics, corePhysic: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, corePhysicEnnemy: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, handleBulletCollision: any, scene: Phaser.Scene, wallService: WallService) {
    let isSended = false;
    // mélanger la liste des tourelles
    turrets = turrets.sort(() => Math.random() - 0.5);
    turrets.forEach((turret) => {
      if (!turret.isEnemy || isSended) {
        return;
      }

      let hasGoodShot = this.goodShot.length > 0;

      let positionX =turret.x + Math.floor(Math.random() * (cellSize / 2));
      let positionY = turret.y + Math.floor(Math.random() * cellSize);


      if (hasGoodShot) {
        let goodShot = this.goodShot[0];
        positionX = goodShot.x;
        positionY = goodShot.y;
      }



      bulletService.generateBullet(turret, positionX, positionY, true);
      bulletService.addCollision(physics, corePhysic, corePhysicEnnemy, handleBulletCollision, scene, wallService);  
      
    });
  }

  private buildWall(wallService: WallService, grid: Array<Cell[]>) {
    // Récupérer une position aléatoire dans la grille
    let gridX = Math.floor(Math.random() * grid.length);
    let gridY = Math.floor(Math.random() * grid[0].length);

    let cell = grid[gridX][gridY];

    // Vérifier si la position est déjà occupée
    while (!cell['isEmpty']) {
      gridX = Math.floor(Math.random() * grid.length);
      gridY = Math.floor(Math.random() * grid[0].length);
    }

    wallService.generateWall(cell['x'] + 25, cell['y'] + 25);
    cell.updateIsEmpty(false);
  }

  private buildTurret(turretService: TurretService, scene: Phaser.Scene, grid: Array<Cell[]>) {
    // Récupérer une position aléatoire dans la grille toto
    let gridX = Math.floor(Math.random() * grid.length);
    let gridY = Math.floor(Math.random() * grid[0].length);

    let cell = grid[gridX][gridY];

    // Vérifier si la position est déjà occupée
    while (!cell['isEmpty']) {
      gridX = Math.floor(Math.random() * grid.length);
      gridY = Math.floor(Math.random() * grid[0].length);
    }

    turretService.generateTurret(cell['x'] + 25, cell['y'] + 25, 'tourelle_reversed', true, scene);
    cell.updateIsEmpty(false);
  }
}
