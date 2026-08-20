const CACHE = 'bacen-ti-v2.3';
const CORE = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/app.js",
  "./js/storage.js",
  "./js/utils.js",
  "./js/charts.js",
  "./js/scheduler.js",
  "./js/ranking.js",
  "./js/insights.js",
  "./js/pareto.js",
  "./js/fixed-plan.js",
  "./data/frases-motivacionais.json",
  "./data/edital.json",
  "./data/curso-gran.json",
  "./data/cobertura-gran.json",
  "./data/pesos.json",
  "./data/metadata.json",
  "./data/config-padrao.json",
  "./data/temas-discursiva.json",
  "./data/bacen-ranking-2024.json",
  "./data/edital-gran-map.json",
  "./data/cebraspe-8020.json",
  "./data/plano-diario.json",
  "./assets/favicon.svg",
  "./manifest.webmanifest"
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request).then(response => {
    const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response;
  }).catch(() => caches.match('./index.html'))));
});

function openDb(){
  return new Promise((resolve,reject)=>{const req=indexedDB.open('estudos-ti-sw',1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('kv'))req.result.createObjectStore('kv')};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)});
}
async function setKv(key,value){const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction('kv','readwrite');tx.objectStore('kv').put(value,key);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error)})}
async function getKv(key){const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction('kv','readonly'),req=tx.objectStore('kv').get(key);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}

self.addEventListener('message', event => {
  if(event.data?.type==='REMINDER_CONFIG') event.waitUntil(setKv('reminder',event.data));
});
self.addEventListener('periodicsync', event => {
  if(event.tag!=='study-reminder')return;
  event.waitUntil((async()=>{
    const cfg=await getKv('reminder');if(!cfg?.enabled)return;
    const gap=Date.now()-Number(cfg.lastOpen||Date.now()),threshold=Number(cfg.inactivityHours||24)*3600000;
    if(gap<threshold)return;
    await self.registration.showNotification(cfg.appName||'BACEN Estudos TI',{body:cfg.phrase||'Seu plano continua aqui. Retome pelo próximo bloco.',icon:'./assets/favicon.svg',badge:'./assets/favicon.svg',tag:cfg.tag||'study-inactivity',renotify:false,data:{url:'./index.html#/hoje'}});
  })());
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil((async()=>{const url=new URL(event.notification.data?.url||'./index.html#/hoje',self.location.href).href;const clientsList=await clients.matchAll({type:'window',includeUncontrolled:true});for(const c of clientsList){if('focus' in c){await c.focus();if('navigate' in c)await c.navigate(url);return}}if(clients.openWindow)return clients.openWindow(url)})());
});
