window.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('[data-mobile-menu]');
  const openBtn = document.querySelector('[data-mobile-menu-open]');
  const closeBtn = document.querySelector('[data-mobile-menu-close]');
  const links = document.querySelectorAll('.mobile-menu__link');
  const body = document.body;

  if (!menu || !openBtn) return;

  const autoSprite = new URL('img/sprite.svg', document.baseURI).pathname;
  const ds = (openBtn.dataset.sprite || '').trim();
  const SPRITE = ds && !ds.startsWith('/') ? ds : autoSprite;
  const ICON_CLOSED = (openBtn.dataset.iconClosed || 'menu').trim();
  const ICON_OPEN = (openBtn.dataset.iconOpen || 'x').trim();

  const setBtnIcon = (id) => {
    const svg = openBtn.querySelector('svg');
    if (!svg) return;
    const url = `${SPRITE}#${id}`;
    const ns = 'http://www.w3.org/2000/svg';
    const xns = 'http://www.w3.org/1999/xlink';

    const oldUse = svg.querySelector('use');
    if (oldUse) svg.removeChild(oldUse);

    const use = document.createElementNS(ns, 'use');
    try { use.setAttribute('href', url); } catch (_) {}
    try { use.setAttributeNS(xns, 'xlink:href', url); } catch (_) {}
    svg.appendChild(use);
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

  openBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const expanded = openBtn.getAttribute('aria-expanded') === 'true';
    expanded ? close() : open();
  });

  if (closeBtn) closeBtn.addEventListener('click', close);
  links.forEach(a => a.addEventListener('click', close));
  window.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  // Закриття кліком поза меню на tablet (768–1439)
  document.addEventListener('click', (e) => {
    const w = window.innerWidth;
    if (w >= 768 && w < 1440 && menu.classList.contains('is-open')) {
      const inside = menu.contains(e.target);
      const onToggle = openBtn.contains(e.target) || (closeBtn && closeBtn.contains(e.target));
      if (!inside && !onToggle) close();
    }
  });

  setBtnIcon(ICON_CLOSED);
});
