import 'phaser';
import { Bullet } from "../models/Bullet";
import { Turret } from "../models/Turret";
import { WallService } from './wallService';
import { game } from '../main';


export class BulletService {
    bulletsGroup: Phaser.Physics.Arcade.Group;

    constructor(physics: Phaser.Physics.Arcade.ArcadePhysics) {
        this.bulletsGroup = physics.add.group();

    }

    public generateBullet(turret: Turret, pointerX: number, pointerY: number) {
        let bullet = new Bullet(turret.x, turret.y, 300);
        let bulletPhysic = this.bulletsGroup.create(bullet.x, bullet.y, 'bullet');
    
        // calculer la vélocité de la balle en fonction de la position de la souris par rapport au centre du cercle
        const xPosition = Math.abs(turret.x - pointerX);
        const yPosition = turret.y - pointerY;

    
        const normalizedVelocity = new Phaser.Math.Vector2(xPosition, yPosition).normalize().scale(400);

        bulletPhysic.setVelocity(normalizedVelocity.x, -normalizedVelocity.y);

        game.sound.play('tir');
      }


      public addCollision(physics: Phaser.Physics.Arcade.ArcadePhysics, corePhysic: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, corePhysicEnnemy: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, handleBulletCollision: any, phaserScene: Phaser.Scene, wallService: WallService) {
        physics.add.collider(corePhysic, this.bulletsGroup, handleBulletCollision, undefined, phaserScene);
        physics.add.collider(corePhysicEnnemy, this.bulletsGroup, handleBulletCollision, undefined, phaserScene);
        wallService.addCollision(phaserScene, this.bulletsGroup);
      }
}