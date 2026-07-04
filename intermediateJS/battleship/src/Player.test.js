import { createPlayer } from './Player';
import { createShip } from './Ship';
import { createGameboard } from './Gameboard';
import { BOARD_SIZE } from './constants';

describe('createPlayer', () => {
  test('defaults to a real player', () => {
    const player = createPlayer();
    expect(player.type).toBe('real');
  });

  test('can create a computer player', () => {
    const player = createPlayer('computer');
    expect(player.type).toBe('computer');
  });

  test('each player gets a working gameboard', () => {
    const player = createPlayer();
    const ship = createShip(1);
    expect(player.gameboard.placeShip(ship, [0, 0])).toBe(true);
  });

  test('each player has an independent gameboard', () => {
    const player1 = createPlayer();
    const player2 = createPlayer();
    const ship = createShip(1);

    player1.gameboard.placeShip(ship, [0, 0]);
    player2.gameboard.receiveAttack([0, 0]);

    expect(player2.gameboard.getMissedAttacks()).toContainEqual([0, 0]);
  });

  test('getRandomLegalMove stays in bounds and never repeats an attacked coordinate', () => {
    const player = createPlayer('computer');
    const enemyGameboard = createGameboard();

    for (let i = 0; i < 50; i++) {
      const [x, y] = player.getRandomLegalMove(enemyGameboard);

      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(BOARD_SIZE);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThan(BOARD_SIZE);
      expect(enemyGameboard.hasBeenAttacked([x, y])).toBe(false);

      enemyGameboard.receiveAttack([x, y]);
    }
  });

  test('getNextMove targets a cell adjacent to the last reported hit', () => {
    const player = createPlayer('computer');
    const enemyGameboard = createGameboard();

    player.registerAttackResult([5, 5], true);

    const [x, y] = player.getNextMove(enemyGameboard);
    const isAdjacentToHit =
      (Math.abs(x - 5) === 1 && y === 5) || (Math.abs(y - 5) === 1 && x === 5);
    expect(isAdjacentToHit).toBe(true);
  });

  test('getNextMove falls back to a random legal move once queued targets are exhausted', () => {
    const player = createPlayer('computer');
    const enemyGameboard = createGameboard();

    player.registerAttackResult([5, 5], true);
    const neighbors = [
      [6, 5],
      [4, 5],
      [5, 6],
      [5, 4],
    ];
    neighbors.forEach((coordinates) => enemyGameboard.receiveAttack(coordinates));

    const [x, y] = player.getNextMove(enemyGameboard);
    expect(neighbors).not.toContainEqual([x, y]);
    expect(enemyGameboard.hasBeenAttacked([x, y])).toBe(false);
  });
});
