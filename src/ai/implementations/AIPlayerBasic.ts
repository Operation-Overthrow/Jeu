import { Core } from "../../models/Core";
import { Turret } from "../../models/Turret";
import { BulletService } from "../../services/bulletService";
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
    wallService: WallService
  ): void {
    turrets.forEach((turret) => {
      if (!turret.isEnemy) {
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
      // save the current position and current ally core hp
        let currentCoreHp = enemyCore.hp;
        let currentTurretPosition = {
            x: positionX,
            y: positionY
        };
      
        // Vérifier si le core ennemi a perdu de la vie après 5 secondes
        setTimeout(() => {
            if(enemyCore.hp !== currentCoreHp) {
              // si oui, on ajoute la position de la tourelle à la liste des bonnes positions en vérifiant qu'elle n'y est pas déjà
              if(!this.goodShot.some((shot) => shot.x === currentTurretPosition.x && shot.y === currentTurretPosition.y)) {
                this.goodShot.push(currentTurretPosition);
              }
            }
        }, 4000);
    });
  }
}
