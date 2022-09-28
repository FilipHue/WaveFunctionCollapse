class Grid {
	constructor() {
		this.canvas = [];
	}

	initializeGrid(DIM) {
		for (let i = 0; i < DIM * DIM; i++) {
			let cell = new Cell(
				false,
				new Array(numberOfTiles).fill(0).map((x, i) => i)
			);
			this.canvas[i] = cell;
		}
	}

	createRules(tiles) {
		for (let tile of tiles) {
			tile.generateRulesOfConnection(tiles);
		}
	}

	sortDensity() {
		let gridCopy = this.canvas.slice();
		gridCopy = gridCopy.filter((a) => {
			return !a.collapsed;
		});

		if (gridCopy.length == 0) {
			return -1;
		}

		gridCopy.sort((a, b) => {
			return a.possibleTiles.length - b.possibleTiles.length;
		});

		let minDen = gridCopy[0].possibleTiles.length;
		let minimumDensity = gridCopy.filter((a) => {
			return a.possibleTiles.length <= minDen;
		});

		return minimumDensity;
	}

	deleteDuplicates(tiles) {
		const uniqueTilesMap = {};
		for (const tile of tiles) {
			const key = tile.connections.join(",");
			uniqueTilesMap[key] = tile;
		}
		return Object.values(uniqueTilesMap);
	}

	pickRandomTile(tiles) {
		let cell = random(tiles);
		let pickedTile = random(cell.possibleTiles);
		if (pickedTile == undefined) {
			this.initializeGrid(DIM);
			return;
		}
		cell.collapsed = true;
		cell.possibleTiles = [pickedTile];
	}

	setNextTiles() {
		let nextGrid = [];

		for (let i = 0; i < DIM; i++) {
			for (let j = 0; j < DIM; j++) {
				let cell = this.canvas[j + i * DIM];
				if (cell.collapsed) {
					nextGrid[j + i * DIM] = cell;
				} else {
					let options = new Array(numberOfTiles + 4).fill(0).map((x, i) => i);
					if (i > 0) {
						let upTile = this.canvas[j + (i - 1) * DIM];
						let validOptions = [];
						for (let option of upTile.possibleTiles) {
							let valid = tiles[option].downTiles;
							validOptions = validOptions.concat(valid);
						}
						this.checkOptions(options, validOptions);
					}
					if (j < DIM - 1) {
						let rightTile = this.canvas[j + 1 + i * DIM];
						let validOptions = [];
						for (let option of rightTile.possibleTiles) {
							let valid = tiles[option].leftTiles;
							validOptions = validOptions.concat(valid);
						}
						this.checkOptions(options, validOptions);
					}
					if (i < DIM - 1) {
						let downTile = this.canvas[j + (i + 1) * DIM];
						let validOptions = [];
						for (let option of downTile.possibleTiles) {
							let valid = tiles[option].upTiles;
							validOptions = validOptions.concat(valid);
						}
						this.checkOptions(options, validOptions);
					}
					if (j > 0) {
						let leftTile = this.canvas[j - 1 + i * DIM];
						let validOptions = [];
						for (let option of leftTile.possibleTiles) {
							let valid = tiles[option].rightTiles;
							validOptions = validOptions.concat(valid);
						}
						this.checkOptions(options, validOptions);
					}
					nextGrid[j + i * DIM] = new Cell(false, options);
				}
			}
		}
		this.canvas = nextGrid;
	}

	checkOptions(options, validOptions) {
		for (let i = options.length; i >= 0; i--) {
			if (!validOptions.includes(options[i])) {
				options.splice(i, 1);
			}
		}
	}

	show(DIM, w, h) {
		for (let i = 0; i < DIM; i++) {
			for (let j = 0; j < DIM; j++) {
				let cell = this.canvas[j + i * DIM];
				if (cell.collapsed) {
					let index = cell.possibleTiles[0];
					image(tiles[index].image, j * w, i * h, w, h);
				} else {
					stroke(255);
					fill(0);
					rect(j * w, i * h, w, h);
				}
			}
		}
	}
}