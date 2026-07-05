import { createPlayer } from './Player';
import { createShip } from './Ship';
import { BOARD_SIZE } from './constants';

const fleetLengths = [3, 2, 2];

function getRandomStartCoordinates(length) {
  const x = Math.floor(Math.random() * BOARD_SIZE);
  const y = Math.floor(Math.random() * (BOARD_SIZE - length + 1));
  return [x, y];
}

function placeFleetRandomly(player) {
  fleetLengths.forEach((length) => {
    const ship = createShip(length);
    let placed = false;
    while (!placed) {
      placed = player.gameboard.placeShip(ship, getRandomStartCoordinates(length));
    }
  });

}

const game = {
  player1: createPlayer('real'),
  player2: createPlayer('computer'),
  currentPlayer: 'player1',
  isOver: false,
};

placeFleetRandomly(game.player2);

export { game, placeFleetRandomly, fleetLengths };
