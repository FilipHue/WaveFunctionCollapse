function reverseString(string) {
	stringArray = string.split("");
	return stringArray.reverse().join("");
}

function checkConnection(connection1, connection2) {
	return connection1 == reverseString(connection2);
}

class Tile {
	constructor(image, connections, isAsimetric) {
		this.image = image;
		this.connections = connections;
		this.isAsimetric = isAsimetric;

		this.upTiles = [];
		this.rightTiles = [];
		this.downTiles = [];
		this.leftTiles = [];
	}

	generateRulesOfConnection(tiles) {
		for (let i = 0; i < tiles.length; i++) {
			if (this.isAsimetric && tiles[i].isAsimetric) {
				continue;
			}
			if (checkConnection(tiles[i].connections[2], this.connections[0])) {
				this.upTiles.push(i);
			}
			if (checkConnection(tiles[i].connections[3], this.connections[1])) {
				this.rightTiles.push(i);
			}
			if (checkConnection(tiles[i].connections[0], this.connections[2])) {
				this.downTiles.push(i);
			}
			if (checkConnection(tiles[i].connections[1], this.connections[3])) {
				this.leftTiles.push(i);
			}
		}
	}

	rotate(numberOfRotations) {
		const w = this.image.width;
		const h = this.image.height;
		const newImage = createGraphics(w, h);
		newImage.imageMode(CENTER);
		newImage.translate(w / 2, h / 2);
		newImage.rotate(HALF_PI * numberOfRotations);
		newImage.image(this.image, 0, 0);
		const newConnections = [];

		for (let i = 0; i < 4; i++) {
			newConnections[i] = this.connections[(i - numberOfRotations + 4) % 4];
		}

		return new Tile(newImage, newConnections, this.isAsimetric);
	}
}
