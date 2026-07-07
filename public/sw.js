const CACHE = "carta-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== self.location.origin) return;

  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/")) {
    event.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        const response = await fetch(event.request);
        if (response.ok) cache.put(event.request, response.clone());
        return response;
      })
    );
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(
        () =>
          new Response(
            "<!doctype html><html lang='es'><body style='font-family:sans-serif;text-align:center;padding:3rem;background:#121216;color:#f5f0eb'>" +
              "<h1>Sin conexión</h1><p>Carta necesita internet para mostrar el menú. " +
              "Revise su conexión e intente de nuevo.</p></body></html>",
            { headers: { "Content-Type": "text/html; charset=utf-8" } }
          )
      )
    );
  }
});
