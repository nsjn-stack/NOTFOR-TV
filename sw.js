/* Guarda as imagens (capas/banners) no aparelho. Só mexe em imagens; o resto do app passa direto. */
const C='cn-capas-v1',MAX=300;
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
async function trim(c){const k=await c.keys();if(k.length>MAX)for(const x of k.slice(0,k.length-MAX))await c.delete(x)}
self.addEventListener('fetch',e=>{
 const r=e.request;
 if(r.method!=='GET'||r.destination!=='image')return;
 e.respondWith((async()=>{
  const c=await caches.open(C),hit=await c.match(r.url);
  if(hit)return hit;
  try{
   const res=await fetch(r.url,{mode:'cors',credentials:'omit'});
   if(res&&res.ok){c.put(r.url,res.clone()).then(()=>trim(c));return res}
  }catch(_){}
  return fetch(r);
 })());
});
