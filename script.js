// ===============================
// PLAYER
// ===============================

const Player = (name, marker) => {
  return {
    name: name,
    marker: marker,
    score: 0,
  };
};

// ===============================
// GAMEBOARD
// ===============================

const Gameboard = (() => {
  // ALWAYS EXACTLY 9 CELLS
  let board = Array(9).fill("");

  // Get board
  const getBoard = () => {
    return board;
  };

  // Place marker
  const placeMarker = (index, marker) => {
    // Don't allow an occupied cell
    if (board[index] !== "") {
      return false;
    }

    board[index] = marker;

    return true;
  };

  // Reset board
  const resetBoard = () => {
    board = Array(9).fill("");
  };

  return {
    getBoard,
    placeMarker,
    resetBoard,
  };
})();

// ===============================
// GAME CONTROLLER
// ===============================

const GameController = (() => {
  let player1 = null;
  let player2 = null;

  let currentPlayer = null;

  let gameOver = true;

  // ===========================
  // START NEW GAME
  // ===========================

  const startGame = (name1, name2) => {
    // Create completely new players
    player1 = Player(name1, "X");

    player2 = Player(name2, "O");

    currentPlayer = player1;

    gameOver = false;

    // Clear board
    Gameboard.resetBoard();

    // Update display
    DisplayController.updatePlayerNames();

    DisplayController.updateScores();

    DisplayController.updateMessage(
      `${currentPlayer.name}'s turn (${currentPlayer.marker})`,
    );

    DisplayController.render();
  };

  // ===========================
  // PLAY ROUND
  // ===========================

  const playRound = (index) => {
    // Don't allow moves when game is over
    if (gameOver || currentPlayer === null) {
      return;
    }

    // Try to place marker
    const successfulMove = Gameboard.placeMarker(index, currentPlayer.marker);

    // Cell already occupied
    if (!successfulMove) {
      DisplayController.updateMessage("⚠️ This position is already taken!");

      return;
    }

    // Show move
    DisplayController.render();

    // =========================
    // CHECK WINNER
    // =========================

    const winningCombination = checkWinner();

    if (winningCombination) {
      currentPlayer.score++;

      gameOver = true;

      // Highlight winning cells
      DisplayController.highlightWinner(winningCombination);

      // Update score
      DisplayController.updateScores();

      // Show winner message
      DisplayController.updateMessage(`🏆 ${currentPlayer.name} wins! 🎉`);

      return;
    }

    // =========================
    // CHECK TIE
    // =========================

    if (checkTie()) {
      gameOver = true;

      DisplayController.updateMessage("🤝 It's a tie!");

      return;
    }

    // =========================
    // SWITCH PLAYER
    // =========================

    switchPlayer();

    DisplayController.updateMessage(
      `${currentPlayer.name}'s turn (${currentPlayer.marker})`,
    );
  };

  // ===========================
  // SWITCH PLAYER
  // ===========================

  const switchPlayer = () => {
    if (currentPlayer === player1) {
      currentPlayer = player2;
    } else {
      currentPlayer = player1;
    }
  };

  // ===========================
  // CHECK WINNER
  // ===========================

  const checkWinner = () => {
    const board = Gameboard.getBoard();

    const winningCombinations = [
      // Rows
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],

      // Columns
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],

      // Diagonals
      [0, 4, 8],
      [2, 4, 6],
    ];

    // Return the winning combination
    // instead of only true/false
    return winningCombinations.find(([a, b, c]) => {
      return board[a] !== "" && board[a] === board[b] && board[b] === board[c];
    });
  };

  // ===========================
  // CHECK TIE
  // ===========================

  const checkTie = () => {
    return Gameboard.getBoard().every((cell) => cell !== "");
  };

  // ===========================
  // GET PLAYERS
  // ===========================

  const getPlayers = () => {
    return {
      player1,
      player2,
    };
  };

  // ===========================
  // RESTART CURRENT GAME
  // ===========================

  const restartGame = () => {
    // No game has been started
    if (player1 === null || player2 === null) {
      return;
    }

    // Player 1 starts again
    currentPlayer = player1;

    gameOver = false;

    // Clear board
    Gameboard.resetBoard();

    // Update display
    DisplayController.render();

    DisplayController.updateMessage(
      `${currentPlayer.name}'s turn (${currentPlayer.marker})`,
    );
  };

  return {
    startGame,
    playRound,
    restartGame,
    getPlayers,
  };
})();

// ===============================
// DISPLAY CONTROLLER
// ===============================

