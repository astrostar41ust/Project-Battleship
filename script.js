class Ship {
  constructor(length) {
    this.length = length;
    this.hitCount = 0;
  }

  hit() {
    this.hitCount++;
  }

  isSunk() {
    return this.hitCount === this.length;
  }
}

class GameBoard {
  constructor() {
    this.board = Array(10)
      .fill(null)
      .map(() => Array(10).fill(null));
    this.ships = [];
    this.missedAttacks = new Set();
  }

  placeShip(ship, startCoordinate, orientation) {
    const coordinates = this._generatePlaceShipCoordinate(
      startCoordinate,
      ship.length,
      orientation
    );

    for (const coordinate of coordinates) {
      const [x, y] = coordinate;
      const xOutOfBoundCheck = x < 0 || x > 9;
      const yOutOfBoundCheck = y < 0 || y > 9;

      if (xOutOfBoundCheck || yOutOfBoundCheck || this.board[y][x] !== null) {
        return false;
      }
    }

    for (const coordinate of coordinates) {
      const [x, y] = coordinate;
      this.board[y][x] = ship;
    }

    this.ships.push(ship);
    return true;
  }

  _generatePlaceShipCoordinate(startCoordinate, length, orientation) {
    const coordinates = [];

    for (let i = 0; i < length; i++) {
      if (orientation === "horizontal") {
        let newX = startCoordinate[0] + i;
        let newY = startCoordinate[1];

        coordinates.push([newX, newY]);
      } else if (orientation === "vertical") {
        let newX = startCoordinate[0];
        let newY = startCoordinate[1] + i;

        coordinates.push([newX, newY]);
      }
    }

    return coordinates;
  }

  receiveAttack(coordinate) {
    const [x, y] = coordinate;
    const key = `${x},${y}`

    if(this.missedAttacks.has(key) || this.board[y][x] === 'x') {
        return false
    }

    if(this.board[y][x] === null) {
        this.board[y][x] = 'm'
        this.missedAttacks.add(key)
        return true
    }

    if(typeof(this.board[y][x]) === "object") {
        this.board[y][x].hit()
        this.board[y][x] = 'x'
        return true
    }

   

  }

  areAllShipsSunk() {

    return this.ships.every((ship) => ship.isSunk())
    
  }
}

export { Ship, GameBoard };
