// ===========================
// TIMELINE
// ===========================
(function() {
  const events = [
    {
      year: 'The Beginning',
      title: 'First Conversation',
      desc: 'Some conversations feel like the universe finally saying something worth listening to.',
      future: false
    },
    {
      year: 'A Little Later',
      title: 'Getting to Know',
      desc: 'The kind of person who makes you glad you started talking.',
      future: false
    },
    {
      year: 'Random Days',
      title: 'Unexpected Talks',
      desc: 'Those conversations that happen for no reason — and somehow become the best ones.',
      future: false
    },
    {
      year: 'Favorite Moments',
      title: 'Memories Worth Keeping',
      desc: 'The moments that stay. The kind you carry with you, quietly.',
      future: false
    },
    {
      year: 'Right Now',
      title: 'Today',
      desc: 'Still grateful that the universe decided to make our paths cross.',
      future: false
    },
    {
      year: '???',
      title: 'The Future',
      desc: 'Still being written...',
      future: true
    }
  ];

  const wrap = document.getElementById('timeline-wrap');

  events.forEach((ev, i) => {
    const item = document.createElement('div');
    item.className = 'tl-item' + (ev.future ? ' tl-future' : '');

    const dot = document.createElement('div');
    dot.className = 'tl-dot';

    const content = document.createElement('div');
    content.className = 'tl-content';

    const year = document.createElement('div');
    year.className = 'tl-year';
    year.textContent = ev.year;

    const title = document.createElement('div');
    title.className = 'tl-title';
    title.textContent = ev.title;

    const desc = document.createElement('div');
    desc.className = 'tl-desc';
    desc.textContent = ev.desc;

    content.appendChild(year);
    content.appendChild(title);
    content.appendChild(desc);
    item.appendChild(dot);
    item.appendChild(content);
    wrap.appendChild(item);

    if (ev.future) {
      item.style.cursor = 'none';
      item.addEventListener('click', () => {
        item.classList.add('revealed');
        desc.textContent = '"Still Being Written..."';
        year.textContent = '∞';
        dot.style.background = 'var(--accent2)';
      });
    }
  });

  // Intersection Observer for scroll animation
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.tl-item').forEach(item => observer.observe(item));
})();
