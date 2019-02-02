
document.addEventListener('mousedown', function (e) {
    e.preventDefault();
}, false);

function callFn(fn, obj, args) {
    return Function.prototype.apply.call(fn, obj, args);
}