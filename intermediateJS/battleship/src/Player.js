import { createGameboard } from './Gameboard';
import { BOARD_SIZE } from './constants';

function createPlayer(type = 'real') {
  const targetQueue = [];

  function getRandomCoordinates() {
    return [
      Math.floor(Math.random() * BOARD_SIZE),
      Math.floor(Math.random() * BOARD_SIZE),
    ];
  }

  function getRandomLegalMove(enemyGameboard) {
    let coordinates;
    do {
      coordinates = getRandomCoordinates();
    } while (enemyGameboard.hasBeenAttacked(coordinates));
    return coordinates;
  }

  function isOnBoard([x, y]) {
    return x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE;
  }

  function getAdjacentCoordinates([x, y]) {
    return [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ].filter(isOnBoard);
  }

  function getNextMove(enemyGameboard) {
    while (targetQueue.length > 0) {
      const coordinates = targetQueue.shift();
      if (!enemyGameboard.hasBeenAttacked(coordinates)) {
        return coordinates;
      }
    }
    return getRandomLegalMove(enemyGameboard);
  }

  function registerAttackResult(coordinates, wasHit) {
    if (wasHit) {
      targetQueue.push(...getAdjacentCoordinates(coordinates));
    }
  }

  return {
    type,
    gameboard: createGameboard(),
    getRandomLegalMove,
    getNextMove,
    registerAttackResult,
  };
}

export { createPlayer };
