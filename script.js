(() => {
  // ─── Cursor ─────────────────────────────────
  const cur  = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  const isDesktop = window.matchMedia('(pointer:fine)').matches;

  if (isDesktop && cur && ring) {
    let mx=0, my=0, rx=0, ry=0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cur.style.left = mx + 'px';
      cur.style.top  = my + 'px';
    });
    const lerpC = () => {
      rx += (mx - rx) * .12;
      ry += (my - ry) * .12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(lerpC);
    };
    lerpC();
    document.querySelectorAll('a, .panel-bridge, .panel-stairs, .panel-case, .brand-tag')
      .forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
      });
  }

  // ─── Scroll-driven image animations ─────────
  // Each .panel-bg child track its scroll progress as --py (0=top, 1=bottom)
  const container = document.getElementById('scrollContainer');
  if (!container) return;

  const animatedPanels = Array.from(
    document.querySelectorAll('.parallax-bg, .zoom-bg, .slide-bg--left, .slide-bg--right')
  );

  const updatePanels = () => {
    const cTop = container.scrollTop;
    const cH   = container.clientHeight;

    animatedPanels.forEach(bg => {
      const panel   = bg.parentElement;
      const panelTop = panel.offsetTop;          // offset within scroll container
      const panelH   = panel.offsetHeight;

      // progress: 0 when top of panel at bottom of viewport → 1 when bottom at top
      const raw = (cTop - panelTop + cH) / (panelH + cH);
      const py  = Math.min(1, Math.max(0, raw));
      bg.style.setProperty('--py', py.toFixed(4));
    });
  };

  container.addEventListener('scroll', updatePanels, { passive: true });
  updatePanels(); // initial

  // ─── Intersection Observer (reveal animations) ──
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
      }
    });
  }, {
    root: container,          // scoped to scroll container
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.js-reveal, .discipline, .case-overlay')
    .forEach(el => observer.observe(el));

})();
