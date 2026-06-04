// ===========================
// GALAXY BACKGROUND SYSTEM
// ===========================
(function() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, stars = [], nebulas = [], shootingStars = [], mouse = { x: 0, y: 0 };
  let animFrame, priyankaMode = false;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initStars();
  }

  function initStars() {
    stars = [];
    nebulas = [];
    const count = Math.floor((W * H) / 3000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.8 + 0.2,
        opacity: Math.random() * 0.8 + 0.2,
        twinkle: Math.random() * 0.02 + 0.005,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
        speed: Math.random() * 0.05 + 0.01,
        parallax: Math.random() * 0.3 + 0.05,
        color: pickStarColor()
      });
    }
    for (let i = 0; i < 6; i++) {
      nebulas.push({
        x: Math.random() * W, y: Math.random() * H,
        r: 200 + Math.random() * 300,
        color: pickNebulaColor(),
        opacity: 0.025 + Math.random() * 0.035
      });
    }
  }

  function pickStarColor() {
    const colors = ['#fff', '#e0d0ff', '#ffd0e0', '#d0e0ff', '#ffe0a0', '#c0c0ff'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function pickNebulaColor() {
    const colors = priyankaMode
      ? ['rgba(244,114,182', 'rgba(232,121,249', 'rgba(251,113,133']
      : ['rgba(99,102,241', 'rgba(139,92,246', 'rgba(192,132,252', 'rgba(236,72,153', 'rgba(59,130,246'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function spawnShootingStar() {
    if (shootingStars.length < 3 && Math.random() < 0.007) {
      shootingStars.push({
        x: Math.random() * W * 0.8,
        y: Math.random() * H * 0.4,
        len: 80 + Math.random() * 100,
        speed: 8 + Math.random() * 12,
        opacity: 1,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
        life: 1
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Deep space gradient
    const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7);
    if (priyankaMode) {
      grad.addColorStop(0, '#140520');
      grad.addColorStop(0.5, '#0d0318');
      grad.addColorStop(1, '#050510');
    } else {
      grad.addColorStop(0, '#0d0a1e');
      grad.addColorStop(0.5, '#080515');
      grad.addColorStop(1, '#050510');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Nebulas
    nebulas.forEach(n => {
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
      g.addColorStop(0, n.color + ',' + (n.opacity * 2) + ')');
      g.addColorStop(1, n.color + ',0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Stars
    const mx = (mouse.x / W - 0.5) * 15;
    const my = (mouse.y / H - 0.5) * 15;
    stars.forEach(s => {
      s.opacity += s.twinkle * s.twinkleDir;
      if (s.opacity > 1 || s.opacity < 0.1) s.twinkleDir *= -1;
      s.y += s.speed * 0.1;
      if (s.y > H) s.y = 0;
      const px = s.x + mx * s.parallax;
      const py = s.y + my * s.parallax;
      ctx.globalAlpha = s.opacity;
      ctx.beginPath();
      ctx.arc(px, py, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.shadowBlur = s.r > 1.2 ? 6 : 0;
      ctx.shadowColor = s.color;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    // Shooting stars
    spawnShootingStar();
    shootingStars = shootingStars.filter(ss => ss.life > 0);
    shootingStars.forEach(ss => {
      ss.x += Math.cos(ss.angle) * ss.speed;
      ss.y += Math.sin(ss.angle) * ss.speed;
      ss.life -= 0.018;
      const ex = ss.x - Math.cos(ss.angle) * ss.len;
      const ey = ss.y - Math.sin(ss.angle) * ss.len;
      const g = ctx.createLinearGradient(ex, ey, ss.x, ss.y);
      g.addColorStop(0, 'rgba(255,255,255,0)');
      g.addColorStop(1, `rgba(255,240,255,${ss.life})`);
      ctx.strokeStyle = g; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ss.x, ss.y);
      ctx.stroke();
    });

    animFrame = requestAnimationFrame(draw);
  }

  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('touchmove', e => {
    if (e.touches[0]) { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; }
  }, { passive: true });
  window.addEventListener('resize', resize);

  window.setParticlePriyankaMode = function(on) {
    priyankaMode = on;
    nebulas.forEach(n => { n.color = pickNebulaColor(); });
  };

  resize();
  draw();
})();
