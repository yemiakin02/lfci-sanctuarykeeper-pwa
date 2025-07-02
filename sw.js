// ==========================================
// FILE 2: sw.js (Save as: public/sw.js)
// ==========================================

const CACHE_NAME = 'sanctuary-keeper-v1.0.0';
const STATIC_CACHE = 'sanctuary-keeper-static-v1';
const DYNAMIC_CACHE = 'sanctuary-keeper-dynamic-v1';

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://raw.githubusercontent.com/yemiakin02/Winniner_logo/main/logo_winners%20(1).PNG'
  // Add your existing CSS/JS files here if needed
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('🔧 Sanctuary Keeper SW: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Caching static files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Static files cached');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Sanctuary Keeper SW: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  // Skip Firebase requests
  if (event.request.url.includes('firestore.googleapis.com') || 
      event.request.url.includes('firebase') ||
      event.request.url.includes('googleapis.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }

        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseToCache = response.clone();

          caches.open(DYNAMIC_CACHE)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(() => {
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
      })
  );
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'attendance-sync') {
    event.waitUntil(syncOfflineAttendance());
  }
});

// Push notification handling
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Sanctuary Keeper';
  const options = {
    body: data.body || 'New notification from Sanctuary Keeper',
    icon: 'https://raw.githubusercontent.com/yemiakin02/Winniner_logo/main/logo_winners%20(1).PNG',
    badge: 'https://raw.githubusercontent.com/yemiakin02/Winniner_logo/main/logo_winners%20(1).PNG',
    vibrate: [200, 100, 200],
    data: data,
    actions: [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

async function syncOfflineAttendance() {
  console.log('🔄 Syncing offline attendance data...');
}
