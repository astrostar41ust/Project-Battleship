const displayController = (() => {
  let playerBoard;
  let computerBoard;
  let statusMessage;
  let attackCallback;

  const createBoard = (boardElement) => {
    boardElement.innerHTML = "";
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.x = y;
        cell.dataset.y = x;
        boardElement.appendChild(cell);
      }
    }
  };

  const initializeBoards = () => {
    playerBoard = document.getElementById("player-board");
    computerBoard = document.getElementById("computer-board");
    statusMessage = document.getElementById("status-message");

    createBoard(playerBoard);
    createBoard(computerBoard);
  };

  const renderBoard = (player, isEnemyBoard = false) => {
   
    const boardElement = player.name === 'real player' ? playerBoard : computerBoard;
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const cellState = player.board.board[y][x];
        const cell = boardElement.querySelector(
          `[data-x="${x}"][data-y="${y}"]`
        );

        cell.className = "cell";

        if (cellState === "m") {
          cell.classList.add("miss");
        } else if (cellState === "x") {
          cell.classList.add("hit");
        } else if (typeof cellState === "object" && cellState !== null) {
          if (!isEnemyBoard) {
            cell.classList.add("ship");
          }
        }
      }
    }
  };

  const updateStatus = (message) => {
    statusMessage.textContent = message;
  };

  const handleAttack = (e) => {
    const cell = e.target;
    if (
      cell.classList.contains("cell") &&
      !cell.classList.contains("hit") &&
      !cell.classList.contains("miss")
    ) {
      const x = parseInt(cell.dataset.x);
      const y = parseInt(cell.dataset.y);


      attackCallback([x, y]);
    }
  }

  const addAttackListener = (callback) => {
    attackCallback = callback
    computerBoard.addEventListener("click", handleAttack)
  };

  const removeAttackListener = () => {
    computerBoard.removeEventListener('click', handleAttack);
  };

  return {
    initializeBoards,
    renderBoard,
    updateStatus,
    addAttackListener,
    removeAttackListener
  };
})();

export default displayController;