// ===========================
// MAIN CONTROLLER
// ===========================

// ---- LOADING SCREEN ----
(function() {
  const lines = [
    '> Initializing Universe...',
    '> Searching through 8,000,000,000 souls...',
    '> Finding someone special...',
    '> Analyzing...',
    '> Match Found ✓'
  ];
  const tls = [1,2,3,4,5].map(i => document.getElementById('tl' + i));
  const cursor = document.getElementById('tcursor');
  const nameReveal = document.getElementById('loading-name-reveal');
  const revealName = document.getElementById('reveal-name');

  let lineIdx = 0;
  function typeLine() {
    if (lineIdx >= lines.length) {
      setTimeout(showName, 400);
      return;
    }
    const el = tls[lineIdx];
    const text = lines[lineIdx];
    let charIdx = 0;
    el.textContent = '';
    const delay = lineIdx === lines.length - 1 ? 40 : 30;
    function typeChar() {
      if (charIdx < text.length) {
        el.textContent += text[charIdx];
        charIdx++;
        setTimeout(typeChar, delay);
      } else {
        lineIdx++;
        setTimeout(typeLine, lineIdx < lines.length ? 300 : 600);
      }
    }
    typeChar();
  }

  function showName() {
    cursor.style.display = 'none';
    nameReveal.classList.add('show');
    const name = 'PRIYANKA';
    let i = 0;
    function typeReveal() {
      if (i < name.length) {
        revealName.textContent += name[i];
        i++;
        setTimeout(typeReveal, 100);
      } else {
        setTimeout(hideLoader, 2000);
      }
    }
    typeReveal();
  }

  function hideLoader() {
    document.getElementById('loading-screen').classList.add('hidden');
    document.getElementById('main-content').style.opacity = '1';
    initAll();
  }

  document.getElementById('main-content').style.opacity = '0';
  document.getElementById('main-content').style.transition = 'opacity 1s ease';
  typeLine();
})();

// ---- INIT ALL ----
function initAll() {
  initScrollProgress();
  initHeroTyping();
  initAIBars();
  initConstellation();
  initMemoryWall();
  initEasterEggs();
  initPriyankaMode();
  initSectionReveal();
  if (typeof initExtras === 'function') initExtras();
}

// ---- SCROLL PROGRESS ----
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}

// ---- HERO TYPING ----
function initHeroTyping() {
  const el = document.getElementById('hero-typing');
  const phrases = [
    'Among billions of people, the universe somehow led me to Priyanka.',
    'Some people become memories.\nSome become reasons to smile.',
    'And somehow... you became both.'
  ];
  let phraseIdx = 0;
  let charIdx = 0;
  let typing = true;
  let pauseTimer = null;

  el.innerHTML = '<span class="cursor">|</span>';

  function updateDisplay(text) {
    el.innerHTML = text.replace(/\n/g, '<br>') + '<span class="cursor">|</span>';
  }

  function tick() {
    const current = phrases[phraseIdx];
    if (typing) {
      if (charIdx <= current.length) {
        updateDisplay(current.slice(0, charIdx));
        charIdx++;
        pauseTimer = setTimeout(tick, charIdx === current.length + 1 ? 2000 : 45);
      } else {
        typing = false;
        charIdx = current.length;
        pauseTimer = setTimeout(tick, 2000);
      }
    } else {
      if (charIdx > 0) {
        updateDisplay(current.slice(0, charIdx));
        charIdx--;
        pauseTimer = setTimeout(tick, 25);
      } else {
        phraseIdx = (phraseIdx + 1) % phrases.length;
        typing = true;
        pauseTimer = setTimeout(tick, 500);
      }
    }
  }
  setTimeout(tick, 500);
}

