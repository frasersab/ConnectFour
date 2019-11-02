export class ConnectFour {
	constructor(selector) {
		// Game variables
		this.gameOver = false;
		this.playerTurn = 0;                // player 0 is red, player 1 is yellow
		this.cellOwners = [];               // 2d array of who owns which cell. Columns then rows
		this.lastMouseMove = 0;				// timer used to keep track of refresh rate
		this.updateTime = 60;               // how often mouseMovement can update in ms

		// Colours
		this.colourRed = 'rgb(240, 41, 41)';
		this.colourYellow = 'rgb(240, 232, 10)';
		this.colourBlue = 'rgb(44, 173, 242)';
		this.colourBlank = 'rgb(255, 255, 255)';

		// Hover support query
		this.media = window.matchMedia('(hover: hover)');

		// Drawing variables
		this.rows = 6;
		this.columns = 7;
		this.aspectRatio = this.columns / this.rows;
		this.connect = 4;                                       // number of pucks needed to algin to win

		this.canvas = document.getElementById(selector);        // the canvas element
		this.ctx = this.canvas.getContext('2d');                // the canvas context

		this.width = this.canvas.scrollWidth;                   // setting the canvas elements width to a variable
		this.height = this.canvas.scrollHeight;                 // setting the canvas elements height to a variable
		this.canvas.width = this.width;                         // set internal canvas width to the same as the canvas element
		this.canvas.height = this.height;                       // set internal canvas height to the same as the canvas element

		this.cellWidth = this.width / this.columns;
		this.cellHeight = this.height / this.rows;
		this.radius = this.cellWidth / 2.6;                     // sets raius for full circle that scales with canvas
		this.radiusOutline = this.cellWidth / 3.6;				// sets radius for circle outline that scales with canvas

		this.initialise();		// runs everything needed for startup

		// Event listeners
		this.canvas.addEventListener('click', this.click.bind(this));
		// only add hover affect if device has support
		if (this.media.matches) {
			this.canvas.addEventListener('mousemove', this.mouseMove.bind(this));
			this.canvas.addEventListener('mouseout', this.mouseOut.bind(this), false);
		}
		this.media.addListener(this.mediaChange.bind(this));
		window.addEventListener('resize', this.resizeGame.bind(this), false);
		window.addEventListener('orientationchange', this.resizeGame.bind(this), false);
	}

	initialise() {
		// set all cell owners to null
		this.cellOwners = []
		let rowsArray = [];
		for (let i = 0; i < this.columns; i++) {
			for (let j = 0; j < this.rows; j++) {
				rowsArray.push(null);
			}
			this.cellOwners.push(rowsArray);
			rowsArray = [];
		}

		// reset game controls
		this.gameOver = false;
		this.playerTurn = 0;

		// draw the game
		this.resizeGame();
	}

	// handles 
	click(event) {
		// is game over?
		if (this.gameOver == true) {
			// reset the game
			this.initialise();

		} else {

			// find the next available cell in the column
			let cell = this.getCell(event.offsetX, event.offsetY);

			// check if the column is full
			if (cell[1] == -1) {
				// if column is full don't do anything
				return;
			}
			else {
				// add cell to player owner
				this.cellOwners[cell[0]][cell[1]] = this.playerTurn;

				// draw a new grid with a full circle for the available cell in the column
				this.drawGrid();

				// check for win
				let winner = this.checkWin();

				if (winner == 0) {
					// red wins
					this.gameOver = true;
					console.log('Red Wins!');

				} else if (winner == 1) {
					// yellow wins
					this.gameOver = true;
					console.log('Yellow Wins!');

				} else {
					// toggle player turn
					this.playerTurn ^= 1;
				}
			}
		}
	}

	mouseMove(event) {
		// limit mouseMove updates to 'updateTime'
		if (Date.now() - this.lastMouseMove > this.updateTime) {
			// find the next available cell in the column
			let cell = this.getCell(event.offsetX, event.offsetY);

			// check if the column is full
			if (cell[1] == -1) {
				// if column is full redraw grid
				this.drawGrid();
			} else {
				// redraw grid and then add highlighted celll
				this.drawGrid();
				this.drawCellOutline(cell);
			}

			// reset last mouse move
			this.lastMouseMove = Date.now();
		}
	}

	mouseOut() {
		// redraw grid to remove highlighted cell if mouse moves out of canvas
		this.drawGrid();
	}

	resizeGame() {
		let windowWidth = window.innerWidth;
		let windowHeight = window.innerHeight;
		let windowAspectRatio = windowWidth / windowHeight;

		// check if the device is in portrain or landscape
		if (windowAspectRatio > this.aspectRatio) {
			// portrait
			this.canvas.height = windowHeight;
			this.canvas.width = this.aspectRatio * windowHeight;

		} else {
			// landscape
			this.canvas.width = windowWidth;
			this.canvas.height = windowWidth / this.aspectRatio;
		}

		// reset all drawing variables
		this.width = this.canvas.scrollWidth;
		this.height = this.canvas.scrollHeight;
		this.canvas.width = this.width;
		this.canvas.height = this.height;

		this.cellWidth = this.width / this.columns;
		this.cellHeight = this.height / this.rows;
		this.radius = this.cellWidth / 2.6;
		this.radiusOutline = this.cellWidth / 3.6;

		// redraw canvas
		this.drawGrid();
	}

	mediaChange() {
		if (this.media.matches) {
			// if hover is supported on device add hover functionality
			this.canvas.addEventListener('mousemove', this.mouseMove.bind(this));
			this.canvas.addEventListener("mouseout", this.mouseOut.bind(this));
		} else {
			// if hover is not supported on device remove hover functionality
			this.canvas.removeEventListener('mousemove', this.mouseMove.bind(this));
			this.canvas.addEventListener("mouseout", this.mouseOut.bind(this));
		}
	}

	drawGrid() {
		// create blue rounded rectange
		this.ctx.fillStyle = this.colourBlue;
		this.roundRect(this.ctx, 0, 0, this.width, this.height, this.radius, true, false)

		// create grid of holes
		let x = this.cellWidth / 2;                 // sets the initial x center position of the first hole
		let y = this.cellHeight / 2;                // sets the initial y center position of the first hole
		for (let i = 0; i < this.columns; i++) {
			for (let j = 0; j < this.rows; j++) {
				// check who owns the cell
				if (this.cellOwners[i][j] == 0) {
					// if player 0 owns the cell make it red
					this.ctx.fillStyle = this.colourRed;
				} else if (this.cellOwners[i][j] == 1) {
					// if player 1 owns the cell make it yellow
					this.ctx.fillStyle = this.colourYellow;
				} else {
					// if noone owns the cell make it white
					this.ctx.fillStyle = this.colourBlank;
				}

				// draw the circle
				this.ctx.beginPath();
				this.ctx.arc(x, y, this.radius, 0, 2 * Math.PI);
				this.ctx.fill();

				// increment the y position by a cell
				y = y + this.cellHeight;
			}
			// reset y position
			y = this.cellHeight / 2;

			// increment the x position by a cell
			x = x + this.cellWidth;
		}
	}

	drawCellOutline(cell) {
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

		// fill the center with white to make outline
		this.ctx.fillStyle = this.colourBlank;
		this.ctx.beginPath();
		this.ctx.arc(centerX, centerY, this.radiusOutline, 0, 2 * Math.PI);
		this.ctx.fill();
	}

	checkCell(x, y) {
		if (x == this.width) x--;       // handling edge case for when x = width
		if (y == this.height) y--;      // handling edge case for when y = height
		return [Math.trunc(x / this.cellWidth), Math.trunc(y / this.cellHeight)];
	}

	getCell(x, y) {
		// get cell from mouse click
		let cell = this.checkCell(x, y);

		// find out which row is the bottom in the column and return that cell, -1 if full
		for (let i = 0; i < this.rows; i++) {
			if (this.cellOwners[cell[0]][i] !== null) {
				return [cell[0], i - 1];
			}
		}
		return [cell[0], this.rows - 1];
	}

	checkWin() {
		// only works for 4 connect

		// run through each cell
		for (let i = 0; i < this.columns; i++) {
			for (let j = 0; j < this.rows; j++) {
				// horizontal check
				if ((i - this.connect) <= 0) {
					// if there is enough cells to check horizontally then check
					if ((this.cellOwners[i][j] == 0) && (this.cellOwners[i + 1][j] == 0) && (this.cellOwners[i + 2][j] == 0) && (this.cellOwners[i + 3][j] == 0)) {
						return 0;
					}
					if ((this.cellOwners[i][j] == 1) && (this.cellOwners[i + 1][j] == 1) && (this.cellOwners[i + 2][j] == 1) && (this.cellOwners[i + 3][j] == 1)) {
						return 1;
					}
				}
				// vertical
				if ((j - this.connect) <= 0) {
					// if there is enough cells to check vertically then check
					if ((this.cellOwners[i][j] == 0) && (this.cellOwners[i][j + 1] == 0) && (this.cellOwners[i][j + 2] == 0) && (this.cellOwners[i][j + 3] == 0)) {
						return 0;
					}
					if ((this.cellOwners[i][j] == 1) && (this.cellOwners[i][j + 1] == 1) && (this.cellOwners[i][j + 2] == 1) && (this.cellOwners[i][j + 3] == 1)) {
						return 1;
					}
				}
				// diagonal, right/down
				if (((i - this.connect) <= 0) && ((j - this.connect) <= 0)) {
					// if there is enough cells to check diagonaly then check
					if ((this.cellOwners[i][j] == 0) && (this.cellOwners[i + 1][j + 1] == 0) && (this.cellOwners[i + 2][j + 2] == 0) && (this.cellOwners[i + 3][j + 3] == 0)) {
						return 0;
					}
					if ((this.cellOwners[i][j] == 1) && (this.cellOwners[i + 1][j + 1] == 1) && (this.cellOwners[i + 2][j + 2] == 1) && (this.cellOwners[i + 3][j + 3] == 1)) {
						return 1;
					}
				}
				// diagonal, right/up
				if (((i - this.connect) <= 0) && ((j - this.connect) <= 0)) {
					// if there is enough cells to check diagonaly then check
					if ((this.cellOwners[i][j] == 0) && (this.cellOwners[i + 1][j - 1] == 0) && (this.cellOwners[i + 2][j - 2] == 0) && (this.cellOwners[i + 3][j - 3] == 0)) {
						return 0;
					}
					if ((this.cellOwners[i][j] == 1) && (this.cellOwners[i + 1][j - 1] == 1) && (this.cellOwners[i + 2][j - 2] == 1) && (this.cellOwners[i + 3][j - 3] == 1)) {
						return 1;
					}
				}
			}
		}
		return null;
	}

	roundRect(ctx, x, y, width, height, radius = 5, fill, stroke = true) {
		ctx.beginPath();
		ctx.moveTo(x + radius, y);
		ctx.lineTo(x + width - radius, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
		ctx.lineTo(x + width, y + height - radius);
		ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
		ctx.lineTo(x + radius, y + height);
		ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
		ctx.lineTo(x, y + radius);
		ctx.quadraticCurveTo(x, y, x + radius, y);
		ctx.closePath();
		if (fill) {
			ctx.fill();
		}
		if (stroke) {
			ctx.stroke();
		}
	}
}