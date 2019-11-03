parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"nCJ9":[function(require,module,exports) {

},{}],"X5h2":[function(require,module,exports) {
"use strict";function t(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}function i(t,i){for(var e=0;e<i.length;e++){var s=i[e];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}function e(t,e,s){return e&&i(t.prototype,e),s&&i(t,s),t}Object.defineProperty(exports,"__esModule",{value:!0}),exports.ConnectFour=void 0;var s=function(){function i(e){t(this,i),this.gameOver=!1,this.gameTie=!1,this.playerTurn=0,this.cellOwners=[],this.lastMouseMove=0,this.updateTime=60,this.colourRed="rgb(240, 41, 41)",this.colourRedDark="rgb(220, 21, 21)",this.colourYellow="rgb(240, 232, 10)",this.colourYellowDark="rgb(220, 212, 0)",this.colourTie="rgb(240, 240, 240)",this.colourTieDark="rgb(220, 220, 220)",this.colourBlue="rgb(44, 173, 242)",this.colourBlank="rgb(255, 255, 255)",this.redWinText="Red Wins!",this.yellowWinText="Yellow Wins!",this.tieText="Tie!",this.textFont="dejavu sans mono",this.media=window.matchMedia("(hover: hover)"),this.rows=6,this.columns=7,this.aspectRatio=this.columns/this.rows,this.connect=4,this.canvas=document.getElementById(e),this.ctx=this.canvas.getContext("2d"),this.width=this.canvas.scrollWidth,this.height=this.canvas.scrollHeight,this.canvas.width=this.width,this.canvas.height=this.height,this.cellWidth=this.width/this.columns,this.cellHeight=this.height/this.rows,this.radius=this.cellWidth/2.6,this.radiusOutline=this.cellWidth/3.6,this.initialise(),this.canvas.addEventListener("click",this.click.bind(this)),this.media.matches&&(this.canvas.addEventListener("mousemove",this.mouseMove.bind(this)),this.canvas.addEventListener("mouseout",this.mouseOut.bind(this),!1)),this.media.addListener(this.mediaChange.bind(this)),window.addEventListener("resize",this.resizeGame.bind(this),!1),window.addEventListener("orientationchange",this.resizeGame.bind(this),!1)}return e(i,[{key:"initialise",value:function(){this.cellOwners=[];for(var t=[],i=0;i<this.columns;i++){for(var e=0;e<this.rows;e++)t.push(null);this.cellOwners.push(t),t=[]}this.gameOver=!1,this.playerTurn=0,this.gameTie=!1,this.resizeGame()}},{key:"click",value:function(t){if(1==this.gameOver)this.initialise();else{var i=this.getCell(t.offsetX,t.offsetY);if(-1==i[1])return;switch(this.cellOwners[i[0]][i[1]]=this.playerTurn,this.drawGrid(),this.checkWin(i[0],i[1])){case!0:case"tie":this.gameOver=!0,this.winText();break;default:this.playerTurn^=1}}}},{key:"mouseMove",value:function(t){if(Date.now()-this.lastMouseMove>this.updateTime&&!this.gameOver){var i=this.getCell(t.offsetX,t.offsetY);-1==i[1]?this.drawGrid():(this.drawGrid(),this.drawCellOutline(i)),this.lastMouseMove=Date.now()}}},{key:"mouseOut",value:function(){this.gameOver||this.drawGrid()}},{key:"resizeGame",value:function(){var t=window.innerWidth,i=window.innerHeight;t/i>this.aspectRatio?(this.canvas.height=i,this.canvas.width=this.aspectRatio*i):(this.canvas.width=t,this.canvas.height=t/this.aspectRatio),this.width=this.canvas.scrollWidth,this.height=this.canvas.scrollHeight,this.canvas.width=this.width,this.canvas.height=this.height,this.cellWidth=this.width/this.columns,this.cellHeight=this.height/this.rows,this.radius=this.cellWidth/2.6,this.radiusOutline=this.cellWidth/3.6,this.drawGrid(),this.gameOver&&this.winText()}},{key:"mediaChange",value:function(){this.media.matches?(this.canvas.addEventListener("mousemove",this.mouseMove.bind(this)),this.canvas.addEventListener("mouseout",this.mouseOut.bind(this))):(this.canvas.removeEventListener("mousemove",this.mouseMove.bind(this)),this.canvas.addEventListener("mouseout",this.mouseOut.bind(this)))}},{key:"drawGrid",value:function(){this.ctx.fillStyle=this.colourBlue,this.roundRect(this.ctx,0,0,this.width,this.height,this.radius,!0,!1);for(var t=this.cellWidth/2,i=this.cellHeight/2,e=0;e<this.columns;e++){for(var s=0;s<this.rows;s++)0==this.cellOwners[e][s]?this.ctx.fillStyle=this.colourRed:1==this.cellOwners[e][s]?this.ctx.fillStyle=this.colourYellow:this.ctx.fillStyle=this.colourBlank,this.ctx.beginPath(),this.ctx.arc(t,i,this.radius,0,2*Math.PI),this.ctx.fill(),i+=this.cellHeight;i=this.cellHeight/2,t+=this.cellWidth}}},{key:"drawCellOutline",value:function(t){var i=t[0]*this.cellWidth+this.cellWidth/2,e=t[1]*this.cellHeight+this.cellHeight/2;0==this.playerTurn?this.ctx.fillStyle=this.colourRed:this.ctx.fillStyle=this.colourYellow,this.ctx.beginPath(),this.ctx.arc(i,e,this.radius,0,2*Math.PI),this.ctx.fill(),this.ctx.fillStyle=this.colourBlank,this.ctx.beginPath(),this.ctx.arc(i,e,this.radiusOutline,0,2*Math.PI),this.ctx.fill()}},{key:"checkCell",value:function(t,i){return t==this.width&&t--,i==this.height&&i--,[Math.trunc(t/this.cellWidth),Math.trunc(i/this.cellHeight)]}},{key:"getCell",value:function(t,i){for(var e=this.checkCell(t,i),s=0;s<this.rows;s++)if(null!==this.cellOwners[e[0]][s])return[e[0],s-1];return[e[0],this.rows-1]}},{key:"checkWin",value:function(t,i){for(var e=[],s=[],h=[],l=[],r=!0,n=0;n<this.columns;n++)for(var a=0;a<this.rows;a++)a==i&&e.push(this.cellOwners[n][a]),n==t&&s.push(this.cellOwners[n][a]),n+a==t+i&&l.push(this.cellOwners[n][a]),n-a==t-i&&h.push(this.cellOwners[n][a]),null==this.cellOwners[n][a]&&(r=!1);return r?(this.gameTie=!0,"tie"):this.checkArray(e)||this.checkArray(s)||this.checkArray(l)||this.checkArray(h)}},{key:"checkArray",value:function(t){for(var i=0,e=0,s=0;s<t.length;s++)switch(t[s]){case 0:if(++i>=this.connect)return!0;e=0;break;case 1:if(++e>=this.connect)return!0;i=0;break;default:i=0,e=0}return!1}},{key:"winText",value:function(){var t=this.cellHeight;this.ctx.fillStyle=this.gameTie?this.colourTie:this.playerTurn?this.colourYellow:this.colourRed,this.ctx.font=t+"px "+this.textFont,this.ctx.lineJoin="round",this.ctx.lineWidth=t/10,this.ctx.strokeStyle=this.gameTie?this.colourTieDark:this.playerTurn?this.colourYellowDark:this.colourRedDark,this.ctx.textAlign="center",this.ctx.textBaseline="middle";var i=this.gameTie?this.tieText:this.playerTurn?this.yellowWinText:this.redWinText;this.ctx.strokeText(i,this.width/2,this.height/2),this.ctx.fillText(i,this.width/2,this.height/2)}},{key:"roundRect",value:function(t,i,e,s,h){var l=arguments.length>5&&void 0!==arguments[5]?arguments[5]:5,r=arguments.length>6?arguments[6]:void 0,n=!(arguments.length>7&&void 0!==arguments[7])||arguments[7];t.beginPath(),t.moveTo(i+l,e),t.lineTo(i+s-l,e),t.quadraticCurveTo(i+s,e,i+s,e+l),t.lineTo(i+s,e+h-l),t.quadraticCurveTo(i+s,e+h,i+s-l,e+h),t.lineTo(i+l,e+h),t.quadraticCurveTo(i,e+h,i,e+h-l),t.lineTo(i,e+l),t.quadraticCurveTo(i,e,i+l,e),t.closePath(),r&&t.fill(),n&&t.stroke()}}]),i}();exports.ConnectFour=s;
},{}],"d6sW":[function(require,module,exports) {
"use strict";require("../css/style.scss");var e=require("./ConnectFour.js");console.log("Kia Ora");var r=new e.ConnectFour("connect-four");
},{"../css/style.scss":"nCJ9","./ConnectFour.js":"X5h2"}]},{},["d6sW"], null)
//# sourceMappingURL=/ConnectFour/main.1c0ff109.js.map