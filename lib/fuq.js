/*
 * fuQuery - or just fuq for short. Heh.
 * Minimalistic Javascript library for Javascript, written in Javascript for use with Javascript. That was deliberate.
 * This is _not_ a jQuery wannabe, nor will I pretend it is. It's just a simplistic library to make 
 * some things easier without the need to load larger libraries, like jQuery.
 */

__getElementsByClassName = function(className) {
    var hasClassName = new RegExp("(?:^|\\s)" + className + "(?:$|\\s)");
    var allElements = document.getElementsByTagName("*");
    var results = [];

    var element;
    for (var i = 0; (element = allElements[i]) != null; i++) {
        var elementClass = element.className;
        if (elementClass && elementClass.indexOf(className) != -1 && hasClassName.test(elementClass))
            results.push(element);
    }

    return results;
}

//-- Object prototypes
Object.prototype.first = function() {
    return this[0];
}

Object.prototype.last = function() {
    return this[this.length-1];
}

Object.prototype.html = function(txt) {
    this.innerHTML = txt;
}

Object.prototype.click = function(cb) {
    if (typeof addEventListener == 'function')
        this.addEventListener('click', cb);
    else if (typeof attachEvent == 'function')
        this.attachEvent('onclick', cb);
    else
        console.error("Can't create onClick event. Not supported by your browser");
}

Object.prototype.hide = function() {
    this.style.display = 'none';
}

Object.prototype.show = function() {
    this.style.display = '';
}

function ready(cb) {
    if(document.addEventListener) {   // Mozilla, Opera, Webkit are all happy with this
        document.addEventListener("DOMContentLoaded", function() {
            document.removeEventListener( "DOMContentLoaded", arguments.callee, false);
            cb();
        }, false);
    }
    else if(document.attachEvent) {   // IE is different...
        document.attachEvent("onreadystatechange", function() {
            if(document.readyState === "complete") {
                document.detachEvent("onreadystatechange", arguments.callee);
                cb();
            }
        });
    }
}

//-- Getters
function find(h) {
    if (h.hasOwnProperty('id'))
        return document.getElementById(h['id']);
    else if (h.hasOwnProperty('class'))
        return __getElementsByClassName(h['class']);
}