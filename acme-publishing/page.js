(function() {
  if (!navigator.serviceWorker) return;

  var thisScriptURL = document.currentScript.src;

  // some nasty url hacking that should probably be done some other way
  var urlRE = /^.*acme-publishing\/([^\/]+)\//.exec(location.href);
  var publicationName = urlRE[1];
  var publicationBaseURL = urlRE[0];

  var ui = document.querySelector('.page-controls');

  navigator.serviceWorker.register(new URL('sw.js', thisScriptURL));


  if (navigator.serviceWorker.controller) {
    initPageControls();
  }
  else {
    navigator.serviceWorker.addEventListener('controllerchange', function onControllerChange() {
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
      initPageControls();
    });
  }

  function initPageControls() {
    caches.has(publicationName).then(function(isCached) {
      ui.innerHTML =
        '<div><label><input type="checkbox" class="work-offline"> Make worky offline</label></div>' +
        '<div><a href="' + publicationBaseURL + 'download-publication">Download publication</a></div>' +
        '<div class="status"></div>' +
      '';

      var status = ui.querySelector('.status');
      var checkbox = ui.querySelector('.work-offline');

      checkbox.checked = isCached;

      checkbox.addEventListener('change', function(event) {
        if (!this.checked) {
          caches.delete(publicationName);
          status.textContent = "Removed";
        }
        else {
          status.textContent = "Offlinifying…";

          fetch(publicationBaseURL + 'manifest.webmanifest').then(function(response) {
            return response.json();
          }).then(function(data) {
            data.assets.push('manifest.webmanifest');
            
            return caches.open(publicationName).then(function(cache) {
              return cache.addAll(data.assets.map(function(url) {
                return new URL(url, publicationBaseURL);
              }));
            });
          }).then(function() {
            status.textContent = 'Offlinification complete!';
          }).catch(function(err) {
            console.log(err);
            status.textContent = 'Offlinification failed :(';
          });
        }
      });
    });
  }
}());