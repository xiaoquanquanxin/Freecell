document.addEventListener('mousedown', function (e) {
    e.preventDefault();
}, false);

function callFn(fn, obj, args) {
    return Function.prototype.apply.call(fn, obj, args);
}


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

compatibility.event = function (e) {
    return e || window.event;
};
compatibility.target = function (e) {
    return e.target || e.srcElement;
};