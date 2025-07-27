// C:\smart-money\public\service-worker.js

const CACHE_NAME = 'pixcom-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // Adicione outros arquivos que você queira cachear, como CSS e JS do seu projeto
  // 'https://cdn.tailwindcss.com', // Se quiser cachear o CDN do Tailwind
  // 'https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js', // Se quiser cachear o Firebase SDK
];

// Instalação do Service Worker: Cacheia os arquivos estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Ativação do Service Worker: Limpa caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Intercepta requisições de rede e serve do cache se disponível
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - retorna a resposta do cache
        if (response) {
          return response;
        }
        // Nenhuma correspondência no cache - busca na rede
        return fetch(event.request);
      })
  );
});
