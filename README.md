TileFlooring.js
===============
You want a masonry-style layout? You got it.

I got sick of isotope/masonry, so decided to write this. Right now it takes a very simple approach and is a little limited in what it can do.

This simply figures out how many columns to make, and then puts things into those columns.

Usage
=====
```javascript
var floor = new TileFloor(myDivElement, {
    elementSelector: ".item",
    columns: {
        maxWidth: 200,
        maxCount: 5
    }
});
```
And now you have 5 columns that are each a maximum of 200px wide. If you only have 620px to work with, you get 4 columns, 600 gets 3, etc.

TileFlooring.js automatically responds to width changes through a combination of CSS, styles, and javascript, but only needs to run intensive javascript if the number of columns is changed, everything else is done by styles!

Limitations
===========
TileFlooring does not (and will not) work on browsers that do not have proper HTML5 support, sorry. Not worth the trouble or cruft.

TileFlooring.js is a young project and not all features are implemented yet. There are plans to add more options to the column layout, the ability to dynamically add elements without having to recreate the floor, the ability to actually destroy a floor, and more layout options.

Contributing
============
Just send a PR, as long as you're cool with publishing your code under the BSD license.