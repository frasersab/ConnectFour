export class ConnectFour {
    constructor(selector) {
        // Game variables
        this.gameOver = false;
        this.playerTurn = 0;                // player 0 is red, player 1 is yellow
        this.cellOwners = [];               // 2d array. Columns then rows
        this.lastMove = 0;                  // user to keep track of refresh rate
        this.updateTime = 100;              // How often mouseMovement can update in ms

        // Colours
        this.colourRed = 'rgb(240, 41, 41)';
        this.colourYellow = 'rgb(240, 232, 10)';
        this.colourBlue = 'rgb(44, 173, 242)';
        this.colourBlank = 'rgb(255, 255, 255)';

        // Drawing variables
        this.rows = 6;
        this.columns = 7;
        this.aspectRatio = this.columns / this.rows;
        this.connect = 4;                                       // number of pucks needed to algin to win

        this.canvas = document.getElementById(selector);        // the canvas element
        this.ctx = this.canvas.getContext('2d');                // the canvas context

        this.width = this.canvas.scrollWidth;                   // setting the canvas elements width to a variable
        this.height = this.canvas.scrollHeight;                 // setting the canvas elements height to a variable
        this.canvas.width = this.width;                         // set canvas width to the same as the canvas element
        this.canvas.height = this.height;                       // set canvas height to the same as the canvas element

        this.cellWidth = this.width / this.columns;
        this.cellHeight = this.height / this.rows;
        this.radius = this.cellWidth / 2.6;                     // sets raius for full circle that scales with canvas
        this.radiusSemi = this.cellWidth / 3.6;                 // sets radius for circle outline that scales with canvas

        this.initialise();

        // Event listeners
        this.canvas.addEventListener('click', this.click.bind(this));
        this.canvas.addEventListener('mousemove', this.mouseMove.bind(this));
        window.addEventListener('resize', this.resizeGame.bind(this), false);
        window.addEventListener('orientationchange', this.resizeGame.bind(this), false);
    }

    resizeGame() {
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;
        let windowAspectRatio = windowWidth / windowHeight;

        if (windowAspectRatio > this.aspectRatio) {
            this.canvas.height = windowHeight;
            this.canvas.width = this.aspectRatio * windowHeight;

        } else {
            this.canvas.width = windowWidth;
            this.canvas.height = windowWidth / this.aspectRatio;
        }

        // reset all drawing variables
        this.width = this.canvas.scrollWidth;
        this.height = this.canvas.scrollHeight;
        this.canvas.width = this.width;                         // set canvas width to the same as the canvas element
        this.canvas.height = this.height;                       // set canvas height to the same as the canvas element

        this.cellWidth = this.width / this.columns;
        this.cellHeight = this.height / this.rows;
        this.radius = this.cellWidth / 2.6;                     // sets raius for full circle that scales with canvas
        this.radiusSemi = this.cellWidth / 3.6;                 // sets radius for circle outline that scales with canvas

        //
        this.drawGrid();
    }

    initialise() {
        // set all cell owners to null
        let rowsArray = [];
        for (let i = 0; i < this.columns; i++) {
            for (let j = 0; j < this.rows; j++) {
                rowsArray.push(null);
            }
            this.cellOwners.push(rowsArray);
            rowsArray = [];
        }

        // size the game
        this.resizeGame();

    }

    click(event) {
        // find the next available cell in the column

        let cell = this.getCell(event.offsetX, event.offsetY);
        // if the cell is full don't do anything
        if (cell[1] == -1) {
            return;
        } else {
            // add cell to player owner
            this.cellOwners[cell[0]][cell[1]] = this.playerTurn;

            // else draw a new grid with a full circle for the available cell in the column
            this.drawGrid();

            // toggle player turn
            this.playerTurn ^= 1;

            // add new circle preview to new available
            cell = this.getCell(event.offsetX, event.offsetY);
            this.drawCell(cell, true);
        }
    }

    mouseMove(event) {
        // limit mouseMove updates to 
        if (Date.now() - this.lastMove > this.updateTime) {
            // find the next available cell in the column
            let cell = this.getCell(event.offsetX, event.offsetY);

            // if the cell is full don't draw grid without filling cell
            if (cell[1] == -1) {
                this.drawGrid();
            }
            // Else draw a new grid with a semi circle for the available cell in the column
            else {
                this.drawGrid();
                this.drawCell(cell, true);
            }

            // reset last move
            this.lastMove = Date.now();
        }
    }

    drawCell(cell, semiCircle = false) {
        let centerX = (cell[0] * this.cellWidth) + (this.cellWidth / 2);
        let centerY = (cell[1] * this.cellHeight) + (this.cellHeight / 2);

        // get player colour
        if (this.playerTurn == 0) {
            // red player
            this.ctx.fillStyle = this.colourRed;
        } else {
            // yellow player
            this.ctx.fillStyle = this.colourYellow;
        }

        // draw player colour circle
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, this.radius, 0, 2 * Math.PI);
        this.ctx.fill();

        // if preview circle then blank out center of full circle
        if (semiCircle) {
            this.ctx.fillStyle = this.colourBlank;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, this.radiusSemi, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }

    // find cell number from x,y position
    checkCell(x, y) {
        if (x == this.width) x--;       // handling edge case
        if (y == this.height) y--;      // handling edge case
        return [Math.trunc(x / this.cellWidth), Math.trunc(y / this.cellHeight)];
    }

    getCell(x, y) {
        // get cell from mouse click
        let cell = this.checkCell(x, y);

        // find out which row is the bottom in the column and return that cell
        for (let i = 0; i < this.rows; i++) {
            if (this.cellOwners[cell[0]][i] !== null) {
                return [cell[0], i - 1];
            }
        }
        return [cell[0], this.rows - 1];
    }

    drawGrid() {
        // create rounded rectange
        this.ctx.fillStyle = this.colourBlue;
        this.roundRect(this.ctx, 0, 0, this.width, this.height, this.radius, true, false)

        // create grid of holes
        let x = this.cellWidth / 2;                 // sets the initial x center position of the first hole
        let y = this.cellHeight / 2;                // sets the initial y center position of the first hole
        for (let i = 0; i < this.columns; i++) {
            for (let j = 0; j < this.rows; j++) {
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

                y = y + this.cellHeight;                // increments the x center position for the next hole in the row
            }
            y = this.cellHeight / 2;                    // resets the x center position for the next column of holes
            x = x + this.cellWidth;                     // increments the y center position for the next hole in the column
        }
    }



    roundRect(ctx, x, y, width, height, radius, fill, stroke) {
        if (typeof stroke === 'undefined') {
            stroke = true;
        }
        if (typeof radius === 'undefined') {
            radius = 5;
        }
        if (typeof radius === 'number') {
            radius = { tl: radius, tr: radius, br: radius, bl: radius };
        } else {
            var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
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

}