// ---- AI ANALYZER ----
function initAIBars() {
  const container = document.getElementById('ai-bars');
  const traits = [
    { label: 'Smile Quality', target: 100, normal: true },
    { label: 'Kindness Index', target: 100, normal: true },
    { label: 'Personality Score', target: 100, normal: true },
    { label: 'Intelligence Rating', target: 100, normal: true },
    { label: 'Cuteness Level', target: 999, normal: false, error: true }
  ];

  traits.forEach(t => {
    const item = document.createElement('div');
    item.className = 'ai-bar-item' + (t.error ? ' ai-error' : '');
    item.innerHTML = `
      <div class="ai-bar-label">
        <span>${t.label}</span>
        <span class="ai-pct" data-target="${t.target}">0%</span>
      </div>
      <div class="ai-bar-track"><div class="ai-bar-fill" data-target="${t.target}"></div></div>
      ${t.error ? '<div class="ai-error-msg" style="font-family:Courier New,monospace;font-size:0.75rem;color:#fb923c;margin-top:4px;display:none">⚠️ ERROR: Value exceeds system limits.</div>' : ''}
    `;
    container.appendChild(item);
  });
}

window.runAIAnalysis = function() {
  const btn = document.getElementById('btn-analyze');
  btn.disabled = true; btn.textContent = 'Analyzing...';

  const bars = document.querySelectorAll('.ai-bar-fill');
  const pcts = document.querySelectorAll('.ai-pct');

  bars.forEach((bar, i) => {
    setTimeout(() => {
      const target = parseInt(bar.dataset.target);
      bar.style.width = Math.min(target, 100) + '%';

      let current = 0;
      const pctEl = pcts[i];
      const maxDisplay = target;
      const interval = setInterval(() => {
        current = Math.min(current + Math.ceil(maxDisplay / 40), maxDisplay);
        pctEl.textContent = current + (target > 100 ? '' : '%');
        if (current >= maxDisplay) {
          clearInterval(interval);
          if (target > 100) {
            pctEl.textContent = '∞';
            setTimeout(() => {
              const errMsg = bar.closest('.ai-bar-item').querySelector('.ai-error-msg');
              if (errMsg) errMsg.style.display = 'block';
            }, 400);
          }
        }
      }, 35);

      if (i === bars.length - 1) {
        setTimeout(() => {
          document.getElementById('ai-result').style.display = 'block';
          btn.textContent = 'Run Again';
          btn.disabled = false;
        }, 1200);
      }
    }, i * 800);
  });
};

// ---- HEART GALAXY ----
window.buildHeartGalaxy = function() {
  const canvas = document.getElementById('heart-canvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth;
  const H = canvas.offsetHeight;
  canvas.width = W; canvas.height = H;

  const N = 1800;
  const particles = [];
  let phase = 0;

  // Heart parametric
  function heartX(t) { return 16 * Math.pow(Math.sin(t), 3); }
  function heartY(t) { return -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)); }

  const scale = Math.min(W, H) / 55;
  const cx = W / 2, cy = H / 2 + 20;

  for (let i = 0; i < N; i++) {
    const t = (i / N) * Math.PI * 2;
    const tx = cx + heartX(t) * scale;
    const ty = cy + heartY(t) * scale;
    particles.push({
      x: Math.random() * W, y: Math.random() * H,
      tx, ty,
      r: Math.random() * 2 + 0.5,
      color: `hsl(${330 + Math.random() * 30}, 80%, ${60 + Math.random() * 20}%)`,
      speed: 0.03 + Math.random() * 0.04,
      glow: Math.random() > 0.7
    });
  }

  function anim() {
    ctx.clearRect(0, 0, W, H);
    let allDone = true;
    particles.forEach(p => {
      p.x += (p.tx - p.x) * p.speed;
      p.y += (p.ty - p.y) * p.speed;
      const dist = Math.hypot(p.tx - p.x, p.ty - p.y);
      if (dist > 1) allDone = false;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      if (p.glow) { ctx.shadowBlur = 8; ctx.shadowColor = p.color; }
      else ctx.shadowBlur = 0;
      ctx.fill();
    });
    ctx.shadowBlur = 0;
    phase++;

    if (!allDone || phase < 60) {
      requestAnimationFrame(anim);
    } else {
      // Show message
      const msg = document.getElementById('heart-msg');
      if (msg) msg.classList.add('show');
    }
  }
  requestAnimationFrame(anim);
};

