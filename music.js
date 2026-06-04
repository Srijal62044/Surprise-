// ===========================
// MUSIC PLAYER
// ===========================
(function() {
  const audio = document.getElementById('audio-player');
  const btnPlay = document.getElementById('btn-play');
  const btnMute = document.getElementById('btn-mute');
  const prog = document.getElementById('music-prog');
  const eq = document.getElementById('music-eq');
  const volSlider = document.getElementById('vol-slider');
  let isMuted = false;

  audio.volume = 0.6;

  window.musicToggle = function() {
    if (audio.paused) {
      audio.play().then(() => {
        btnPlay.textContent = '⏸';
        eq.classList.remove('paused');
      }).catch(() => {});
    } else {
      audio.pause();
      btnPlay.textContent = '▶';
      eq.classList.add('paused');
    }
  };

  window.musicMute = function() {
    isMuted = !isMuted;
    audio.muted = isMuted;
    btnMute.textContent = isMuted ? '🔇' : '🔊';
  };

  window.setVol = function(val) {
    audio.volume = val / 100;
    if (val == 0) { audio.muted = true; btnMute.textContent = '🔇'; }
    else { audio.muted = false; btnMute.textContent = '🔊'; isMuted = false; }
  };

  window.seekMusic = function(e) {
    const wrap = e.currentTarget;
    const rect = wrap.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    if (audio.duration) audio.currentTime = ratio * audio.duration;
  };

  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      const pct = (audio.currentTime / audio.duration) * 100;
      prog.style.width = pct + '%';
    }
  });

  audio.addEventListener('ended', () => {
    btnPlay.textContent = '▶';
    eq.classList.add('paused');
    prog.style.width = '0%';
  });

  // Auto-play after user interaction
  function tryAutoplay() {
    document.removeEventListener('click', tryAutoplay);
    document.removeEventListener('touchstart', tryAutoplay);
    audio.play().then(() => {
      btnPlay.textContent = '⏸';
      eq.classList.remove('paused');
    }).catch(() => {});
  }
  document.addEventListener('click', tryAutoplay);
  document.addEventListener('touchstart', tryAutoplay, { passive: true });

  // Priyanka mode: add extra glow effect to player
  window.musicSetPriyankaMode = function(on) {
    const player = document.getElementById('music-player');
    if (on) {
      player.style.boxShadow = '0 0 40px rgba(244,114,182,0.4), 0 8px 32px rgba(0,0,0,0.3)';
      player.style.borderColor = 'rgba(244,114,182,0.3)';
    } else {
      player.style.boxShadow = '';
      player.style.borderColor = '';
    }
  };
})();
