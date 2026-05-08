

document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('carousel-track');
  const pipsContainer = document.getElementById('carousel-pips');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const autoBtn = document.getElementById('autoplay-btn');
  const counterEl = document.getElementById('carousel-counter');

  if (!track) return;

  let current = 0;
  let slides = [];
  let autoplayTimer = null;
  let isPlaying = false;

  fetch('data/images.json')
    .then(res => res.json())
    .then(data => buildCarousel(data.carousel))
    .catch(err => {
      track.innerHTML = `<p style="color:var(--clr-muted); padding:2rem;">Could not load carousel: ${err.message}</p>`;
    });

  function buildCarousel(images) {
    slides = images;
    track.innerHTML = '';
    pipsContainer.innerHTML = '';

    images.forEach((img, i) => {
      // Slide
      const slide = document.createElement('div');
      slide.className = 'carousel-slide';
      slide.innerHTML = `
        <img src="${img.src}" alt="${img.alt}" loading="${i === 0 ? 'eager' : 'lazy'}">
        <div class="carousel-info">
          <h3>${img.title}</h3>
          <p>${img.description}</p>
        </div>
      `;
      track.appendChild(slide);

      // Pip
      const pip = document.createElement('button');
      pip.className = 'pip' + (i === 0 ? ' active' : '');
      pip.setAttribute('aria-label', `Go to slide ${i + 1}`);
      pip.addEventListener('click', () => goTo(i));
      pipsContainer.appendChild(pip);
    });

    updateUI();
  }

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    updateUI();
  }

  function updateUI() {
    
    document.querySelectorAll('.pip').forEach((p, i) => {
      p.classList.toggle('active', i === current);
    });
    // Update counter
    if (counterEl) counterEl.textContent = `${current + 1} / ${slides.length}`;
  }

  prevBtn && prevBtn.addEventListener('click', () => { goTo(current - 1); resetAutoplay(); });
  nextBtn && nextBtn.addEventListener('click', () => { goTo(current + 1); resetAutoplay(); });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (!track) return;
    if (e.key === 'ArrowLeft') { goTo(current - 1); resetAutoplay(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); resetAutoplay(); }
  });

  // Touch/swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goTo(current + 1) : goTo(current - 1);
      resetAutoplay();
    }
  });

  // Autoplay
  function startAutoplay() {
    isPlaying = true;
    autoBtn && (autoBtn.textContent = '⏸ Pause');
    autoBtn && autoBtn.classList.add('playing');
    autoplayTimer = setInterval(() => goTo(current + 1), 3500);
  }

  function stopAutoplay() {
    isPlaying = false;
    autoBtn && (autoBtn.textContent = '▶ Autoplay');
    autoBtn && autoBtn.classList.remove('playing');
    clearInterval(autoplayTimer);
  }

  function resetAutoplay() {
    if (isPlaying) { stopAutoplay(); startAutoplay(); }
  }

  autoBtn && autoBtn.addEventListener('click', () => {
    isPlaying ? stopAutoplay() : startAutoplay();
  });
});
