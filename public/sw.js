// Service Worker 버전
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `lottopass-${CACHE_VERSION}`;

// 캐시할 리소스 목록
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/static/css/main.css',
  '/static/js/main.js',
  // 중요한 페이지들을 미리 캐시
  '/number-generation',
  '/statistics',
  '/history',
];

// 동적 캐시 이름
const DYNAMIC_CACHE = `lottopass-dynamic-${CACHE_VERSION}`;
const API_CACHE = `lottopass-api-${CACHE_VERSION}`;

// API 엔드포인트 패턴
const API_PATTERNS = [
  /\/api\/lottery/,
  /\/api\/winning-stores/,
  /dhlottery\.co\.kr/,
];

// 설치 이벤트
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// 활성화 이벤트
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName.startsWith('lottopass-') && cacheName !== CACHE_NAME;
          })
          .map((cacheName) => {
            console.log('[SW] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch 이벤트
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // POST 요청은 캐시하지 않음
  if (request.method !== 'GET') {
    return;
  }

  // API 요청 처리
  if (API_PATTERNS.some(pattern => pattern.test(url.href))) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // 정적 리소스 처리
  event.respondWith(handleStaticRequest(request));
});

// API 요청 처리 (Network First)
async function handleApiRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    // 성공적인 응답은 캐시에 저장
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network request failed, trying cache:', error);
    
    // 네트워크 실패 시 캐시에서 가져오기
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('[SW] Serving from cache:', request.url);
      return cachedResponse;
    }
    
    // 캐시에도 없으면 오프라인 페이지 표시
    return new Response(
      JSON.stringify({ error: 'Offline', message: '인터넷 연결을 확인해주세요.' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// 정적 리소스 처리 (Cache First)
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // 백그라운드에서 업데이트
    fetchAndCache(request);
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    // 성공적인 응답은 캐시에 저장
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network request failed:', error);
    
    // 특정 페이지에 대한 오프라인 폴백
    if (request.destination === 'document') {
      return caches.match('/offline.html');
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// 백그라운드 업데이트
async function fetchAndCache(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
  } catch (error) {
    console.log('[SW] Background update failed:', error);
  }
}

// 푸시 알림 이벤트
self.addEventListener('push', (event) => {
  console.log('[SW] Push received');
  
  const options = {
    body: event.data ? event.data.text() : '새로운 로또 결과가 발표되었습니다!',
    icon: '/android-icon-192x192.png',
    badge: '/android-icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '결과 확인',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: '닫기',
        icon: '/icons/xmark.png'
      },
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('로또패스 알림', options)
  );
});

// 알림 클릭 이벤트
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click received');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/history')
    );
  }
});

// 백그라운드 동기화
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-lottery-results') {
    event.waitUntil(syncLotteryResults());
  }
});

async function syncLotteryResults() {
  try {
    const response = await fetch('/api/lottery?drwNo=latest');
    const data = await response.json();
    
    // 최신 결과를 캐시에 저장
    const cache = await caches.open(API_CACHE);
    cache.put('/api/lottery?drwNo=latest', new Response(JSON.stringify(data)));
    
    console.log('[SW] Lottery results synced');
  } catch (error) {
    console.error('[SW] Sync failed:', error);
  }
}