// ---- STAR CONSTELLATION ----
function initConstellation() {
  const canvas = document.getElementById('constellation-canvas');
  const ctx = canvas.getContext('2d');
  const popup = document.getElementById('star-popup');

  const messages = [
    "You make ordinary days feel extraordinary.",
    "Your smile is brighter than most stars.",
    "Some people enter life quietly and change everything.",
    "You have a way of making people feel seen.",
    "The world is genuinely better with you in it.",
    "Your kindness is the kind that stays with people.",
    "You make conversations feel effortless.",
    "There's something quietly magnetic about you.",
    "You have a beautiful way of making people comfortable.",
    "You're one of the easiest people to appreciate.",
    "You carry warmth wherever you go.",
    "The universe made you rare on purpose.",
    "Your laugh is something people remember.",
    "You're the kind of person worth knowing.",
    "Some people shine without even trying. You're one of them.",
    "You turn ordinary moments into something worth remembering.",
    "There's a gentleness in you that the world needs more of.",
    "You're the kind of rare that's hard to explain.",
    "You make people feel at ease just by being yourself.",
    "Your presence is a gift you probably underestimate.",
    "Some hearts are just built differently — yours is one of them.",
    "You have the kind of energy that quietly lifts a room.",
    "The stars have nothing on you.",
    "You make the mundane feel meaningful.",
    "You're proof that some things in life are genuinely worth the wait.",
    "Your smile does things that words can't.",
    "You're the kind of person who makes other people better.",
    "There's a quiet strength in you that's deeply admirable.",
    "You make life feel a little less ordinary.",
    "Some people are just impossible to forget. You're one.",
    "You carry your heart beautifully.",
    "Your inner world is as beautiful as your outer one.",
    "You have more impact than you realize.",
    "The kindness you give out? It travels far.",
    "You've probably made someone's day without knowing it.",
    "You're the kind of rare the world quietly needs.",
    "Something about you just stays with people.",
    "You make other people feel like they matter — that's rare.",
    "Your presence changes the feeling of a room.",
    "You're someone worth writing about.",
    "Some lights can't be dimmed. Yours is one.",
    "You have a gentleness that's quietly powerful.",
    "The universe was specific when it made you.",
    "You're genuinely, quietly extraordinary.",
    "There's something about you that makes people feel lucky to know you.",
    "Your story is still being written — and it's beautiful so far.",
    "You don't realize how much light you carry.",
    "You're the person people are glad they met.",
    "There are very few people like you. That's a compliment.",
    "You exist and somehow that makes things better."
  ];

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    buildStars();
  }

  let stars = [];
  function buildStars() {
    const W = canvas.width, H = canvas.height;
    stars = [];
    for (let i = 0; i < 50; i++) {
      stars.push({
        x: 20 + Math.random() * (W - 40),
        y: 20 + Math.random() * (H - 40),
        r: 3 + Math.random() * 4,
        msg: messages[i % messages.length],
        pulse: Math.random() * Math.PI * 2,
        found: false
      });
    }
    drawStars();
  }

  function drawStars() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Lines between nearby stars
    ctx.strokeStyle = 'rgba(192,132,252,0.08)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const d = Math.hypot(stars[i].x - stars[j].x, stars[i].y - stars[j].y);
        if (d < 100) {
          ctx.globalAlpha = 1 - d / 100;
          ctx.beginPath();
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(stars[j].x, stars[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    // Stars
    stars.forEach(s => {
      s.pulse += 0.04;
      const glow = s.found ? 0 : (1 + Math.sin(s.pulse)) / 2;
      const color = s.found ? 'rgba(74,222,128,0.5)' : `hsl(${270 + glow * 30},80%,${65 + glow * 15}%)`;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowBlur = 10 + glow * 10;
      ctx.shadowColor = color;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    requestAnimationFrame(drawStars);
  }

  function getStarAt(x, y) {
    return stars.find(s => Math.hypot(s.x - x, s.y - y) < s.r < 25);
  }

  function showPopup(star, cx, cy) {
    popup.style.display = 'block';
    popup.textContent = star.msg;
    const bnd = canvas.getBoundingClientRect();
    let left = bnd.left + cx + 16;
    let top = bnd.top + cy - 30 + window.scrollY;
    if (left + 280 > window.innerWidth) left = bnd.left + cx - 296;
    popup.style.left = left + 'px';
    popup.style.top = top + 'px';
    popup.style.position = 'fixed';
    setTimeout(() => { popup.style.display = 'none'; }, 3500);
  }

  canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const star = getStarAt(x, y);
     if (star) {
    showPopup(star, x, y);
     
      if (navigator.vibrate) navigator.vibrate(50);
     }
  });

  canvas.addEventListener('touchstart', e => {
    const t = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = t.clientX - rect.left;
    const y = t.clientY - rect.top;
    const star = getStarAt(x, y);
    if (star) showPopup(star, x, y);
  }, { passive: true });

  window.addEventListener('resize', resize);
  resize();
}

// ---- COMPLIMENT GENERATOR ----
window.generateCompliment = function() {
  const compliments = [
    "Your smile improves bad days.",
    "You make conversations feel effortless.",
    "You have a beautiful way of making people comfortable.",
    "You're one of the easiest people to appreciate.",
    "Your energy is contagious in the best way.",
    "You radiate a warmth that stays with people.",
    "You're the kind of person who makes memories without trying.",
    "Your kindness isn't loud — but it's felt.",
    "You have an elegance that can't be taught.",
    "You're someone worth writing poems about.",
    "There's a softness in your strength that's rare.",
    "You make people feel like they matter.",
    "Your laugh is one of those sounds that makes everything feel okay.",
    "You have a way of making ordinary moments feel meaningful.",
    "The universe was thoughtful when it made you.",
    "You carry yourself with a quiet confidence that's beautiful.",
    "People are genuinely better for knowing you.",
    "You're the kind of rare the world quietly needs more of.",
    "Your presence is a gift you probably underestimate.",
    "You have a beauty that goes all the way through.",
    "You're thoughtful in a world that often isn't.",
    "Something about you stays with people long after they've left.",
    "You make even silence feel comfortable.",
    "You're proof that some things in life are genuinely worth knowing.",
    "Your smile — it does something to the mood of a room.",
    "You're gentle and powerful at the same time.",
    "There's a brightness about you that no filter could recreate.",
    "You make the world feel less heavy.",
    "You're the kind of person who lights things up without realizing it.",
    "Extraordinary doesn't feel like an overstatement when it comes to you."
  ];

  const card = document.getElementById('compliment-card');
  const text = document.getElementById('compliment-text');
  const pick = compliments[Math.floor(Math.random() * compliments.length)];

  text.style.opacity = '0';
  text.style.transform = 'translateY(10px)';
  text.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  setTimeout(() => {
    text.textContent = pick;
    text.style.opacity = '1';
    text.style.transform = 'translateY(0)';
    card.style.animation = 'none'; card.offsetHeight;
    card.style.animation = 'compliment-glow 1.5s ease';
  }, 300);

  if (navigator.vibrate) navigator.vibrate(50);
};

// Add compliment glow keyframe
const cgStyle = document.createElement('style');
cgStyle.textContent = '@keyframes compliment-glow{0%{box-shadow:0 0 0 rgba(192,132,252,0)}50%{box-shadow:0 0 40px rgba(192,132,252,0.3)}100%{box-shadow:0 0 0 rgba(192,132,252,0)}}';
document.head.appendChild(cgStyle);

// ---- PARALLEL UNIVERSE ----
window.searchParallelUniverse = function() {
  const screen = document.getElementById('parallel-screen');
  const steps = [
    { delay: 0, html: `<div class="parallel-line">> Accessing Timeline Database...</div>` },
    { delay: 900, html: `<div class="parallel-line">> Searching alternate universes...</div>` },
    { delay: 1800, html: `<div class="parallel-line">> Scanning 10,847 parallel timelines...</div>` },
    { delay: 2700, html: `<div class="parallel-line">> Cross-referencing fate coordinates...</div>` },
    { delay: 3800, html: `<div class="parallel-line parallel-error">ERROR — CRITICAL DATA MISSING</div>` },
    {
      delay: 4600,
      html: `
        <div class="parallel-404">404</div>
        <div class="parallel-error" style="font-size:1rem;margin:8px 0">Priyanka Not Found</div>
        <div class="parallel-error">Happiness Not Found</div>
        <div class="parallel-error">Warmth Not Found</div>
        <div class="parallel-error">Smile Not Found</div>
        <br>
        <div class="parallel-return" style="font-family:var(--font-body);font-style:italic">
          Conclusion: A world without Priyanka<br>is not worth simulating.
        </div>
        <br>
        <div class="parallel-line" style="color:#4ade80">> Returning to main universe... ✓</div>
      `
    }
  ];

  screen.innerHTML = '<div class="parallel-icon">⏳</div>';

  let built = '';
  steps.forEach(step => {
    setTimeout(() => {
      if (step.delay === 0) { built = ''; }
      built += step.html;
      screen.innerHTML = `<div style="text-align:left;line-height:2;font-family:Courier New,monospace;font-size:0.8rem">${built}</div>`;
      screen.scrollTop = screen.scrollHeight;
    }, step.delay);
  });
};

// ---- CHAT AI ----
const chatAnswers = {
  default: [
    { q: null, answer: 'Searching universal database...\n\nResult found:\n\nPriyanka ❤️' }
  ]
};

window.askChat = function(q) {
  const msgs = document.getElementById('chat-msgs');

  // User message
  const userDiv = document.createElement('div');
  userDiv.className = 'chat-msg user-msg';
  userDiv.innerHTML = `<div class="msg-bubble">${q}</div>`;
  msgs.appendChild(userDiv);

  // Typing indicator
  const typingDiv = document.createElement('div');
  typingDiv.className = 'chat-msg bot-msg';
  typingDiv.innerHTML = `
    <div class="bot-av">🌌</div>
    <div class="typing-bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>
  `;
  msgs.appendChild(typingDiv);
  msgs.scrollTop = msgs.scrollHeight;

  setTimeout(() => {
    msgs.removeChild(typingDiv);

    const botDiv = document.createElement('div');
    botDiv.className = 'chat-msg bot-msg';

    const responses = [
      'Searching...\n\nAnalyzing 8 billion possibilities...\n\nResult Found:\n\n**Priyanka ❤️**',
      'Universal database queried.\n\nConclusion:\n\nPriyanka.',
      '[ UNIVERSE RESPONSE ]\n\nSearching...\n✓ Match confirmed:\n\nPriyanka ❤️',
      'Processing query...\n\nThe answer is always the same:\n\nPriyanka.',
    ];
    const pick = responses[Math.floor(Math.random() * responses.length)];
    const formatted = pick.replace(/\n/g, '<br>').replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--accent2)">$1</strong>');

    botDiv.innerHTML = `
      <div class="bot-av">🌌</div>
      <div class="msg-bubble">${formatted}</div>
    `;
    msgs.appendChild(botDiv);
    msgs.scrollTop = msgs.scrollHeight;

    if (navigator.vibrate) navigator.vibrate(50);
  }, 1800);
};

