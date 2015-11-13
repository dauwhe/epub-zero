// v2

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open('reader-static-v1').then(c => c.addAll([
      'sw-index.html',
      'page.js',
      'jszip.js',
      '/pub/acme.js'
    ]))
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const sameOrigin = url.origin === location.origin;

  if (event.request.url == new URL('./', location).href) {
    event.respondWith(caches.match('sw-index.html'));
    return;
  }

  if (sameOrigin && url.pathname.includes('/pub/')) {
    event.respondWith(pubResponse(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

function pubResponse(request) {
  const pubName = /\/pub\/([^\/]+)/.exec(request.url)[1];
  return caches.has('reader-pub:' + pubName).then(isCached => {
    if (!isCached) return Response("Publication not found");
    return caches.open('reader-pub:' + pubName).then(c => c.match(request));
  });
}