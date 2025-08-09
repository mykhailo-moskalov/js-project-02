window.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('[data-mobile-menu]');
  const openBtn = document.querySelector('[data-mobile-menu-open]');
  const closeBtn = document.querySelector('[data-mobile-menu-close]');
  const links = document.querySelectorAll('.mobile-menu__link');
  const body = document.body;

  if (!menu || !openBtn) return;

  const SPRITE = openBtn.dataset.sprite || '/img/sprite.svg';
  const ICON_CLOSED = openBtn.dataset.iconClosed || 'menu';
  const ICON_OPEN = openBtn.dataset.iconOpen || 'x';

  const setBtnIcon = (id) => {
    const use = openBtn.querySelector('use');
    if (use) use.setAttribute('href', `${SPRITE}#${id}`);
  };

  const open = () => {
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    openBtn.setAttribute('aria-expanded', 'true');
    body.classList.add('no-scroll');
    setBtnIcon(ICON_OPEN);
    openBtn.setAttribute('aria-label', 'Закрити меню');
  };

  const close = () => {
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    openBtn.setAttribute('aria-expanded', 'false');
    body.classList.remove('no-scroll');
    setBtnIcon(ICON_CLOSED);
    openBtn.setAttribute('aria-label', 'Відкрити меню');
  };

  openBtn.addEventListener('click', () => {
    const expanded = openBtn.getAttribute('aria-expanded') === 'true';
    expanded ? close() : open();
  });

  if (closeBtn) closeBtn.addEventListener('click', close);
  links.forEach(a => a.addEventListener('click', close));
  window.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
});
