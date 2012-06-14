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

function __canEvent(me) {
    if (me == 'undefined' || me.length < 1) return false;
    else return true;
}

function __createEvent(me, type, cb) {
    if (me.addEventListener)
        me.addEventListener(type, cb, false);

    else if (me.attachEvent)
        me.attachEvent(type, cb);

    else
        me.type = "on" + me.type = cb;
}

function __getOffset(el) {
    var _x = 0;
    var _y = 0;
    while(el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}

//-- Object prototypes
Object.prototype.first = function() {
    return this[0];
}

Object.prototype.last = function() {
    return this[this.length-1];
}

Object.prototype.top = function() {
    return __getOffset(this).left;
}

Object.prototype.left = function() {
    return __getOffset(this).top;
}

Object.prototype.html = function(txt, h) {
    if (!txt)
        return this.innerHTML;
    else {
        if (h) {
            if (h.hasOwnProperty('write')) {
                if (h['write'] == 'append')
                    this.innerHTML = this.innerHTML + txt;
            }
        }
        else {
            this.innerHTML = txt;
        }
    }
}

Object.prototype.each = function(cb) {
    for(var i = 0; i < this.length; i++) {
        cb(this[i], i);
    }
}

/** Events **/
Object.prototype.click = function(cb) { __createEvent(this, 'click', cb); }
Object.prototype.dblclick = function(cb) { __createEvent(this, 'dblclick', cb); }
Object.prototype.mouseover = function(cb) { __createEvent(this, 'mouseover', cb); }
Object.prototype.mouseout = function(cb) { __createEvent(this, 'mouseout', cb); }
Object.prototype.keypress = function(cb) { __createEvent(this, 'keypress', cb); }
Object.prototype.keydown = function(cb) { __createEvent(this, 'keydown', cb); }
Object.prototype.keyup = function(cb) { __createEvent(this, 'keyup', cb); }
/** /Events **/

Object.prototype.hide = function() {
    this.style.display = 'none';
}

Object.prototype.show = function() {
    this.style.display = '';
}

Object.prototype.tags = function(tag) {
    var result = this;

    // no length, so probably an element from id
    if (! result.length)
        result = this.getElementsByTagName(tag);
    
    else {
        var m;
        var matches = [];
        for (var j = 0; j < result.length; j++) {
            var res = result[j].getElementsByTagName(tag);
            if (res.length > 0)
                matches.push(res);
        }
    
        result = []; 
        for (var i = 0; i < matches.length; i++) {
            for (var k = 0; k < matches[i].length; k++) {
                result.push(matches[i][k]);
            }
        }
    }
    
    return result;
}

Object.prototype.css = function(h) {
    for(var k in h) {
        var val = h[k];
        if (! (typeof val == 'function')) {
            switch(k) {
                case 'color':
                    this.style.color = val;
                    break;
                case 'background':
                    this.style.background = val;
                    break;
                case 'border':
                    this.style.border = val;
                    break;
                case 'font-size':
                    this.style.fontSize = val;
                    break;
                case 'font-weight':
                    this.style.fontWeight = val;
                    break;
                case 'height':
                    this.style.height = val;
                    break;
                case 'width':
                    this.style.width = val;
                    break;
                case 'top':
                    this.style.top = val;
                    break;
                case 'left':
                    this.style.left = val;
                    break;
                case 'right':
                    this.style.right = val;
                    break;
                case 'padding':
                    this.style.padding = val;
                    break;
                case 'margin':
                    this.style.margin = val;
                    break;
                default:
                    console.error("No such fuQuery css option '%s'", val);
            }
        }
    }
}

function ready(cb) {
    if(document.addEventListener) {   // Mozilla, Opera, Webkit are all happy with this
        document.addEventListener("DOMContentLoaded", function() {
            document.removeEventListener( "DOMContentLoaded", arguments.callee, false);
            cb();
        }, false);
    }
    else if(document.attachEvent) {   // IE sucks, so likes to be different
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

function $(el) {
    var sigil   = el.substring(0, 1);
    var element = el.substring(1, el.length);
    if (typeof el == 'object') { return el; }
    if (sigil == '#')
        return document.getElementById(element);

    else if (sigil == '.')
        return __getElementsByClassName(element);

    else
        return document.getElementsByTagName(el);
}
