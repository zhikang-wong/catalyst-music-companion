// Catalyst Music Companion — offline service worker
// Bump CACHE_VERSION whenever index.html or assets change to force refresh.
const CACHE_VERSION = "catalyst-v13-2026-06-14";

const PRECACHE = [
  "./",
  "./index.html",
  "./assets/tabs/all-star-bass-1.png",
  "./assets/tabs/all-star-bass-2.png",
  "./assets/tabs/all-star-bass-3.png",
  "./assets/tabs/bring-me-life-tab-1.png",
  "./assets/tabs/bring-me-life-tab-2.png",
  "./assets/tabs/bring-me-life-tab-3.png",
  "./assets/tabs/die-smile-bass-1.png",
  "./assets/tabs/die-smile-bass-2.png",
  "./assets/tabs/die-smile-bass-3.png",
  "./assets/tabs/die-smile-chords-1.png",
  "./assets/tabs/die-smile-chords-2.png",
  "./assets/tabs/die-smile-chords-3.png",
  "./assets/tabs/die-smile-drums-1.png",
  "./assets/tabs/die-smile-drums-2.png",
  "./assets/tabs/die-smile-drums-3.png",
  "./assets/tabs/die-smile-drums-4.png",
  "./assets/tabs/final-countdown-bass-1.png",
  "./assets/tabs/final-countdown-bass-2.png",
  "./assets/tabs/final-countdown-bass-3.png",
  "./assets/tabs/final-countdown-bass-4.png",
  "./assets/tabs/i-want-bass-1.png",
  "./assets/tabs/i-want-bass-2.png",
  "./assets/tabs/livin-prayer-bass-1.png",
  "./assets/tabs/livin-prayer-bass-2.png",
  "./assets/tabs/livin-prayer-bass-3.png",
  "./assets/tabs/locked-out-bass-1.png",
  "./assets/tabs/locked-out-bass-2.png",
  "./assets/tabs/locked-out-bass-3.png",
  "./assets/tabs/locked-out-bass-4.png",
  "./assets/tabs/mr-brightside-tab-1.png",
  "./assets/tabs/mr-brightside-tab-2.png",
  "./assets/tabs/mr-brightside-tab-3.png",
  "./assets/tabs/sky-stars-bass-1.png",
  "./assets/tabs/sky-stars-bass-2.png",
  "./assets/tabs/you-belong-bass-1.png",
  "./assets/tabs/you-belong-bass-2.png",
  "./assets/tabs/you-belong-bass-3.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Strategy: network-first for the HTML shell (so updates land when online),
// cache-first for static assets (images), both with offline fallback.
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const isHTML = req.mode === "navigate" || url.pathname.endsWith(".html") || url.pathname.endsWith("/");

  if (isHTML) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match("./index.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      return (
        cached ||
        fetch(req).then((res) => {
          if (res.ok && url.origin === self.location.origin) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
          }
          return res;
        })
      );
    })
  );
});
