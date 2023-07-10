export class Turret {
    static readonly TURRET_DEFAULT_COOLDOWN = 360; // 6 secondes
    static readonly TURRET_VELOCITY = 20;


    public hp;
    public x;
    public y;
    public isEnemy;
    
    constructor(hp:number,x:number,y:number, isEnemy: boolean = false){
        this.hp = hp;
        this.x = x;
        this.y = y;
        this.isEnemy = isEnemy;
    }
}