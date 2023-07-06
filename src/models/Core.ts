export class Core {
    public hp: number;
    public x: number;
    public y: number;
    
    constructor(hp:number,x:number,y:number){
        this.hp = hp;
        this.x = x;
        this.y = y;
    }

    reduceHP(hp:number){
        this.hp -= hp
    }
}