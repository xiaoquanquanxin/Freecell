document.addEventListener('mousedown', function (e) {
    e.preventDefault();
}, false);


var compatibility = {};
compatibility.eventListener = function (aim, eventType, fn) {
    if (aim.addEventListener) {
        aim.addEventListener(eventType, fn, false);
    } else if (aim.attachEvent) {
        aim.attachEvent('on' + eventType, fn);
    } else {
        throw  new Error('不支持二级DOM事件');
    }
};
compatibility.removeListener = function (aim, eventType, fn) {
    if (aim.removeEventListener) {
        aim.removeEventListener(eventType, fn, false);
    } else if (aim.detachEvent) {
        aim.detachEvent('on' + eventType, fn);
    }
};

compatibility.event = function (e) {
    return e || window.event;
};
compatibility.target = function (e) {
    return e.target || e.srcElement;
};


//  call
compatibility.callFn = function (fn, obj, args) {
    return Function.prototype.apply.call(fn, obj, args);
};

compatibility.map = Array.prototype.map;
compatibility.forEach = Array.prototype.forEach;
compatibility.reduce = Array.prototype.reduce;