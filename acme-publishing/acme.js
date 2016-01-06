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
controlBlock.style.left = 0;
controlBlock.style.backgroundColor = "#ddd";
controlBlock.style.height = "30px";
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
fontPluslink.addEventListener('click', function() { var cur = window.getComputedStyle(document.body).fontSize;  document.body.style.fontSize = parseInt(cur) + 2 + "px"}, false)


var fontMinuslink = document.createElement("input");
fontMinuslink.type='button';
fontMinuslink.value='-';
fontMinuslink.addEventListener('click', function() { var cur = window.getComputedStyle(document.body).fontSize;  document.body.style.fontSize = parseInt(cur) - 2 + "px"}, false)

prevWrapper.appendChild(prevlink);
nextWrapper.appendChild(nextlink);
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



librarylink.textContent = "Library";
librarylink.href = "../../index.html";
controlBlock.appendChild(libraryWrapper);

prevlink.textContent = "Prev";
prevlink.href = document.querySelector('link[rel="prev"]').href
controlBlock.appendChild(prevWrapper);

nextlink.textContent = "Next";
nextlink.href = document.querySelector('link[rel="next"]').href
controlBlock.appendChild(nextWrapper);

toclink.textContent = "Contents";
toclink.href = "../index.html";
controlBlock.appendChild(tocWrapper);


controlBlock.appendChild(fontPlusWrapper);



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
document.getElementsByClassName("galley-rw")[0].style.padding = "30px 2em 2em 2em";


document.getElementsByClassName("page-controls")[0].style.padding = "30px 0 0 0";
