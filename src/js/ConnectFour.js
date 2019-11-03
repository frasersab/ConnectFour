export class ConnectFour {
	constructor(selector) {
		// Game variables
		this.gameOver = false;				// used to keep track if game is finished or not
		this.gameTie = false;				// used to keep track of a tie
		this.playerTurn = 0;                // player 0 is red, player 1 is yellow
		this.cellOwners = [];               // 2d array of who owns which cell. Columns then rows
		this.lastMouseMove = 0;				// timer used to keep track of refresh rate
		this.updateTime = 60;               // how often mouseMovement can update in ms

		// Colours
		this.colourRed = 'rgb(240, 41, 41)';
		this.colourRedDark = 'rgb(220, 21, 21)';
		this.colourYellow = 'rgb(240, 232, 10)';
		this.colourYellowDark = 'rgb(220, 212, 0)';
		this.colourTie = 'rgb(240, 240, 240)';
		this.colourTieDark = 'rgb(220, 220, 220)';
		this.colourBlue = 'rgb(44, 173, 242)';
		this.colourBlank = 'rgb(255, 255, 255)';

		// Win text
		this.redWinText = 'Red Wins!';
		this.yellowWinText = 'Yellow Wins!';
		this.tieText = 'Tie!';
		this.textFont = 'dejavu sans mono';

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
		this.gameTie = false;

		// draw the game
		this.resizeGame();
	}

	click(event) {
		// check if the game is over
		if (this.gameOver == true) {
			// if game is over, reset the game
			this.initialise();
		} else {
			// find the next available cell in the column
			let cell = this.getCell(event.offsetX, event.offsetY);

			// check if the column is full
			if (cell[1] == -1) {
				// if column is full don't do anything
				return;
			} else {
				// add cell to player owner
				this.cellOwners[cell[0]][cell[1]] = this.playerTurn;

				// draw a new grid with new player owned puck
				this.drawGrid();

				// check for win
				switch (this.checkWin(cell[0], cell[1])) {
					case true:
						// winner
						this.gameOver = true;
						this.winText();
						break;

					case 'tie':
						// tie
						this.gameOver = true;
						this.winText();
						break;

					default:
						// toggle player turn
						this.playerTurn ^= 1;
				}
			}
		}
	}

	mouseMove(event) {
		// limit mouseMove updates to 'updateTime' and only if the game is still in play
		if ((Date.now() - this.lastMouseMove > this.updateTime) && !this.gameOver) {
			// find the next available cell in the column
			let cell = this.getCell(event.offsetX, event.offsetY);

			// check if the column is full
			if (cell[1] == -1) {
				// if column is full redraw grid to remove other cell highlight
				this.drawGrid();
			} else {
				// redraw grid and then add highlighted cell
				this.drawGrid();
				this.drawCellOutline(cell);
			}

			// reset last mouse move
			this.lastMouseMove = Date.now();
		}
	}

	mouseOut() {
		// check if game is still in play
		if (!this.gameOver) {
			// redraw grid to remove highlighted cell if mouse moves out of canvas
			this.drawGrid();
		}
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

		// if the game is over redraw the winner text
		if (this.gameOver) {
			this.winText();
		}
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

	checkWin(column, row) {
		// create arrays for all possible win direction of the cell
		let horizonal = [], vertical = [], diagonalLeft = [], diagonalRight = [];
		let tie = true;
		// populate with values arrays
		for (let i = 0; i < this.columns; i++) {
			for (let j = 0; j < this.rows; j++) {
				// horizontal
				if (j == row) {
					horizonal.push(this.cellOwners[i][j]);
				}
				// vertical
				if (i == column) {
					vertical.push(this.cellOwners[i][j]);
				}
				// diagonalRight (bottom left to top right)
				if (i + j == column + row) {
					diagonalRight.push(this.cellOwners[i][j]);
				}
				// diagonalLeft (top left to bottom right)
				if (i - j == column - row) {
					diagonalLeft.push(this.cellOwners[i][j]);
				}
				// check for tie
				if (this.cellOwners[i][j] == null) {
					tie = false;
				}
			}
		}
		if (tie) {
			this.gameTie = true;
			return 'tie';
		} else {
			return this.checkArray(horizonal) || this.checkArray(vertical) || this.checkArray(diagonalRight) || this.checkArray(diagonalLeft)
		}
	}

	checkArray(array) {
		let redCounter = 0;
		let yellowCounter = 0;
		for (let i = 0; i < array.length; i++) {
			switch (array[i]) {
				case 0:
					// red
					redCounter++;
					if (redCounter >= this.connect) return true;
					yellowCounter = 0;
					break;
				case 1:
					// yellow
					yellowCounter++;
					if (yellowCounter >= this.connect) return true;
					redCounter = 0;
					break;
				default:
					redCounter = 0;
					yellowCounter = 0;
					break;
			}
		}
		return false;
	}

	winText() {
		// set up text parameters
		let size = this.cellHeight;
		this.ctx.fillStyle = this.gameTie ? this.colourTie : this.playerTurn ? this.colourYellow : this.colourRed;
		this.ctx.font = size + 'px ' + this.textFont;
		this.ctx.lineJoin = 'round';
		this.ctx.lineWidth = size / 10;
		this.ctx.strokeStyle = this.gameTie ? this.colourTieDark : this.playerTurn ? this.colourYellowDark : this.colourRedDark;
		this.ctx.textAlign = 'center';
		this.ctx.textBaseline = 'middle';

		// draw the text
		let offset = size * 0.55;
		let text = this.gameTie ? this.tieText : this.playerTurn ? this.yellowWinText : this.redWinText;

		this.ctx.strokeText(text, this.width / 2, this.height / 2);
		this.ctx.fillText(text, this.width / 2, this.height / 2);
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