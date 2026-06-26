// Service Worker — 缓存 + 离线支持
const CACHE = "flashcards-v1";

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => r || fetch(e.request))
  );
});

// 推送通知
self.addEventListener("push", (e) => {
  const data = e.data?.json() || {};
  self.registration.showNotification(data.title || "AI Flashcards", {
    body: data.body || "你有卡片需要复习！",
    icon: "/icon.png",
    badge: "/icon.png",
  });
});
