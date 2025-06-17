import Player from "./player.js";
import Ship from "./ship.js";

const gameController = (() => {
  let isPlayerTurn = true;
  let realPlayer;
  let computerPlayer;
  const setupGame = () => {
    realPlayer = new Player("real player");
    computerPlayer = new Player("computer player");

    const playerFleet = [
      { length: 5, start: [0, 1], orientation: "horizontal" },
      { length: 4, start: [2, 3], orientation: "vertical" },
      { length: 3, start: [5, 5], orientation: "horizontal" },
    ];

    const computerFleet = [
      { length: 5, start: [5, 3], orientation: "horizontal" },
      { length: 2, start: [7, 4], orientation: "vertical" },
      { length: 3, start: [3, 1], orientation: "horizontal" },
    ];

    for (const fleet of playerFleet) {
      const ship = new Ship(fleet.length);
      realPlayer.board.placeShip(ship, fleet.start, fleet.orientation);
    }

    for (const fleet of computerFleet) {
      const ship = new Ship(fleet.length);
      computerPlayer.board.placeShip(ship, fleet.start, fleet.orientation);
    }

    return { realPlayer, computerPlayer };
  };

  const playPlayerTurn = (coordinate) => {
    if (!isPlayerTurn) return;

    const playerAttackResult = realPlayer.attack(computerPlayer, coordinate);

    if (playerAttackResult === "illegal") return { moveStatus: "illegal" };

    if (computerPlayer.board.areAllShipsSunk()) {
      return {
        gameOver: true,
        winner: "player",
        playerAttackResult: playerAttackResult,
        moveStatus: "legal",
      };
    }

    isPlayerTurn = false;
    return {
      gameOver: false,
      winner: null,
      playerAttackResult: playerAttackResult,
      moveStatus: "legal",
    };
  };

  const playComputerTurn = () => {
    const computerAttackCoordinate =
      computerPlayer.generateRandomAttack(realPlayer);

    const computerAttackResult = computerPlayer.attack(
      realPlayer,
      computerAttackCoordinate
    );

    if (realPlayer.board.areAllShipsSunk()) {
      return {
        gameOver: true,
        winner: "computer",
        computerAttackCoordinate: computerAttackCoordinate,
        computerAttackResult: computerAttackResult,
      };
    }

    isPlayerTurn = true;
    return {
      gameOver: false,
      winner: null,
      computerAttackCoordinate: computerAttackCoordinate,
      computerAttackResult: computerAttackResult,
    };
  };

  return {
    setupGame,
    playPlayerTurn,
    playComputerTurn,
  };
})();

export default gameController;
