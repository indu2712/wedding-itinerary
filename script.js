// The wedding weekend starts at midnight in Bangalore (India Standard Time).
const countdownNumber = document.getElementById('countdown-number');
const countdownLabel = document.getElementById('countdown-label');
const weekendStart = Date.parse('2027-02-26T00:00:00+05:30');
const weekendEnd = Date.parse('2027-02-28T00:00:00+05:30');

function updateCountdown() {
  const now = Date.now();
  if (now >= weekendEnd) {
    countdownNumber.textContent = '♥';
    countdownLabel.textContent = 'Thank you for celebrating with us';
  } else if (now >= weekendStart) {
    countdownNumber.textContent = '♥';
    countdownLabel.textContent = 'The wedding weekend is here!';
  } else {
    const days = Math.ceil((weekendStart - now) / 86400000);
    countdownNumber.textContent = days;
    countdownLabel.textContent = `${days === 1 ? 'day' : 'days'} until the weekend`;
  }
}
updateCountdown();
setInterval(updateCountdown, 60000);

// Offline support requires HTTPS (or localhost) and a supported browser.
if ('serviceWorker' in navigator && window.isSecureContext) {
  navigator.serviceWorker.register('./service-worker.js').catch(error => {
    console.warn('Offline support could not be enabled:', error);
  });
}

let installPrompt;
const installButton = document.getElementById('install-button');
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  installPrompt = event;
  installButton.hidden = false;
});
installButton.addEventListener('click', async () => {
  if (!installPrompt) return;
  await installPrompt.prompt();
  installPrompt = null;
  installButton.hidden = true;
});
window.addEventListener('appinstalled', () => {
  installPrompt = null;
  installButton.hidden = true;
});

// Browser-specific installation guide by Philip Fung (MIT licence).
const guideButton = document.getElementById('guide-button');
const isInstalled = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
if (!isInstalled && typeof window.AddToHomeScreen === 'function') {
  const guide = window.AddToHomeScreen({
    appName: 'Yukti & Indushan’s Wedding',
    appIconUrl: 'assets/apple-touch-icon.png',
    assetUrl: 'vendor/add-to-homescreen/assets/',
    maxModalDisplayCount: -1,
    displayOptions: { showMobile: true, showDesktop: true },
    allowClose: true,
    showArrow: true
  });
  guideButton.hidden = false;
  guideButton.addEventListener('click', () => guide.show('en'));
  if (isMobile) {
    try {
      if (!localStorage.getItem('wedding-install-guide-seen')) {
        localStorage.setItem('wedding-install-guide-seen', '1');
        guide.show('en');
      }
    } catch (_) {
      // The manual button remains available when browser storage is blocked.
    }
  }
}