// ---- TIME CAPSULE ----
window.openCapsule = function() {
  const env = document.getElementById('envelope');
  const letter = document.getElementById('capsule-letter');
  if (env.classList.contains('opened')) return;
  env.classList.add('opened');
  setTimeout(() => {
    document.getElementById('envelope-area').style.display = 'none';
    letter.style.display = 'block';
  }, 800);
  if (navigator.vibrate) navigator.vibrate([50, 50, 100]);
};

// ---- MEMORY WALL ----
function initMemoryWall() {
  const photos = [
    'p1.jpg', 'p2.jpg', 'p3.jpg',
    'p4.jpg', 'p5.jpg', 'p6.jpg',
    'p7.webp', 'p8.jpg', 'p9.jpg',
    'p10.jpg', 'p11.jpg', 'p12.jpg'
  ];
  const quotes = [
    'Some people become part of your story without even trying.',
    'Certain memories never really fade.',
    'The best moments are often the unexpected ones.',
    'Some connections don\'t need explanation — they just are.',
    'The kind of warmth that stays long after the moment is gone.',
    'Some people make the world feel a little more beautiful.',
    'The moments we didn\'t plan are often the ones we remember most.',
    'Rare things are rare for a reason.',
    'Some people change the frequency of your life just by existing.',
    'There are people who leave a little light wherever they go.',
    'The ordinary becomes extraordinary in the right company.',
    'Some memories are worth carrying forever.'
  ];

  const wall = document.getElementById('memory-wall-inner');
  if (!wall) return;

  // Create 12 cards (photo + quote mix)
  for (let i = 0; i < 12; i++) {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.style.animationDelay = (i * 0.1) + 's';

    if (i % 3 !== 2) {
      const img = document.createElement('img');
      img.className = 'memory-card-photo';
      img.src = photos[i % photos.length];
      img.alt = 'Memory';
      img.loading = 'lazy';
      card.appendChild(img);
    }

    const quote = document.createElement('div');
    quote.className = 'memory-card-quote';
    quote.textContent = '"' + quotes[i % quotes.length] + '"';
    card.appendChild(quote);

    const star = document.createElement('div');
    star.className = 'memory-card-star';
    star.textContent = '✦ ✦ ✦';
    card.appendChild(star);

    wall.appendChild(card);
  }

  // Intersection observer
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  wall.querySelectorAll('.memory-card').forEach(c => {
    c.style.opacity = '0';
    c.style.transform = 'translateY(30px)';
    c.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(c);
  });
}

