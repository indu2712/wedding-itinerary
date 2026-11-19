(() => {
  const button = document.getElementById('notification-button');
  const status = document.getElementById('notification-status');
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const installed = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  if (ios && !installed) {
    status.textContent = 'On iPhone or iPad, add this app to your Home Screen and open it there before enabling reminders.';
    return;
  }
  if (!window.isSecureContext || !('Notification' in window) || !('serviceWorker' in navigator)) {
    status.textContent = 'Notifications are unavailable in this browser. Try opening the installed app in a supported browser.';
    return;
  }
  if (!navigator.onLine) {
    status.textContent = 'Connect to the internet to enable reminders.';
    return;
  }
  const timeout = setTimeout(() => {
    if (button.disabled) status.textContent = 'Reminders could not be loaded. Check your connection and try again.';
  }, 12000);
  window.OneSignalDeferred = window.OneSignalDeferred || [];
  window.OneSignalDeferred.push(async OneSignal => {
    try {
      await OneSignal.init({
        appId: '31cdbb0c-5eb1-42fc-b5a9-d35feffb3877',
        serviceWorkerPath: 'wedding-itinerary/push/onesignal/OneSignalSDKWorker.js',
        serviceWorkerParam: { scope: '/wedding-itinerary/push/onesignal/' },
        notifyButton: { enable: false },
        promptOptions: { slidedown: { prompts: [{ type: 'push', autoPrompt: false }] } },
        allowLocalhostAsSecureOrigin: false
      });
      clearTimeout(timeout);
      if (!OneSignal.Notifications.isPushSupported()) {
        status.textContent = 'This browser does not support web notifications. Try Chrome on Android or the Home Screen app on iPhone.';
        return;
      }
      const refresh = () => {
        const sub = OneSignal.User.PushSubscription;
        if (sub.optedIn && sub.id && sub.token) {
          button.disabled = true;
          button.textContent = 'Reminders enabled';
          status.textContent = 'This device is subscribed to wedding reminders.';
        } else if (Notification.permission === 'denied') {
          button.disabled = true;
          status.textContent = 'Notifications are blocked. Enable them in your device or browser settings, then return here.';
        } else {
          button.disabled = false;
          status.textContent = 'Get a reminder before wedding events. You can change this in your notification settings.';
        }
      };
      OneSignal.User.PushSubscription.addEventListener('change', refresh);
      OneSignal.Notifications.addEventListener('permissionChange', refresh);
      button.addEventListener('click', () => {
        status.textContent = 'Follow your phone’s prompt to enable reminders.';
        OneSignal.User.PushSubscription.optIn();
      });
      refresh();
    } catch (error) {
      clearTimeout(timeout);
      status.textContent = 'Reminders are not available yet. Please try again later.';
      console.warn('Notification setup failed:', error);
    }
  });
  const sdk = document.createElement('script');
  sdk.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
  sdk.async = true;
  sdk.onerror = () => {
    clearTimeout(timeout);
    status.textContent = 'Reminders could not be loaded. Check your connection and try again.';
  };
  document.head.appendChild(sdk);
})();
