// ===========================
// EXTRAS — Fun interactive features
// ===========================

function initExtras() {
  initClickHearts();
  initSpinWheel();
  initWishBubbles();
  initPersonalLetter();
  initFireworksBtn();
  initClickHint();
}

// ---- CLICK-ANYWHERE HEARTS & SPARKS ----
function initClickHearts() {
  const emojis = ['❤️','💗','💖','💫','✨','🌸','💕','⭐','💝'];
  const sparkColors = ['#c084fc','#f472b6','#818cf8','#fbbf24','#e879f9','#fb7185'];

  document.addEventListener('click', e => {
    // Don't trigger on buttons/links/inputs
    const tag = e.target.tagName.toLowerCase();
    if (['button','a','input','canvas'].includes(tag)) return;

    const x = e.clientX, y = e.clientY;

    // Floating heart emoji
    const heart = document.createElement('div');
    heart.className = 'click-heart';
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    heart.style.fontSize = (0.9 + Math.random() * 0.8) + 'rem';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1300);

    // Sparks
    for (let i = 0; i < 6; i++) {
      const spark = document.createElement('div');
      spark.className = 'click-spark';
      spark.style.left = x + 'px';
      spark.style.top = y + 'px';
      spark.style.background = sparkColors[Math.floor(Math.random() * sparkColors.length)];
      const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.5;
      const dist = 30 + Math.random() * 40;
      spark.style.setProperty('--tx', (Math.cos(angle) * dist) + 'px');
      spark.style.setProperty('--ty', (Math.sin(angle) * dist) + 'px');
      document.body.appendChild(spark);
      setTimeout(() => spark.remove(), 700);
    }
  });
}

// ---- FIREWORKS BUTTON ----
function initFireworksBtn() {
  const btn = document.createElement('button');
  btn.className = 'fireworks-btn';
  btn.textContent = '🎆 Fireworks';
  btn.onclick = launchFireworks;
  document.body.appendChild(btn);
}

function launchFireworks() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = 'block';

  const bursts = [];
  const origins = [
    { x: canvas.width * 0.25, y: canvas.height * 0.35 },
    { x: canvas.width * 0.5,  y: canvas.height * 0.25 },
    { x: canvas.width * 0.75, y: canvas.height * 0.35 },
    { x: canvas.width * 0.4,  y: canvas.height * 0.5 },
    { x: canvas.width * 0.65, y: canvas.height * 0.45 },
  ];

  origins.forEach((o, oi) => {
    setTimeout(() => {
      const hue = Math.random() * 360;
      const particles = Array.from({ length: 60 }, () => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 5;
        return {
          x: o.x, y: o.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: 2 + Math.random() * 3,
          color: `hsl(${hue + Math.random() * 60},90%,${60 + Math.random() * 20}%)`,
          life: 1, decay: 0.015 + Math.random() * 0.01,
          trail: []
        };
      });
      bursts.push(particles);

      if (navigator.vibrate) navigator.vibrate(50);
    }, oi * 300);
  });

  let frame;
  function draw() {
    ctx.fillStyle = 'rgba(5,5,16,0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let anyAlive = false;
    bursts.forEach(particles => {
      particles.forEach(p => {
        if (p.life <= 0) return;
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.97; p.vy *= 0.97; p.vy += 0.06;
        p.life -= p.decay;
        anyAlive = true;

        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 6; ctx.shadowColor = p.color;
        ctx.fill();
      });
    });
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;

    if (anyAlive) {
      frame = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.style.display = 'none';
      cancelAnimationFrame(frame);
    }
  }
  draw();
}

