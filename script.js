const element = document.querySelector('.animate__fadeInLeft');
element.style.setProperty('--animate-duration', '5s');




(function(){
  function initTicker(id, { pxPerSecond = 80, toggleSelector = '.ticker-toggle' } = {}){
    const track = document.getElementById(id);
    if (!track) return;
    const mask = track.parentElement;
    const seed = Array.from(track.children).map(n => n.cloneNode(true));

    function build(){
      // Pause while rebuilding
      const prevState = getComputedStyle(track).animationPlayState;
      track.style.animation = 'none';

      // Build ONE group wide enough to cover the mask
      track.innerHTML = '';
      do { seed.forEach(li => track.appendChild(li.cloneNode(true))); }
      while (track.scrollWidth < mask.offsetWidth && seed.length);

      // Duplicate to make EXACTLY two identical groups
      const groupHTML = track.innerHTML;
      track.innerHTML = groupHTML + groupHTML;

      // Constant speed regardless of content width
      const groupWidth = track.scrollWidth / 2;
      const duration = groupWidth / pxPerSecond;
      track.style.setProperty('--duration', `${duration}s`);

      // Force reflow so new duration applies, then resume animation
      // eslint-disable-next-line no-unused-expressions
      track.offsetWidth;
      track.style.animation = '';
      track.style.animationPlayState = prevState;
    }

    const ready = document.fonts?.ready || Promise.resolve();
    ready.then(() => {
      build();
      // Rebuild on resize
      let raf;
      addEventListener('resize', () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(build);
      }, { passive: true });

      // If using tabs/collapse, rebuild when section becomes visible:
      document.addEventListener('shown.bs.tab', build);
      document.addEventListener('shown.bs.collapse', build);
    });

    const btn = document.querySelector(toggleSelector);
    if (btn){
      btn.addEventListener('click', () => {
        const paused = getComputedStyle(track).animationPlayState === 'paused';
        track.style.animationPlayState = paused ? 'running' : 'paused';
        btn.setAttribute('aria-pressed', String(!paused));
        btn.textContent = paused ? 'Pause' : 'Play';
      });
    }
  }

  // Wait for everything (images/fonts) to be safe to measure
  addEventListener('load', () => initTicker('ticker1', { pxPerSecond: 80 }));
})();
