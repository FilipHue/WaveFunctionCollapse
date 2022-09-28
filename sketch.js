const DIM = 20;

let numberOfTiles = 13;
const tileImages = [];
let tiles = [];

let grid;

function preload() {
	for (let i = 0; i < numberOfTiles; i++) {
		tileImages[i] = loadImage(`circuit/${i}.png`);
	}
}

function setup() {
	createCanvas(800, 800);
	grid = new Grid();

	tiles[0] = new Tile(tileImages[0], ['AAA', 'AAA', 'AAA', 'AAA'], false);
	tiles[1] = new Tile(tileImages[1], ['BBB', 'BBB', 'BBB', 'BBB'], false);
	tiles[2] = new Tile(tileImages[2], ['BBB', 'BCB', 'BBB', 'BBB'], false);
	tiles[3] = new Tile(tileImages[3], ['BBB', 'BDB', 'BBB', 'BDB'], false);
	tiles[4] = new Tile(tileImages[4], ['ABB', 'BCB', 'BBA', 'AAA'], false);
	tiles[5] = new Tile(tileImages[5], ['ABB', 'BBB', 'BBB', 'BBA'], true);
	tiles[6] = new Tile(tileImages[6], ['BBB', 'BCB', 'BBB', 'BCB'], false);
	tiles[7] = new Tile(tileImages[7], ['BDB', 'BCB', 'BDB', 'BCB'], false);
	tiles[8] = new Tile(tileImages[8], ['BDB', 'BBB', 'BCB', 'BBB'], false);
	tiles[9] = new Tile(tileImages[9], ['BCB', 'BCB', 'BBB', 'BCB'], false);
	tiles[10] = new Tile(tileImages[10], ['BCB', 'BCB', 'BCB', 'BCB'], false);
	tiles[11] = new Tile(tileImages[11], ['BCB', 'BCB', 'BBB', 'BBB'], false);
	tiles[12] = new Tile(tileImages[12], ['BBB', 'BCB', 'BBB', 'BCB'], false);


	let index = numberOfTiles;
	for (let i = 0; i < numberOfTiles; i++) {
		for (let j = 1; j < 4; j++) {
			tiles[index] = tiles[i].rotate(j);
			index++;
		}
	}
	tiles = grid.deleteDuplicates(tiles);
	numberOfTiles = tiles.length;

	grid.createRules(tiles);
	grid.initializeGrid(DIM);

}

function draw() {
	background(0);

	const w = width / DIM;
	const h = height / DIM;

	grid.show(DIM, w, h);

	minimumDensity = grid.sortDensity();
	if (minimumDensity == -1) {
		return;
	}
	grid.pickRandomTile(minimumDensity);

	grid.setNextTiles();
}
