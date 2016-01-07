// swipe navigation

/*
* @package SPN
* @author sheiko
* @version 0.1
* @license MIT
* @copyright (c) Dmitry Sheiko http://www.dsheiko.com
* Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
*/

(function( window ){

var window = window,
    document = window.document,
    screen = window.screen,
    touchSwipeListener = function( options ) {
        // Private members
        var track = {
                startX: 0,
                endX: 0
            },
            defaultOptions = {
                moveHandler: function( direction ) {},
                endHandler: function( direction ) {},
                minLengthRatio: 0.3
            },
            getDirection = function() {
                return track.endX > track.startX ? "prev" : "next";
            },
            isDeliberateMove = function() {
                var minLength = Math.ceil( screen.width * options.minLengthRatio );
                return Math.abs(track.endX - track.startX) > minLength;
            },
            extendOptions = function() {
                for (var prop in defaultOptions) {
                    if ( defaultOptions.hasOwnProperty( prop ) ) {
                        options[ prop ] || ( options[ prop ] = defaultOptions[ prop ] );
                    }
                }
            },
            handler = {
                touchStart: function( event ) {
                    // At least one finger has touched the screen
                    if ( event.touches.length > 0  ) {
                        track.startX = event.touches[0].pageX;
                    }
                },
                touchMove: function( event ) {
                    if ( event.touches.length > 0  ) {
                        track.endX = event.touches[0].pageX;
                        options.moveHandler( getDirection(), isDeliberateMove() );
                    }
                },
                touchEnd: function( event ) {
                    var touches = event.changedTouches || event.touches;
                    if ( touches.length > 0  ) {
                        track.endX = touches[0].pageX;
                        isDeliberateMove() && options.endHandler( getDirection() );
                    }
                }
            };

        extendOptions();
        // Graceful degradation
        if ( !document.addEventListener ) {
            return {
                on: function() {},
                off: function() {}
            }
        }
        return {
            on: function() {
                document.addEventListener('touchstart', handler.touchStart, false);
                document.addEventListener('touchmove', handler.touchMove, false);
                document.addEventListener('touchend', handler.touchEnd, false);
            },
            off: function() {
                document.removeEventListener('touchstart', handler.touchStart);
                document.removeEventListener('touchmove', handler.touchMove);
                document.removeEventListener('touchend', handler.touchEnd);
            }
        }
    }
    // Expose global
    window.touchSwipeListener = touchSwipeListener;

}( window ));



(function( window ){
    var document = window.document,
        // Element helpers
        Util = {
            addClass: function( el, className ) {
                el.className += " " + className;
            },
            hasClass: function( el, className ) {
                var re = new RegExp("\s?" + className, "gi");
                return re.test( el.className );
            },
            removeClass: function( el, className ) {
                var re = new RegExp("\s?" + className, "gi");
                el.className = el.className.replace(re, "");
            }
        },
        swipePageNav = (function() {
            // Page sibling links like <link rel="prev" title=".." href=".." />
            // See also http://diveintohtml5.info/semantics.html
            var elLink = {
                    prev: null,
                    next: null
                },
                // Arrows, which slide in to indicate the shift direction
                elArrow = {
                    prev: null,
                    next: null
                },
                swipeListener;
            return {
                init: function() {
                    this.retrievePageSiblings();
                    // Swipe navigation makes sense only if any of sibling page link available
                    if ( !elLink.prev && !elLink.next ) {
                        return;
                    }
                    this.renderArows();
                    this.syncUI();
                },
                syncUI: function() {
                    var that = this;
                    // Assign handlers for swipe "in progress" / "complete" events
                    swipeListener = new window.touchSwipeListener({
                       moveHandler: function( direction, isDeliberateMove ) {
                           if ( isDeliberateMove ) {
                               if ( elArrow[ direction ] && elLink[ direction ] ) {
                                   Util.hasClass( elArrow[ direction ], "visible" ) ||
                                       Util.addClass( elArrow[ direction ], "visible" );
                               }
                           } else {
                               Util.removeClass( elArrow.next, "visible" );
                               Util.removeClass( elArrow.prev, "visible" );
                           }
                       },
                       endHandler: function( direction ) {
                            that[ direction ] && that[ direction ]();
                       }
                    });
                    swipeListener.on();
                },
                retrievePageSiblings: function() {
                    elLink.prev = document.querySelector( "head > link[rel=prev]");
                    elLink.next = document.querySelector( "head > link[rel=next]");
                },
                renderArows: function() {
                    var renderArrow = function( direction ) {
                        var div = document.createElement("div");
                        div.className = "spn-direction-sign " + direction;
                        document.getElementsByTagName( "body" )[ 0 ].appendChild( div );
                        return div;
                    }
                    elArrow.next = renderArrow( "next" );
                    elArrow.prev = renderArrow( "prev" );
                },
                // When the shift (page swap) is requested, this overlay indicates that
                // the current page is frozen and a new one is loading
                showLoadingScreen: function() {
                    var div = document.createElement("div");
                    div.className = "spn-freezing-overlay";
                    document.getElementsByTagName( "body" )[ 0 ].appendChild( div );
                },
                // Request the previous sibling page
                prev: function() {
                    if ( elLink.prev ) {
                        this.showLoadingScreen();
                        window.location.href = elLink.prev.href;
                    }
                },
                // Request the next sibling page
                next: function() {
                    if ( elLink.next ) {
                        this.showLoadingScreen();
                        window.location.href = elLink.next.href;
                    }
                }
            }
        }())

    // Apply when document is ready
    document.addEventListener( "DOMContentLoaded", function(){
        document.removeEventListener( "DOMContentLoaded", arguments.callee, false );
        try {
            swipePageNav.init();
        } catch (e) {
            alert(e);
        }
    }, false );


}( window ));




