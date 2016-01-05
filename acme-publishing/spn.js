var touchApi;
(function (touchApi) {
    var SwipeListener = (function () {
        function SwipeListener(options) {
            this.track = {
                startX: 0,
                endX: 0
            };
            if(!document.addEventListener) {
                throw new Error("The browser must too old to support addEventListener");
            }
        }
        SwipeListener.prototype.getDirection = function () {
            return this.track.endX > this.track.startX ? "prev" : "next";
        };
        SwipeListener.prototype.isDeliberateMove = function () {
            var minLength = Math.ceil(screen.width * this.options.minLengthRatio);
            return Math.abs(this.track.endX - this.track.startX) > minLength;
        };
        SwipeListener.prototype.touchStartHandler = function (event) {
            if(event.touches.length > 0) {
                this.track.startX = event.touches[0].pageX;
            }
        };
        SwipeListener.prototype.touchMoveHandler = function (event) {
            if(event.touches.length > 0) {
                this.track.endX = event.touches[0].pageX;
                this.options.moveHandler(this.getDirection(), this.isDeliberateMove());
            }
        };
        SwipeListener.prototype.touchEndHandler = function (event) {
            var touches = event.changedTouches || event.touches;
            if(touches.length > 0) {
                this.track.endX = touches[0].pageX;
                if(this.isDeliberateMove()) {
                    this.options.endHandler(this.getDirection());
                }
            }
        };
        return SwipeListener;
    })();
    touchApi.SwipeListener = SwipeListener;    
})(touchApi || (touchApi = {}));

var Util;
(function (Util) {
    function addClass(el, className) {
        el.className += " " + className;
    }
    Util.addClass = addClass;
    function hasClass(el, className) {
        var re = new RegExp("\\s?" + className, "gi");
        return re.test(el.className);
    }
    Util.hasClass = hasClass;
    function removeClass(el, className) {
        var re = new RegExp("\\s?" + className, "gi");
        el.className = el.className.replace(re, "");
    }
    Util.removeClass = removeClass;
})(Util || (Util = {}));

var pageNav;
(function (pageNav) {
    var swipeNav = (function () {
        function swipeNav() {
            this.retrievePageSiblings();
            if(!this.elLink.prev && !this.elLink.next) {
                return;
            }
            this.renderArows();
            this.syncUI();
        }
        swipeNav.prototype.syncUI = function () {
            var _this = this;
            swipeListener = new touchApi.SwipeListener({
                moveHandler: function (direction, isDeliberateMove) {
                    if(isDeliberateMove) {
                        if(_this.elArrow[direction] && elLink[direction]) {
                            if(!Util.hasClass(_this.elArrow[direction], "visible")) {
                                Util.addClass(_this.elArrow[direction], "visible");
                            }
                        }
                    } else {
                        Util.removeClass(_this.elArrow.next, "visible");
                        Util.removeClass(_this.elArrow.prev, "visible");
                    }
                },
                endHandler: function (direction) {
                    if(_this[direction]) {
                        _this[direction]();
                    }
                }
            });
            swipeListener.on();
        };
        swipeNav.prototype.retrievePageSiblings = function () {
            this.elLink.prev = document.querySelector("head > link[rel=prev]");
            this.elLink.next = document.querySelector("head > link[rel=next]");
        };
        swipeNav.prototype.renderArows = function () {
            var renderArrow = function (direction) {
                var div = document.createElement("div");
                div.className = "spn-direction-sign " + direction;
                document.getElementsByTagName("body")[0].appendChild(div);
                return div;
            };
            this.elArrow.next = renderArrow("next");
            this.elArrow.prev = renderArrow("prev");
        };
        swipeNav.prototype.showLoadingScreen = function () {
            var div = document.createElement("div");
            div.className = "spn-freezing-overlay";
            document.getElementsByTagName("body")[0].appendChild(div);
        };
        swipeNav.prototype.prev = function () {
            if(this.elLink.prev) {
                this.showLoadingScreen();
                window.location.href = this.elLink.prev.href;
            }
        };
        swipeNav.prototype.next = function () {
            if(this.elLink.next) {
                this.showLoadingScreen();
                window.location.href = this.elLink.next.href;
            }
        };
        return swipeNav;
    })();
    pageNav.swipeNav = swipeNav;    
})(pageNav || (pageNav = {}));

document.addEventListener("DOMContentLoaded", fn = function () {
    document.removeEventListener("DOMContentLoaded", fn, false);
    try  {
        new pageNav.SwipeNav();
    } catch (e) {
    }
}, false);
