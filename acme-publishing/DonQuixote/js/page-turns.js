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