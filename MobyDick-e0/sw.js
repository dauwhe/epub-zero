



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
   
'title-page.html',
'copyright.html',
'introduction.html',
'epigraph.html',
'c001.html',
'c002.html',
'c003.html',
'c004.html',
'c005.html',
'c006.html',
'c007.html',
'c008.html',
'c009.html',
'c010.html',
'c011.html',
'c012.html',
'c013.html',
'c014.html',
'c015.html',
'c016.html',
'c017.html',
'c018.html',
'c019.html',
'c020.html',
'c021.html',
'c022.html',
'c023.html',
'c024.html',
'c025.html',
'c026.html',
'c027.html',
'c028.html',
'c029.html',
'c030.html',
'c031.html',
'c032.html',
'c033.html',
'c034.html',
'c035.html',
'c036.html',
'c037.html',
'c038.html',
'c039.html',
'c040.html',
'c041.html',
'c042.html',
'c043.html',
'c044.html',
'c045.html',
'c046.html',
'c047.html',
'c048.html',
'c049.html',
'c050.html',
'c051.html',
'c052.html',
'c053.html',
'c054.html',
'c055.html',
'c056.html',
'c057.html',
'c058.html',
'c059.html',
'c060.html',
'c061.html',
'c062.html',
'c063.html',
'c064.html',
'c065.html',
'c066.html',
'c067.html',
'c068.html',
'c069.html',
'c070.html',
'c071.html',
'c072.html',
'c073.html',
'c074.html',
'c075.html',
'c076.html',
'c077.html',
'c078.html',
'c079.html',
'c080.html',
'c081.html',
'c082.html',
'c083.html',
'c084.html',
'c085.html',
'c086.html',
'c087.html',
'c088.html',
'c089.html',
'c090.html',
'c091.html',
'c092.html',
'c093.html',
'c094.html',
'c095.html',
'c096.html',
'c097.html',
'c098.html',
'c099.html',
'c100.html',
'c101.html',
'c102.html',
'c103.html',
'c104.html',
'c105.html',
'c106.html',
'c107.html',
'c108.html',
'c109.html',
'c110.html',
'c111.html',
'c112.html',
'c113.html',
'c114.html',
'c115.html',
'c116.html',
'c117.html',
'c118.html',
'c119.html',
'c120.html',
'c121.html',
'c122.html',
'c123.html',
'c124.html',
'c125.html',
'c126.html',
'c127.html',
'c128.html',
'c129.html',
'c130.html',
'c131.html',
'c132.html',
'c133.html',
'c134.html',
'c135.html',
'c136.html',
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




