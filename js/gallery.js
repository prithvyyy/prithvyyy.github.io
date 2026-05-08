/* ============================================
   TASK 4 — IMAGE GALLERY FROM JSON
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const galleryContainer = document.getElementById('gallery-grid');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalImg = document.getElementById('modal-img');
  const modalDesc = document.getElementById('modal-desc');
  const modalClose = document.getElementById('modal-close');

  if (!galleryContainer) return;

  // Fetch JSON data
  fetch('data/images.json')
    .then(res => {
      if (!res.ok) throw new Error('Could not load image data.');
      return res.json();
    })
    .then(data => buildGallery(data.gallery))
    .catch(err => {
      galleryContainer.innerHTML = `<p style="color:var(--clr-muted); grid-column:span 3;">Could not load gallery: ${err.message}</p>`;
    });

  function buildGallery(images) {
    galleryContainer.innerHTML = '';
    images.forEach(image => {
      const item = document.createElement('div');
      item.className = 'gallery-item fade-in';
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', `View full image: ${image.alt}`);

      item.innerHTML = `
        <img src="${image.src}" alt="${image.alt}" loading="lazy">
        <div class="gallery-caption">${image.description}</div>
      `;

      item.addEventListener('click', () => openModal(image));
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') openModal(image);
      });

      galleryContainer.appendChild(item);
    });

    // Trigger fade-in observer refresh
    document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
  }

  function openModal(image) {
    modalImg.src = image.src;
    modalImg.alt = image.alt;
    modalDesc.textContent = image.description;
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
    modalImg.src = '';
  }

  modalClose && modalClose.addEventListener('click', closeModal);
  modalOverlay && modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
});
