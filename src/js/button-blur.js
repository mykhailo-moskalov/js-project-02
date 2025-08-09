const buttons = document.querySelectorAll('button');
const links = document.querySelectorAll('a');

const events = [
  'click',
  'mousedown',
  'mouseleave',
  'mouseup',
  'mouseleave',
  'touchstart',
  'touchmove',
  'touchend',
  'touchcancel',
];

events.forEach(event => {
  buttons.forEach(b => {
    b.addEventListener(event, () => {
      b.blur();
    });
  });

  links.forEach(l => {
    l.addEventListener(event, () => {
      l.blur();
    });
  });
});
