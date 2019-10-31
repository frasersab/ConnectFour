// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/parcel/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../node_modules/parcel/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../node_modules/parcel/src/builtins/bundle-url.js"}],"css/style.scss":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel/src/builtins/css-loader.js"}],"js/ConnectFour.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConnectFour = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ConnectFour =
/*#__PURE__*/
function () {
  function ConnectFour(selector) {
    _classCallCheck(this, ConnectFour);

    // Game variables
    this.gameOver = false;
    this.playerTurn = 0; // player 0 is red, player 1 is yellow

    this.cellOwners = []; // 2d array. Columns then rows

    this.lastMove = 0; // user to keep track of refresh rate

    this.updateTime = 100; // How often mouseMovement can update in ms
    // Colours

    this.colourRed = 'rgb(240, 41, 41)';
    this.colourYellow = 'rgb(240, 232, 10)';
    this.colourBlue = 'rgb(44, 173, 242)';
    this.colourBlank = 'rgb(255, 255, 255)'; // Drawing variables

    this.rows = 6;
    this.columns = 7;
    this.aspectRatio = this.columns / this.rows;
    this.connect = 4; // number of pucks needed to algin to win

    this.canvas = document.getElementById(selector); // the canvas element

    this.ctx = this.canvas.getContext('2d'); // the canvas context

    this.width = this.canvas.scrollWidth; // setting the canvas elements width to a variable

    this.height = this.canvas.scrollHeight; // setting the canvas elements height to a variable

    this.canvas.width = this.width; // set canvas width to the same as the canvas element

    this.canvas.height = this.height; // set canvas height to the same as the canvas element

    this.cellWidth = this.width / this.columns;
    this.cellHeight = this.height / this.rows;
    this.radius = this.cellWidth / 2.6; // sets raius for full circle that scales with canvas

    this.radiusSemi = this.cellWidth / 3.6; // sets radius for circle outline that scales with canvas

    this.initialise(); // Event listeners

    this.canvas.addEventListener('click', this.click.bind(this));
    this.canvas.addEventListener('mousemove', this.mouseMove.bind(this));
    window.addEventListener('resize', this.resizeGame.bind(this), false);
    window.addEventListener('orientationchange', this.resizeGame.bind(this), false);
  }

  _createClass(ConnectFour, [{
    key: "resizeGame",
    value: function resizeGame() {
      var windowWidth = window.innerWidth;
      var windowHeight = window.innerHeight;
      var windowAspectRatio = windowWidth / windowHeight;

      if (windowAspectRatio > this.aspectRatio) {
        this.canvas.height = windowHeight;
        this.canvas.width = this.aspectRatio * windowHeight;
      } else {
        this.canvas.width = windowWidth;
        this.canvas.height = windowWidth / this.aspectRatio;
      } // reset all drawing variables


      this.width = this.canvas.scrollWidth;
      this.height = this.canvas.scrollHeight;
      this.canvas.width = this.width; // set canvas width to the same as the canvas element

      this.canvas.height = this.height; // set canvas height to the same as the canvas element

      this.cellWidth = this.width / this.columns;
      this.cellHeight = this.height / this.rows;
      this.radius = this.cellWidth / 2.6; // sets raius for full circle that scales with canvas

      this.radiusSemi = this.cellWidth / 3.6; // sets radius for circle outline that scales with canvas
      //

      this.drawGrid();
    }
  }, {
    key: "initialise",
    value: function initialise() {
      // set all cell owners to null
      var rowsArray = [];

      for (var i = 0; i < this.columns; i++) {
        for (var j = 0; j < this.rows; j++) {
          rowsArray.push(null);
        }

        this.cellOwners.push(rowsArray);
        rowsArray = [];
      } // size the game


      this.resizeGame();
    }
  }, {
    key: "click",
    value: function click(event) {
      // find the next available cell in the column
      var cell = this.getCell(event.offsetX, event.offsetY); // if the cell is full don't do anything

      if (cell[1] == -1) {
        return;
      } else {
        // add cell to player owner
        this.cellOwners[cell[0]][cell[1]] = this.playerTurn; // else draw a new grid with a full circle for the available cell in the column

        this.drawGrid(); // toggle player turn

        this.playerTurn ^= 1; // add new circle preview to new available

        cell = this.getCell(event.offsetX, event.offsetY);
        this.drawCell(cell, true);
      }
    }
  }, {
    key: "mouseMove",
    value: function mouseMove(event) {
      // limit mouseMove updates to 
      if (Date.now() - this.lastMove > this.updateTime) {
        // find the next available cell in the column
        var cell = this.getCell(event.offsetX, event.offsetY); // if the cell is full don't draw grid without filling cell

        if (cell[1] == -1) {
          this.drawGrid();
        } // Else draw a new grid with a semi circle for the available cell in the column
        else {
            this.drawGrid();
            this.drawCell(cell, true);
          } // reset last move


        this.lastMove = Date.now();
      }
    }
  }, {
    key: "drawCell",
    value: function drawCell(cell) {
      var semiCircle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var centerX = cell[0] * this.cellWidth + this.cellWidth / 2;
      var centerY = cell[1] * this.cellHeight + this.cellHeight / 2; // get player colour

      if (this.playerTurn == 0) {
        // red player
        this.ctx.fillStyle = this.colourRed;
      } else {
        // yellow player
        this.ctx.fillStyle = this.colourYellow;
      } // draw player colour circle


      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, this.radius, 0, 2 * Math.PI);
      this.ctx.fill(); // if preview circle then blank out center of full circle

      if (semiCircle) {
        this.ctx.fillStyle = this.colourBlank;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, this.radiusSemi, 0, 2 * Math.PI);
        this.ctx.fill();
      }
    } // find cell number from x,y position

  }, {
    key: "checkCell",
    value: function checkCell(x, y) {
      if (x == this.width) x--; // handling edge case

      if (y == this.height) y--; // handling edge case

      return [Math.trunc(x / this.cellWidth), Math.trunc(y / this.cellHeight)];
    }
  }, {
    key: "getCell",
    value: function getCell(x, y) {
      // get cell from mouse click
      var cell = this.checkCell(x, y); // find out which row is the bottom in the column and return that cell

      for (var i = 0; i < this.rows; i++) {
        if (this.cellOwners[cell[0]][i] !== null) {
          return [cell[0], i - 1];
        }
      }

      return [cell[0], this.rows - 1];
    }
  }, {
    key: "drawGrid",
    value: function drawGrid() {
      // create rounded rectange
      this.ctx.fillStyle = this.colourBlue;
      this.roundRect(this.ctx, 0, 0, this.width, this.height, this.radius, true, false); // create grid of holes

      var x = this.cellWidth / 2; // sets the initial x center position of the first hole

      var y = this.cellHeight / 2; // sets the initial y center position of the first hole

      for (var i = 0; i < this.columns; i++) {
        for (var j = 0; j < this.rows; j++) {
          if (this.cellOwners[i][j] == 0) {
            this.ctx.fillStyle = this.colourRed;
          } else if (this.cellOwners[i][j] == 1) {
            this.ctx.fillStyle = this.colourYellow;
          } else {
            this.ctx.fillStyle = this.colourBlank;
          }

          this.ctx.beginPath();
          this.ctx.arc(x, y, this.radius, 0, 2 * Math.PI);
          this.ctx.fill();
          y = y + this.cellHeight; // increments the x center position for the next hole in the row
        }

        y = this.cellHeight / 2; // resets the x center position for the next column of holes

        x = x + this.cellWidth; // increments the y center position for the next hole in the column
      }
    }
  }, {
    key: "roundRect",
    value: function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
      if (typeof stroke === 'undefined') {
        stroke = true;
      }

      if (typeof radius === 'undefined') {
        radius = 5;
      }

      if (typeof radius === 'number') {
        radius = {
          tl: radius,
          tr: radius,
          br: radius,
          bl: radius
        };
      } else {
        var defaultRadius = {
          tl: 0,
          tr: 0,
          br: 0,
          bl: 0
        };

        for (var side in defaultRadius) {
          radius[side] = radius[side] || defaultRadius[side];
        }
      }

      ctx.beginPath();
      ctx.moveTo(x + radius.tl, y);
      ctx.lineTo(x + width - radius.tr, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
      ctx.lineTo(x + width, y + height - radius.br);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
      ctx.lineTo(x + radius.bl, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
      ctx.lineTo(x, y + radius.tl);
      ctx.quadraticCurveTo(x, y, x + radius.tl, y);
      ctx.closePath();

      if (fill) {
        ctx.fill();
      }

      if (stroke) {
        ctx.stroke();
      }
    }
  }]);

  return ConnectFour;
}();

exports.ConnectFour = ConnectFour;
},{}],"js/main.js":[function(require,module,exports) {
"use strict";

require("../css/style.scss");

var _ConnectFour = require("./ConnectFour.js");

console.log('Kia Ora');
var connectFour = new _ConnectFour.ConnectFour('connect-four');
},{"../css/style.scss":"css/style.scss","./ConnectFour.js":"js/ConnectFour.js"}],"../node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "56009" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel/src/builtins/hmr-runtime.js","js/main.js"], null)
//# sourceMappingURL=/main.fb6bbcaf.js.map