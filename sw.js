// ==========================================
// FILE 2: sw.js (Save as: public/sw.js)
// ==========================================

// Service Worker for Sanctuary Keeper PWA
const CACHE_NAME = 'sanctuary-keeper-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Files to cache for offline functionality
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/css/styles.css',
  '/js/app.js',
  '/js/pwa-integration.js',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon.png',
  '/icons/favicon-32x32.png',
  '/icons/favicon-16x16.png'
];

// Dynamic cache for API responses and user data
const DYNAMIC_CACHE_NAME = 'sanctuary-keeper-dynamic-v1.0.0';

// URLs that should always be fetched from network (bypass cache)
const NETWORK_ONLY_URLS = [
  '/api/submit-attendance',
  '/api/login',
  '/api/register',
  '/api/admin-panel'
];

// URLs that should be cached and updated in background
const CACHE_FIRST_URLS = [
  '/api/user-profile',
  '/api/announcements',
  '/api/cleaning-days'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Install event');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Old caches cleaned up');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Handle different request types
  if (isNetworkOnlyRequest(url.pathname)) {
    event.respondWith(networkOnlyStrategy(request));
  } else if (isCacheFirstRequest(url.pathname)) {
    event.respondWith(cacheFirstStrategy(request));
  } else if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirstStrategy(request));
  } else {
    event.respondWith(networkFirstStrategy(request));
  }
});

// Network-only strategy for critical API calls
function networkOnlyStrategy(request) {
  return fetch(request)
    .catch(() => {
      // Return offline page for navigation requests
      if (request.mode === 'navigate') {
        return caches.match(OFFLINE_URL);
      }
      // Return error response for API calls
      return new Response(
        JSON.stringify({ 
          error: 'Network unavailable', 
          offline: true,
          message: 'This action requires an internet connection'
        }),
        {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'application/json' }
        }
      );
    });
}

// Cache-first strategy for user data and settings
function cacheFirstStrategy(request) {
  return caches.match(request)
    .then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached version immediately
        updateCacheInBackground(request);
        return cachedResponse;
      }
      // If not in cache, fetch from network
      return fetchAndCache(request);
    });
}

// Network-first strategy for general content
function networkFirstStrategy(request) {
  return fetch(request)
    .then((response) => {
      // Clone response before caching
      const responseClone = response.clone();
      
      // Cache successful responses
      if (response.status === 200) {
        caches.open(DYNAMIC_CACHE_NAME)
          .then((cache) => {
            cache.put(request, responseClone);
          });
      }
      
      return response;
    })
    .catch(() => {
      // Return cached version if available
      return caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Return offline page for navigation requests
          if (request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
          // Return generic offline response
          return new Response(
            JSON.stringify({ 
              error: 'Offline', 
              message: 'Content not available offline' 
            }),
            {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'application/json' }
            }
          );
        });
    });
}

// Helper function to fetch and cache responses
function fetchAndCache(request) {
  return fetch(request)
    .then((response) => {
      if (response.status === 200) {
        const responseClone = response.clone();
        caches.open(DYNAMIC_CACHE_NAME)
          .then((cache) => {
            cache.put(request, responseClone);
          });
      }
      return response;
    });
}

// Update cache in background for cache-first requests
function updateCacheInBackground(request) {
  fetch(request)
    .then((response) => {
      if (response.status === 200) {
        caches.open(DYNAMIC_CACHE_NAME)
          .then((cache) => {
            cache.put(request, response.clone());
          });
      }
    })
    .catch(() => {
      // Silently fail background updates
      console.log('[SW] Background cache update failed for:', request.url);
    });
}

// Helper functions to categorize requests
function isNetworkOnlyRequest(pathname) {
  return NETWORK_ONLY_URLS.some(url => pathname.includes(url));
}

function isCacheFirstRequest(pathname) {
  return CACHE_FIRST_URLS.some(url => pathname.includes(url));
}

