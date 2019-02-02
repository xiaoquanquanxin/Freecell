function loadJs(src) {
    "use strict";
    var script = document.createElement('script');
    script.src = src + '?v=' + Math.random();
    document.head.appendChild(script);
}