export class Cell {
    private x: number;
    private y: number;
    private isEmpty: boolean;
    private color: number | undefined;

    constructor(x: number,y: number,isEmpty: boolean,color: number | undefined){
        this.x = x;
        this.y = y;
        this.isEmpty = isEmpty;
        this.color = color;
    }

    colorEmpty(){
        if(this.isEmpty === true){
            this.color = 0x00FF00;
            return;
        }
        this.color = 0xFF0000;
    }    
}