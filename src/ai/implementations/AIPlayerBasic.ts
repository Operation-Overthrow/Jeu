import { Core } from "../../models/Core";
import { Turret } from "../../models/Turret";
import { BulletService } from "../../services/bulletService";
import { AIPlayer } from "../interfaces/AIPlayer";

export class AIPlayerBasic implements AIPlayer {
    private blackList: Array<{x: number, y:number}> = [];
  doStuff(
    bulletService: BulletService,
    turrets: Array<Turret>,
    cellSize: number,
    enemyCore: Core,
    physics: Phaser.Physics.Arcade.ArcadePhysics,
    corePhysic: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    corePhysicEnnemy: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    handleBulletCollision: any,
    scene: Phaser.Scene
  ): void {
    turrets.forEach((turret) => {
      if (!turret.isEnemy) {
        return;
      }

      let isBlackListed = true;

      let positionX = 0;
      let positionY = 0;

      while(isBlackListed) {
        positionX = turret.x + Math.floor(Math.random() * (cellSize / 2));
        positionY = turret.y + Math.floor(Math.random() * cellSize);

        // vérifier si la position est blacklistée
        isBlackListed = this.blackList.some((blackListedPosition) => {
            return blackListedPosition.x === positionX && blackListedPosition.y === positionY;
        });
      }

      bulletService.generateBullet(turret, positionX, positionY);
      bulletService.addCollision(physics, corePhysic, corePhysicEnnemy, handleBulletCollision, scene);  
      // save the current position and current ally core hp
        let currentCoreHp = enemyCore.hp;
        let currentTurretPosition = {
            x: positionX,
            y: positionY
        };

        console.log(this.blackList);
      

        // Vérifier si le core ennemi a perdu de la vie après 5 secondes
        setTimeout(() => {
            if(enemyCore.hp === currentCoreHp) {
                // si le core ennemi n'a pas perdu de vie, on blacklist la position de la tourelle
                this.blackList.push(currentTurretPosition);
            }
        }, 4000);
    });
  }
}
