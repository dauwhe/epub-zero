#EPUB Zero

EPUB Zero is a portable web publication format created from existing Web specifications. Think of it as a [vernacular](http://vernacular.io). Think of it as progressive enhancement for books. Think of it as [books in browsers](http://booksinbrowsers.org).

EPUB Zero attempts to fulfill the vision of "Portable Web Publications" as defined in the Digital Publishing Interest Group's [white paper](http://w3c.github.io/dpub-pwp/).

In a nutshell, EPUB Zero is:

* a folder
* of well structured, semantic, accessible OWP content (HTML5, CSS, SVG, MathML, images, audio, video)
* with a navigation file called `index.html` in the top level of the folder

```
MobyDick/
  index.html
  html/
    c001.html
    c002.html
    c003.html
  css/
    mobydick.css
  images/
    moby-dick-book-cover.jpg
```

* which includes a `nav` element listing all the content documents in a default sequence, with links and link text.

```html
<nav id="nav1">
  <ol>
    <li><a href="html/c001.html">Loomings</a></li>
    <li><a href="html/c002.html">The Carpet-Bag</a></li>
    <li><a href="html/c003.html">The Spouter-Inn</a></li>
  </ol>
</nav>
```

Drop this in a web server, and anyone who has the URI of the folder can read everything in the book. Of course, we want more from our books, and so we can progressively enhance an EPUB Zero:

* use HTML link relations to describe the relationships between documents, possibly using a bit of JavaScript to allow keyboard navigation through the document sequence for browsers that don't support functionality (kudos to Firefox and Opera, shame on Safari, Chrome, and Edge).

```html
<head>
  <title>Moby-Dick</title>
  <meta charset="utf-8">
  <link rel="contents" href="../index.html">
  <link rel="prev" href="c001.html" />
  <link rel="next" href="c003.html" />
</head>
```


* include a manifest to facilitate offline reading, caching, or other useful behaviors. In the example below, `assets` are appended to a web application manifest.

```json
{
  "name": "Moby-Dick",
  "short_name": "Moby-Dick",
  "icons": [{
        "src": "images/moby-dick-icon.jpg",
        "sizes": "64x64",
        "type": "image/jpeg"
      }],
  "start_url": "index.html",
  "display": "fullscreen",

  "assets": [
            
    "",
"html/title-page.html",
"html/copyright.html",
"html/introduction.html",
"html/epigraph.html",
"html/c001.html",
"html/c002.html",
...
```

* include metadata inside or outside content files. By convention, metadata expressed in `index.html` is assumed to apply to the entire publication. Metadata expressed in other content files applies only to those files.

* include EPUB 3.X components like package and container files, so an EPUB Zero can also function as an EPUB 3.X document. This may require some compromises, like using the XML serialization of HTML5 and having to ZIP in strange ways.

* ZIP or otherwise package the EPUB Zero to facilitate portability.

##Examples

###Acme Publishing

[Acme Publishing](https://dauwhe.github.io/epub-zero/acme-publishing) is an attempt to prototype some of these ideas, allowing for online and offline reading of book content in web browsers. 

####Offline

The offline functionality of this site depends on Service Workers, and so works best in recent versions of Chrome (tested in 46) or Firefox Nightly (tested in 45.0a1 (2015-11-25)).

####User Interface
The book files contain a link to a javascript file that creates the navigation bar at the top of the page and provides a bit of styling for the `body` element. It also assigns the left and right arrow keys to move to the previous and next files, respectively. 



##Further Reading

* https://github.com/jakearchibald/ebook-demo

* http://vernacular.io

* https://infrequently.org/2015/06/progressive-apps-escaping-tabs-without-losing-our-soul/

 