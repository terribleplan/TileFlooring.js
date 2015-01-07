/*! TileFlooring.js 0.0.1 | (c) 2015 Kegan Myers | https://terribleplan.com/TileFlooring.js/LICENSE.md */

var TileFloor = (function() {
    function elementSuicide(element) {
        if (element.parentElement !== null) {
            element.parentElement.removeChild(element);
        }
    }
    if (typeof document.querySelectorAll !== "function") {
        throw new Error("TileFloor is only compatible with HTML5 browsers");
    }

    function TileElement(element) {
        this.element = element;
        this.originalParent = element.parent;
    }
    TileElement.prototype.removeSelf = function removeSelf() {
        elementSuicide(this.element);
    };

    function TileElementContainer(element) {
        this.element = element;
    }
    TileElementContainer.prototype.removeSelf = TileElement.prototype.removeSelf;
    TileElementContainer.prototype.height = function height() {
        return this.element.offsetHeight;
    };
    TileElementContainer.prototype.addChild = function addChild(child) {
        return this.element.appendChild(child);
    };

    function Tile(element, options) {
        if (!element.tagName || typeof element.querySelectorAll !== "function") {
            throw new Error("The first argument must be a DOM Element");
        }
        if (!options.hasOwnProperty("elementSelector")) {
            throw new Error("You must define an element selector");
        }
        if (options.hasOwnProperty("columns")) {
            if (!options.columns.hasOwnProperty("maxWidth")) {
                throw new Error("You must define a max width for your columns");
            }
            if (!options.columns.hasOwnProperty("maxCount")) {
                options.columns.maxCount = Infinity;
            }
        } else {
            throw new Error("The only display mode is `columns`");
        }
        this.masterElement = element;
        this.destroyed = false;
        this.options = options;
        this.elements = Array.prototype.map.call(element.querySelectorAll(options.elementSelector), function (element) {
            return new TileElement(element)
        });
        this.containers = [];
        this.containerElement = null;
        var cssPostfix = "-generated-tf" + Math.floor(Math.random() * 10000);
        this.clearfixClassName = "clearfix" + cssPostfix;
        this.columnClassName = "responsive-column" + cssPostfix;
        this.clearfixStylesheet = document.createElement("style");
        document.head.appendChild(this.clearfixStylesheet);
        this.clearfixStylesheet.sheet.insertRule("." + this.clearfixClassName + ":after{content:\"\";display:table;clear:both}", 0);
        this.clearfixStylesheet.sheet.insertRule("." + this.columnClassName + "{float:left;max-width:" + options.columns.maxWidth + "px}",0);
        this.flow();

        //Adjust columns when the window is resized
        var _this = this;
        this.onResize = function onResize() {
            var newColumnCount = _this.determineColumns();
            if (_this.containers.length !== newColumnCount) {
                return _this.flow();
            }
        };
        window.addEventListener('resize', this.onResize, false);
    }
    function goAway(element) {
        element.removeSelf();
    }
    function create() {
        return document.createElement("div");
    }
    function shortest(arr) {
        var shortIndex = 0, shortHeight = Infinity;
        arr.forEach(function(container, i) {
            var h = container.height();
            if (h < shortHeight) {
                shortIndex = i;
                shortHeight = h;
            }
        });
        return arr[shortIndex];
    }

    Tile.prototype.flow = function flow() {
        var _this = this;
        if (this.containerElement !== null) {
            elementSuicide(this.containerElement);
        }
        this.elements.forEach(goAway);
        this.containers.forEach(goAway);

        var columnCount = this.determineColumns();
        if (columnCount === 0) {
            throw new Error("Cowardly refusing to flow elements into 0 columns");
        }
        this.containerElement = create();
        this.containerElement.className = this.clearfixClassName;

        this.containers = (new Array(columnCount));
        for (var i = 0; i < columnCount; i++) {
            var div = create();
            div.className = _this.columnClassName;
            div.style.width = (100 / columnCount) + "%";
            _this.containerElement.appendChild(div);
            this.containers[i] = new TileElementContainer(div);
        }
        this.masterElement.appendChild(this.containerElement);
        this.elements.forEach(function(newChild) {
            shortest(_this.containers).addChild(newChild.element);
        });
    };

    Tile.prototype.determineColumns = function determineColumns() {
        return Math.min(Math.ceil(this.masterElement.offsetWidth / this.options.columns.maxWidth), this.options.columns.maxCount);;
    };

    return Tile;
})();