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




var controlBlock = document.createElement("div");
controlBlock.className="controls";
controlBlock.style.display = "flex";
controlBlock.style.position = "fixed";
controlBlock.style.top = 0;
controlBlock.style.right = 0;
controlBlock.style.left = 0;
controlBlock.style.backgroundColor = "#ddd";
controlBlock.style.height = "30px";
var prevwrapper = document.createElement("p");
var prevlink = document.createElement("a");

var nextwrapper = document.createElement("p");
var nextlink = document.createElement("a");

var tocwrapper = document.createElement("p");
var toclink = document.createElement("a");

var librarywrapper = document.createElement("p");
var librarylink = document.createElement("a");

prevwrapper.appendChild(prevlink);
nextwrapper.appendChild(nextlink);
tocwrapper.appendChild(toclink);
librarywrapper.appendChild(librarylink);

// style p inside div.controls using flexbox

prevwrapper.style.flex = 1;
prevwrapper.style.textAlign = "center";
prevwrapper.style.margin = 0;
prevwrapper.style.padding = 0;
prevwrapper.style.border = "2px solid #ddd";
nextwrapper.style.flex = 1;
nextwrapper.style.textAlign = "center";
nextwrapper.style.margin = 0;
nextwrapper.style.padding = 0;
nextwrapper.style.border = "2px solid #ddd";


tocwrapper.style.flex = 1;
tocwrapper.style.textAlign = "center";
tocwrapper.style.margin = 0;
tocwrapper.style.padding = 0;
tocwrapper.style.border = "2px solid #ddd";

librarywrapper.style.flex = 1;
librarywrapper.style.textAlign = "center";
librarywrapper.style.margin = 0;
librarywrapper.style.padding = 0;
librarywrapper.style.border = "2px solid #ddd";


librarylink.textContent = "Library";
librarylink.href = "../../index.html";
controlBlock.appendChild(librarywrapper);

prevlink.textContent = "Prev";
prevlink.href = document.querySelector('link[rel="prev"]').href
controlBlock.appendChild(prevwrapper);

nextlink.textContent = "Next";
nextlink.href = document.querySelector('link[rel="next"]').href
controlBlock.appendChild(nextwrapper);

toclink.textContent = "Contents";
toclink.href = "../index.html";
controlBlock.appendChild(tocwrapper);



// insert control block
document.body.insertBefore(controlBlock, document.body.firstChild);

// style body
document.body.style.backgroundColor = "#F8F8F8";

// style galley-rw
document.getElementsByClassName("galley-rw")[0].style.backgroundColor = "white";
document.getElementsByClassName("galley-rw")[0].style.width = "30em";
document.getElementsByClassName("galley-rw")[0].style.margin = "0 auto 0 auto";
document.getElementsByClassName("galley-rw")[0].style.padding = "30px 2em 2em 2em";