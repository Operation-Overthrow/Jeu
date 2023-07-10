import 'phaser';
import { Bullet } from "../models/Bullet";
import { Turret } from "../models/Turret";
import { WallService } from './wallService';
import { game } from '../main';
import { TurretService } from './turretService';


export class BulletService {
    bulletsGroup: Phaser.Physics.Arcade.Group;
    turretService: TurretService;

    constructor(physics: Phaser.Physics.Arcade.ArcadePhysics, turretService: TurretService, scene: Phaser.Scene) {
        this.bulletsGroup = physics.add.group();
        this.turretService = turretService;
        
        let localBulletsPhysics = this.bulletsGroup;
        scene.time.addEvent({
          loop: true,
          delay: 1000, // Vérifie toutes les secondes (ajuste la valeur selon tes besoins)
          callback: function() {
            localBulletsPhysics.getChildren().forEach(function(bullet) {
              if (!Phaser.Geom.Rectangle.Overlaps(bullet.getBounds(), scene.cameras.main.worldView)) {
                // L'objet est hors de l'écran, donc on le détruit
                bullet.destroy();
                localBulletsPhysics.remove(bullet);
              }
            }, this);
          },
          callbackScope: this
        });

    }

    public generateBullet(turret: Turret, pointerX: number, pointerY: number, isEnemy: boolean = false) {
        let bullet = new Bullet(turret.x, turret.y, 300);
        let bulletPhysic = this.bulletsGroup.create(bullet.x, bullet.y, 'bullet');
    
        // calculer la vélocité de la balle en fonction de la position de la souris par rapport au centre du cercle
        let xPosition = Math.abs(turret.x - pointerX);
        const yPosition = turret.y - pointerY;

    
        const normalizedVelocity = new Phaser.Math.Vector2(xPosition, yPosition).normalize().scale(400);

        if(isEnemy) {
          xPosition = turret.x - pointerX;
          
          bulletPhysic.setVelocity(xPosition * Turret.TURRET_VELOCITY, yPosition * Turret.TURRET_VELOCITY);
        } else {
        bulletPhysic.setVelocity(normalizedVelocity.x, -normalizedVelocity.y);
        }

        game.sound.play('tir');
      }


      public addCollision(physics: Phaser.Physics.Arcade.ArcadePhysics, corePhysic: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, corePhysicEnnemy: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, handleBulletCollision: any, phaserScene: Phaser.Scene, wallService: WallService) {
        physics.add.collider(corePhysic, this.bulletsGroup, handleBulletCollision, undefined, phaserScene);
        physics.add.collider(corePhysicEnnemy, this.bulletsGroup, handleBulletCollision, undefined, phaserScene);
        wallService.addCollision(phaserScene, this.bulletsGroup);
        this.turretService.addCollision(phaserScene, this.bulletsGroup);
      }
}