// ---- SPIN THE WHEEL ----
function initSpinWheel() {
  const canvas = document.getElementById('wheel-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const segments = [
    'Adorable', 'Brilliant', 'Charming', 'Dazzling',
    'Elegant', 'Fearless', 'Glowing', 'Heartwarming',
    'Incredible', 'Joyful', 'Kindest', 'Luminous',
    'Magnetic', 'Nurturing', 'Outstanding', 'Precious'
  ];

  const colors = [
    '#c084fc','#f472b6','#818cf8','#e879f9',
    '#a78bfa','#fb7185','#7dd3fc','#f0abfc',
    '#c084fc','#f472b6','#818cf8','#e879f9',
    '#a78bfa','#fb7185','#7dd3fc','#f0abfc'
  ];

  let currentAngle = 0;
  let spinning = false;

  function drawWheel(angle) {
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2, radius = Math.min(W, H) / 2 - 8;
    const sliceAngle = (Math.PI * 2) / segments.length;

    ctx.clearRect(0, 0, W, H);

    segments.forEach((seg, i) => {
      const startAngle = angle + i * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = colors[i];
      ctx.fill();
      ctx.strokeStyle = 'rgba(5,5,16,0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${W < 300 ? 8 : 10}px Inter, sans-serif`;
      ctx.shadowBlur = 3;
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.fillText(seg, radius - 12, 4);
      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 24, 0, Math.PI * 2);
    ctx.fillStyle = '#0a0a1a';
    ctx.fill();
    ctx.strokeStyle = 'rgba(192,132,252,0.6)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦', cx, cy);
  }

  drawWheel(0);

  window.spinWheel = function() {
    if (spinning) return;
    spinning = true;
    const resultEl = document.getElementById('wheel-result');
    const resultText = document.getElementById('wheel-result-text');
    resultEl.classList.remove('show');
    resultEl.style.opacity = '0';

    const spinAmount = (Math.PI * 2 * (5 + Math.random() * 5)) + Math.random() * Math.PI * 2;
    const duration = 3000 + Math.random() * 1000;
    const start = performance.now();
    const startAngle = currentAngle;

    function easeOut(t) { return 1 - Math.pow(1 - t, 4); }

    function frame(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      currentAngle = startAngle + spinAmount * easeOut(progress);
      drawWheel(currentAngle);

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        spinning = false;
        // Determine winner
        const sliceAngle = (Math.PI * 2) / segments.length;
        const normalised = (((-currentAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2));
        const idx = Math.floor(normalised / sliceAngle) % segments.length;
        const winner = segments[idx];

        resultText.textContent = `✦ Priyanka is ${winner} ✦`;
        resultEl.style.transition = 'none';
        resultEl.style.opacity = '0';
        resultEl.style.transform = 'translateY(10px)';
        setTimeout(() => {
          resultEl.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          resultEl.classList.add('show');
        }, 50);

        if (navigator.vibrate) navigator.vibrate([100, 50, 150]);
        launchConfetti();
      }
    }
    requestAnimationFrame(frame);
  };
}

// ---- WISH BUBBLES ----
const wishes = [
  'May every day bring you a reason to smile 🌸',
  'May your kindness return to you a hundredfold ✨',
  'May you always feel as loved as you deserve 💖',
  'May every dream you hold dear come true 🌟',
  'May the universe keep you warm and safe 🌙',
  'May your laughter never run out 💗',
  'May life surprise you with beautiful things 🌺',
  'May you always know your own worth 💫',
  'May happiness follow you everywhere you go 🎆',
  'May every sunrise remind you how precious you are ☀️',
  'May your heart always be light 🕊️',
  'May joy find you in the quietest moments 🌿',
  'May you be proud of who you are becoming 🦋',
  'May the world be as kind to you as you are to it 💝',
  'May you always have someone to share good moments with 🌈',
  'May every wish you make quietly come true 🌠',
];

function initWishBubbles() {
  spawnBubbles();
}

function spawnBubbles() {
  const field = document.getElementById('bubbles-field');
  if (!field) return;
  field.innerHTML = '';

  const sizes = [80, 90, 100, 70, 85, 95, 75, 88];
  const shuffled = [...wishes].sort(() => Math.random() - 0.5);

  shuffled.slice(0, 12).forEach((wish, i) => {
    const size = sizes[i % sizes.length];
    const bubble = document.createElement('div');
    bubble.className = 'wish-bubble';
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';
    bubble.style.animationDuration = (3 + Math.random() * 3) + 's';
    bubble.style.animationDelay = (Math.random() * 2) + 's';
    bubble.textContent = ['🫧','✨','💗','🌟','💫','🌸','💖','⭐'][i % 8];
    bubble.title = wish;

    bubble.addEventListener('click', () => {
      bubble.classList.add('pop');
      showWishToast(wish);
      if (navigator.vibrate) navigator.vibrate(60);
      setTimeout(() => bubble.remove(), 400);

      // Mini hearts burst
      const rect = bubble.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      for (let k = 0; k < 5; k++) {
        const h = document.createElement('div');
        h.className = 'click-heart';
        h.textContent = ['💗','✨','💫','🌸','⭐'][k];
        h.style.left = (cx + (Math.random()-0.5)*40) + 'px';
        h.style.top = (cy + (Math.random()-0.5)*20) + 'px';
        h.style.fontSize = '0.9rem';
        document.body.appendChild(h);
        setTimeout(() => h.remove(), 1300);
      }
    });

    field.appendChild(bubble);
  });
}

