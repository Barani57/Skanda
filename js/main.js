/* ============================================================
   SRI SKANDA BHAVAN — main.js v2 Pro
   WebMint Solutions, Tiruppur
   ============================================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ── NAVBAR SCROLL ──────────────────────────────────────── */
  const navbar = document.querySelector('.navbar');
  const btt    = document.querySelector('.btt');
  const onScroll = () => {
    const y = window.scrollY;
    navbar?.classList.toggle('scrolled', y > 40);
    btt?.classList.toggle('show', y > 420);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── HAMBURGER ──────────────────────────────────────────── */
  const ham     = document.querySelector('.nav-ham');
  const drawer  = document.querySelector('.nav-drawer');
  const overlay = document.querySelector('.nav-overlay');
  const dClose  = document.querySelector('.nav-drawer-close');

  const openDrawer  = () => { ham?.classList.add('open'); drawer?.classList.add('open'); overlay?.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeDrawer = () => { ham?.classList.remove('open'); drawer?.classList.remove('open'); overlay?.classList.remove('open'); document.body.style.overflow = ''; };

  ham?.addEventListener('click', openDrawer);
  dClose?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);
  document.querySelectorAll('.drawer-links a').forEach(a => a.addEventListener('click', closeDrawer));

  /* ── ACTIVE NAV ─────────────────────────────────────────── */
  const pg = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .drawer-links a').forEach(a => {
    if (a.getAttribute('href') === pg) a.classList.add('active');
  });

  /* ── SCROLL REVEAL ──────────────────────────────────────── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    .forEach(el => revealObs.observe(el));

  /* ── COUNTER ANIMATION ──────────────────────────────────── */
  const counters = document.querySelectorAll('.stat-num[data-count]');
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el   = e.target;
      const end  = parseInt(el.dataset.count, 10);
      const suf  = el.dataset.suffix || '';
      const dur  = 1400;
      const step = 16;
      const inc  = end / (dur / step);
      let cur = 0;
      const t = setInterval(() => {
        cur += inc;
        if (cur >= end) { cur = end; clearInterval(t); }
        el.textContent = Math.floor(cur) + suf;
      }, step);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObs.observe(c));

  /* ── BACK TO TOP ────────────────────────────────────────── */
  btt?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ── LIGHTBOX ───────────────────────────────────────────── */
  const lb      = document.querySelector('.lightbox');
  const lbImg   = document.querySelector('.lightbox img');
  const lbClose = document.querySelector('.lightbox-close');

  document.querySelectorAll('.gallery-item[data-src]').forEach(item => {
    item.addEventListener('click', () => {
      if (lbImg) lbImg.src = item.dataset.src;
      lb?.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLb = () => { lb?.classList.remove('open'); document.body.style.overflow = ''; };
  lbClose?.addEventListener('click', closeLb);
  lb?.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });

  /* ── COMBO "SHOW MORE / LESS" ───────────────────────────── */
  document.querySelectorAll('.combo-more-btn').forEach(btn => {
    const ul    = btn.previousElementSibling;
    const items = ul.querySelectorAll('li');
    const MAX   = 6;

    if (items.length <= MAX) { btn.style.display = 'none'; return; }

    items.forEach((li, i) => { if (i >= MAX) { li.style.display = 'none'; li.dataset.hidden = 'true'; } });
    btn.textContent = `+ ${items.length - MAX} more items →`;

    btn.addEventListener('click', () => {
      const hidden = [...items].filter(li => li.dataset.hidden === 'true');
      if (hidden.length) {
        hidden.forEach(li => { li.style.display = ''; delete li.dataset.hidden; });
        btn.textContent = '− Show less';
      } else {
        items.forEach((li, i) => { if (i >= MAX) { li.style.display = 'none'; li.dataset.hidden = 'true'; } });
        btn.textContent = `+ ${items.length - MAX} more items →`;
      }
    });
  });

  /* ── MENU TABS ──────────────────────────────────────────── */
  const mealTabs = document.querySelectorAll('.meal-tab');
  const menuSecs = document.querySelectorAll('.menu-section');

  mealTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      mealTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.meal;
      menuSecs.forEach(s => s.classList.toggle('active', s.dataset.meal === target));

      // Reset type toggle in the newly shown section
      const sec = document.querySelector(`.menu-section[data-meal="${target}"]`);
      if (sec) {
        const firstToggle = sec.querySelector('.type-toggle');
        firstToggle?.click();
      }
    });
  });

  /* ── TYPE TOGGLES ───────────────────────────────────────── */
  document.querySelectorAll('.menu-section').forEach(sec => {
    const toggles  = sec.querySelectorAll('.type-toggle');
    const typeSecs = sec.querySelectorAll('.menu-type-section');

    toggles.forEach(tog => {
      tog.addEventListener('click', () => {
        toggles.forEach(t => t.classList.remove('active'));
        tog.classList.add('active');
        typeSecs.forEach(s => s.classList.toggle('active', s.dataset.type === tog.dataset.type));
      });
    });

    if (toggles.length) toggles[0].click();
  });

  /* ── ORDER FORM (Restaurant) ────────────────────────────── */
  document.querySelector('#order-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target;
    const name = f.querySelector('[name="name"]')?.value || '';
    const phone = f.querySelector('[name="phone"]')?.value || '';
    const meal  = f.querySelector('[name="meal"]')?.value || '';
    const plan  = f.querySelector('[name="plan"]')?.value || '';
    const date  = f.querySelector('[name="date"]')?.value || '';
    const pax   = f.querySelector('[name="persons"]')?.value || '';
    const note  = f.querySelector('[name="special"]')?.value || 'None';
    const msg = `🙏 *Sri Skanda Bhavan — Meal Order*\n\nName: ${name}\nPhone: ${phone}\nMeal: ${meal} · ${plan}\nDate: ${date}\nPersons: ${pax}\nNote: ${note}`;
    window.open(`https://wa.me/918248077837?text=${encodeURIComponent(msg)}`, '_blank');
  });

  /* ── CONTACT FORM ───────────────────────────────────────── */
  document.querySelector('#contact-form-wa')?.addEventListener('click', () => {
    const f = document.querySelector('#contact-form');
    if (!f) return;
    const name    = f.querySelector('[name="name"]')?.value || '';
    const phone   = f.querySelector('[name="phone"]')?.value || '';
    const type    = f.querySelector('[name="enquiry-type"]')?.value || '';
    const guests  = f.querySelector('[name="guests"]')?.value || '';
    const checkin = f.querySelector('[name="checkin"]')?.value || '';
    const out     = f.querySelector('[name="checkout"]')?.value || '';
    const msg2    = f.querySelector('[name="message"]')?.value || '';
    const msg = `🙏 *Sri Skanda Bhavan — Booking Enquiry*\n\nName: ${name}\nPhone: ${phone}\nType: ${type}\nGuests: ${guests}\nCheck-in: ${checkin}\nCheck-out: ${out}\nMessage: ${msg2 || 'None'}`;
    window.open(`https://wa.me/918248077837?text=${encodeURIComponent(msg)}`, '_blank');
  });

  /* ── WA ROOM BUTTONS ────────────────────────────────────── */
  document.querySelectorAll('.room-wa-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const room = btn.dataset.room || 'a room';
      const msg  = `🙏 Hi Sri Skanda Bhavan!\n\nI'd like to enquire about: *${room}*\n\nPlease share availability & rates. Thank you!`;
      window.open(`https://wa.me/918248077837?text=${encodeURIComponent(msg)}`, '_blank');
    });
  });

  /* ── WA COMBO BUTTONS ───────────────────────────────────── */
  document.querySelectorAll('.combo-wa-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const plan = btn.dataset.plan || 'a meal plan';
      const msg  = `🙏 Hi Sri Skanda Bhavan!\n\nOrder: *${plan}*\nDate: \nPersons: \n\nPlease confirm. Thank you!`;
      window.open(`https://wa.me/918248077837?text=${encodeURIComponent(msg)}`, '_blank');
    });
  });

  /* ── SMOOTH ANCHOR SCROLL ───────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 84, behavior: 'smooth' });
      }
    });
  });

  /* ── IMAGE LAZY FALLBACK (shows placeholder tint on 404) ── */
  document.querySelectorAll('img[src]').forEach(img => {
    img.addEventListener('error', () => {
      img.style.background = 'rgba(38,166,154,0.06)';
      img.style.minHeight  = img.style.minHeight || '80px';
    }, { once: true });
  });

});