// ---- GRAND FINALE ----
window.startFinale = function() {
  document.getElementById('btn-finale').classList.add('hidden');

  const canvas = document.getElementById('finale-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  // Launch finale particles
  const fParts = [];
  for (let i = 0; i < 200; i++) {
    fParts.push({
      x: canvas.width / 2, y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4 - 1,
      r: Math.random() * 3 + 1,
      color: `hsl(${280 + Math.random() * 80},70%,${60 + Math.random() * 20}%)`,
      life: 1, decay: 0.008 + Math.random() * 0.005
    });
  }

  function drawFinaleParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fParts.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.03; p.life -= p.decay;
      if (p.life <= 0) return;
      ctx.globalAlpha = p.life;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color; ctx.shadowBlur = 6; ctx.shadowColor = p.color;
      ctx.fill();
    });
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    if (fParts.some(p => p.life > 0)) requestAnimationFrame(drawFinaleParticles);
  }
  drawFinaleParticles();

  // Typing finale messages
  const textEl = document.getElementById('finale-text');
  const heartEl = document.getElementById('finale-heart');
  const sigEl = document.getElementById('finale-sig');

  const passages = [
    'There are billions of people\nin this world.\n\nAnd yet,\n\nsomehow,\n\nI got lucky enough\nto know Priyanka.',
    'Some people become memories.\n\nSome become happiness.\n\nSome become reasons to smile.',
    'Thank you for existing, Priyanka.'
  ];

  let pi = 0;
  function typePassage(text, cb) {
    textEl.innerHTML = '';
    const lines = text.split('\n');
    let li = 0, ci = 0;
    let current = '';
    function step() {
      if (li >= lines.length) { if (cb) setTimeout(cb, 1500); return; }
      const line = lines[li];
      if (ci < line.length) {
        current += line[ci++];
        textEl.innerHTML = current.replace(/\n/g, '<br>') + '<span style="opacity:0.6">|</span>';
        setTimeout(step, 40);
      } else {
        current += '\n';
        textEl.innerHTML = current.replace(/\n/g, '<br>');
        li++; ci = 0;
        setTimeout(step, 300);
      }
    }
    step();
  }

  function runPassage() {
    if (pi >= passages.length) {
      // Show heart & sig
      setTimeout(() => {
        heartEl.classList.add('show');
        launchConfetti();
        setTimeout(() => sigEl.classList.add('show'), 1200);
        if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 400]);
      }, 800);
      return;
    }
    typePassage(passages[pi], () => {
      pi++;
      runPassage();
    });
  }
  runPassage();
};

