const CACHE='gomo-vs-planner-v2.26.0';
const ASSETS=['./','./index.html','./styles.css?v=2.26.0','./app.js?v=2.26.0','./manifest.webmanifest','./icon-192.png','./icon-512.png','./gomo-vs-planner.png?v=2.22.0'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()).then(()=>self.clients.matchAll({type:'window'})).then(windows=>Promise.all(windows.map(client=>client.navigate(client.url))))));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||!event.request.url.startsWith(self.location.origin))return;
  if(event.request.mode==='navigate'){event.respondWith(fetch(event.request,{cache:'no-store'}).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put('./index.html',copy));return response;}).catch(()=>caches.match('./index.html')));return;}
  event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response;}).catch(()=>caches.match(event.request)));
});