var script = document.createElement('script');
script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);


var view = document.createElement('meta');
view.name = "viewport";
view.content="width=device-width, initial-scale=1.0";
document.getElementsByTagName('head')[0].appendChild(view);

var controls = document.createElement('p');
controls.setAttribute("class", "page-controls");


var pagescript = document.createElement('script');
pagescript.src = '../../page.js';
pagescript.type = 'text/javascript';
pagescript.setAttribute("async", "async");

controls.appendChild(pagescript);

//document.getElementsByTagName('body')[0].appendChild(controls);



// use arrow keys to navigate from chapter to chapter

   document.onkeyup = function(e) { // key pressed
    if(document.activeElement.nodeName === "INPUT"
    || document.activeElement.nodeName === "TEXTAREA") {
        return; // abort if focusing input box
    }

    var elems = document.getElementsByTagName("link"),
        links = {};

    for(var i = 0; i < elems.length; i++) { // filter link elements
        var elem = elems[i];
        if(elem.rel === "prev") { // add prev to links object
            links.prev = elem;
        } else if(elem.rel === "next") { // ad next to links object
            links.next = elem;
        }
    }

    if(e.keyCode === 37) { // left key
        location.href = links.prev.href;
    } else if(e.keyCode === 39) { // right key
        location.href = links.next.href;
    }
};


// create control block for book pages

var controlBlock = document.createElement("div");
controlBlock.className="controls";
controlBlock.style.display = "flex";
controlBlock.style.position = "fixed";
controlBlock.style.top = 0;
controlBlock.style.right = 0;
// controlBlock.style.left = 0;
controlBlock.style.width="100%";
controlBlock.style.backgroundColor = "#ddd";
controlBlock.style.height = "2em";
var prevWrapper = document.createElement("p");
var prevlink = document.createElement("a");

var nextWrapper = document.createElement("p");
var nextlink = document.createElement("a");

var tocWrapper = document.createElement("p");
var toclink = document.createElement("a");

var libraryWrapper = document.createElement("p");
var librarylink = document.createElement("a");

var fontPlusWrapper = document.createElement("p");
var fontPluslink = document.createElement("input");
fontPluslink.type='button';
fontPluslink.value='+';
fontPluslink.addEventListener('click', function() { var cur = window.getComputedStyle(document.getElementsByClassName("galley-rw")[0]).fontSize;  document.getElementsByClassName('galley-rw')[0].style.fontSize = parseInt(cur) + 2 + "px"}, false)


