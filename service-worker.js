
importScripts('js/service-worker-utils.js');

const STATIC_CACHE = 'estatico_v1';
const DYNAMIC_CACHE = 'dinamico_v1';
const INMUTABLE_CACHE = 'inmutable_v1';

const APP_SHELL = [

    //'/',
    'index.html',
    'vendor/bootstrap/css/bootstrap.min.css',
    'css/gestion.css',
    'img/principal.jpg',
    'vendor/jquery/jquery.min.js',
    'vendor/bootstrap/js/bootstrap.bundle.min.js',
    'js/app.js',
    'js/service-worker-utils.js'

];

const APP_SHELL_INMUTABLE = [

    'https://fonts.googleapis.com/css2?family=Raleway:wght@300&display=swap',
    'https://fonts.googleapis.com/css?family=Lora:400,400i,700,700i'
];




fetch('https://pokeapi.co/api/v2/pokemon/1')
    .then( respuesta => respuesta.json() )
    .then( almacenado => {
        
        console.log(almacenado.id)
        console.log(almacenado.name)
    });





self.addEventListener('install', event => {

    const cacheStatic = caches.open( STATIC_CACHE ).then(cache => 
        cache.addAll( APP_SHELL ));

    const cacheInmutable = caches.open( INMUTABLE_CACHE ).then(cache => 
        cache.addAll( APP_SHELL_INMUTABLE ));
    
    console.log(STATIC_CACHE);
    event.waitUntil( Promise.all( [cacheStatic, cacheInmutable] ))
});



self.addEventListener('activate', event => {

    const respuesta = caches.keys().then( keys => {

        keys.forEach( key => {

            if (  key !== STATIC_CACHE && key.includes('static') ) {
                return caches.delete(key);
            }

            if (  key !== DYNAMIC_CACHE && key.includes('dynamic') ) {
                return caches.delete(key);
            }

        });

    });

    event.waitUntil( respuesta );
});



self.addEventListener('fetch', event => {
    
    const respuesta = caches.match( event.request ).then( res => {

        if ( res ) {
            return res;
        } else {

            return fetch( event.request ).then( newRes => {

                return actualizaCacheDinamico( DYNAMIC_CACHE, event.request, newRes );

            });

        }

    });

    event.respondWith( respuesta );
});




