import 'phaser';
import { Wall } from "../models/Wall";
import { Cell } from '../models/Cell';
import { Turret } from '../models/Turret';


export class WallService {
    public walls: Array<Wall> = [];
    public wallsPhysics: Phaser.Physics.Arcade.Group;
    private physics: Phaser.Physics.Arcade.ArcadePhysics;

    constructor(physics: Phaser.Physics.Arcade.ArcadePhysics) {
        this.physics = physics;
        this.wallsPhysics = this.physics.add.group();
        this.walls = [];
        
    }

    public generateWall(x: number, y: number) {
        let wall = new Wall(x, y);
        this.walls.push(wall);

        let wallPhysic = this.wallsPhysics.create(wall.x, wall.y, 'wall');
        wallPhysic.setImmovable(true);
        wallPhysic.setCollideWorldBounds(true);
        wallPhysic.body.allowGravity = false;
        wallPhysic.body.moves = false;

        this.wallsPhysics.add(wallPhysic);
    }

    public destroyWall(wallCenterX: number, wallCenterY: number) {
        this.walls.forEach((wall, index) => {
            if (wall.x === wallCenterX && wall.y === wallCenterY) {
                this.walls.splice(index, 1);
                // remove physic from group
                this.wallsPhysics.getChildren().forEach((wallPhysic) => {
                    if (wallPhysic.x === wallCenterX && wallPhysic.y === wallCenterY) {
                        wallPhysic.destroy();
                    }
                });
            }
        });
    }

    public addCollision(phaserScene: Phaser.Scene, bulletsGroup: Phaser.Physics.Arcade.Group) {
        this.physics.add.collider(this.wallsPhysics, bulletsGroup, this.handleWallCollision, undefined, phaserScene);
    }

    public handleWallCollision(wallPhysic: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, bullet: Phaser.GameObjects.GameObject) {
        let selectedWall: Wall|null = null;
        // find the corresponding wall
        
        this.wallService.getWalls().forEach((wall: Wall) => {
            if (wall.x === wallPhysic.x && wall.y === wallPhysic.y) {
                selectedWall = wall;
            }
        });

        if (selectedWall !== null) {
            selectedWall.decreaseHealth(Turret.TURRET_DEFAULT_DAMAGE);
            
            if (selectedWall['hp'] <= 0) {
                this.sound.play('explosion');
                this.wallService.destroyWall(selectedWall['x'], selectedWall['y']);

                this.gridAlly.forEach((row: Array<Cell>) => {
                    row.forEach((cell: Cell) => {
                        if (cell['x'] === selectedWall!['x'] - 25 && cell['y'] === selectedWall!['y'] - 25) {
                            cell.updateIsEmpty(true);
                        }
                    });
                });

                this.gridEnemy.forEach((row: Array<Cell>) => {
                    row.forEach((cell: Cell) => {
                        if (cell['x'] === selectedWall!['x'] - 25 && cell['y'] === selectedWall!['y'] - 25) {
                            cell.updateIsEmpty(true);
                        }
                    });
                });
            }
        }
    
        bullet.destroy();
      }
    getWalls(): Array<Wall> {
        return this.walls;
    }
    
}