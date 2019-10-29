parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"nCJ9":[function(require,module,exports) {

},{}],"X5h2":[function(require,module,exports) {
"use strict";function t(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}function i(t,i){for(var e=0;e<i.length;e++){var l=i[e];l.enumerable=l.enumerable||!1,l.configurable=!0,"value"in l&&(l.writable=!0),Object.defineProperty(t,l.key,l)}}function e(t,e,l){return e&&i(t.prototype,e),l&&i(t,l),t}Object.defineProperty(exports,"__esModule",{value:!0}),exports.ConnectFour=void 0;var l=function(){function i(e){t(this,i),this.gameOver=!1,this.playerTurn=0,this.cellOwners=[],this.lastMove=0,this.updateTime=100,this.colourRed="rgb(240, 41, 41)",this.colourYellow="rgb(240, 232, 10)",this.colourBlue="rgb(44, 173, 242)",this.colourBlank="rgb(255, 255, 255)",this.rows=6,this.columns=7,this.connect=4,this.canvas=document.getElementById(e),this.width=this.canvas.scrollWidth,this.height=this.canvas.scrollHeight,this.canvas.width=this.width,this.canvas.height=this.height,this.cellWidth=this.width/this.columns,this.cellHeight=this.height/this.rows,this.radius=this.cellWidth/2.6,this.radiusSemi=this.cellWidth/3.6,this.ctx=this.canvas.getContext("2d"),this.initialise(),this.canvas.addEventListener("click",this.click.bind(this)),this.canvas.addEventListener("mousemove",this.mouseMove.bind(this))}return e(i,[{key:"initialise",value:function(){for(var t=[],i=0;i<this.columns;i++){for(var e=0;e<this.rows;e++)t.push(null);this.cellOwners.push(t),t=[]}this.drawGrid()}},{key:"click",value:function(t){var i=this.getCell(t.offsetX,t.offsetY);-1!=i[1]&&(this.cellOwners[i[0]][i[1]]=this.playerTurn,this.drawGrid(),this.playerTurn^=1,i=this.getCell(t.offsetX,t.offsetY),this.drawCell(i,!0))}},{key:"mouseMove",value:function(t){if(Date.now()-this.lastMove>this.updateTime){var i=this.getCell(t.offsetX,t.offsetY);-1==i[1]?this.drawGrid():(this.drawGrid(),this.drawCell(i,!0)),this.lastMove=Date.now()}}},{key:"drawCell",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]&&arguments[1],e=t[0]*this.cellWidth+this.cellWidth/2,l=t[1]*this.cellHeight+this.cellHeight/2;0==this.playerTurn?this.ctx.fillStyle=this.colourRed:this.ctx.fillStyle=this.colourYellow,this.ctx.beginPath(),this.ctx.arc(e,l,this.radius,0,2*Math.PI),this.ctx.fill(),i&&(this.ctx.fillStyle=this.colourBlank,this.ctx.beginPath(),this.ctx.arc(e,l,this.radiusSemi,0,2*Math.PI),this.ctx.fill())}},{key:"checkCell",value:function(t,i){return[Math.trunc(t/this.cellWidth),Math.trunc(i/this.cellHeight)]}},{key:"getCell",value:function(t,i){for(var e=this.checkCell(t,i),l=0;l<this.rows;l++)if(null!==this.cellOwners[e[0]][l])return[e[0],l-1];return[e[0],this.rows-1]}},{key:"drawGrid",value:function(){this.ctx.fillStyle=this.colourBlue,this.roundRect(this.ctx,0,0,this.width,this.height,20,!0,!1);for(var t=this.cellWidth/2,i=this.cellHeight/2,e=0;e<this.columns;e++){for(var l=0;l<this.rows;l++)0==this.cellOwners[e][l]?this.ctx.fillStyle=this.colourRed:1==this.cellOwners[e][l]?this.ctx.fillStyle=this.colourYellow:this.ctx.fillStyle=this.colourBlank,this.ctx.beginPath(),this.ctx.arc(t,i,this.radius,0,2*Math.PI),this.ctx.fill(),i+=this.cellHeight;i=this.cellHeight/2,t+=this.cellWidth}}},{key:"roundRect",value:function(t,i,e,l,s,h,r,o){if(void 0===o&&(o=!0),void 0===h&&(h=5),"number"==typeof h)h={tl:h,tr:h,br:h,bl:h};else{var c={tl:0,tr:0,br:0,bl:0};for(var n in c)h[n]=h[n]||c[n]}t.beginPath(),t.moveTo(i+h.tl,e),t.lineTo(i+l-h.tr,e),t.quadraticCurveTo(i+l,e,i+l,e+h.tr),t.lineTo(i+l,e+s-h.br),t.quadraticCurveTo(i+l,e+s,i+l-h.br,e+s),t.lineTo(i+h.bl,e+s),t.quadraticCurveTo(i,e+s,i,e+s-h.bl),t.lineTo(i,e+h.tl),t.quadraticCurveTo(i,e,i+h.tl,e),t.closePath(),r&&t.fill(),o&&t.stroke()}}]),i}();exports.ConnectFour=l;
},{}],"d6sW":[function(require,module,exports) {
"use strict";require("../css/style.scss");var e=require("./ConnectFour.js");console.log("Kia Ora");var r=new e.ConnectFour("connect-four");
},{"../css/style.scss":"nCJ9","./ConnectFour.js":"X5h2"}]},{},["d6sW"], null)
//# sourceMappingURL=/main.a6d3c390.js.map