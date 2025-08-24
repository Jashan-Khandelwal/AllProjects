import "./index.css";

("use strict");

const Gameboard = (() => {
  const board = Array(9).fill(null);

  function getBoard() {
    return board.slice();
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

// const Player = ((name, mark) => {
//   {
//     name, mark;
//   }
// })();

const Player = (name, mark) => ({ name, mark });

const Game = (() => {
  const WIN_STATES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let players = [Player("Player x", "X"), Player("Player o", "O")];
  let isOver = false;
  let winner = null;
  let winningLine = null;
  let current = 0;
  let hasStarted = false;

  function init(nameX, nameY) {
    const nx = (nameX || "").trim() || "player X";
    const ny = (nameY || "").trim() || "player Y";
    players = [Player(nx, "X"), Player(ny, "O")];
    Gameboard.reset();
    current = 0;
    isOver = false;
    winner = null;
    winningLine = null;
    hasStarted = true;
    return getState();
  }

  function evaluate() {
    const brd = Gameboard.getBoard();

    for (const line of WIN_STATES) {
      const [a, b, c] = line;
      if (brd[a] && brd[a] === brd[b] && brd[b] === brd[c]) {
        isOver = true;
        winner = brd[a];
        winningLine = line;
        return;
      }
    }

    if (!brd.includes(null)) {
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

    evaluate();

    const state = getState();
    if (!isOver) {
      current = 1 - current;
    }
    return { ok: true, state };
  }

  function getState() {
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

  function reset() {
    return init(players[0].name, players[1].name);
  }

  function getCurrentPlayer() {
    return players[current];
  }

  return { init, play, getState, reset, getCurrentPlayer };
})();

const DisplayController = (() => {
  const boardEl = document.getElementById("board");
  const cellEls = Array.from(boardEl.querySelectorAll(".cell"));
  const statusEl = document.getElementById("status");
  const startBtn = document.getElementById("start");
  const nameX = document.getElementById("nameX");
  const nameY = document.getElementById("nameO");

  function setBoardEnabled(enabled) {
    cellEls.forEach((btn) => (btn.disabled = !enabled));
    boardEl.classList.toggle("disabled", !enabled);
  }

  function shake(e) {
    e.classList.remove("shake");

    e.offsetWidth;
    e.classList.add("shake");
    setTimeout(() => e.classList.remove("shake"), 320);
  }

  function updateStatus(state) {
    if (!state.hasStarted) {
      statusEl.textContent = "click state to begin";
      return;
    }
    if (state.isOver) {
      if (state.winner) {
        const winnername = state.players.find(
          (p) => p.mark === state.winner
        ).name;
        statusEl.textContent = `${winnername} (${state.winner}) wins!`;
      } else {
        statusEl.textContent = "it's a tie!";
      }
      return;
    }
    statusEl.textContent = `${state.currentPlayer.name} (${state.currentPlayer.mark})-teri turn`;
  }

  function render() {
    const state = Game.getState();
    const board = state.board;

    cellEls.forEach((btn, i) => {
      const val = board[i];
      btn.textContent = val ? val : "";
      btn.classList.toggle("filled", !!val);
      btn.classList.remove("win");
    });

    if (state.isOver && state.winningLine) {
      state.winningLine.forEach((i) => cellEls[i].classList.add("win"));
    }

    setBoardEnabled(state.hasStarted && !state.isOver);
    updateStatus(state);
  }

  function onCellClick(e) {
    const target = e.target.closest(".cell");
    if (!target) return;

    const idx = Number(target.dataset.index);
    const res = Game.play(idx);

    if (!res.ok) {
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
    const nx = nameX.value;
    const ny = nameY.value;
    Game.init(nx, ny);
    render();
  }

  function bind() {
    render();

    boardEl.addEventListener("click", onCellClick);
    startBtn.addEventListener("click", onStart);

    [nameX, nameY].forEach((inp) => {
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

DisplayController.bind();
