const $d = require('./../kingDOM/kingDOM');
const View = require('./snake-view');

$d(() => {
  const rootEl = $d('.grid');
  $d(".start").on("click", () => {
    $d(".grid").removeClass("hide");
    $d(".score").html("0");
    new View(rootEl);
  });
});
