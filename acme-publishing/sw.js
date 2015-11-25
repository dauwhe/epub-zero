// v2
importScripts('jszip.js');

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open('pub-static-v1').then(c => c.addAll([
      './',
      'page.js',
      'jszip.js'
    ]))
  );
});

self.addEventListener('activate', event => {
  clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const sameOrigin = url.origin === location.origin;

  if (sameOrigin && url.pathname.endsWith('/download-publication')) {
    event.respondWith(packagePublication(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

function packagePublication(request) {
  // more hacky url stuff that can probably be done better
  const urlRE = /^.*acme-publishing\/([^\/]+)\//.exec(request.url);
  const publicationName = urlRE[1];
  const publicationBaseURL = urlRE[0];

  return caches.has(publicationName).then(isCached => {
    return isCached ? caches.open(publicationName).then(c => c.match.bind(c)) : fetch;
  }).then(fetchingMethod => {
    return fetchingMethod(publicationBaseURL + 'manifest.webmanifest').then(r => r.json()).then(data => {
      const zip = new JSZip();
      const types = {};

      // I should reuse the asset I just downloaded but I'm lazy
      data.assets.push('manifest.webmanifest');

      return Promise.all(
        data.assets.map(path => {
          return fetchingMethod(publicationBaseURL + path).then(response => {
            if (!path || path.endsWith('/')) path += 'index.html';
            types[path] = response.headers.get('Content-Type');
            return response.arrayBuffer();
          }).then(arrayBuffer => {
            zip.file(path, arrayBuffer);
          });
        })
      ).then(_ => {
        zip.file('types.json', JSON.stringify(types));

        const zipArray = new Uint8Array(zip.generate({
          type: 'uint8array',
          compression: 'DEFLATE'
        }));
        const resultArray = new Uint8Array(zipArray.length + 1);

        // 'encode' the archive
        for (var i = 0; i < zipArray.length; i++) {
          resultArray[i+1] = zipArray[i];
        }

        return new Response(resultArray.buffer, {
          headers: {
            'Content-Disposition': 'attachment; filename="' + publicationName + '.pubarc"'
          }
        });
      });
    });
  });
}