// ---- SECTION REVEAL ----
function initSectionReveal() {
  const sections = document.querySelectorAll('.section');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
      }
    });
  }, { threshold: 0.1 });
  sections.forEach(s => {
    s.style.opacity = '0';
    s.style.transform = 'translateY(40px)';
    s.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(s);
  });

  const sStyle = document.createElement('style');
  sStyle.textContent = '.section-visible{opacity:1!important;transform:translateY(0)!important}';
  document.head.appendChild(sStyle);
}

// ---- EASTER EGGS ----
function initEasterEggs() {
  const hearts = document.querySelectorAll('.eh');
  let found = new Set();
  hearts.forEach(h => {
    h.addEventListener('click', () => {
      const n = parseInt(h.dataset.n);
      if (!found.has(n)) {
        found.add(n);
        h.classList.add('found');
        if (navigator.vibrate) navigator.vibrate([50, 30, 80]);
        if (found.size === hearts.length) {
          setTimeout(() => {
            document.getElementById('easter-page').style.display = 'flex';
            launchConfetti();
          }, 500);
        }
      }
    });
  });
}

window.closeEasterPage = function() {
  document.getElementById('easter-page').style.display = 'none';
};

// ---- PRIYANKA MODE ----
let priyankaActive = false;
let roseInterval = null;

