import gameController from "./modules/gameController.js";
import displayController from "./modules/displayController.js";

function runGame() {
  const { realPlayer, computerPlayer } = gameController.setupGame();

  displayController.initializeBoards();

  const playRound = (coordinate) => {
    const playerReport =  gameController.playPlayerTurn(coordinate);
    console.log(playerReport)
    if (playerReport.moveStatus === 'llegal') return;

    displayController.renderBoard(computerPlayer, true);

    if (playerReport.gameOver === true) {
      displayController.updateStatus("Player Won!");
      displayController.removeAttackListener();
      return;
    }

    setTimeout(() => {
      const computerReport = gameController.playComputerTurn();
      displayController.renderBoard(realPlayer);

      if (computerReport.gameOver === true) {
        displayController.updateStatus("Computer Won!");
        displayController.removeAttackListener();
      } else {
        displayController.updateStatus("Your turn. Attack the enemy!");
      }
    }, 100);
  };

  displayController.addAttackListener(playRound);
}

runGame();