let wishToastTimer = null;
function showWishToast(msg) {
  let toast = document.getElementById('wish-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'wish-toast';
    toast.className = 'bubble-wish-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  if (wishToastTimer) clearTimeout(wishToastTimer);
  wishToastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}

window.refillBubbles = function() {
  spawnBubbles();
};

// ---- PERSONAL LETTER ----
function initPersonalLetter() {}

const letterParagraphs = [
  'I have been thinking about what I would say if I had the chance to write you a letter.',
  '',
  'I think I would start with this:',
  'you are the kind of person the world quietly needs.',
  '',
  'Not because you do anything extraordinary,',
  'but because you make ordinary moments feel worth remembering.',
  '',
  'Your laugh is the kind that makes other people smile.',
  'Your kindness is the kind that stays with people.',
  'And your presence — it changes the feeling of a room.',
  '',
  'I am glad the universe decided our paths should cross.',
  '',
  'I hope you always know:',
  'you are enough, exactly as you are.',
  'You are more than enough.',
  '',
  'And wherever life takes you,',
  'I hope it takes you somewhere beautiful.',
];

window.revealLetter = function() {
  const btn = document.getElementById('btn-letter');
  const body = document.getElementById('letter-body');
  const linesContainer = document.getElementById('letter-lines');
  if (!btn || !body) return;

  btn.classList.add('hidden');
  body.style.opacity = '1';

  // Build lines
  linesContainer.innerHTML = '';
  const lineEls = letterParagraphs.map(text => {
    const el = document.createElement('p');
    el.className = 'letter-line' + (text === '' ? ' blank' : '');
    el.textContent = text || '\u00a0';
    linesContainer.appendChild(el);
    return el;
  });

  // Reveal line by line
  lineEls.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('show');
      if (i === lineEls.length - 1) {
        const closing = document.querySelector('.letter-closing');
        const from = document.querySelector('.letter-from');
        setTimeout(() => { if (closing) closing.classList.add('show'); }, 400);
        setTimeout(() => {
          if (from) from.classList.add('show');
          launchConfetti();
          if (navigator.vibrate) navigator.vibrate([100,50,100]);
        }, 900);
      }
    }, 200 + i * 260);
  });
};

// ---- CLICK HINT ----
function initClickHint() {
  const hint = document.createElement('div');
  hint.className = 'click-hint show';
  hint.textContent = '✦ Click anywhere to release hearts ✦';
  document.body.appendChild(hint);
  setTimeout(() => hint.remove(), 8000);
}

