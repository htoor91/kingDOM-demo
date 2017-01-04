const DOMNodeCollection = require('./dom_node_collection.js');

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
