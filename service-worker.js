const CACHE='gomo-vs-planner-v3.16.0';

const ASSETS=[
  './',
  './index.html',
  './styles.css?v=3.15.0',
  './app.js?v=3.15.0',
  './upgrade-v2.30.js?v=3.15.0',
  './upgrade-v2.31.js?v=3.15.0',
  './upgrade-v2.32.js?v=3.15.0',
  './upgrade-v2.40.js?v=3.15.0',
  './upgrade-v2.41.js?v=3.15.0',
  './upgrade-v2.42.js?v=3.15.0',
  './upgrade-v3.15.js?v=3.15.0',
  './upgrade-v3.16.js?v=3.16.0',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './gomo-vs-planner-v2.42.png?v=2.42.0'
];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>Promise.allSettled(
        ASSETS.map(asset=>cache.add(new Request(asset,{cache:'reload'})))
      ))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET' || !event.request.url.startsWith(self.location.origin)) return;

  if(event.request.mode==='navigate'){
    event.respondWith(
      fetch(event.request,{cache:'no-store'})
        .then(response=>{
          const copy=response.clone();
          caches.open(CACHE).then(cache=>cache.put('./index.html',copy));
          return response;
        })
        .catch(()=>caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    fetch(event.request,{cache:'no-store'})
      .then(response=>{
        const copy=response.clone();
        caches.open(CACHE).then(cache=>cache.put(event.request,copy));
        return response;
      })
      .catch(()=>caches.match(event.request))
  );
});