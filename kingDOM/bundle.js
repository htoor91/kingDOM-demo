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

	const DOMNodeCollection = __webpack_require__(1);
	
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
	  } else if (selector instanceof HTMLElement) {
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


/***/ },
/* 1 */
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
	    const classNames = className.split(' ');
	
	    this.each((node) => {
	      classNames.forEach((name) => {
	        node.classList.remove(name);
	      });
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map