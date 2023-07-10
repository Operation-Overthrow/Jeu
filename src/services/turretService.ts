import { Cell } from "../models/Cell";
import { Turret } from "../models/Turret";

export class TurretService {
    turrets: Array<Turret>;
    physics: Phaser.Physics.Arcade.ArcadePhysics;
    turretsPhysics: Phaser.Physics.Arcade.Group;

    constructor(physics: Phaser.Physics.Arcade.ArcadePhysics) {
        this.turrets = [];
        this.physics = physics;
        this.turretsPhysics = this.physics.add.group();
    }

    
  addCollision(phaserScene: Phaser.Scene, bulletsGroup: Phaser.Physics.Arcade.Group) {
    this.physics.add.collider(this.turretsPhysics, bulletsGroup, this.handleTurretsCollision, undefined, phaserScene);
  }
    
  public handleTurretsCollision(turretPhysic: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, bullet: Phaser.GameObjects.GameObject) {
        let selectedTurret: Turret|null = null;

        this.turretService.turrets.forEach((turret: Turret) => {
            if (turret.x === turretPhysic.x && turret.y === turretPhysic.y) {
                selectedTurret = turret;
            }
        });
        console.log(selectedTurret);

        if (selectedTurret !== null) {
            selectedTurret.decreaseHealth(Turret.TURRET_DEFAULT_DAMAGE);

            if (selectedTurret['hp'] <= 0) {
                this.turretService.destroyTurret(selectedTurret['x'], selectedTurret['y']);

                this.gridAlly.forEach((row: Array<Cell>) => {
                    row.forEach((cell: Cell) => {
                        if (cell.x === selectedTurret['x'] - 25 && cell.y === selectedTurret['y'] - 25) {
                            cell.updateIsEmpty(true);
                        }
                    });
                });

                this.gridEnemy.forEach((row: Array<Cell>) => {
                    row.forEach((cell: Cell) => {
                        if (cell.x === selectedTurret['x'] - 25 && cell.y === selectedTurret['y'] - 25) {
                            cell.updateIsEmpty(true);
                        }
                    });
                });
            }
        }
        
        bullet.destroy();
    }

    
  generateTurret(x: number, y: number, sprite: string = 'tourelle', isEnemy: boolean = false, scene: Phaser.Scene) {
    let turret = new Turret(Turret.TURRET_DEFAULT_HP, x, y, isEnemy);
    let turretPhysic = scene.physics.add.sprite(turret.x, turret.y, sprite);
    turretPhysic.setImmovable(true);
    turretPhysic.setCollideWorldBounds(true);
    turretPhysic.body.allowGravity = false;
    turretPhysic.body.moves = false;

    this.turrets.push(turret);
    

    this.turretsPhysics.add(turretPhysic);
  }

  public destroyTurret(turretCenterX: number, turretCenterY: number) {
    this.turrets.forEach((turret, index) => {
        if (turret.x === turretCenterX && turret.y === turretCenterY) {
            this.turrets.splice(index, 1);
            // remove physic from group
            this.turretsPhysics.getChildren().forEach((turretPhysic) => {
                if (turretPhysic.x === turretCenterX && turretPhysic.y === turretCenterY) {
                    turretPhysic.destroy();
                }
            });
        }
    });
}
}