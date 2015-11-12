(function() {
  // allow dropping of files
  // ps: drag events are horrid
  var activeEnters = 0;
  var currentEnteredElement = null;

  document.addEventListener('dragover', event => {
    event.preventDefault();
  });

  document.addEventListener('dragenter', event => {
    // firefox double-fires on window enter, this works around it
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1124645
    if (currentEnteredElement == event.target) return;
    currentEnteredElement = event.target;
  });

  document.addEventListener('dragleave', _ => {
    currentEnteredElement = null;
  });

  document.addEventListener('drop', event => {
    event.preventDefault();
    openFile(event.dataTransfer.files[0]);
  });

  document.querySelector('.file-upload').addEventListener('change', event => {
    if (event.target.files[0]) openFile(event.target.files[0]);
  });

  const cachedPubs = document.querySelector('.cached-publications');

  cachedPubs.addEventListener('click', event => {
    const button = event.target.closest('.del');
    if (!button) return;
    caches.delete(button.getAttribute('data-cache-name')).then(_ => updateCachedList());
  });

  function updateCachedList() {
    caches.keys().then(keys => {
      const pubCaches = keys.filter(k => k.startsWith('reader-pub:'));
      if (!pubCaches.length) {
        cachedPubs.textContent = "Nothing cached";
        return;
      }

      cachedPubs.innerHTML = '';
      const list = document.createElement('ul');
      cachedPubs.appendChild(list);

      Promise.all(
        pubCaches.map(cacheName => {
          const path = 'pub/' + cacheName.slice('reader-pub:'.length) + '/';

          return caches.open(cacheName)
            .then(c => c.match(path + 'pub-manifest.json'))
            .then(r => r.json())
            .then(data => ({
              title: data.title,
              path: path,
              cacheName: cacheName
            }));
        })
      ).then(entries => {
        entries.forEach(entry => {
          const li = document.createElement('li');
          list.appendChild(li);
          const a = document.createElement('a');
          li.appendChild(a);
          a.textContent = entry.title;
          a.href = entry.path;
          li.appendChild(document.createTextNode(' '));
          const button = document.createElement('button');
          button.textContent = 'Delete';
          button.className = 'del';
          button.setAttribute('data-cache-name', entry.cacheName);
          li.appendChild(button);
        });
      });
    });
  }

  updateCachedList();

  function openFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onerror = _ => reject(reader.error);
      reader.onload = _ => resolve(reader.result);
    }).then(buffer => {
      const zip = new JSZip(buffer.slice(1));
      const meta = JSON.parse(zip.files['pub-manifest.json'].asText());
      const types = JSON.parse(zip.files['types.json'].asText());
      const stub = meta.title.toLowerCase().replace(/\s+/g, '-');

      return caches.open('reader-pub:' + stub).then(cache => {
        return Promise.all(
          Object.keys(zip.files).map(path => {
            const urlPath = path.replace(/index.html$/, '');

            return cache.put('pub/' + stub + '/' + urlPath, new Response(zip.files[path].asArrayBuffer(), {
              headers: {
                "Content-Type": types[path],
                "Content-Security-Policy": "script-src 'self'"
              }
            }));
          })
        );
      }).then(_ => updateCachedList());
    });
  }
}());