// ---- COSMIC HOROSCOPE ----
(function() {
  // Seeded RNG — different every day, same all day
  function makeSeed() {
    const d = new Date();
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  }
  function seededRand(seed) {
    let s = seed;
    return function() {
      s = (s * 1664525 + 1013904223) & 0xffffffff;
      return (s >>> 0) / 0xffffffff;
    };
  }

  const rand = seededRand(makeSeed());

  const elements = [
    { name: 'Stardust', icon: '✨', color: '#c084fc' },
    { name: 'Moonlight', icon: '🌙', color: '#818cf8' },
    { name: 'Aurora', icon: '🌌', color: '#f472b6' },
    { name: 'Nebula', icon: '🌠', color: '#e879f9' },
    { name: 'Cosmos', icon: '💫', color: '#fbbf24' },
    { name: 'Starfire', icon: '⭐', color: '#fb7185' },
    { name: 'Twilight', icon: '🌟', color: '#7dd3fc' },
  ];
  const colors = [
    'Cosmic Violet', 'Aurora Pink', 'Nebula Gold', 'Starlight Blue',
    'Rose Quartz', 'Midnight Lilac', 'Celestial Teal', 'Solar Amber',
    'Prism White', 'Galactic Mauve',
  ];
  const animals = [
    { name: 'Phoenix', icon: '🦅' }, { name: 'Moonbear', icon: '🐻' },
    { name: 'Stardeer', icon: '🦌' }, { name: 'Cosmic Butterfly', icon: '🦋' },
    { name: 'Galaxy Fox', icon: '🦊' }, { name: 'Nebula Whale', icon: '🐳' },
    { name: 'Aurora Owl', icon: '🦉' }, { name: 'Celestial Swan', icon: '🦢' },
    { name: 'Solar Wolf', icon: '🐺' }, { name: 'Prism Peacock', icon: '🦚' },
  ];
  const energies = [
    'Radiant ✦✦✦✦✦', 'Luminous ✦✦✦✦✦', 'Magnetic ✦✦✦✦✦',
    'Celestial ✦✦✦✦✦', 'Ethereal ✦✦✦✦✦', 'Transcendent ✦✦✦✦✦',
  ];
  const luckyNums = () => Math.floor(rand() * 99) + 1;

  const verdicts = [
    'The universe has voted unanimously: Priyanka is extraordinary.',
    'All 8 billion timelines confirm: Priyanka is irreplaceable.',
    'Cosmic verdict: Priyanka radiates a frequency no instrument can measure.',
    'The stars have conferred — Priyanka is the kind of person who makes the universe proud.',
    'Final cosmic ruling: Priyanka carries more brightness than most stars.',
    'Universal consensus: Priyanka makes the world significantly better just by existing.',
    'The constellations agree: Priyanka is one of the rarest things in the universe.',
  ];

  const dailyMessages = [
    'Today, the universe is quietly proud of who you are becoming. Walk gently — you carry more light than you know.',
    'The stars have aligned specifically for you today. Whatever feels heavy — you are stronger than it, and the universe is certain of this.',
    'Today carries a rare energy: the kind that only visits people who deserve it. That is you, Priyanka. That has always been you.',
    'The cosmos whispers: do not shrink. Whatever room you are in today, you belong there. You make it better just by being in it.',
    'Today, the universe wishes you this: a moment of quiet that reminds you just how beautifully far you have come.',
    'The celestial forecast: your kindness today will travel further than you expect. It always does. The universe has been keeping track.',
    'Today\'s message from the stars: you are not ordinary. You never were. Some people are born to leave a mark — you are one of them.',
    'The universe notes: today is a good day to be Priyanka. Not that there is ever a bad one.',
    'Cosmic transmission received: wherever you go today, you take warmth with you. The world gets warmer because of it.',
    'The stars have checked — your energy today is exactly what someone needed. You probably don\'t know who. The universe does.',
    'Today\'s celestial reading: be proud of yourself. Quietly or loudly. You have earned it more than you realize.',
    'The cosmos has a message: the people who know you are lucky. The universe arranged it on purpose.',
  ];

  const symbols = ['✦', '⍟', '✵', '✶', '✷', '✸', '✹', '★', '☆', '✰'];

  function pick(arr) {
    return arr[Math.floor(rand() * arr.length)];
  }

  const forecast = {
    element: pick(elements),
    color: pick(colors),
    animal: pick(animals),
    energy: pick(energies),
    lucky: luckyNums(),
    symbol: pick(symbols),
    verdict: pick(verdicts),
    daily: pick(dailyMessages),
    score: 8 + Math.floor(rand() * 3), // 8, 9, or 10
  };

  // Draw star background in horoscope card
  function drawHoroStars() {
    const canvas = document.getElementById('horoscope-stars');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.offsetWidth || 320;
    const H = canvas.offsetHeight || 140;
    canvas.width = W; canvas.height = H;

    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#0a0520');
    bg.addColorStop(0.5, '#08031a');
    bg.addColorStop(1, '#0d0228');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Stars using today's seed
    const r2 = seededRand(makeSeed() + 1);
    for (let i = 0; i < 80; i++) {
      const x = r2() * W;
      const y = r2() * H;
      const radius = r2() * 1.5 + 0.3;
      const alpha = r2() * 0.8 + 0.2;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      const hue = 260 + r2() * 60;
      ctx.fillStyle = `hsla(${hue},70%,80%,${alpha})`;
      ctx.fill();
    }

    // Constellation lines
    const pts = Array.from({length: 7}, () => ({ x: r2() * W * 0.8 + W * 0.1, y: r2() * H * 0.7 + H * 0.1 }));
    ctx.strokeStyle = 'rgba(192,132,252,0.15)';
    ctx.lineWidth = 0.8;
    for (let i = 0; i < pts.length - 1; i++) {
      const d = Math.hypot(pts[i].x - pts[i+1].x, pts[i].y - pts[i+1].y);
      if (d < 120) {
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[i+1].x, pts[i+1].y);
        ctx.stroke();
      }
    }
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(192,132,252,0.8)';
      ctx.shadowBlur = 6; ctx.shadowColor = '#c084fc';
      ctx.fill();
    });
    ctx.shadowBlur = 0;
  }

  function formatDate() {
    const d = new Date();
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
  }

  window.revealHoroscope = function() {
    const btn = document.querySelector('#horoscope .btn-primary');
    if (btn) { btn.style.opacity = '0.4'; btn.style.pointerEvents = 'none'; }

    drawHoroStars();

    const symEl = document.getElementById('horoscope-symbol');
    if (symEl) symEl.textContent = forecast.symbol;

    const dateEl = document.getElementById('horoscope-date');
    if (dateEl) dateEl.textContent = formatDate();

    // Build attributes
    const attrsEl = document.getElementById('horoscope-attrs');
    const attrs = [
      { icon: forecast.element.icon, label: 'Cosmic Element', value: forecast.element.name },
      { icon: '🎨', label: 'Lucky Color', value: forecast.color },
      { icon: forecast.animal.icon, label: 'Power Animal', value: forecast.animal.name },
      { icon: '⚡', label: "Today's Energy", value: forecast.energy },
      { icon: '🔢', label: 'Lucky Number', value: '#' + forecast.lucky },
      { icon: '✦', label: 'Universe Rating', value: forecast.score + '/10' },
    ];

    attrsEl.innerHTML = attrs.map(a => `
      <div class="h-attr">
        <div class="h-attr-icon">${a.icon}</div>
        <div class="h-attr-label">${a.label}</div>
        <div class="h-attr-value">${a.value}</div>
      </div>
    `).join('');

    // Score dots
    const verdictEl = document.getElementById('horoscope-verdict');
    const dotsHtml = Array.from({length: 10}, (_, i) =>
      `<div class="vscore-dot${i < forecast.score ? ' lit' : ''}"></div>`
    ).join('');
    verdictEl.innerHTML = `
      <div class="verdict-label">✦ Cosmic Verdict ✦</div>
      <div class="verdict-text">${forecast.verdict}</div>
      <div class="verdict-score">${dotsHtml}</div>
    `;

    // Daily message
    const dailyEl = document.getElementById('horoscope-daily');
    dailyEl.innerHTML = `
      <span class="daily-label">✦ Today's Universe Message ✦</span>
      "${forecast.daily}"
    `;

    // Animate in sequence
    setTimeout(() => {
      attrsEl.style.transition = 'opacity 0.6s ease';
      attrsEl.style.opacity = '1';
      const attrCards = attrsEl.querySelectorAll('.h-attr');
      attrCards.forEach((c, i) => {
        setTimeout(() => c.classList.add('show'), i * 120);
      });
    }, 200);

    setTimeout(() => {
      verdictEl.style.transition = 'opacity 0.7s ease';
      verdictEl.style.opacity = '1';
    }, 200 + attrs.length * 120 + 300);

    setTimeout(() => {
      dailyEl.style.transition = 'opacity 0.7s ease';
      dailyEl.style.opacity = '1';
      launchConfetti();
      if (navigator.vibrate) navigator.vibrate([80, 40, 80, 40, 120]);
      if (btn) { btn.textContent = 'Come Back Tomorrow ✦'; }
    }, 200 + attrs.length * 120 + 800);
  };

  // Auto-draw stars background on load (without revealing content)
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(drawHoroStars, 500);
  });
  setTimeout(drawHoroStars, 1000);
})();
