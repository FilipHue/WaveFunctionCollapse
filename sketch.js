const DIM = 20;

let numberOfTiles = 5;
const tileImages = [];
let tiles = [];

let grid = [];

function deleteDuplicates(tiles) {
  const uniqueTilesMap = {};
  for (const tile of tiles) {
    const key = tile.connections.join(",");
    uniqueTilesMap[key] = tile;
  }
  return Object.values(uniqueTilesMap);
}

function initializeGrid() {
  for (let i = 0; i < DIM * DIM; i++) {
    let cell = new Cell(
      false,
      new Array(numberOfTiles).fill(0).map((x, i) => i)
    );
    grid[i] = cell;
  }
}

function createRules(tiles) {
  for (let tile of tiles) {
    tile.generateRulesOfConnection(tiles);
  }
}

function sortDensity() {
  let gridCopy = grid.slice();
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

function pickRandomTile(tiles) {
  let cell = random(tiles);
  let pickedTile = random(cell.possibleTiles);
  if (pickedTile == undefined) {
    initializeGrid();
    return;
  }
  cell.collapsed = true;
  cell.possibleTiles = [pickedTile];
}

function checkOptions(options, validOptions) {
  for (let i = options.length; i >= 0; i--) {
    if (!validOptions.includes(options[i])) {
      options.splice(i, 1);
    }
  }
}

function mousePressed() {
  redraw();
}

function preload() {
  for (let i = 0; i < numberOfTiles; i++) {
    tileImages[i] = loadImage(`tiles/${i}.png`);
  }
}

function setup() {
  createCanvas(800, 800);

  tiles[0] = new Tile(tileImages[0], ["AAA", "AAA", "AAA", "AAA"], false);
  tiles[1] = new Tile(tileImages[1], ["ABA", "ABA", "AAA", "ABA"], false);
  tiles[2] = new Tile(tileImages[2], ["ABA", "ABA", "ABA", "AAA"], false);
  tiles[3] = new Tile(tileImages[3], ["AAA", "ABA", "ABA", "ABA"], false);
  tiles[4] = new Tile(tileImages[4], ["ABA", "AAA", "ABA", "ABA"], false);  


  let index = numberOfTiles;
  for (let i = 0; i < numberOfTiles; i++) {
    for (let j = 1; j < 4; j++) {
      tiles[index] = tiles[i].rotate(j);
      index++;
    }
  }

  tiles = deleteDuplicates(tiles);

  numberOfTiles = tiles.length;

  createRules(tiles);

  initializeGrid();
}

function draw() {
  background(0);

  const w = width / DIM;
  const h = height / DIM;

  for (let i = 0; i < DIM; i++) {
    for (let j = 0; j < DIM; j++) {
      let cell = grid[j + i * DIM];
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

  minimumDensity = sortDensity();
  if (minimumDensity == -1) {
    return;
  }
  pickRandomTile(minimumDensity);

  let nextGrid = [];

  for (let i = 0; i < DIM; i++) {
    for (let j = 0; j < DIM; j++) {
      let cell = grid[j + i * DIM];
      if (cell.collapsed) {
        nextGrid[j + i * DIM] = cell;
      } else {
        let options = new Array(numberOfTiles + 4).fill(0).map((x, i) => i);

        if (i > 0) {
          let upTile = grid[j + (i - 1) * DIM];
          let validOptions = [];
          for (let option of upTile.possibleTiles) {
            let valid = tiles[option].downTiles;
            validOptions = validOptions.concat(valid);
          }
          checkOptions(options, validOptions);
        }

        if (j < DIM - 1) {
          let rightTile = grid[j + 1 + i * DIM];
          let validOptions = [];
          for (let option of rightTile.possibleTiles) {
            let valid = tiles[option].leftTiles;
            validOptions = validOptions.concat(valid);
          }
          checkOptions(options, validOptions);
        }

        if (i < DIM - 1) {
          let downTile = grid[j + (i + 1) * DIM];
          let validOptions = [];
          for (let option of downTile.possibleTiles) {
            let valid = tiles[option].upTiles;
            validOptions = validOptions.concat(valid);
          }
          checkOptions(options, validOptions);
        }

        if (j > 0) {
          let leftTile = grid[j - 1 + i * DIM];
          let validOptions = [];
          for (let option of leftTile.possibleTiles) {
            let valid = tiles[option].rightTiles;
            validOptions = validOptions.concat(valid);
          }
          checkOptions(options, validOptions);
        }

        nextGrid[j + i * DIM] = new Cell(false, options);
      }
    }
  }

  grid = nextGrid;

//   noLoop();
}
