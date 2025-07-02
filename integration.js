// PWA Integration for Sanctuary Keeper
class PWAIntegration {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.isOnline = navigator.onLine;
    this.serviceWorkerRegistration = null;
    
    this.init();
  }
  
  async init() {
    console.log('🔧 PWA Integration initializing...');
    
    // Register service worker
    await this.registerServiceWorker();
    
    // Setup install prompt
    this.setupInstallPrompt();
    
    // Setup offline detection
    this.setupOfflineDetection();
    
    // Setup periodic sync
    this.setupPeriodicSync();
    
    // Setup push notifications
    this.setupPushNotifications();
    
    // Handle app shortcuts
    this.handleAppShortcuts();
    
    // Setup beforeinstallprompt event
    this.setupBeforeInstallPrompt();
    
    console.log('✅ PWA Integration initialized successfully');
  }
  
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });
        
        this.serviceWorkerRegistration = registration;
        console.log('✅ Service Worker registered:', registration.scope);
        
        // Handle service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('🔄 New service worker installing...');
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.showUpdateAvailableNotification();
            }
          });
        });
        
        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          this.handleServiceWorkerMessage(event.data);
        });
        
      } catch (error) {
        console.error('❌ Service Worker registration failed:', error);
      }
    } else {
      console.warn('⚠️ Service Worker not supported');
    }
  }
  
  setupInstallPrompt() {
    const installBanner = document.getElementById('pwaInstallBanner');
    const installButton = document.getElementById('pwaInstallButton');
    const dismissButton = document.getElementById('pwaInstallDismiss');
    
    if (!installBanner || !installButton || !dismissButton) {
      console.warn('⚠️ Install banner elements not found');
      return;
    }
    
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      this.isInstalled = true;
      installBanner.style.display = 'none';
      return;
    }
    
    // Check if user has dismissed the banner before
    if (localStorage.getItem('pwa-install-dismissed') === 'true') {
      installBanner.style.display = 'none';
      return;
    }
    
    // Show install banner after delay
    setTimeout(() => {
      if (this.deferredPrompt && !this.isInstalled) {
        installBanner.style.display = 'block';
      }
    }, 5000);
    
    // Handle install button click
    installButton.addEventListener('click', () => {
      this.promptInstall();
    });
    
    // Handle dismiss button click
    dismissButton.addEventListener('click', () => {
      installBanner.style.display = 'none';
      localStorage.setItem('pwa-install-dismissed', 'true');
    });
  }
  
  setupBeforeInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (event) => {
      console.log('📱 beforeinstallprompt event fired');
      
      // Prevent the mini-infobar from appearing
      event.preventDefault();
      
      // Save the event for later use
      this.deferredPrompt = event;
    });
    
    window.addEventListener('appinstalled', (event) => {
      console.log('✅ PWA was installed');
      this.isInstalled = true;
      
      // Hide install banner
      const installBanner = document.getElementById('pwaInstallBanner');
      if (installBanner) {
        installBanner.style.display = 'none';
      }
      
      // Track installation
      this.trackEvent('pwa_installed');
    });
  }
  
  async promptInstall() {
    if (!this.deferredPrompt) {
      console.warn('⚠️ Install prompt not available');
      return;
    }
    
    try {
      // Show the install prompt
      this.deferredPrompt.prompt();
      
      // Wait for user response
      const { outcome } = await this.deferredPrompt.userChoice;
      
      console.log(`👤 User ${outcome} the install prompt`);
      
      if (outcome === 'accepted') {
        this.trackEvent('pwa_install_accepted');
      } else {
        this.trackEvent('pwa_install_dismissed');
      }
      
      // Clear the prompt
      this.deferredPrompt = null;
      
      // Hide install banner
      const installBanner = document.getElementById('pwaInstallBanner');
      if (installBanner) {
        installBanner.style.display = 'none';
      }
      
    } catch (error) {
      console.error('❌ Install prompt error:', error);
    }
  }
  
  setupOfflineDetection() {
    const offlineIndicator = document.getElementById('offlineIndicator');
    
    if (!offlineIndicator) {
      console.warn('⚠️ Offline indicator element not found');
      return;
    }
    
    // Update online status
    const updateOnlineStatus = () => {
      this.isOnline = navigator.onLine;
      
      if (this.isOnline) {
        offlineIndicator.style.display = 'none';
        console.log('🌐 Back online');
        this.handleBackOnline();
      } else {
        offlineIndicator.style.display = 'block';
        console.log('📡 Gone offline');
        this.handleGoOffline();
      }
    };
    
    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Initial check
    updateOnlineStatus();
  }
  
  handleBackOnline() {
    // Trigger background sync when back online
    if (this.serviceWorkerRegistration && 'sync' in window.ServiceWorkerRegistration.prototype) {
      this.serviceWorkerRegistration.sync.register('user-data-sync');
      this.serviceWorkerRegistration.sync.register('attendance-submission');
    }
    
    // Show toast notification
    this.showToast('🌐 Back online! Syncing data...', 'success');
    
    // Refresh critical data
    this.refreshCriticalData();
  }
  
  handleGoOffline() {
    // Show offline notification
    this.showToast('📡 You\'re offline. Limited functionality available.', 'warning');
    
    // Enable offline mode in the app
    document.body.classList.add('offline-mode');
  }
  
  async setupPeriodicSync() {
    if ('serviceWorker' in navigator && this.serviceWorkerRegistration) {
      try {
        // Register periodic background sync (requires permission)
        if ('periodicSync' in this.serviceWorkerRegistration) {
          const status = await navigator.permissions.query({ name: 'periodic-background-sync' });
          
          if (status.state === 'granted') {
            await this.serviceWorkerRegistration.periodicSync.register('user-data-sync', {
              minInterval: 24 * 60 * 60 * 1000, // 24 hours
            });
            console.log('✅ Periodic sync registered');
          }
        }
      } catch (error) {
        console.warn('⚠️ Periodic sync not supported or failed:', error);
      }
    }
  }
  
  async setupPushNotifications() {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      try {
        // Check current permission
        let permission = Notification.permission;
        
        if (permission === 'default') {
          // Request permission if not already granted or denied
          permission = await Notification.requestPermission();
        }
        
        if (permission === 'granted' && this.serviceWorkerRegistration) {
          console.log('✅ Push notifications permission granted');
          
          // Subscribe to push notifications
          const subscription = await this.serviceWorkerRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: this.urlBase64ToUint8Array(
              'BEl62iUYgUivxIkv69yViEuiBIa40HI80NM-QdUbLI8'  // Replace with your VAPID public key
            )
          });
          
          // Send subscription to server
          await this.sendSubscriptionToServer(subscription);
          
        } else {
          console.warn('⚠️ Push notifications permission denied');
        }
      } catch (error) {
        console.error('❌ Push notification setup failed:', error);
      }
    }
  }
  
  handleAppShortcuts() {
    // Handle URL parameters for app shortcuts
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    
    if (action) {
      this.handleShortcutAction(action);
    }
    
    // Handle hash-based shortcuts
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      this.handleShortcutAction(hash);
    }
  }
  
  handleShortcutAction(action) {
    console.log('🔗 Handling shortcut action:', action);
    
    switch (action) {
      case 'submit-attendance':
        // Navigate to attendance submission
        setTimeout(() => {
          if (typeof handleSummarySubmitAttendance === 'function') {
            handleSummarySubmitAttendance();
          }
        }, 1000);
        break;
        
      case 'admin-panel':
        // Navigate to admin panel
        setTimeout(() => {
          if (typeof handleAdminIconClick === 'function') {
            handleAdminIconClick();
          }
        }, 1000);
        break;
        
      default:
        console.warn('⚠️ Unknown shortcut action:', action);
    }
    
    // Clear the URL parameter/hash
    if (window.history && window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }
  
  handleServiceWorkerMessage(data) {
    console.log('📩 Message from service worker:', data);
    
    switch (data.type) {
      case 'SYNC_COMPLETE':
        this.handleSyncComplete(data.payload);
        break;
        
      case 'CACHE_UPDATED':
        this.handleCacheUpdated(data.payload);
        break;
        
      case 'OFFLINE_SUBMISSION_STORED':
        this.showToast('📝 Attendance saved offline. Will sync when online.', 'info');
        break;
        
      default:
        console.warn('⚠️ Unknown service worker message type:', data.type);
    }
  }
  
  handleSyncComplete(payload) {
    if (payload.type === 'attendance') {
      this.showToast('✅ Offline attendance submissions synced!', 'success');
      
      // Refresh the UI to show updated data
      if (typeof updateUISummaryPageContent === 'function') {
        updateUISummaryPageContent();
      }
    }
  }
  
  handleCacheUpdated(payload) {
    console.log('🔄 Cache updated:', payload);
    
    // Refresh UI with updated data if necessary
    if (payload.url.includes('/api/user-profile')) {
      if (typeof updateUISummaryPageContent === 'function') {
        updateUISummaryPageContent();
      }
    }
  }
  
  async refreshCriticalData() {
    try {
      // Refresh user profile data
      if (typeof navigateToSummaryPage === 'function') {
        await navigateToSummaryPage();
      }
      
      // Refresh announcements
      if (typeof displayAnnouncementOnPage === 'function') {
        displayAnnouncementOnPage();
      }
      
      console.log('✅ Critical data refreshed');
    } catch (error) {
      console.error('❌ Failed to refresh critical data:', error);
    }
  }
  
  showUpdateAvailableNotification() {
    const updateMessage = 'A new version of Sanctuary Keeper is available. Refresh to update?';
    
    if (confirm(updateMessage)) {
      // Tell the service worker to skip waiting
      if (this.serviceWorkerRegistration && this.serviceWorkerRegistration.waiting) {
        this.serviceWorkerRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
        
        // Refresh the page when the new service worker takes control
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload();
        });
      }
    }
  }
  
  async sendSubscriptionToServer(subscription) {
    try {
      // Send push subscription to your backend
      const response = await fetch('/api/push-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: subscription,
          userId: this.getCurrentUserId()
        })
      });
      
      if (response.ok) {
        console.log('✅ Push subscription sent to server');
      } else {
        console.error('❌ Failed to send push subscription to server');
      }
    } catch (error) {
      console.error('❌ Error sending push subscription:', error);
    }
  }
  
  getCurrentUserId() {
    // Get current user ID from your app's user management system
    try {
      const userData = localStorage.getItem('SK_CurrentUser');
      if (userData) {
        const user = JSON.parse(userData);
        return user.firebaseUid || user.memberId;
      }
    } catch (error) {
      console.error('❌ Error getting current user ID:', error);
    }
    return null;
  }
  
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  
  showToast(message, type = 'info', duration = 3000) {
    // Use the existing toast system if available
    if (typeof showToast === 'function') {
      showToast(message, type, duration);
      return;
    }
    
    // Fallback toast implementation
    const toast = document.createElement('div');
    toast.className = `pwa-toast pwa-toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: ${this.getToastColor(type)};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 10000;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, duration);
  }
  
  getToastColor(type) {
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6'
    };
    return colors[type] || colors.info;
  }
  
  trackEvent(eventName, properties = {}) {
    console.log('📊 PWA Event:', eventName, properties);
    
    // Integrate with your analytics system here
    // Example: Google Analytics 4
    if (typeof gtag === 'function') {
      gtag('event', eventName, {
        app_name: 'Sanctuary Keeper',
        app_version: '1.0.0',
        ...properties
      });
    }
  }
  
  // Public methods for app integration
  
  async cacheOfflineSubmission(submissionData) {
    if (this.serviceWorkerRegistration) {
      // Send data to service worker for offline storage
      navigator.serviceWorker.controller?.postMessage({
        type: 'CACHE_ATTENDANCE',
        payload: submissionData
      });
      
      // Also register for background sync
      if ('sync' in this.serviceWorkerRegistration) {
        await this.serviceWorkerRegistration.sync.register('attendance-submission');
      }
    }
  }
  
  isAppInstalled() {
    return this.isInstalled || 
           window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
  }
  
  isAppOnline() {
    return this.isOnline;
  }
  
  async requestPersistentStorage() {
    if ('storage' in navigator && 'persist' in navigator.storage) {
      try {
        const persistent = await navigator.storage.persist();
        console.log(persistent ? '✅ Persistent storage granted' : '⚠️ Persistent storage denied');
        return persistent;
      } catch (error) {
        console.error('❌ Error requesting persistent storage:', error);
        return false;
      }
    }
    return false;
  }
  
  async estimateStorage() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        console.log('💾 Storage estimate:', estimate);
        return estimate;
      } catch (error) {
        console.error('❌ Error estimating storage:', error);
        return null;
      }
    }
    return null;
  }
  
  // Share API integration
  async shareContent(shareData) {
    if ('share' in navigator) {
      try {
        await navigator.share(shareData);
        console.log('✅ Content shared successfully');
        this.trackEvent('content_shared', { type: shareData.title });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('❌ Error sharing content:', error);
        }
      }
    } else {
      // Fallback: copy to clipboard
      if ('clipboard' in navigator) {
        try {
          await navigator.clipboard.writeText(shareData.url || shareData.text);
          this.showToast('📋 Copied to clipboard!', 'success');
        } catch (error) {
          console.error('❌ Error copying to clipboard:', error);
        }
      }
    }
  }
  
  // Badging API for app icon badges
  setBadge(count = 0) {
    if ('setAppBadge' in navigator) {
      navigator.setAppBadge(count).catch(error => {
        console.error('❌ Error setting app badge:', error);
      });
    }
  }
  
  clearBadge() {
    if ('clearAppBadge' in navigator) {
      navigator.clearAppBadge().catch(error => {
        console.error('❌ Error clearing app badge:', error);
      });
    }
  }
}

// Initialize PWA Integration when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.pwaIntegration = new PWAIntegration();
});

// Export for use in other parts of the app
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PWAIntegration;
}

// Global PWA utilities
window.PWAUtils = {
  // Check if running as PWA
  isPWA: () => {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
  },
  
  // Check if PWA installation is available
  canInstall: () => {
    return window.pwaIntegration && window.pwaIntegration.deferredPrompt !== null;
  },
  
  // Trigger PWA installation
  install: () => {
    if (window.pwaIntegration) {
      return window.pwaIntegration.promptInstall();
    }
  },
  
  // Check online status
  isOnline: () => {
    return window.pwaIntegration ? window.pwaIntegration.isAppOnline() : navigator.onLine;
  },
  
  // Share functionality
  share: (data) => {
    if (window.pwaIntegration) {
      return window.pwaIntegration.shareContent(data);
    }
  },
  
  // Badge functionality
  setBadge: (count) => {
    if (window.pwaIntegration) {
      window.pwaIntegration.setBadge(count);
    }
  },
  
  clearBadge: () => {
    if (window.pwaIntegration) {
      window.pwaIntegration.clearBadge();
    }
  }
};