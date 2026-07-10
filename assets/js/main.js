(() => {
  'use strict';

  const body = document.body;
  const menuButton = document.querySelector('.mobile-menu-button');
  const drawer = document.querySelector('.mobile-drawer');
  const drawerClose = document.querySelector('.drawer-close');
  const overlay = document.querySelector('.drawer-overlay');
  const searchButton = document.querySelector('.mobile-search-button');
  const mobileSearch = document.querySelector('.mobile-search');
  const backToTop = document.querySelector('.back-to-top');
  const toast = document.querySelector('.toast');

  const setDrawer = (open) => {
    if (!drawer || !menuButton || !overlay) return;
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    menuButton.setAttribute('aria-expanded', String(open));
    overlay.hidden = !open;
    body.classList.toggle('is-locked', open);
  };

  menuButton?.addEventListener('click', () => setDrawer(true));
  drawerClose?.addEventListener('click', () => setDrawer(false));
  overlay?.addEventListener('click', () => setDrawer(false));
  drawer?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setDrawer(false)));

  searchButton?.addEventListener('click', () => {
    const open = !mobileSearch?.classList.contains('is-open');
    mobileSearch?.classList.toggle('is-open', open);
    searchButton.setAttribute('aria-expanded', String(open));
    if (open) mobileSearch?.querySelector('input')?.focus();
  });

  document.querySelectorAll('.has-submenu > button').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.has-submenu');
      const open = !item.classList.contains('is-open');
      document.querySelectorAll('.has-submenu.is-open').forEach((node) => {
        if (node !== item) {
          node.classList.remove('is-open');
          node.querySelector('button')?.setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('is-open', open);
      button.setAttribute('aria-expanded', String(open));
    });
  });

  window.addEventListener('scroll', () => {
    backToTop?.classList.toggle('is-visible', window.scrollY > 500);
  }, { passive: true });

  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  document.querySelectorAll('[data-copy-url]').forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
      } catch (_) {
        const input = document.createElement('input');
        input.value = window.location.href;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        input.remove();
      }
      toast?.classList.add('is-visible');
      window.setTimeout(() => toast?.classList.remove('is-visible'), 1600);
    });
  });

  document.querySelectorAll('form[action="#"]').forEach((form) => {
    form.addEventListener('submit', (event) => event.preventDefault());
  });
})();
