import { Core } from "../../models/Core";
import { Turret } from "../../models/Turret";
import { BulletService } from "../../services/bulletService";

export interface AIPlayer {

    doStuff(bulletService: BulletService, turrets: Array<Turret>, cellSize: number, enemyCore: Core): void;
}