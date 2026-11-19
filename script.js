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
