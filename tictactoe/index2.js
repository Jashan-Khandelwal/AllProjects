import "./index.css";

("use strict");

/* ============================================================
 * Gameboard module (IIFE)
 * - Owns the 9-cell array
 * - Exposes safe read/write/reset methods
 * ============================================================ */
const Gameboard = (() => {
  const board = Array(9).fill(null); // values: null | 'X' | 'O'

  function getBoard() {
    return board.slice(); // return a copy to protect internal state
  }

  function getCell(i) {
    return board[i];
  }

  function place(i, mark) {
    if (typeof i !== "number" || i < 0 || i > 8) return false;
    if (board[i] !== null) return false;
    board[i] = mark;
    return true;
  }

  function reset() {
    for (let i = 0; i < 9; i++) board[i] = null;
  }

  return { getBoard, getCell, place, reset };
})();

/* ============================================================
 * Player factory
 * ============================================================ */
const Player = (name, mark) => {
  return { name, mark };
};

/* ============================================================
 * Game module (IIFE)
 * - Rules + turn management + win/draw evaluation
 * - Single source of truth for game state
 * ============================================================ */
const Game = (() => {
  const WIN_LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  let players = [Player("Player X", "X"), Player("Player O", "O")];
  let current = 0; // 0 -> X, 1 -> O
  let isOver = false;
  let winner = null; // 'X' | 'O' | null
  let winningLine = null; // [a,b,c] | null
  let hasStarted = false;

  function init(nameX, nameO) {
    const nx = (nameX || "").trim() || "Player X";
    const no = (nameO || "").trim() || "Player O";
    players = [Player(nx, "X"), Player(no, "O")];
    Gameboard.reset();
    current = 0;
    isOver = false;
    winner = null;
    winningLine = null;
    hasStarted = true;
    return getState();
  }

  function reset() {
    // preserves names
    return init(players[0].name, players[1].name);
  }

  function getCurrentPlayer() {
    return players[current];
  }

  function evaluate() {
    const brd = Gameboard.getBoard();

    for (const line of WIN_LINES) {
      const [a, b, c] = line;
      if (brd[a] && brd[a] === brd[b] && brd[a] === brd[c]) {
        isOver = true;
        winner = brd[a];
        winningLine = line;
        return;
      }
    }

    // draw if no empty cells and no winner
    if (brd.every((v) => v !== null)) {
      isOver = true;
      winner = null;
      winningLine = null;
    }
  }

  function play(i) {
    if (!hasStarted) return { ok: false, reason: "not-started" };
    if (isOver) return { ok: false, reason: "game-over" };

    const mark = getCurrentPlayer().mark;
    const placed = Gameboard.place(i, mark);
    if (!placed) return { ok: false, reason: "occupied" };

    evaluate(); // may set isOver/winner/winningLine

    const state = getState();
    if (!isOver) {
      current = 1 - current; // flip turn only if game continues
    }
    return { ok: true, state };
  }

  function getState() {
    // expose a snapshot (not references)
    return {
      board: Gameboard.getBoard(),
      isOver,
      winner,
      winningLine,
      currentPlayer: { ...players[current] },
      players: players.map((p) => ({ ...p })),
      hasStarted,
    };
  }

  return { init, reset, play, getState, getCurrentPlayer };
})();

/* ============================================================
 * DisplayController module (IIFE)
 * - DOM rendering + event wiring
 * - Talks to Game, never mutates state itself
 * ============================================================ */
const DisplayController = (() => {
  const boardEl = document.getElementById("board");
  const cellEls = Array.from(boardEl.querySelectorAll(".cell"));
  const statusEl = document.getElementById("status");
  const startBtn = document.getElementById("start");
  const nameXInput = document.getElementById("nameX");
  const nameOInput = document.getElementById("nameO");

  // --- helpers ---
  function setBoardEnabled(enabled) {
    cellEls.forEach((btn) => (btn.disabled = !enabled));
    boardEl.classList.toggle("disabled", !enabled);
  }

  function shake(el) {
    el.classList.remove("shake");
    // force reflow to restart animation if already applied
    // eslint-disable-next-line no-unused-expressions
    el.offsetWidth;
    el.classList.add("shake");
    setTimeout(() => el.classList.remove("shake"), 320);
  }

  function updateStatus(state) {
    if (!state.hasStarted) {
      statusEl.textContent = "Click Start to begin.";
      return;
    }

    if (state.isOver) {
      if (state.winner) {
        const winnerName = state.players.find(
          (p) => p.mark === state.winner
        ).name;
        statusEl.textContent = `${winnerName} (${state.winner}) wins!`;
      } else {
        statusEl.textContent = "It’s a draw!";
      }
      return;
    }

    statusEl.textContent = `${state.currentPlayer.name} (${state.currentPlayer.mark}) — your turn.`;
  }

  function render() {
    const state = Game.getState();
    const board = state.board;

    // paint cells
    cellEls.forEach((btn, i) => {
      const val = board[i];
      btn.textContent = val ? val : "";
      btn.classList.toggle("filled", !!val);
      btn.classList.remove("win");
    });

    // highlight winning line
    if (state.isOver && state.winningLine) {
      state.winningLine.forEach((i) => cellEls[i].classList.add("win"));
    }

    // interactivity + status
    setBoardEnabled(state.hasStarted && !state.isOver);
    updateStatus(state);
  }

  // --- event handlers ---
  function onCellClick(e) {
    const target = e.target.closest(".cell");
    if (!target) return;

    const idx = Number(target.dataset.index);
    const res = Game.play(idx);

    if (!res.ok) {
      // feedback for bad clicks
      if (
        res.reason === "occupied" ||
        res.reason === "game-over" ||
        res.reason === "not-started"
      ) {
        shake(target);
      }
      return;
    }

    render();
  }

  function onStart() {
    const nx = nameXInput.value;
    const no = nameOInput.value;
    Game.init(nx, no);
    render();
  }

  function bind() {
    // Initial state: locked board until Start
    render();

    boardEl.addEventListener("click", onCellClick);
    startBtn.addEventListener("click", onStart);

    // optional: Enter on inputs starts game
    [nameXInput, nameOInput].forEach((inp) => {
      inp.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onStart();
        }
      });
    });
  }

  return { bind, render };
})();

// Bootstrap (script is loaded with `defer`, so DOM is ready)
DisplayController.bind();
