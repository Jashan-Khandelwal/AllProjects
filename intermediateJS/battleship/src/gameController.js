import { game, placeFleetRandomly, fleetLengths } from './game';
import { createShip } from './Ship';
import { renderBoard, renderMessage, renderFleetList } from './dom';

const placementScreen = document.getElementById('placement-screen');
const battleScreen = document.getElementById('battle-screen');
const placementBoardContainer = document.getElementById('placement-board');
const fleetListContainer = document.getElementById('fleet-list');
const randomizeButton = document.getElementById('randomize-button');
const startButton = document.getElementById('start-button');
const playerBoardContainer = document.getElementById('player-board');
const enemyBoardContainer = document.getElementById('enemy-board');
const messageContainer = document.getElementById('message');

let fleet = [];

function createFleet() {
  fleet = fleetLengths.map((length) => ({ ship: createShip(length), placed: false }));
}

function renderPlacementUI() {
  renderFleetList(fleetListContainer, fleet);
  renderBoard(placementBoardContainer, game.player1.gameboard, {
    reveal: true,
    onCellDrop: handleShipDrop,
  });
  startButton.disabled = fleet.some((entry) => !entry.placed);
}

function handleShipDrop(coordinates, event) {
  const index = Number(event.dataTransfer.getData('text/plain'));
  const entry = fleet[index];

  if (!entry || entry.placed) {
    return;
  }

  entry.placed = game.player1.gameboard.placeShip(entry.ship, coordinates);
  renderPlacementUI();
}

function renderBattleBoards() {
  renderBoard(playerBoardContainer, game.player1.gameboard, { reveal: true });
  renderBoard(enemyBoardContainer, game.player2.gameboard, {
    reveal: false,
    onCellClick: game.isOver ? undefined : handlePlayerAttack,
  });
}

function endGame(winner) {
  game.isOver = true;
  renderMessage(messageContainer, `${winner.type} player wins!`);
}

function computerTurn() {
  const coordinates = game.player2.getNextMove(game.player1.gameboard);
  const wasHit = game.player1.gameboard.receiveAttack(coordinates);
  game.player2.registerAttackResult(coordinates, wasHit);

  if (game.player1.gameboard.allShipsSunk()) {
    renderBattleBoards();
    endGame(game.player2);
    return;
  }

  game.currentPlayer = 'player1';
  renderBattleBoards();
}

function handlePlayerAttack(coordinates) {
  if (game.currentPlayer !== 'player1' || game.isOver) {
    return;
  }

  game.player2.gameboard.receiveAttack(coordinates);

  if (game.player2.gameboard.allShipsSunk()) {
    renderBattleBoards();
    endGame(game.player1);
    return;
  }

  game.currentPlayer = 'player2';
  computerTurn();
}

function handleRandomize() {
  game.player1.gameboard.reset();
  placeFleetRandomly(game.player1);
  fleet.forEach((entry) => {
    entry.placed = true;
  });
  renderPlacementUI();
}

function handleStart() {
  placementScreen.hidden = true;
  battleScreen.hidden = false;
  renderBattleBoards();
}

randomizeButton.addEventListener('click', handleRandomize);
startButton.addEventListener('click', handleStart);

function startGame() {
  createFleet();
  renderPlacementUI();
}

export { startGame };
