const Coord = require("./coord");

class Apple {
  constructor(board) {
    this.board = board;
    this.replace();
  }

  replace() {
    let x = this.rand();
    let y = this.rand();

    while (this.board.snake.isOccupying([x,y])){
      x = this.rand();
      y = this.rand();
    }

    this.position = new Coord(x,y);
  }

  rand() {
    return Math.floor(Math.random() * this.board.dim);
  }
}

module.exports = Apple;
