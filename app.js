/* app.js — all client-side behavior for the link-in-bio page.
   Served from the same origin as index.html. No external calls. */

/* ── live clock (privacy-respecting: local time only, no network) ── */
(function () {
  const el = document.getElementById('clock');
  function tick() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    el.textContent = `${h}:${m}:${s}`;
  }
  tick();
  setInterval(tick, 1000);
})();

/* ── easter egg: type "j" three times, or tap avatar 5 times ── */
(function () {
  const egg = document.getElementById('easterEgg');
  let keyBuffer = '';
  let tapCount = 0;
  let tapTimer = null;

  document.addEventListener('keydown', function (e) {
    if (e.key.toLowerCase() === 'j') {
      keyBuffer += 'j';
      if (keyBuffer.length > 3) keyBuffer = keyBuffer.slice(-3);
      if (keyBuffer === 'jjj') {
        egg.classList.add('show');
        setTimeout(function () { egg.classList.remove('show'); }, 4000);
        keyBuffer = '';
      }
    } else {
      keyBuffer = '';
    }
  });

  const avatar = document.querySelector('.profile-avatar');
  if (avatar) {
    avatar.addEventListener('click', function () {
      tapCount++;
      clearTimeout(tapTimer);
      tapTimer = setTimeout(function () { tapCount = 0; }, 1200);
      if (tapCount >= 5) {
        egg.classList.add('show');
        setTimeout(function () { egg.classList.remove('show'); }, 4000);
        tapCount = 0;
      }
    });
  }
})();

/* ── Bitcoin panel: toggle, reveal-full-address, copy-to-clipboard ── */
(function () {
  const toggleBtn = document.getElementById('bitcoinToggle');
  const panel = document.getElementById('bitcoinPanel');
  const chevron = document.getElementById('bitcoinChevron');
  const addressBox = document.getElementById('bitcoinAddress');
  const addrValue = document.getElementById('bitcoinAddrValue');
  const revealBtn = document.getElementById('bitcoinReveal');
  const revealLabel = document.getElementById('bitcoinRevealLabel');
  const copyBtn = document.getElementById('bitcoinCopy');

  if (!toggleBtn || !panel) return;

  toggleBtn.addEventListener('click', function () {
    const isOpen = panel.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    if (chevron) chevron.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
  });

  if (revealBtn && addrValue) {
    revealBtn.addEventListener('click', function () {
      const isRevealed = revealBtn.getAttribute('aria-expanded') === 'true';
      if (isRevealed) {
        addrValue.textContent = revealBtn.getAttribute('data-short');
        revealBtn.setAttribute('aria-expanded', 'false');
        if (revealLabel) revealLabel.textContent = 'Show full';
        if (addressBox) addressBox.classList.remove('revealed');
      } else {
        addrValue.textContent = revealBtn.getAttribute('data-full');
        revealBtn.setAttribute('aria-expanded', 'true');
        if (revealLabel) revealLabel.textContent = 'Hide';
        if (addressBox) addressBox.classList.add('revealed');
      }
    });
  }

  if (copyBtn) {
    const fullAddress = copyBtn.getAttribute('data-address');
    copyBtn.addEventListener('click', async function () {
      const original = copyBtn.innerHTML;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(fullAddress);
        } else {
          const ta = document.createElement('textarea');
          ta.value = fullAddress;
          ta.setAttribute('readonly', '');
          ta.style.position = 'absolute';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i><span>Copied — verify in wallet</span>';
        setTimeout(function () {
          copyBtn.classList.remove('copied');
          copyBtn.innerHTML = original;
        }, 2600);
      } catch (err) {
        copyBtn.innerHTML = '<i class="fa-solid fa-xmark"></i><span>Copy failed — select manually</span>';
        setTimeout(function () {
          copyBtn.innerHTML = original;
        }, 2600);
      }
    });
  }
})();
