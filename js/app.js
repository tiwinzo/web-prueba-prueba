


var url = window.location.href;
var swLocation = '/App-demo/service-worker.js';


if ( navigator.serviceWorker ) {


    if ( url.includes('localhost') ) {
        swLocation = '/service-worker.js';
    }


    navigator.serviceWorker.register( swLocation );
}