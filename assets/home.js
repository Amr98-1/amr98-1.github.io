// 6 Levels homepage motion: hero entrance, count-up, scroll reveal, card spotlight, magnetic buttons.
(function () {
  const $ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // hero entrance, staggered
  $('.hero .wrap > div:first-child > *').forEach((el, i) => { el.classList.add('ani-up'); el.style.animationDelay = (.1 + i * .12) + 's'; });
  const hp = document.querySelector('.hero .phone');
  hp && hp.addEventListener('animationend', e => { if (e.animationName === 'phoneIn') { hp.style.opacity = 1; hp.classList.add('float'); } });
  setTimeout(() => document.querySelector('.hero .pbar')?.classList.add('go'), 200);

  // count-up numbers
  if (!reduce) $('[data-count]').forEach(b => {
    const to = +b.dataset.count, t0 = performance.now() + 700, d = 1600;
    const tick = n => { const p = Math.min(1, Math.max(0, (n - t0) / d)); b.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); };
    b.textContent = '0'; requestAnimationFrame(tick);
  });

  // scroll reveal
  $('.sh,.co,.feat,.hw,.d,.faq details').forEach(el => el.classList.add('rv'));
  $('.feats,.how,.dl,.callouts,.faq').forEach(g => [...g.children].forEach((c, i) => c.style.transitionDelay = (i * .08) + 's'));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const t = e.target; t.classList.add('on');
    if (t.classList.contains('steps')) {
      [...t.children].forEach((s, i) => { s.querySelector('.gem').style.transitionDelay = (i * .14) + 's'; s.querySelector('.bar').style.transitionDelay = (.2 + i * .14) + 's'; });
      document.querySelector('.baseline')?.classList.add('on');
    }
    io.unobserve(t);
  }), { threshold: .15 });
  $('.rv,.steps').forEach(el => io.observe(el));

  // spotlight that follows the mouse inside cards
  $('.feat,.co,.hw,.d,.faq details').forEach(c => c.addEventListener('pointermove', e => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }));

  // magnetic buttons (mouse only)
  if (matchMedia('(pointer:fine)').matches && !reduce) $('.btn').forEach(b => {
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .15}px,${(e.clientY - r.top - r.height / 2) * .25}px)`; });
    b.addEventListener('pointerleave', () => b.style.transform = '');
  });

  // hexagon background follows the mouse a little
  const hb = document.querySelector('.hexbg');
  if (hb && !reduce) addEventListener('pointermove', e => { hb.style.transform = `translate(${(e.clientX / innerWidth - .5) * 24}px,${(e.clientY / innerHeight - .5) * 24}px)`; }, { passive: true });
})();
