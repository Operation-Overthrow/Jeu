export class Turret {
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