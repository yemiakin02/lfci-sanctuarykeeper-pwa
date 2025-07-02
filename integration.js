// ==========================================
// FILE 3: pwa-integration.js (Save as: public/pwa-integration.js)
// ==========================================

class SanctuaryKeeperPWA {
  constructor() {
    this.deferredPrompt = null;
    this.isOnline = navigator.onLine;
    this.isInstalled = this.checkIfInstalled();
    
    // Your actual Firebase configuration
    this.firebaseConfig = {
      apiKey: "AIzaSyAwfkDMy5hCWNBBHhLApXRZmvYIZVo7vOE",
      authDomain: "attendance-system-c8323.firebaseapp.com",
      projectId: "attendance-system-c8323",
      storageBucket: "attendance-system-c8323.firebasestorage.app",
      messagingSenderId: "285619179838",
      appId: "1:285619179838:web:46a8f37de16ff59d9edc6f"
    };
    
    // Your actual VAPID key
    this.vapidKey = "BN1oojhOz-akRmj9qYgoxVByQqWzBaCzsjm3tLZrk9GuLEqTnzqHCTUeCQkp_ysz9K4VH86u5sTlcupkqCviBhY";
    
    this.init();
  }

  async init() {
    console.log('🏛️ Initializing Sanctuary Keeper PWA...');
    
    await this.registerServiceWorker();
    this.setupInstallPrompt();
    this.setupOfflineHandling();
    await this.initFirebase();
    await this.setupNotifications();
    this.connectExistingForms();
    this.addInstallButton();
    
    console.log('✅ Sanctuary Keeper PWA Ready!');
  }

  // SERVICE WORKER REGISTRATION
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('✅ Service Worker registered');
        
        registration.addEventListener('updatefound', () => {
          this.showUpdateNotification();
        });

