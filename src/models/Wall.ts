export class Wall {
  static readonly DEFAULT_WALL_HP = 4;

  public hp;
  public x;
  public y;

  constructor(x: number, y: number, hp: number = Wall.DEFAULT_WALL_HP) {
    this.x = x;
    this.y = y;
    this.hp = hp;
  }

  decreaseHealth(damage: number) {
      this.hp -= damage;
  }
}
