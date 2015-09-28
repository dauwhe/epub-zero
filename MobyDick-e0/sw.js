



/*
 Copyright 2014 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

// This polyfill provides Cache.add(), Cache.addAll(), and CacheStorage.match(),
// which are not implemented in Chrome 40.
importScripts('serviceworker-cache-polyfill.js');

// While overkill for this specific sample in which there is only one cache,
// this is one best practice that can be followed in general to keep track of
// multiple caches used by a given service worker, and keep them all versioned.
// It maps a shorthand identifier for a cache to a specific, versioned cache name.

// Note that since global state is discarded in between service worker restarts, these
// variables will be reinitialized each time the service worker handles an event, and you
// should not attempt to change their values inside an event handler. (Treat them as constants.)

// If at any point you want to force pages that use this service worker to start using a fresh
// cache, then increment the CACHE_VERSION value. It will kick off the service worker update
// flow and the old cache(s) will be purged as part of the activate event handler when the
// updated service worker is activated.
var CACHE_VERSION = 2;
var CURRENT_CACHES = {
  prefetch: 'prefetch-cache-v' + CACHE_VERSION
};

self.addEventListener('install', function(event) {
  var urlsToPrefetch = [
   
'html/title-page.html',
'html/copyright.html',
'html/introduction.html',
'html/epigraph.html',
'html/c001.html',
'html/c002.html',
'html/c003.html',
'html/c004.html',
'html/c005.html',
'html/c006.html',
'html/c007.html',
'html/c008.html',
'html/c009.html',
'html/c010.html',
'html/c011.html',
'html/c012.html',
'html/c013.html',
'html/c014.html',
'html/c015.html',
'html/c016.html',
'html/c017.html',
'html/c018.html',
'html/c019.html',
'html/c020.html',
'html/c021.html',
'html/c022.html',
'html/c023.html',
'html/c024.html',
'html/c025.html',
'html/c026.html',
'html/c027.html',
'html/c028.html',
'html/c029.html',
'html/c030.html',
'html/c031.html',
'html/c032.html',
'html/c033.html',
'html/c034.html',
'html/c035.html',
'html/c036.html',
'html/c037.html',
'html/c038.html',
'html/c039.html',
'html/c040.html',
'html/c041.html',
'html/c042.html',
'html/c043.html',
'html/c044.html',
'html/c045.html',
'html/c046.html',
'html/c047.html',
'html/c048.html',
'html/c049.html',
'html/c050.html',
'html/c051.html',
'html/c052.html',
'html/c053.html',
'html/c054.html',
'html/c055.html',
'html/c056.html',
'html/c057.html',
'html/c058.html',
'html/c059.html',
'html/c060.html',
'html/c061.html',
'html/c062.html',
'html/c063.html',
'html/c064.html',
'html/c065.html',
'html/c066.html',
'html/c067.html',
'html/c068.html',
'html/c069.html',
'html/c070.html',
'html/c071.html',
'html/c072.html',
'html/c073.html',
'html/c074.html',
'html/c075.html',
'html/c076.html',
'html/c077.html',
'html/c078.html',
'html/c079.html',
'html/c080.html',
'html/c081.html',
'html/c082.html',
'html/c083.html',
'html/c084.html',
'html/c085.html',
'html/c086.html',
'html/c087.html',
'html/c088.html',
'html/c089.html',
'html/c090.html',
'html/c091.html',
'html/c092.html',
'html/c093.html',
'html/c094.html',
'html/c095.html',
'html/c096.html',
'html/c097.html',
'html/c098.html',
'html/c099.html',
'html/c100.html',
'html/c101.html',
'html/c102.html',
'html/c103.html',
'html/c104.html',
'html/c105.html',
'html/c106.html',
'html/c107.html',
'html/c108.html',
'html/c109.html',
'html/c110.html',
'html/c111.html',
'html/c112.html',
'html/c113.html',
'html/c114.html',
'html/c115.html',
'html/c116.html',
'html/c117.html',
'html/c118.html',
'html/c119.html',
'html/c120.html',
'html/c121.html',
'html/c122.html',
'html/c123.html',
'html/c124.html',
'html/c125.html',
'html/c126.html',
'html/c127.html',
'html/c128.html',
'html/c129.html',
'html/c130.html',
'html/c131.html',
'html/c132.html',
'html/c133.html',
'html/c134.html',
'html/c135.html',
'html/c136.html',
'css/mobydick.css'];

  // All of these logging statements should be visible via the "Inspect" interface
  // for the relevant SW accessed via chrome://serviceworker-internals
  console.log('Handling install event. Resources to pre-fetch:', urlsToPrefetch);

  event.waitUntil(
    caches.open(CURRENT_CACHES['prefetch']).then(function(cache) {
      return cache.addAll(urlsToPrefetch.map(function(urlToPrefetch) {
        // It's very important to use {mode: 'no-cors'} if there is any chance that
        // the resources being fetched are served off of a server that doesn't support
        // CORS (http://en.wikipedia.org/wiki/Cross-origin_resource_sharing).
        // In this example, www.chromium.org doesn't support CORS, and the fetch()
        // would fail if the default mode of 'cors' was used for the fetch() request.
        // The drawback of hardcoding {mode: 'no-cors'} is that the response from all
        // cross-origin hosts will always be opaque
        // (https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#cross-origin-resources)
        // and it is not possible to determine whether an opaque response represents a success or failure
        // (https://github.com/whatwg/fetch/issues/14).
        return new Request(urlToPrefetch, {mode: 'no-cors'});
      })).then(function() {
        console.log('All resources have been fetched and cached.');
      });
    }).catch(function(error) {
      // This catch() will handle any exceptions from the caches.open()/cache.addAll() steps.
      console.error('Pre-fetching failed:', error);
    })
  );
});

self.addEventListener('activate', function(event) {
  // Delete all caches that aren't named in CURRENT_CACHES.
  // While there is only one cache in this example, the same logic will handle the case where
  // there are multiple versioned caches.
  var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function(key) {
    return CURRENT_CACHES[key];
  });

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (expectedCacheNames.indexOf(cacheName) == -1) {
            // If this cache name isn't present in the array of "expected" cache names, then delete it.
            console.log('Deleting out of date cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  console.log('Handling fetch event for', event.request.url);

  event.respondWith(
    // caches.match() will look for a cache entry in all of the caches available to the service worker.
    // It's an alternative to first opening a specific named cache and then matching on that.
    caches.match(event.request).then(function(response) {
      if (response) {
        console.log('Found response in cache:', response);

        return response;
      }

      console.log('No response found in cache. About to fetch from network...');

      // event.request will always have the proper mode set ('cors, 'no-cors', etc.) so we don't
      // have to hardcode 'no-cors' like we do when fetch()ing in the install handler.
      return fetch(event.request).then(function(response) {
        console.log('Response from network is:', response);

        return response;
      }).catch(function(error) {
        // This catch() will handle exceptions thrown from the fetch() operation.
        // Note that a HTTP error response (e.g. 404) will NOT trigger an exception.
        // It will return a normal response object that has the appropriate error code set.
        console.error('Fetching failed:', error);

        throw error;
      });
    })
  );
});




