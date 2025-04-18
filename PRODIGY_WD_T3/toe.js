document.addEventListener("DOMContentLoaded", () => {
    const startScreen = document.getElementById("start-screen");
    const gameContainer = document.getElementById("game-container");
    const startForm = document.getElementById("start-form");
    const playerInputs = document.getElementById("player-inputs");
    const aiOptions = document.getElementById("ai-options");
    const playerXInput = document.getElementById("player-x");
    const playerOInput = document.getElementById("player-o");
    const playerAINameInput = document.getElementById("player-name-ai");
    const difficultySelect = document.getElementById("difficulty");
    const playerInfo = document.getElementById("player-info");
    const board = document.getElementById("board");
    const status = document.getElementById("status");
  
    let cells = [];
    let currentPlayer = "X";
    let gameActive = true;
    let mode = "2p";
    let difficulty = "beginner";
    let playerX = "Player X";
    let playerO = "Player O";
  
    const winPatterns = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6]
    ];
  
    document.querySelectorAll('input[name="mode"]').forEach(radio => {
      radio.addEventListener("change", e => {
        mode = e.target.value;
        playerInputs.classList.toggle("hidden", mode === "ai");
        aiOptions.classList.toggle("hidden", mode === "2p");
      });
    });
  
    startForm.addEventListener("submit", function (e) {
      e.preventDefault();
      mode = document.querySelector('input[name="mode"]:checked').value;
  
      if (mode === "2p") {
        playerX = playerXInput.value.trim() || "Player X";
        playerO = playerOInput.value.trim() || "Player O";
      } else {
        playerX = playerAINameInput.value.trim() || "You";
        playerO = "AI";
        difficulty = difficultySelect.value;
      }
  
      startScreen.classList.add("hidden");
      gameContainer.classList.remove("hidden");
      restartGame();
    });
  
    function createBoard() {
      board.innerHTML = "";
      cells = [];
      for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;
        cell.addEventListener("click", handleMove);
        cells.push(cell);
        board.appendChild(cell);
      }
      updateStatus();
    }
  
    function handleMove(e) {
      const index = e.target.dataset.index;
      if (!gameActive || cells[index].textContent) return;
  
      cells[index].textContent = currentPlayer;
      if (checkWin()) {
        status.textContent = `${getCurrentPlayerName()} wins!`;
        gameActive = false;
        return;
      } else if (checkDraw()) {
        status.textContent = "It's a draw!";
        gameActive = false;
        return;
      }
  
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      updateStatus();
  
      if (mode === "ai" && currentPlayer === "O" && gameActive) {
        setTimeout(aiMove, 400);
      }
    }
  
    function getCurrentPlayerName() {
      return currentPlayer === "X" ? playerX : playerO;
    }
  
    function updateStatus() {
      status.textContent = `${getCurrentPlayerName()}'s turn`;
      playerInfo.textContent = `${playerX} (X) vs ${playerO} (O) — Mode: ${mode === "ai" ? difficulty : "2 Player"}`;
    }
  
    window.restartGame = function () {
      currentPlayer = "X";
      gameActive = true;
      createBoard();
    }
  
    function checkWin() {
      return winPatterns.some(([a, b, c]) => {
        return cells[a].textContent &&
               cells[a].textContent === cells[b].textContent &&
               cells[b].textContent === cells[c].textContent;
      });
    }
  
    function checkDraw() {
      return cells.every(cell => cell.textContent);
    }
  
    function aiMove() {
      const emptyIndexes = cells
        .map((cell, index) => (!cell.textContent ? index : null))
        .filter(i => i !== null);
  
      let moveIndex;
  
      if (difficulty === "beginner") {
        moveIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
      } else if (difficulty === "moderate") {
        moveIndex = findBestMoveModerate(emptyIndexes);
      } else {
        moveIndex = findBestMoveHard();
      }
  
      if (moveIndex != null) cells[moveIndex].click();
    }
  
    function findBestMoveModerate(emptyIndexes) {
      if (emptyIndexes.includes(4)) return 4;
      const corners = [0,2,6,8].filter(i => emptyIndexes.includes(i));
      if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
      return emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
    }
  
    function findBestMoveHard() {
      let bestScore = -Infinity;
      let move;
  
      for (let i = 0; i < 9; i++) {
        if (!cells[i].textContent) {
          cells[i].textContent = "O";
          let score = minimax(false);
          cells[i].textContent = "";
          if (score > bestScore) {
            bestScore = score;
            move = i;
          }
        }
      }
  
      return move;
    }
  
    function minimax(isMaximizing) {
      if (checkWin()) return isMaximizing ? -1 : 1;
      if (checkDraw()) return 0;
  
      let bestScore = isMaximizing ? -Infinity : Infinity;
  
      for (let i = 0; i < 9; i++) {
        if (!cells[i].textContent) {
          cells[i].textContent = isMaximizing ? "O" : "X";
          let score = minimax(!isMaximizing);
          cells[i].textContent = "";
          bestScore = isMaximizing
            ? Math.max(score, bestScore)
            : Math.min(score, bestScore);
        }
      }
  
      return bestScore;
    }
    // Background effect when mouse is outside the board
document.addEventListener("mousemove", (e) => {
    const boardRect = board.getBoundingClientRect();
    const isOutside =
      e.clientX < boardRect.left ||
      e.clientX > boardRect.right ||
      e.clientY < boardRect.top ||
      e.clientY > boardRect.bottom;
  
    });   
    window.goBackToStart = function () {
        document.getElementById("game-container").classList.add("hidden");
        document.getElementById("start-screen").classList.remove("hidden");
        // Optional: reset inputs or game state here
      };
  });