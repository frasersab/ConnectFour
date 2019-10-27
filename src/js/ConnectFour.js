export class ConnectFour {
    constructor(selector) {
        // Game variables
        this.gameOver = 0;
        this.playerTurn = 0;                                    // player 0 is red, player 1 is yellow
        this.cellOwners = [];

        // Colours
        this.colourRed = 'rgb(240, 41, 41)';
        this.colourYellow = 'rgb(240, 232, 10)';
        this.colourBlue = 'rgb(44, 173, 242)';
        this.colourBlank = 'rgb(255, 255, 255)';

        // Drawing variables
        this.rows = 6;
        this.columns = 7;
        this.connect = 4;
        this.selector = selector;
        this.canvas = document.getElementById(selector);
        this.width = this.canvas.scrollWidth;
        this.height = this.canvas.scrollHeight;
        this.canvas.width = this.width;                         // set canvas width to the same as the canvas element
        this.canvas.height = this.height;                       // set canvas height to the same as the canvas element

        this.cellWidth = this.width / this.columns;
        this.cellHeight = this.height / this.rows;
        this.radius = this.cellWidth / 2.6;                     // sets a radius that scales with the size of the canvas element
        this.radiusSemi = this.radius - 8;
        this.ctx = this.canvas.getContext('2d');

        this.initialise();

        // Event listeners
        this.canvas.addEventListener('click', this.click.bind(this));
        this.canvas.addEventListener('mousemove', this.mouseMove.bind(this));
    }

    initialise() {
        // Set all cell owners to null
        let rowsArray = [];
        for (let i = 0; i < this.columns; i++) {
            for (let j = 0; j < this.rows; j++) {
                rowsArray.push(null);
            }
            this.cellOwners.push(rowsArray);
            rowsArray = [];
        }

        // Draw grid
        this.drawGrid();
    }

    click(event) {

        // Find the next available cell in the column
        let cell = this.getCell(event.offsetX, event.offsetY);

        // if the cell is full don't do anything
        if (cell[1] == -1) {
            return;
        } else {
            // add cell to player owner
            this.cellOwners[cell[0]][cell[1]] = this.playerTurn;
            console.log(this.cellOwners);

            // else draw a new grid with a full circle for the available cell in the column
            this.drawGrid();


            // toggle player turn
            this.playerTurn ^= 1;



        }
    }

    mouseMove(event) {
        // Find the next available cell in the column
        let cell = this.getCell(event.offsetX, event.offsetY);

        // If the cell is full don't draw anything
        if (cell[1] == -1) {
            return;
        }
        // Else draw a new grid with a semi circle for the available cell in the column
        else {
            this.drawGrid();
            this.drawCell(cell, true);
        }
    }

    drawCell(cell, semiCircle = false) {
        let centerX = (cell[0] * this.cellWidth) + (this.cellWidth / 2);
        let centerY = (cell[1] * this.cellHeight) + (this.cellHeight / 2);

        // Get player colour
        if (this.playerTurn == 0) {
            // Red player
            this.ctx.fillStyle = this.colourRed;
        } else {
            // Yellow player
            this.ctx.fillStyle = this.colourYellow;
        }

        // Draw player colour circle
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, this.radius, 0, 2 * Math.PI);
        this.ctx.fill();

        if (semiCircle) {
            this.ctx.fillStyle = this.colourBlank;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, this.radiusSemi, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }

    checkCell(x, y) {
        return [Math.trunc(x / this.cellWidth), Math.trunc(y / this.cellHeight)];
    }

    getCell(x, y) {
        let cell = this.checkCell(x, y);
        for (let i = 0; i < this.rows; i++) {
            if (this.cellOwners[cell[0]][i] !== null) {
                return [cell[0], i - 1];
            }
        }
        return [cell[0], this.rows - 1];
    }


    drawGrid() {
        // Create rounded rectange
        this.ctx.fillStyle = this.colourBlue;
        this.roundRect(this.ctx, 0, 0, this.width, this.height, 20, true, false)

        // Create grid of holes
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

                y = y + this.cellHeight;             // increments the x center position for the next hole in the row
            }
            y = this.cellHeight / 2;                 // resets the x center position for the next column of holes
            x = x + this.cellWidth;                // increments the y center position for the next hole in the column
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