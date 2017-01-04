const Board = require('./board.js');
const $d = require('../kingDOM/kingDOM');

class View {
  constructor($el){
    this.$el = $el;
    this.board = new Board(20);
    this.setupGrid();
    this.intervalId = window.setInterval(this.step.bind(this),View.STEP_MILLIS);
    $d(window).on("keydown", this.handleKeyEvent.bind(this));
  }

  handleKeyEvent(event){
    if (View.KEYS[event.keyCode]) {
      this.board.snake.turn(View.KEYS[event.keyCode]);
    }
  }

  render() {
    this.updateClasses(this.board.snake.segments, "snake");
    this.updateClasses([this.board.apple.position], "apple");
    $d(".score").html(this.board.snake.score);
  }

  updateClasses(coords, className){
    $d(`.${className}`).removeClass(className);
    let i = 1;
    coords.forEach((coord) => {
      let flat = (coord.x * this.board.dim) + coord.y;
      if (this.$li) {
        this.$li.eq(flat).addClass(className);
      }

      if (i === coords.length && className === "snake"){

        this.removeHeadStyle();

        switch(this.board.snake.dir) {
          case "N":
            this.$li.eq(flat).addClass("north");
            break;
          case "E":
            this.$li.eq(flat).addClass("east");
            break;
          case "S":
            this.$li.eq(flat).addClass("south");
            break;
          case "W":
            this.$li.eq(flat).addClass("west");
            break;
        }
        this.$li.eq(flat).addClass("head");
      }

      i++;
    });
  }

  removeHeadStyle() {
    this.$li.removeClass("head");
    this.$li.removeClass("north");
    this.$li.removeClass("east");
    this.$li.removeClass("south");
    this.$li.removeClass("west");
  }

  setupGrid() {
    let html = "";

    for (let i = 0; i < this.board.dim; i++){
      html += "<ul>";
      for (let j = 0; j < this.board.dim; j++){
        html += "<li></li>";
      }
      html += "</ul>";
    }

    this.$el.html(html);
    this.$li = $d('li');
  }

  step() {
    if (this.board.snake.segments.length > 0) {
      this.board.snake.move();
      this.render();
    } else {
      alert("You lost!");
      window.clearInterval(this.intervalId);
    }
  }
}

View.KEYS = {
  38: "N",
  39: "E",
  40: "S",
  37: "W"
};

View.STEP_MILLIS = 250;

module.exports = View;