        return registration;
      } catch (error) {
        console.error('❌ Service Worker registration failed:', error);
      }
    }
  }

  showUpdateNotification() {
    this.showToast('New version available! Please refresh.', 'info');
  }

  // PWA INSTALLATION
  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallButton();
    });

    window.addEventListener('appinstalled', () => {
      console.log('✅ Sanctuary Keeper installed');
      this.isInstalled = true;
      this.hideInstallButton();
      this.showToast('Sanctuary Keeper installed successfully!', 'success');
    });
  }

  addInstallButton() {
    const installBtn = document.createElement('button');
    installBtn.id = 'pwa-install-btn';
    installBtn.innerHTML = '📱';
    installBtn.title = 'Install Sanctuary Keeper App';
    installBtn.style.cssText = `
      position: fixed;
      top: 70px;
      right: 20px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 100;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
    `;
    
    installBtn.addEventListener('click', () => this.installApp());
    installBtn.addEventListener('mouseenter', () => {
      installBtn.style.transform = 'scale(1.1)';
    });
    installBtn.addEventListener('mouseleave', () => {
      installBtn.style.transform = 'scale(1)';
    });
    
    document.body.appendChild(installBtn);
  }

  showInstallButton() {
    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) {
      installBtn.style.display = 'flex';
    }
  }

  hideInstallButton() {
    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) {
      installBtn.style.display = 'none';
    }
  }

  async installApp() {
    if (!this.deferredPrompt) return false;

    try {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        this.showToast('Installing Sanctuary Keeper...', 'success');
      }
      
      this.deferredPrompt = null;
      this.hideInstallButton();
      
      return outcome === 'accepted';
    } catch (error) {
      console.error('❌ Installation error:', error);
      return false;
    }
  }

  checkIfInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
  }

  // FIREBASE INTEGRATION
  async initFirebase() {
    try {
      const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
      const { getFirestore, collection, addDoc, getDocs, serverTimestamp, onSnapshot } = 
        await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');

      this.app = initializeApp(this.firebaseConfig);
      this.db = getFirestore(this.app);
      this.firestoreModules = { collection, addDoc, getDocs, serverTimestamp, onSnapshot };
      
      console.log('✅ Firebase connected to attendance-system-c8323');
    } catch (error) {
      console.error('❌ Firebase connection failed:', error);
      this.showToast('Database connection failed. Working offline.', 'warning');
    }
  }

  // FORM INTEGRATION - Works with your existing forms
  connectExistingForms() {
    // Auto-enhance forms with data-pwa-sync attribute
    const pwaForms = document.querySelectorAll('form[data-pwa-sync]');
    pwaForms.forEach(form => {
      const collection = form.dataset.pwaSync;
      this.enhanceForm(form, collection);
    });

    // Find common form patterns in your existing code
    this.findAndEnhanceForms();
  }

  findAndEnhanceForms() {
    // Look for attendance forms
    const attendanceForms = document.querySelectorAll(
      '#attendanceForm, .attendance-form, form[action*="attendance"]'
    );
    attendanceForms.forEach(form => this.enhanceForm(form, 'attendance_pwa'));

    // Look for registration forms  
    const registrationForms = document.querySelectorAll(
      '#registrationForm, .registration-form, form[action*="register"]'
    );
    registrationForms.forEach(form => this.enhanceForm(form, 'registrations_pwa'));

    // Look for admin forms
    const adminForms = document.querySelectorAll(
      '.admin-card form, .admin-form'
    );
    adminForms.forEach(form => this.enhanceForm(form, 'admin_actions_pwa'));
  }

  enhanceForm(form, collectionName) {
    console.log(`📝 Enhancing form for ${collectionName} collection`);
    
    form.addEventListener('submit', async (e) => {
      // Don't prevent default - let your existing code run
      
      try {
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Add PWA metadata
        data._pwa_timestamp = new Date().toISOString();
        data._pwa_collection = collectionName;
        data._pwa_online = this.isOnline;
        data._pwa_source = 'sanctuary_keeper';
        data._pwa_user_agent = navigator.userAgent;
        
        // Save to Firestore or offline storage
        if (this.isOnline && this.db) {
          await this.saveToFirestore(data, collectionName);
          console.log(`✅ Saved to ${collectionName} collection in Firestore`);
        } else {
          this.saveOffline(data, collectionName);
          console.log(`💾 Saved ${collectionName} data offline`);
          this.showToast('Data saved offline. Will sync when online.', 'info');
        }
        
      } catch (error) {
        console.error('❌ PWA save failed:', error);
        // Don't break the form - your existing functionality continues
      }
    });
  }

  async saveToFirestore(data, collectionName) {
    if (!this.db || !this.firestoreModules) return;
    
    const { collection, addDoc, serverTimestamp } = this.firestoreModules;
    
    return await addDoc(collection(this.db, collectionName), {
      ...data,
      timestamp: serverTimestamp(),
      source: 'sanctuary_keeper_pwa',
      project: 'attendance-system-c8323'
    });
  }

  saveOffline(data, collectionName) {
    const offlineKey = `offline_${collectionName}_${Date.now()}`;
    const offlineData = {
      data: data,
      collection: collectionName,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(offlineKey, JSON.stringify(offlineData));
    
    // Schedule background sync
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then(registration => {
        return registration.sync.register('attendance-sync');
      });
    }
  }

  // OFFLINE HANDLING
  setupOfflineHandling() {
    window.addEventListener('online', () => {
      console.log('🌐 Back online');
      this.isOnline = true;
      this.updateConnectionStatus(true);
      this.syncOfflineData();
    });

    window.addEventListener('offline', () => {
      console.log('📴 Gone offline');
      this.isOnline = false;
      this.updateConnectionStatus(false);
    });

    this.updateConnectionStatus(this.isOnline);
  }

  updateConnectionStatus(isOnline) {
    let statusIndicator = document.getElementById('pwa-connection-status');
    
    if (!statusIndicator) {
      statusIndicator = document.createElement('div');
      statusIndicator.id = 'pwa-connection-status';
      statusIndicator.style.cssText = `
        position: fixed;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 600;
        z-index: 1000;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
      `;
      document.body.appendChild(statusIndicator);
    }
    
    if (isOnline) {
      statusIndicator.style.background = 'rgba(16, 185, 129, 0.9)';
      statusIndicator.style.color = 'white';
      statusIndicator.textContent = '🟢 Connected to Firebase';
      
      setTimeout(() => {
        statusIndicator.style.opacity = '0';
      }, 2000);
    } else {
      statusIndicator.style.background = 'rgba(239, 68, 68, 0.9)';
      statusIndicator.style.color = 'white';
      statusIndicator.style.opacity = '1';
      statusIndicator.textContent = '🔴 Offline - Data will sync when connected';
    }
  }

  async syncOfflineData() {
    console.log('🔄 Syncing offline data to Firebase...');
    
    const offlineKeys = Object.keys(localStorage).filter(key => key.startsWith('offline_'));
    let syncedCount = 0;
    
    for (const key of offlineKeys) {
      try {
        const offlineData = JSON.parse(localStorage.getItem(key));
        await this.saveToFirestore(offlineData.data, offlineData.collection);
        localStorage.removeItem(key);
        syncedCount++;
      } catch (error) {
        console.error('❌ Sync failed:', error);
      }
    }
    
    if (syncedCount > 0) {
      this.showToast(`✅ Synced ${syncedCount} offline records to Firebase`, 'success');
    }
  }

  // PUSH NOTIFICATIONS
  async setupNotifications() {
    if (!('Notification' in window)) {
      console.log('❌ Notifications not supported');
      return;
    }

    const permission = await this.requestNotificationPermission();
    
    if (permission === 'granted') {
      await this.getFCMToken();
      this.setupForegroundMessages();
    }
  }

  async requestNotificationPermission() {
    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log('✅ Notification permission granted');
        this.showToast('Notifications enabled for Sanctuary Keeper', 'success');
      }
      
      return permission;
    } catch (error) {
      console.error('❌ Notification permission error:', error);
      return 'denied';
    }
  }

  async getFCMToken() {
    try {
      const { getMessaging, getToken } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js');
      
      const messaging = getMessaging(this.app);
      const token = await getToken(messaging, {
        vapidKey: this.vapidKey
      });
      
      if (token) {
        console.log('✅ FCM Token received');
        await this.saveTokenToFirestore(token);
      }
    } catch (error) {
      console.error('❌ FCM token error:', error);
    }
  }

  async saveTokenToFirestore(token) {
    if (!this.db) return;
    
    try {
      const { collection, addDoc, serverTimestamp } = this.firestoreModules;
      
      await addDoc(collection(this.db, 'fcm_tokens'), {
        token: token,
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent,
        app: 'sanctuary_keeper',
        project: 'attendance-system-c8323'
      });
    } catch (error) {
      console.error('❌ Error saving FCM token:', error);
    }
  }

  async setupForegroundMessages() {
    try {
      const { getMessaging, onMessage } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js');
      
      const messaging = getMessaging(this.app);
      
      onMessage(messaging, (payload) => {
        console.log('📬 Foreground message received:', payload);
        const { title, body } = payload.notification || {};
        this.showToast(`${title}: ${body}`, 'info');
      });
    } catch (error) {
      console.error('❌ Foreground message setup failed:', error);
    }
  }

  // UTILITY METHODS
  showToast(message, type = 'info') {
    // Try to use your existing toast system first
    const existingToast = document.getElementById('toast');
    if (existingToast) {
      existingToast.textContent = message;
      existingToast.className = type;
      existingToast.classList.remove('hidden');
      
      setTimeout(() => {
        existingToast.classList.add('hidden');
      }, 3000);
      return;
    }
    
    // Fallback: create PWA toast
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      padding: 12px 20px;
      border-radius: 15px;
      z-index: 1000;
      font-weight: 500;
      backdrop-filter: blur(10px);
      max-width: 90%;
      text-align: center;
    `;
    
    // Use your app's color scheme
    if (type === 'success') toast.style.background = 'rgba(16, 185, 129, 0.9)';
    else if (type === 'error') toast.style.background = 'rgba(239, 68, 68, 0.9)';
    else if (type === 'warning') toast.style.background = 'rgba(217, 119, 6, 0.9)';
    else toast.style.background = 'rgba(59, 130, 246, 0.9)';
    
    toast.style.color = 'white';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
}

// Auto-initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  window.sanctuaryKeeperPWA = new SanctuaryKeeperPWA();
});

window.SanctuaryKeeperPWA = SanctuaryKeeperPWA;