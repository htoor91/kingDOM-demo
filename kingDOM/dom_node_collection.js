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
