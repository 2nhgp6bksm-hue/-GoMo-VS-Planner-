const CACHE='gomo-vs-planner-v3.00.0';
const ASSETS=[
  './','./index.html','./styles.css?v=2.26.0','./app.js?v=2.26.0',
  './upgrade-v2.30.js','./upgrade-v2.31.js','./upgrade-v2.32.js','./upgrade-v2.40.js','./upgrade-v2.41.js','./upgrade-v2.42.js','./upgrade-v3.00.js',
  './manifest.webmanifest','./icon-192.png','./icon-512.png','./gomo-vs-planner-v2.42.png?v=2.42.0'
];

const CENTRAL_URL='https://gomo-central-site.gjp86wh7p2.workers.dev/';
const CENTRAL_MARKER='data-gomo-central-back';
const HERO_NEW='./gomo-vs-planner-v2.42.png?v=2.42.0';
const MARKERS=[
  ['data-gomo-v230','./upgrade-v2.30.js'],
  ['data-gomo-v231','./upgrade-v2.31.js'],
  ['data-gomo-v232','./upgrade-v2.32.js'],
  ['data-gomo-v240','./upgrade-v2.40.js'],
  ['data-gomo-v241','./upgrade-v2.41.js'],
  ['data-gomo-v242','./upgrade-v2.42.js'],
  ['data-gomo-v300','./upgrade-v3.00.js']
];

async function decorateHtml(response){
  if(!response)return response;
  const type=response.headers.get('content-type')||'';
  if(!type.includes('text/html'))return response;
  let html=await response.text();

  // Remplace directement l'ancienne image dans le HTML avant affichage.
  html=html.replace(/(?:\.\/)?gomo-vs-planner\.png(?:\?[^\"'\s<>]*)?/gi,HERO_NEW);

  if(!html.includes(CENTRAL_MARKER)){
    const style=`<style id="gomo-central-back-style">
      .gomo-central-back{position:fixed;top:calc(env(safe-area-inset-top,0px) + 8px);left:max(8px,env(safe-area-inset-left,0px));z-index:9999;display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:36px;padding:0 10px 0 9px;border:1px solid rgba(116,224,167,.34);border-radius:999px;background:rgba(7,17,13,.88);color:#f3fff8;text-decoration:none;font-size:18px;font-weight:800;line-height:1;white-space:nowrap;box-shadow:0 6px 20px rgba(0,0,0,.22);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px)}
      .gomo-central-back .gomo-central-back-text{font-size:10px;font-weight:700;letter-spacing:.04em;opacity:.92}
      .gomo-central-back:active{transform:scale(.97)}
      @media(max-width:580px){.gomo-central-back{z-index:8;width:42px;min-width:42px;height:42px;min-height:42px;padding:0;border-radius:50%}.gomo-central-back .gomo-central-back-text{display:none}}
    </style>`;
    html=html.replace('</head>',style+'</head>');
    html=html.replace(/<body([^>]*)>/i,`<body$1><a ${CENTRAL_MARKER} class="gomo-central-back" href="${CENTRAL_URL}" aria-label="GoMo Central">⌂ <span class="gomo-central-back-text">GoMo Central</span></a>`);
  }

  for(const [marker,src] of MARKERS){
    if(!html.includes(marker))html=html.replace('</body>',`<script ${marker} src="${src}"></script></body>`);
  }

  const headers=new Headers(response.headers);
  headers.delete('content-length');headers.delete('content-encoding');headers.delete('etag');
  return new Response(html,{status:response.status,statusText:response.statusText,headers});
}

self.addEventListener('install',event=>event.waitUntil(
  caches.open(CACHE)
    .then(cache=>Promise.allSettled(ASSETS.map(asset=>cache.add(new Request(asset,{cache:'reload'})))))
    .then(()=>self.skipWaiting())
));

self.addEventListener('activate',event=>event.waitUntil(
  caches.keys()
    .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
    .then(()=>self.clients.claim())
    .then(()=>self.clients.matchAll({type:'window'}))
    .then(windows=>Promise.all(windows.map(client=>client.navigate(client.url))))
));

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||!event.request.url.startsWith(self.location.origin))return;

  if(event.request.mode==='navigate'){
    event.respondWith(
      fetch(event.request,{cache:'no-store'})
        .then(decorateHtml)
        .then(response=>{
          const copy=response.clone();
          caches.open(CACHE).then(cache=>cache.put('./index.html',copy));
          return response;
        })
        .catch(()=>caches.match('./index.html').then(decorateHtml))
    );
    return;
  }

  const url=new URL(event.request.url);
  const isHero=/gomo-vs-planner(?:-v2\.42)?\.png$/i.test(url.pathname);

  event.respondWith(
    fetch(event.request,{cache:isHero?'reload':'no-store'})
      .then(response=>{
        const copy=response.clone();
        caches.open(CACHE).then(cache=>cache.put(event.request,copy));
        return response;
      })
      .catch(()=>caches.match(event.request))
  );
});
