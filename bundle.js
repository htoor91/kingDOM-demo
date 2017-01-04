/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const $d = __webpack_require__(1);
	const View = __webpack_require__(3);
	
	$d(() => {
	  const rootEl = $d('.grid');
	  new View(rootEl);
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const DOMNodeCollection = __webpack_require__(2);
	
	const functionQueue = [];
	let docReady = false;
	
	window.$d = $d;
	
	document.addEventListener('DOMContentLoaded', () => {
	  docReady = true;
	  functionQueue.forEach((fn) => {
	    fn();
	  });
	});
	
	function $d(selector) {
	  if (typeof selector === 'string') {
	    return getNodesFromDOM(selector);
	  } else if (selector instanceof HTMLElement || selector === window) {
	    return new DOMNodeCollection([selector]);
	  } else if (typeof selector === 'function') {
	    return documentReadyCallback(selector);
	  }
	}
	
	$d.extend = function(...args) {
	  let merged = args[0];
	  args.slice(1).forEach((obj) => {
	    Object.keys(obj).forEach((key) => {
	      merged[key] = obj[key];
	    });
	  });
	
	  return merged;
	};
	
	$d.ajax = function (options) {
	  return new Promise((resolve, reject) => {
	    const defaults = {
	      type: 'GET',
	      url: document.URL,
	      success: () => {},
	      error: () => {},
	      data: {},
	      contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
	    };
	
	    const xhr = new XMLHttpRequest();
	    options = $d.extend(defaults, options);
	    options.type = options.type.toUpperCase();
	    xhr.open(options.type, options.url, true);
	
	    xhr.onload = (e) => {
	      const response = JSON.parse(xhr.response);
	
	      if (xhr.status === 200) {
	        options.success(response);
	        resolve(response);
	      } else {
	        options.error(response);
	        reject(response);
	      }
	    };
	
	    xhr.send(options.data);
	  });
	};
	
	// helper methods
	
	function getNodesFromDOM(selector) {
	  const nodes = document.querySelectorAll(selector);
	  const nodesArr = Array.from(nodes);
	  return new DOMNodeCollection(nodesArr);
	}
	
	function documentReadyCallback(fn) {
	  if (docReady) {
	    fn();
	  } else {
	    functionQueue.push(fn);
	  }
	}
	
	module.exports = $d;


/***/ },
/* 2 */
/***/ function(module, exports) {

	class DOMNodeCollection {
	  constructor(nodes){
	    this.nodes = nodes;
	  }
	
	  each(cb) {
	    this.nodes.forEach(cb);
	  }
	
	  html(newHtml) {
	    if (newHtml) {
	      this.each((node) => {
	        node.innerHTML = newHtml;
	      });
	      return this.nodes;
	    } else {
	      return this.nodes[0].innerHTML;
	    }
	  }
	
	  empty() {
	    this.each((node) => {
	      node.innerHTML = "";
	    });
	
	    return this.nodes;
	  }
	
	  append(arg) {
	    if (this.nodes.length === 0) return;
	
	    if (typeof arg === "string") {
	      this.each((node) => {
	        node.innerHTML += arg;
	      });
	    } else if (arg instanceof DOMNodeCollection) {
	      this.each((parent) => {
	        arg.each((child) => {
	          parent.appendChild(child);
	        });
	      });
	    }
	    return this.nodes;
	  }
	
	  attr(attribute, value) {
	    if (typeof value === "string") {
	      this.each((node) => {
	        node.setAttribute(attribute, value);
	      });
	      return this.nodes;
	    } else {
	      return this.nodes[0].getAttribute(attribute);
	    }
	  }
	
	  addClass(className) {
	    const classNames = className.split(' ');
	
	    this.each((node) => {
	      classNames.forEach((name) => {
	        node.classList.add(name);
	      });
	    });
	
	    return this.nodes;
	  }
	
	  removeClass(className) {
	
	    this.each((node) => {
	      node.classList.remove(className);
	    });
	
	    return this.nodes;
	  }
	
	  children() {
	    const childrenArr = [];
	
	    this.each((node) => {
	      childrenArr.push(node.children);
	    });
	
	    return new DOMNodeCollection(childrenArr);
	  }
	
	  parent() {
	    const parents = [];
	
	    this.each((node) => {
	      parents.push(node.parentNode);
	    });
	
	    return new DOMNodeCollection(parents);
	  }
	
	  find(selector) {
	    const found = [];
	
	    this.each((node) => {
	      found.push(node.querySelectorAll(selector));
	    });
	
	    return new DOMNodeCollection(found);
	  }
	
	  remove() {
	    this.each((node) => {
	      node.remove();
	    });
	  }
	
	  eq(idx) {
	    return new DOMNodeCollection([this.nodes[idx]]);
	  }
	
	  on(action, cb) {
	    this.each((node) => {
	      node.addEventListener(action, cb);
	      node.eventCallback = cb;
	    });
	  }
	
	  off(action) {
	    this.each((node) => {
	      const cb = node.eventCallback;
	      node.removeEventListener(action, cb);
	    });
	  }
	
	}
	
	module.exports = DOMNodeCollection;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const Board = __webpack_require__(4);
	const $d = __webpack_require__(1);
	
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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const Snake = __webpack_require__(5);
	const Apple = __webpack_require__(7);
	
	class Board {
	  constructor(dim) {
	    this.dim = dim;
	    this.snake = new Snake(this);
	    this.apple = new Apple(this);
	  }
	
	  static blankGrid(dim) {
	    const grid = [];
	
	    for (let i = 0; i < dim; i++) {
	      const row = [];
	      for (let j = 0; j < dim; j++) {
	        row.push(Board.BLANK_SYMBOL);
	      }
	      grid.push(row);
	    }
	
	    return grid;
	  }
	
	  render() {
	    const grid = Board.blankGrid(this.dim);
	
	    this.snake.segments.forEach((segment) => {
	      grid[segment.x][segment.y] = Snake.SYMBOL;
	    });
	
	    grid[this.apple.position.x][this.apple.position.y] = Apple.SYMBOL;
	
	    grid.map((row) => {
	      row.join("");
	    }).join("\n");
	  }
	
	  validPosition(coord){
	    return (coord.x >= 0) && (coord.x < this.dim) && (coord.y >= 0) && (coord.y < this.dim);
	  }
	}
	
	Board.BLANK_SYMBOL = '.';
	
	module.exports = Board;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Coord = __webpack_require__(6);
	
	class Snake {
	  constructor(board) {
	    this.dir = "N";
	    this.turning = false;
	    this.board = board;
	    this.score = 0;
	
	    const center = new Coord(Math.floor(board.dim/2), Math.floor(board.dim/2));
	    this.segments = [center];
	
	    this.growTurns = 0;
	  }
	
	  eatApple() {
	    if (this.head().equals(this.board.apple.position)) {
	      this.growTurns += 3;
	      return true;
	    } else {
	      return false;
	    }
	  }
	
	  isOccupying(arr) {
	    let result = false;
	    this.segments.forEach((segment) => {
	      if (segment.x === arr[0] && segment.y === arr[1]) {
	        result = true;
	        return result;
	      }
	    });
	    return result;
	  }
	
	  head() {
	    return this.segments.slice(-1)[0];
	  }
	
	  isValid() {
	    const head = this.head();
	
	    if (!this.board.validPosition(this.head())) {
	      return false;
	    }
	
	    for (let i = 0; i < this.segments.length - 1; i++) {
	      if (this.segments[i].equals(head)) {
	        return false;
	      }
	    }
	
	    return true;
	  }
	
	  move() {
	    this.segments.push(this.head().plus(Snake.DIFFS[this.dir]));
	
	    this.turning = false;
	
	    if (this.eatApple()) {
	      this.score += 10;
	      this.board.apple.replace();
	    }
	
	    if (this.growTurns > 0) {
	      this.growTurns -= 1;
	    } else {
	      this.segments.shift();
	    }
	
	    if (!this.isValid()) {
	      this.segments = [];
	    }
	  }
	
	  turn(dir) {
	    if (Snake.DIFFS[this.dir].isOpposite(Snake.DIFFS[dir]) || this.turning) {
	      return;
	    } else {
	      this.turning = true;
	      this.dir = dir;
	    }
	  }
	}
	
	Snake.DIFFS = {
	  "N": new Coord(-1, 0),
	  "E": new Coord(0, 1),
	  "S": new Coord(1, 0),
	  "W": new Coord(0, -1)
	};
	
	Snake.SYMBOL = "S";
	Snake.GROW_TURNS = 3;
	
	module.exports = Snake;


/***/ },
/* 6 */
/***/ function(module, exports) {

	class Coord {
	  constructor(x, y) {
	    this.x = x;
	    this.y = y;
	  }
	
	  plus(coord2) {
	    return new Coord(this.x + coord2.x, this.y + coord2.y);
	  }
	
	  equals(coord2) {
	    return (this.x === coord2.x && this.y === coord2.y);
	  }
	
	  isOpposite(coord2) {
	    return (this.x === -coord2.x) && (this.y === -coord2.y);
	  }
	}
	
	module.exports = Coord;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const Coord = __webpack_require__(6);
	
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map