
(function () {
  const boardEl = document.getElementById("board");
  const statusEl = document.getElementById("status");
  const resetBtn = document.getElementById("resetBtn");
  const winlineEl = document.getElementById("winline");

  const scoreXEl = document.getElementById("scoreX");
  const scoreOEl = document.getElementById("scoreO");
  const scoreDEl = document.getElementById("scoreD");

  const celebrationEl = document.getElementById("celebration");
  const winnerMessageEl = document.getElementById("winnerMessage");

  let board = Array(9).fill(null);
  let current = "X";
  let gameOver = false;

  let scores = {
    X: 0,
    O: 0,
    D: 0
  };

  const WIN_LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  // Create the nine cells
  const cells = [];

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");

    cell.className = "cell";
    cell.dataset.i = i;

    cell.addEventListener("click", function () {
      handleMove(i);
    });

    boardEl.insertBefore(cell, winlineEl);
    cells.push(cell);
  }

  // Create the X symbol
  function xMarkSVG() {
    return `
      <svg viewBox="0 0 100 100">
        <path
          class="mark-path draw-path"
          d="M20,20 L80,80"
        />
        <path
          class="mark-path draw-path"
          d="M80,20 L20,80"
          style="animation-delay:.15s"
        />
      </svg>
    `;
  }

  // Create the O symbol
  function oMarkSVG() {
    return `
      <svg viewBox="0 0 100 100">
        <circle
          class="mark-path draw-path"
          cx="50"
          cy="50"
          r="32"
        />
      </svg>
    `;
  }

  // Handle a player's move
  function handleMove(i) {
    if (gameOver || board[i] !== null) {
      return;
    }

    board[i] = current;

    const cell = cells[i];

    cell.classList.add(
      "filled",
      current.toLowerCase()
    );

    cell.innerHTML =
      current === "X" ? xMarkSVG() : oMarkSVG();

    // Check for a winner
    const win = checkWin();

    if (win) {
      gameOver = true;

      win.line.forEach(function (index) {
        cells[index].classList.add("win");
      });

      drawWinLine(win.line);

      statusEl.textContent = `Player ${current} wins!`;
      statusEl.classList.add("win");

      // Show the dancing anime character on the right
      winnerMessageEl.textContent =
        `🎉 Player ${current} Wins! 🎉`;

      celebrationEl.classList.add("show");

      scores[current]++;
      updateScores();

      return;
    }

    // Check for a draw
    if (board.every(function (value) {
      return value !== null;
    })) {
      gameOver = true;

      statusEl.textContent = "It's a draw!";
      statusEl.classList.add("win");

      celebrationEl.classList.remove("show");

      scores.D++;
      updateScores();

      return;
    }

    // Switch to the other player
    current = current === "X" ? "O" : "X";

    statusEl.textContent = `Turn: ${current}`;
  }

  // Check all possible winning combinations
  function checkWin() {
    for (const line of WIN_LINES) {
      const [a, b, c] = line;

      if (
        board[a] !== null &&
        board[a] === board[b] &&
        board[b] === board[c]
      ) {
        return {
          player: board[a],
          line: line
        };
      }
    }

    return null;
  }

  // Draw the line across the winning cells
  function drawWinLine(line) {
    const boardRect = boardEl.getBoundingClientRect();

    const first = cells[line[0]].getBoundingClientRect();
    const last = cells[line[2]].getBoundingClientRect();

    const x1 =
      first.left + first.width / 2 - boardRect.left;

    const y1 =
      first.top + first.height / 2 - boardRect.top;

    const x2 =
      last.left + last.width / 2 - boardRect.left;

    const y2 =
      last.top + last.height / 2 - boardRect.top;

    const dx = x2 - x1;
    const dy = y2 - y1;

    const length = Math.sqrt(dx * dx + dy * dy);

    const angle =
      Math.atan2(dy, dx) * 180 / Math.PI;

    winlineEl.style.width = length + "px";
    winlineEl.style.left = x1 + "px";
    winlineEl.style.top = (y1 - 3) + "px";

    winlineEl.style.setProperty(
      "--rot",
      angle + "deg"
    );

    winlineEl.style.transform =
      `rotate(${angle}deg)`;

    winlineEl.classList.add("show");
  }

  // Update the scoreboard
  function updateScores() {
    scoreXEl.textContent = scores.X;
    scoreOEl.textContent = scores.O;
    scoreDEl.textContent = scores.D;
  }

  // Restart the round without resetting scores
  function reset() {
    board = Array(9).fill(null);
    current = "X";
    gameOver = false;

    statusEl.textContent = "Turn: X";
    statusEl.classList.remove("win");

    // Hide the anime celebration
    celebrationEl.classList.remove("show");

    // Reset the winning line
    winlineEl.classList.remove("show");
    winlineEl.style.width = "0";
    winlineEl.style.transform = "";

    // Clear every cell
    cells.forEach(function (cell) {
      cell.className = "cell";
      cell.innerHTML = "";
    });
  }

  // Restart button
  resetBtn.addEventListener("click", reset);

})();
