const CACHE_NAME = 'doencas-cache-v1';

// Lista de todos os arquivos necessários para o funcionamento offline
const urlsToCache = [
  './',
  './index.html',
  'https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js', // Biblioteca Excel
  './manifest.json',
  // Adicione todos os seus arquivos de ícones aqui, ex: 'icons/icon-192x192.png'
];

// Instalação: armazena os ativos estáticos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto e arquivos pré-armazenados');
        return cache.addAll(urlsToCache);
      })
  );
});

// Busca: serve conteúdo do cache, se disponível
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna o recurso do cache
        if (response) {
          return response;
        }
        // Se não estiver no cache, faz a requisição de rede
        return fetch(event.request);
      })
  );
});

// Ativação: limpa caches antigos
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Deleta qualquer cache que não esteja na lista
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
