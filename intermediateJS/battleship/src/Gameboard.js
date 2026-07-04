function createGameboard() {
  const board = new Map();
  const missedAttacks = [];
  const hitAttacks = [];
  const attackedCoordinates = new Set();

  function key(coordinates) {
    return coordinates.join(',');
  }

  function canPlaceShip(ship, coordinates) {
    const [x, y] = coordinates;    
    for (let i = 0; i < ship.length; i++) {
      if (board.has(key([x, y + i]))) {
        return false;
      }
    }
    return true;
  }

  function placeShip(ship, coordinates) {
    const [x, y] = coordinates;
    if (!canPlaceShip(ship, coordinates)) {
      return false;
    }
    for (let i = 0; i < ship.length; i++) {
      board.set(key([x, y + i]), ship);
    }
    return true;
  }

  function receiveAttack(coordinates) {
    attackedCoordinates.add(key(coordinates));
    const ship = board.get(key(coordinates));
    if (ship) {
      ship.hit();
      hitAttacks.push(coordinates);
      return true;
    }
    missedAttacks.push(coordinates);
    return false;
  }

  function getMissedAttacks() {
    return missedAttacks;
  }

  function getHitAttacks() {
    return hitAttacks;
  }

  function hasShipAt(coordinates) {
    return board.has(key(coordinates));
  }

  function hasBeenAttacked(coordinates) {
    return attackedCoordinates.has(key(coordinates));
  }

  function reset() {
    board.clear();
    missedAttacks.length = 0;
    hitAttacks.length = 0;
    attackedCoordinates.clear();
  }

  function allShipsSunk() {
    for (const ship of board.values()) {
      if (!ship.isSunk()) {
        return false;
      }
    }
    return true;
  }

  return {
    placeShip,
    receiveAttack,
    getMissedAttacks,
    getHitAttacks,
    hasShipAt,
    hasBeenAttacked,
    reset,
    allShipsSunk,
  };
}

export { createGameboard };