function initPriyankaMode() {}

window.togglePriyankaMode = function() {
  priyankaActive = !priyankaActive;
  const btn = document.getElementById('pm-btn');
  const body = document.body;

  if (priyankaActive) {
    body.classList.add('priyanka-mode');
    btn.classList.add('active');
    btn.textContent = '🌸 Exit Priyanka Mode';
    if (typeof setParticlePriyankaMode === 'function') setParticlePriyankaMode(true);
    if (typeof musicSetPriyankaMode === 'function') musicSetPriyankaMode(true);
    startRoses();
  } else {
    body.classList.remove('priyanka-mode');
    btn.classList.remove('active');
    btn.textContent = '🌸 Priyanka Mode';
    if (typeof setParticlePriyankaMode === 'function') setParticlePriyankaMode(false);
    if (typeof musicSetPriyankaMode === 'function') musicSetPriyankaMode(false);
    stopRoses();
  }
};

function startRoses() {
  roseInterval = setInterval(() => {
    const rose = document.createElement('div');
    rose.className = 'floating-rose';
    rose.textContent = ['🌹', '🌸', '🌺', '💐', '🌷'][Math.floor(Math.random() * 5)];
    rose.style.left = (Math.random() * 100) + 'vw';
    rose.style.animationDuration = (6 + Math.random() * 6) + 's';
    rose.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
    document.body.appendChild(rose);
    setTimeout(() => rose.remove(), 12000);
  }, 600);
}

function stopRoses() {
  if (roseInterval) { clearInterval(roseInterval); roseInterval = null; }
  document.querySelectorAll('.floating-rose').forEach(r => r.remove());
}

// ---- CONFETTI ----
window.launchConfetti = function() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  canvas.style.display = 'block';

  const pieces = Array.from({ length: 150 }, () => ({
    x: Math.random() * canvas.width,
    y: -10,
    vx: (Math.random() - 0.5) * 6,
    vy: 2 + Math.random() * 5,
    r: 4 + Math.random() * 6,
    color: `hsl(${Math.random() * 360}, 80%, 65%)`,
    rotation: Math.random() * 360,
    rotV: (Math.random() - 0.5) * 8,
    life: 1,
    shape: Math.random() > 0.5 ? 'rect' : 'circle'
  }));

  let frame;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let any = false;
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.08;
      p.rotation += p.rotV;
      p.life -= 0.008;
      if (p.life <= 0 || p.y > canvas.height) return;
      any = true;
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * Math.PI / 180);
      if (p.shape === 'rect') ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
      else { ctx.beginPath(); ctx.arc(0, 0, p.r / 2, 0, Math.PI * 2); ctx.fill(); }
      ctx.restore();
    });
    ctx.globalAlpha = 1;
    if (any) frame = requestAnimationFrame(draw);
    else { canvas.style.display = 'none'; cancelAnimationFrame(frame); }
  }
  draw();

  setTimeout(() => { canvas.style.display = 'none'; cancelAnimationFrame(frame); }, 5000);
};
