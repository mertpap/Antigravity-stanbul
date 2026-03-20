(() => {
  // ── Custom cursor (desktop only) ─────────────────
  const cur  = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');

  if (window.matchMedia('(pointer: fine)').matches && cur && ring) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cur.style.left  = mx + 'px';
      cur.style.top   = my + 'px';
    });

    const lerp = (a, b, t) => a + (b - a) * t;
    const tick = () => {
      rx = lerp(rx, mx, .12);
      ry = lerp(ry, my, .12);
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(tick);
    };
    tick();

    document.querySelectorAll('a, .case, .discipline, .fullbleed')
      .forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
      });
  }

  // ── Scroll reveal ─────────────────────────────────
  const reveals = document.querySelectorAll('.js-reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));

  // ── Wrap nav link text for hover slide effect ─────
  document.querySelectorAll('.nav-links a').forEach(a => {
    const t = a.textContent;
    a.innerHTML = `<span>${t}</span>`;
    a.dataset.hover = t;
  });

})();
