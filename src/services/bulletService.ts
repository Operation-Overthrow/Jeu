import 'phaser';
import { Bullet } from "../models/Bullet";
import { Turret } from "../models/Turret";


export class BulletService {
    bulletsGroup: Phaser.Physics.Arcade.Group;

    constructor(physics: Phaser.Physics.Arcade.ArcadePhysics) {
        this.bulletsGroup = physics.add.group();

    }

    public generateBullet(turret: Turret, pointerX: number, pointerY: number) {
        let bullet = new Bullet(turret.x, turret.y, 300);
        let bulletPhysic = this.bulletsGroup.create(bullet.x, bullet.y, 'bullet');
    
        // calculer la vélocité de la balle en fonction de la position de la souris par rapport au centre du cercle
        const xPosition =  turret.x - pointerX;
        const yPosition =  turret.y - pointerY;
    
        bulletPhysic.setVelocity(xPosition * 20, yPosition * 20);
      }

      public addCollision(physics: Phaser.Physics.Arcade.ArcadePhysics, corePhysic: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, corePhysicEnnemy: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, handleBulletCollision: any, phaserScene: Phaser.Scene) {
        physics.add.collider(corePhysic, this.bulletsGroup, handleBulletCollision, undefined, phaserScene);
        physics.add.collider(corePhysicEnnemy, this.bulletsGroup, handleBulletCollision, undefined, phaserScene);
      }
}