function isStaticAsset(pathname) {
  return pathname.includes('/css/') || 
         pathname.includes('/js/') || 
         pathname.includes('/icons/') || 
         pathname.includes('/images/') ||
         pathname.endsWith('.css') ||
         pathname.endsWith('.js') ||
         pathname.endsWith('.png') ||
         pathname.endsWith('.jpg') ||
         pathname.endsWith('.jpeg') ||
         pathname.endsWith('.svg') ||
         pathname.endsWith('.ico');
}

// Handle background sync for offline attendance submissions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync event:', event.tag);
  
  if (event.tag === 'attendance-submission') {
    event.waitUntil(syncOfflineAttendance());
  }
  
  if (event.tag === 'user-data-sync') {
    event.waitUntil(syncUserData());
  }
});

// Sync offline attendance submissions when back online
function syncOfflineAttendance() {
  return new Promise((resolve, reject) => {
    // Get offline submissions from IndexedDB
    getOfflineSubmissions()
      .then((submissions) => {
        if (submissions.length === 0) {
          resolve();
          return;
        }
        
        // Submit each offline submission
        const syncPromises = submissions.map((submission) => {
          return fetch('/api/submit-attendance', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(submission.data)
          })
          .then((response) => {
            if (response.ok) {
              // Remove successful submission from offline storage
              return removeOfflineSubmission(submission.id);
            }
            throw new Error('Submission failed');
          });
        });
        
        return Promise.all(syncPromises);
      })
      .then(() => {
        console.log('[SW] Offline submissions synced successfully');
        // Notify clients about successful sync
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: 'SYNC_COMPLETE',
              payload: { type: 'attendance' }
            });
          });
        });
        resolve();
      })
      .catch((error) => {
        console.error('[SW] Failed to sync offline submissions:', error);
        reject(error);
      });
  });
}

// Sync user data when back online
function syncUserData() {
  return fetch('/api/user-profile')
    .then((response) => response.json())
    .then((userData) => {
      // Update cached user data
      return caches.open(DYNAMIC_CACHE_NAME)
        .then((cache) => {
          cache.put('/api/user-profile', new Response(JSON.stringify(userData)));
        });
    })
    .catch((error) => {
      console.error('[SW] Failed to sync user data:', error);
    });
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: 'You have a new announcement from Sanctuary Keepers',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/icons/action-view.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/action-dismiss.png'
      }
    ]
  };
  
  let title = 'Sanctuary Keeper';
  let body = 'You have a new notification';
  
  if (event.data) {
    const payload = event.data.json();
    title = payload.title || title;
    body = payload.body || body;
    
    if (payload.icon) options.icon = payload.icon;
    if (payload.badge) options.badge = payload.badge;
    if (payload.actions) options.actions = payload.actions;
  }
  
  options.body = body;
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'view') {
    // Open the app
    event.waitUntil(
      self.clients.openWindow('/')
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});

// Handle messages from main app
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_ATTENDANCE') {
    // Cache offline attendance submission
    cacheOfflineSubmission(event.data.payload);
  }
});

// IndexedDB helper functions for offline storage
function getOfflineSubmissions() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SanctuaryKeeperDB', 1);
    
    request.onerror = () => reject(request.error);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['offlineSubmissions'], 'readonly');
      const store = transaction.objectStore('offlineSubmissions');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('offlineSubmissions')) {
        db.createObjectStore('offlineSubmissions', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

function cacheOfflineSubmission(submissionData) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SanctuaryKeeperDB', 1);
    
    request.onerror = () => reject(request.error);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['offlineSubmissions'], 'readwrite');
      const store = transaction.objectStore('offlineSubmissions');
      
      const addRequest = store.add({
        data: submissionData,
        timestamp: Date.now()
      });
      
      addRequest.onsuccess = () => resolve(addRequest.result);
      addRequest.onerror = () => reject(addRequest.error);
    };
  });
}

function removeOfflineSubmission(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SanctuaryKeeperDB', 1);
    
    request.onerror = () => reject(request.error);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['offlineSubmissions'], 'readwrite');
      const store = transaction.objectStore('offlineSubmissions');
      
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
  });
}