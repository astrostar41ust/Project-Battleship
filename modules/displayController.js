const displayController = (() => {
  let playerBoard;
  let computerBoard;
  let statusMessage;
  let attackCallback;
  let placementCallback;
  let currentOrientation = 'horizontal'; // Default orientation
  let rotateButton;

  const createBoard = (boardElement) => {
    boardElement.innerHTML = ""; // Clear any existing cells
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.y = y; // Row
        cell.dataset.x = x; // Column
        boardElement.appendChild(cell);
      }
    }
  };

  const initializeBoards = () => {
    playerBoard = document.getElementById("player-board");
    computerBoard = document.getElementById("computer-board");
    statusMessage = document.getElementById("status-message");
    rotateButton = document.getElementById("rotate-button");

    createBoard(playerBoard);
    createBoard(computerBoard);
  };

  const renderBoard = (gameboard, boardElement, isPlayerBoard = false) => {
    boardElement.innerHTML = ""; // Clear existing cells before re-rendering
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.y = y;
        cell.dataset.x = x;
        const cellState = gameboard.board[y][x];

        if (cellState === "m") {
          cell.classList.add("miss");
        } else if (cellState === "x") {
          cell.classList.add("hit");
        } else if (typeof cellState === "object" && cellState !== null) {
          if (isPlayerBoard) {
            cell.classList.add("ship");
          }
        }
        boardElement.appendChild(cell);
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
      const y = parseInt(cell.dataset.y);
      const x = parseInt(cell.dataset.x);

      attackCallback([y, x]); // Pass [row, col]
    }
  };

  const addAttackListener = (callback) => {
    attackCallback = callback;
    computerBoard.addEventListener("click", handleAttack);
  };

  const removeAttackListener = () => {
    computerBoard.removeEventListener("click", handleAttack);
  };

  const handlePlacementClick = (e) => {
    const cell = e.target;
    if (cell.classList.contains("cell")) {
      const y = parseInt(cell.dataset.y);
      const x = parseInt(cell.dataset.x);
      placementCallback([y, x], currentOrientation); // Pass [row, col] and orientation
    }
  };

  const handleOrientationChange = (e) => {
    if (e.key === 'r' || e.key === 'R') {
      currentOrientation = currentOrientation === 'horizontal' ? 'vertical' : 'horizontal';
      updateStatus(`Current orientation: ${currentOrientation.toUpperCase()} (Press R to change)`);
    }
  };

  const addPlacementListener = (callback) => {
    placementCallback = callback;
    playerBoard.addEventListener("click", handlePlacementClick);
    document.addEventListener('keydown', handleOrientationChange); // Listen for 'R' key
    if (rotateButton) {
        rotateButton.classList.remove('hidden');
        rotateButton.addEventListener('click', () => {
            currentOrientation = currentOrientation === 'horizontal' ? 'vertical' : 'horizontal';
            updateStatus(`Current orientation: ${currentOrientation.toUpperCase()} (Press R to change)`);
        });
    }
  };

  const removePlacementListener = () => {
    playerBoard.removeEventListener("click", handlePlacementClick);
    document.removeEventListener('keydown', handleOrientationChange);
    if (rotateButton) {
        rotateButton.classList.add('hidden');
        // Remove previous event listener to prevent multiple bindings
        const newRotateButton = rotateButton.cloneNode(true);
        rotateButton.parentNode.replaceChild(newRotateButton, rotateButton);
        rotateButton = newRotateButton;
    }
  };

  const renderPlacementPreview = (gameboard, startCoord, shipLength, orientation, isValid) => {
    const [startY, startX] = startCoord;
    // First, clear any existing preview classes from all cells
    const cells = playerBoard.querySelectorAll('.cell');
    cells.forEach(cell => {
      cell.classList.remove('placement-preview', 'placement-invalid');
    });

    if (!isValid) {
        // If placement is invalid, mark the cells with an invalid class
        for (let i = 0; i < shipLength; i++) {
            let y = startY;
            let x = startX;
            if (orientation === 'horizontal') {
                x = startX + i;
            } else {
                y = startY + i;
            }
            const cell = playerBoard.querySelector(`[data-y="${y}"][data-x="${x}"]`);
            if (cell) {
                cell.classList.add('placement-invalid');
            }
        }
        return;
    }

    // If placement is valid, mark the cells with a preview class
    for (let i = 0; i < shipLength; i++) {
        let y = startY;
        let x = startX;
        if (orientation === 'horizontal') {
            x = startX + i;
        } else {
            y = startY + i;
        }
        const cell = playerBoard.querySelector(`[data-y="${y}"][data-x="${x}"]`);
        if (cell) {
            cell.classList.add('placement-preview');
        }
    }
  };

  const clearPreview = () => {
    const cells = playerBoard.querySelectorAll('.cell');
    cells.forEach(cell => {
      cell.classList.remove('placement-preview', 'placement-invalid');
    });
  };

  return {
    initializeBoards,
    renderBoard,
    updateStatus,
    addAttackListener,
    removeAttackListener,
    addPlacementListener,
    removePlacementListener,
    getCurrentOrientation: () => currentOrientation,
    renderPlacementPreview,
    clearPreview,
    updateCell: (boardElement, row, col, status) => {
        const cell = boardElement.querySelector(`[data-y="${row}"][data-x="${col}"]`);
        if (cell) {
            cell.classList.add(status);
        }
    }
  };
})();

export default displayController;
