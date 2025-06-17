import { Ship, GameBoard } from './script.js';

describe('Ship Testing', () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(3);
  });

  test('creates a ship with correct length', () => {
    expect(ship.length).toBe(3);
  });

  test('initializes with zero hits', () => {
    expect(ship.hitCount).toBe(0);
  });

  test('increases hit count when hit', () => {
    ship.hit();
    expect(ship.hitCount).toBe(1);
  });

  test('is not sunk initially', () => {
    expect(ship.isSunk()).toBe(false);
  });

  test('is sunk when hit count equals length', () => {
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
});

describe('GameBoard Testing', () => {
  let gameBoard;
  let ship;

  beforeEach(() => {
    gameBoard = new GameBoard();
    ship = new Ship(3);
  });

  test('creates a 10x10 grid', () => {
    expect(gameBoard.board.length).toBe(10);
    expect(gameBoard.board[0].length).toBe(10);
  });

  test('all cells are initialized as null', () => {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        expect(gameBoard.board[i][j]).toBe(null);
      }
    }
  });

  describe('Coordinate Generation', () => {
    test('generates vertical coordinates correctly', () => {
      expect(gameBoard._generatePlaceShipCoordinate([0, 0], 3, 'vertical'))
        .toEqual([[0, 0], [0, 1], [0, 2]]);
    });

    test('generates horizontal coordinates correctly', () => {
      expect(gameBoard._generatePlaceShipCoordinate([0, 0], 3, 'horizontal'))
        .toEqual([[0, 0], [1, 0], [2, 0]]);
    });
  });

  describe('Ship Placement', () => {
    test('places ship vertically successfully', () => {
      expect(gameBoard.placeShip(ship, [0, 0], 'vertical')).toBe(true);
      expect(gameBoard.board[0][0]).toBe(ship);
      expect(gameBoard.board[1][0]).toBe(ship);
      expect(gameBoard.board[2][0]).toBe(ship);
    });

    test('places ship horizontally successfully', () => {
      expect(gameBoard.placeShip(ship, [0, 0], 'horizontal')).toBe(true);
      expect(gameBoard.board[0][0]).toBe(ship);
      expect(gameBoard.board[0][1]).toBe(ship);
      expect(gameBoard.board[0][2]).toBe(ship);
    });

    test('prevents placing ship out of bounds', () => {
      expect(gameBoard.placeShip(ship, [8, 8], 'horizontal')).toBe(false);
      expect(gameBoard.placeShip(ship, [8, 8], 'vertical')).toBe(false);
    });

    test('prevents placing ship on occupied space', () => {
      gameBoard.placeShip(ship, [0, 0], 'horizontal');
      const newShip = new Ship(3);
      expect(gameBoard.placeShip(newShip, [0, 0], 'horizontal')).toBe(false);
    });
  });

  describe('Receiving Attacks', () => {
    beforeEach(() => {
      gameBoard.placeShip(ship, [0, 0], 'horizontal');
    });

    test('records hit on ship', () => {
      expect(gameBoard.receiveAttack([0, 0])).toBe(true);
      expect(gameBoard.board[0][0]).toBe('x');
      expect(ship.hitCount).toBe(1);
    });

    test('records missed shot', () => {
      expect(gameBoard.receiveAttack([5, 5])).toBe(true);
      expect(gameBoard.board[5][5]).toBe('m');
      expect(gameBoard.missedAttacks.has('5,5')).toBe(true);
    });

    test('prevents attacking same spot twice', () => {
      gameBoard.receiveAttack([0, 0]);
      expect(gameBoard.receiveAttack([0, 0])).toBe(false);
    });
  });

  describe('Game State', () => {
    test('reports all ships sunk when they are', () => {
      gameBoard.placeShip(ship, [0, 0], 'horizontal');
      gameBoard.receiveAttack([0, 0]);
      gameBoard.receiveAttack([1, 0]);
      gameBoard.receiveAttack([2, 0]);
      expect(gameBoard.areAllShipsSunk()).toBe(true);
    });

    test('reports ships not all sunk when they are not', () => {
      gameBoard.placeShip(ship, [0, 0], 'horizontal');
      gameBoard.receiveAttack([0, 0]);
      gameBoard.receiveAttack([1, 0]);
      expect(gameBoard.areAllShipsSunk()).toBe(false);
    });
  });
});
