// Xoài Phiêu Lưu — offline support
const V='xpl-v22';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png','favicon-64.png','img/com-an.webp','img/com-chao.webp','img/com-dung.webp','img/com-lon1.webp','img/com-lon2.webp','img/com-ngu.webp','img/com-vui.webp','img/kl-ptero-hat.webp','img/kl-ptero.webp','img/kl-stego-hat.webp','img/kl-stego.webp','img/kl-trex-hat.webp','img/kl-trex.webp','img/kl-trike-hat.webp','img/kl-trike.webp','img/trung-nut.webp','img/trung-vo.webp','img/trung.webp','img/bip-wave.webp','img/bip-happy.webp','img/bip-sad.webp','img/bip-point.webp','img/bip-walk.webp','img/bip-think.webp'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  // the app page: try the network first so updates arrive, fall back to the saved copy when offline
  if(r.mode==='navigate'){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put('index.html',cp));return res}).catch(()=>caches.match('index.html')));return}
  // fonts and icons: use the saved copy, refresh it in the background
  if(u.origin===location.origin||/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
    e.respondWith(caches.open(V).then(c=>c.match(r).then(hit=>{const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone());return res}).catch(()=>hit);return hit||net})))}
});
