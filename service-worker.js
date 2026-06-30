const CACHE_NAME = "pyq-quiz-v1";

const urlsToCache = [
  "/pyq-quiz-master-v3/",
  "/pyq-quiz-master-v3/index.html",
  "/pyq-quiz-master-v3/css/style.css",
  "/pyq-quiz-master-v3/manifest.json"
];

// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