var fontMinuslink = document.createElement("input");
fontMinuslink.type='button';
fontMinuslink.value='-';
fontMinuslink.addEventListener('click', function() { var cur = window.getComputedStyle(document.getElementsByClassName("galley-rw")[0]).fontSize;  document.getElementsByClassName('galley-rw')[0].style.fontSize = parseInt(cur) - 2 + "px"}, false)

prevWrapper.appendChild(prevlink);
prevWrapper.appendChild(nextlink);
tocWrapper.appendChild(toclink);
libraryWrapper.appendChild(librarylink);
fontPlusWrapper.appendChild(fontPluslink);
fontPlusWrapper.appendChild(fontMinuslink);

// style p inside div.controls using flexbox

prevWrapper.style.flex = 1;
prevWrapper.style.textAlign = "center";
prevWrapper.style.margin = 0;
prevWrapper.style.padding = 0;
prevWrapper.style.border = "2px solid #ddd";
nextWrapper.style.flex = 1;
nextWrapper.style.textAlign = "center";
nextWrapper.style.margin = 0;
nextWrapper.style.padding = 0;
nextWrapper.style.border = "2px solid #ddd";


controls.style.flex = 1;
controls.style.textAlign = "center";
controls.style.margin = 0;
controls.style.padding = 0;
controls.style.border = "2px solid #ddd";


tocWrapper.style.flex = 1;
tocWrapper.style.textAlign = "center";
tocWrapper.style.margin = 0;
tocWrapper.style.padding = 0;
tocWrapper.style.border = "2px solid #ddd";

libraryWrapper.style.flex = 1;
libraryWrapper.style.textAlign = "center";
libraryWrapper.style.margin = 0;
libraryWrapper.style.padding = 0;
libraryWrapper.style.border = "2px solid #ddd";

fontPlusWrapper.style.flex = 1;
fontPlusWrapper.style.textAlign = "center";
fontPlusWrapper.style.margin = 0;
fontPlusWrapper.style.padding = 0;
fontPlusWrapper.style.border = "2px solid #ddd";

fontMinuslink.style.display = "inline";
fontPluslink.style.border = "2px solid #ddd";
fontPluslink.style.padding = 0;
fontPluslink.style.margin = 0;
fontPluslink.style.backgroundColor = "#aaa";
fontPluslink.style.fontSize = "1em";

fontMinuslink.style.display = "inline";
fontMinuslink.style.border = "2px solid #ddd";
fontMinuslink.style.padding = 0;
fontMinuslink.style.backgroundColor = "#aaa";
fontMinuslink.style.fontSize = "1em";





librarylink.textContent = "Library";
librarylink.href = "../../index.html";
controlBlock.appendChild(libraryWrapper);

toclink.textContent = "Contents";
toclink.href = "../index.html";
controlBlock.appendChild(tocWrapper);

prevlink.textContent = "<prev ";
prevlink.href = document.querySelector('link[rel="prev"]').href
controlBlock.appendChild(prevWrapper);

nextlink.textContent = " next>";
nextlink.href = document.querySelector('link[rel="next"]').href
// controlBlock.appendChild(nextWrapper);




controlBlock.appendChild(fontPlusWrapper);


controlBlock.appendChild(controls)



// insert control block
document.body.insertBefore(controlBlock, document.body.firstChild);

// style body
document.body.style.backgroundColor = "#F8F8F8";

// try to do something different for small screens
var mq = window.matchMedia('@media all and (max-width: 750px)');
if(mq.matches) {
    // the width of browser is more then 750px

document.getElementsByClassName("galley-rw")[0].style.width = "30em";
} else {
    // the width of browser is less then 750px
document.getElementsByClassName("galley-rw")[0].style.width = "90%";
}



// style galley-rw
document.getElementsByClassName("galley-rw")[0].style.backgroundColor = "white";

document.getElementsByClassName("galley-rw")[0].style.margin = "0 auto 0 auto";
document.getElementsByClassName("galley-rw")[0].style.padding = "2em 2em 2em 2em";


//document.getElementsByClassName("page-controls")[0].style.padding = "2em 0 0 0";






