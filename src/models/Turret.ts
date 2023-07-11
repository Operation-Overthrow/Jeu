export class Turret {
    static readonly TURRET_DEFAULT_COOLDOWN = 6; // 6 secondes
    static readonly TURRET_VELOCITY = 20;
    static readonly TURRET_DEFAULT_HP = 2;
    static readonly TURRET_DEFAULT_DAMAGE = 1;


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

    decreaseHealth(damage: number) {
        this.hp -= damage;
    }
}