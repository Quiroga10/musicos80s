//asignar un nombre y version al cache
const CACHE_NAME = 'WebJunior',
    urlsToCache = [
        './',
        './index.html',
        './style.css',
        './tablet.css',
        './desktop.css',

        './regist_serviceWorker.js',
        './icons/80s 512x512.png',
        './icons/80s 72x72.png'
    ]

//durante la fase de instalacion, generalmente se almacenan en caché los activos estáticos
self.addEventListener('install', e =>{
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache)
                    .then(() => self.skipWaiting())
            })
            .catch(err => console.log('Falló registro de cache', err))
    )
})

//una vez que se instala el SW, se activa y busca los recursos para hacer que funcione sin conexión
self.addEventListener('activate', e => {
    const cacheWhitelist = [CACHE_NAME]

    e.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        //Eliminamos lo que ya no se necesita en cache se
                        if (cacheWhitelist.indexOf(cacheName) === -1) {
                            return caches.delete(cacheName)
                        }
                    })
                )
            })
            //le indica al SW activar el cache actual
            .then(() => self.clients.claim())
    )
})

//caundo el navegador recupere una url
self.addEventListener('fetch', e => {
    //responder ya sea con el objeto en caché o continuar y buscar la url real
    e.respondWith(
        caches.match(e.request)
            .then(res => {
                if (res){
                    //recuperar del cache
                    return res
                }
                //recuperar de la petición a la url
                return fetch(e.request)
            })
    )
})