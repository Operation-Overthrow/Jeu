export class Cell {
    private x: number;
    private y: number;
    private isEmpty: boolean;
    public color: number | undefined;
    static readonly DEFAULT_CELL_SIZE: number = 50;

    constructor(x: number,y: number,isEmpty: boolean){
        this.x = x;
        this.y = y;
        this.isEmpty = isEmpty;
        this.color = undefined;
    }

    colorEmpty(){
        if(this.isEmpty === true){
            this.color = 0x00FF00;
            return;
        }
        this.color = 0xff00ff;
    }    

    updateIsEmpty(isEmpty: boolean){
        this.isEmpty = isEmpty;
    }
}