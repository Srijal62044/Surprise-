// ===========================
// SECRET VAULT
// ===========================
(function() {
  const CODE = '2007';
  const wrap = document.getElementById('vault-wrap');

  // Build vault UI
  wrap.innerHTML = `
    <div class="vault-door" id="vault-door">
      <div class="vault-icon">🔐</div>
      <div class="vault-title">SECRET VAULT</div>
      <div class="vault-hint">Hint: Someones Birth Of Year😜<br><small style="opacity:0.5;font-size:0.7rem;letter-spacing:0.1em">(4 letters)</small></div>
      <div class="vault-input-row" id="vault-input-row">
        <input class="vault-char" maxlength="1" type="text" autocomplete="off" data-i="0">
        <input class="vault-char" maxlength="1" type="text" autocomplete="off" data-i="1">
        <input class="vault-char" maxlength="1" type="text" autocomplete="off" data-i="2">
        <input class="vault-char" maxlength="1" type="text" autocomplete="off" data-i="3">
      </div>
      <div class="vault-error" id="vault-error"></div>
      <button class="btn-primary" id="btn-vault" onclick="checkVault()" style="margin-top:0">Unlock Vault</button>
    </div>
    <div class="vault-letter" id="vault-letter">
      <div class="vault-letter-title">✦ DECRYPTED MESSAGE ✦</div>
      <div class="vault-letter-text">
        Dear Huggu😋,<br><br>
        You probably don't realize it,<br>
        but you've made many ordinary days<br>
        feel a little more special.<br><br>
        Thank you for every conversation,<br>
        every laugh,<br>
        every moment you were just yourself —<br>
        because that was always more than enough.<br><br>
        Some people enter life quietly<br>
        and change everything without trying.<br>
        You're one of those people.<br><br>
        <span class="vault-letter-sig">— Srijal</span>
      </div>
    </div>
  `;

  const inputs = wrap.querySelectorAll('.vault-char');

  inputs.forEach((inp, idx) => {
    inp.addEventListener('keyup', e => {
      const val = inp.value.replace(/[^a-zA-Z]/g, '').slice(-1).toUpperCase();
      inp.value = val;
      if (val && idx < inputs.length - 1) {
        inputs[idx + 1].focus();
      }
      if (e.key === 'Backspace' && !inp.value && idx > 0) {
        inputs[idx - 1].focus();
      }
      if (e.key === 'Enter') checkVault();
      document.getElementById('vault-error').textContent = '';
    });
    inp.addEventListener('focus', () => inp.select());
  });

  window.checkVault = function() {
    const entered = Array.from(inputs).map(i => i.value.toUpperCase()).join('');
    if (entered === CODE) {
      document.getElementById('vault-door').style.display = 'none';
      const letter = document.getElementById('vault-letter');
      letter.classList.add('open');
      launchConfetti();
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    } else if (entered.length < 4) {
      document.getElementById('vault-error').textContent = 'Please enter all 4 letters.';
    } else {
      document.getElementById('vault-error').textContent = '✗ Incorrect. Try again...';
      inputs.forEach(i => {
        i.style.borderColor = '#ef4444';
        setTimeout(() => { i.style.borderColor = ''; }, 1000);
      });
      // Shake animation
      const row = document.getElementById('vault-input-row');
      row.style.animation = 'none';
      row.offsetHeight;
      row.style.animation = 'shake 0.4s ease';
    }
  };

  // Add shake keyframe
  const style = document.createElement('style');
  style.textContent = '@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}';
  document.head.appendChild(style);
})();
