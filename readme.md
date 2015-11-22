#EPUB Zero

EPUB Zero is a portable web publication format created from existing Web specifications. Think of it as a vernacular. Think of it as progressive enhancement for books. Think of it as books in browsers.

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


* include a manifest to facilitate offline reading, caching, or other useful behaviors. In the future we hope to align with the web application manifest spec.

```json
{
  "title": "Moby-Dick",
  "edition": 1,
  "assets": [
    "",
    "index.html",
    "html/cover.html",
    "html/title-page.html",
    "css/mobydick.css",
    "html/mobydick.css",
    "images/moby-dick-book-cover.jpg",
    "html/copyright.html",
    "html/introduction.html",
    "html/epigraph.html",
    "html/c001.html",
    "html/c002.html",
    "html/c003.html"
  ]
}
```

* include metadata inside or outside content files. By convention, metadata expressed in `index.html` is assumed to apply to the entire publication. Metadata expressed in other content files applies only to those files.

* include EPUB 3.X components like package and container files, so an EPUB Zero can also function as an EPUB 3.X document. This may require some compromises, like using the XML serialization of HTML5 and having to ZIP in strange ways.

* ZIP or otherwise package the EPUB Zero to facilitate portability.

 