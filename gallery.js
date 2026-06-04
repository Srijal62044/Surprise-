// ===========================
// PHOTO GALLERY
// ===========================
(function() {
  const photos = [
    { src: 'p1.jpg',  note: 'Some moments stay longer than photographs.' },
    { src: 'p2.jpg',  note: 'A smile that makes ordinary days feel extraordinary.' },
    { src: 'p3.jpg',  note: 'Quiet beauty in every frame.' },
    { src: 'p4.jpg',  note: 'Eyes that hold a universe within them.' },
    { src: 'p5.jpg',  note: 'A smile that could brighten the darkest room.' },
    { src: 'p6.jpg',  note: 'Elegance is not something you wear — it\'s something you are.' },
    { src: 'p7.webp', note: 'Some people bring warmth wherever they go.' },
    { src: 'p8.jpg',  note: 'The kind of beauty that stays in memory.' },
    { src: 'p9.jpg',  note: 'Every photo tells a story only the heart understands.' },
    { src: 'p10.jpg', note: 'Peaceful. Radiant. Real.' },
    { src: 'p11.jpg', note: 'Some moments are meant to be kept forever.' },
    { src: 'p12.jpg', note: 'The universe has good taste.' },
    { src: 'p13.jpg', note: 'A little mystery, a lot of magic.' },
    { src: 'p14.png', note: 'Certain people light up the world around them.' }
  ];

  const rotations = [-3, 2, -1.5, 3, -2.5, 1, -3.5, 2.5, -1, 3.5, -2, 1.5, -4, 2];
  const grid = document.getElementById('polaroid-grid');

  photos.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'polaroid';
    const rot = rotations[i % rotations.length];
    card.style.setProperty('--rot', rot + 'deg');
    card.style.transform = `rotate(${rot}deg)`;
    card.style.animationDelay = (i * 0.4) + 's';

    const img = document.createElement('img');
    img.className = 'polaroid-img';
    img.src = p.src;
    img.alt = 'Memory ' + (i + 1);
    img.loading = 'lazy';

    const note = document.createElement('div');
    note.className = 'polaroid-note';
    note.textContent = p.note;

    card.appendChild(img);
    card.appendChild(note);
    grid.appendChild(card);

    // 3D tilt effect
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `rotate(${rot}deg) perspective(400px) rotateY(${dx * 10}deg) rotateX(${-dy * 10}deg) translateZ(10px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = `rotate(${rot}deg)`;
    });

    // Touch tilt
    card.addEventListener('touchmove', e => {
      const t = e.touches[0];
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (t.clientX - cx) / (rect.width / 2);
      const dy = (t.clientY - cy) / (rect.height / 2);
      card.style.transform = `rotate(${rot}deg) perspective(400px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg)`;
    }, { passive: true });
    card.addEventListener('touchend', () => {
      card.style.transform = `rotate(${rot}deg)`;
    });

    card.addEventListener('click', () => openPhotoModal(p.src, p.note));
  });

  window.openPhotoModal = function(src, note) {
    const modal = document.getElementById('photo-modal');
    document.getElementById('modal-img').src = src;
    document.getElementById('modal-note').textContent = note;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closePhotoModal = function(e) {
    if (!e || e.target === document.getElementById('photo-modal') || e.target.classList.contains('modal-x')) {
      document.getElementById('photo-modal').classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') window.closePhotoModal();
  });
})();
