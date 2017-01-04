const $d = require('./../kingDOM/kingDOM');
const View = require('./snake-view');

$d(() => {
  const rootEl = $d('.grid');
  new View(rootEl);
});