const DisplayController = (() => {
  // ===========================
  // HTML ELEMENTS
  // ===========================

  const boardElement = document.querySelector("#gameboard");

  const turnMessage = document.querySelector("#turn-message");

  const startButton = document.querySelector("#start-btn");

  const restartButton = document.querySelector("#restart-btn");

  const newGameButton = document.querySelector("#new-game-btn");

  const exitButton = document.querySelector("#exit-btn");

  const playAgainButton = document.querySelector("#play-again-btn");

  const exitScreen = document.querySelector("#exit-screen");

  const player1Input = document.querySelector("#player1");

  const player2Input = document.querySelector("#player2");

  const player1NameElement = document.querySelector("#player1-name");

  const player2NameElement = document.querySelector("#player2-name");

  const player1ScoreElement = document.querySelector("#player1-score");

  const player2ScoreElement = document.querySelector("#player2-score");

  // ===========================
  // RENDER BOARD
  // ===========================

  const render = () => {
    // Clear old cells
    boardElement.innerHTML = "";

    const board = Gameboard.getBoard();

    // Create exactly 9 cells
    board.forEach((cell, index) => {
      const cellElement = document.createElement("div");

      cellElement.classList.add("cell");

      cellElement.dataset.index = index;

      cellElement.textContent = cell;

      // Add different class
      // for X and O
      if (cell === "X") {
        cellElement.classList.add("x-marker");
      }

      if (cell === "O") {
        cellElement.classList.add("o-marker");
      }

      boardElement.appendChild(cellElement);
    });
  };

  // ===========================
  // UPDATE MESSAGE
  // ===========================

  const updateMessage = (message) => {
    turnMessage.textContent = message;
  };

  // ===========================
  // UPDATE PLAYER NAMES
  // ===========================

  const updatePlayerNames = () => {
    const { player1, player2 } = GameController.getPlayers();

    if (player1 && player2) {
      player1NameElement.textContent = player1.name;

      player2NameElement.textContent = player2.name;
    }
  };

  // ===========================
  // UPDATE SCORES
  // ===========================

  const updateScores = () => {
    const { player1, player2 } = GameController.getPlayers();

    if (player1 && player2) {
      player1ScoreElement.textContent = player1.score;

      player2ScoreElement.textContent = player2.score;
    }
  };

  // ===========================
  // HIGHLIGHT WINNER
  // ===========================

  const highlightWinner = (winningCombination) => {
    winningCombination.forEach((index) => {
      const cell = boardElement.querySelector(`[data-index="${index}"]`);

      if (cell) {
        cell.classList.add("winning-cell");
      }
    });
  };

  // ===========================
  // BOARD CLICK
  // ===========================

  const handleClick = (event) => {
    if (!event.target.classList.contains("cell")) {
      return;
    }

    const index = Number(event.target.dataset.index);

    GameController.playRound(index);
  };

  // ===========================
  // START GAME
  // ===========================

  startButton.addEventListener("click", () => {
    const name1 = player1Input.value.trim();

    const name2 = player2Input.value.trim();

    const player1Name = name1 || "Player 1";

    const player2Name = name2 || "Player 2";

    GameController.startGame(player1Name, player2Name);
  });

  // ===========================
  // RESTART
  // ===========================

  restartButton.addEventListener("click", () => {
    GameController.restartGame();
  });

  // ===========================
  // NEW GAME
  // ===========================

  newGameButton.addEventListener("click", () => {
    const name1 = player1Input.value.trim();

    const name2 = player2Input.value.trim();

    const player1Name = name1 || "Player 1";

    const player2Name = name2 || "Player 2";

    // Start completely fresh game
    GameController.startGame(player1Name, player2Name);
  });

  // ===========================
  // EXIT GAME
  // ===========================

  exitButton.addEventListener("click", () => {
    exitScreen.style.display = "flex";
  });

  // ===========================
  // PLAY AGAIN
  // ===========================

  playAgainButton.addEventListener("click", () => {
    // Hide exit screen
    exitScreen.style.display = "none";

    const name1 = player1Input.value.trim();

    const name2 = player2Input.value.trim();

    const player1Name = name1 || "Player 1";

    const player2Name = name2 || "Player 2";

    // Start fresh game
    GameController.startGame(player1Name, player2Name);
  });

  // ===========================
  // BOARD EVENT
  // ===========================

  boardElement.addEventListener("click", handleClick);

  // ===========================
  // RETURN PUBLIC METHODS
  // ===========================

  return {
    render,

    updateMessage,

    updatePlayerNames,

    updateScores,

    highlightWinner,
  };
})();

// ===============================
// INITIAL BOARD
// ===============================

DisplayController.render();
