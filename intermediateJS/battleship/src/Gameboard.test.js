import { createGameboard } from './Gameboard';
import { createShip } from './Ship';

describe('createGameboard', () => {
  test('places a ship at the given coordinates', () => {
    const gameboard = createGameboard();
    const ship = createShip(3);
    expect(gameboard.placeShip(ship, [0, 0])).toBe(true);
  });

  test('receiveAttack hits a ship placed at the attacked coordinates', () => {
    const gameboard = createGameboard();
    const ship = createShip(2);
    gameboard.placeShip(ship, [0, 0]);

    gameboard.receiveAttack([0, 0]);
    expect(ship.isSunk()).toBe(false);

    gameboard.receiveAttack([0, 1]);
    expect(ship.isSunk()).toBe(true);
  });

  test('receiveAttack records a miss when no ship is at the coordinates', () => {
    const gameboard = createGameboard();
    gameboard.receiveAttack([5, 5]);
    expect(gameboard.getMissedAttacks()).toContainEqual([5, 5]);
  });

  test('receiveAttack does not record a hit coordinate as a miss', () => {
    const gameboard = createGameboard();
    const ship = createShip(1);
    gameboard.placeShip(ship, [2, 2]);

    gameboard.receiveAttack([2, 2]);
    expect(gameboard.getMissedAttacks()).toEqual([]);
  });

  test('allShipsSunk returns false while a ship is still afloat', () => {
    const gameboard = createGameboard();
    const ship = createShip(1);
    gameboard.placeShip(ship, [0, 0]);
    expect(gameboard.allShipsSunk()).toBe(false);
  });

  test('allShipsSunk returns true once every placed ship is sunk', () => {
    const gameboard = createGameboard();
    const ship = createShip(1);
    gameboard.placeShip(ship, [0, 0]);
    gameboard.receiveAttack([0, 0]);
    expect(gameboard.allShipsSunk()).toBe(true);
  });

  test('hasShipAt returns true for an occupied coordinate and false otherwise', () => {
    const gameboard = createGameboard();
    const ship = createShip(2);
    gameboard.placeShip(ship, [0, 0]);

    expect(gameboard.hasShipAt([0, 0])).toBe(true);
    expect(gameboard.hasShipAt([0, 1])).toBe(true);
    expect(gameboard.hasShipAt([5, 5])).toBe(false);
  });

  test('getHitAttacks records a coordinate after a successful attack', () => {
    const gameboard = createGameboard();
    const ship = createShip(1);
    gameboard.placeShip(ship, [3, 3]);

    gameboard.receiveAttack([3, 3]);
    expect(gameboard.getHitAttacks()).toContainEqual([3, 3]);
  });

  test('getHitAttacks stays empty after a miss', () => {
    const gameboard = createGameboard();
    gameboard.receiveAttack([7, 7]);
    expect(gameboard.getHitAttacks()).toEqual([]);
  });

  test('hasBeenAttacked tracks every attacked coordinate, hit or miss', () => {
    const gameboard = createGameboard();
    const ship = createShip(1);
    gameboard.placeShip(ship, [1, 1]);

    expect(gameboard.hasBeenAttacked([1, 1])).toBe(false);
    expect(gameboard.hasBeenAttacked([9, 9])).toBe(false);

    gameboard.receiveAttack([1, 1]);
    gameboard.receiveAttack([9, 9]);

    expect(gameboard.hasBeenAttacked([1, 1])).toBe(true);
    expect(gameboard.hasBeenAttacked([9, 9])).toBe(true);
  });

  test('reset clears placed ships and attack history', () => {
    const gameboard = createGameboard();
    const ship = createShip(1);
    gameboard.placeShip(ship, [4, 4]);
    gameboard.receiveAttack([4, 4]);
    gameboard.receiveAttack([8, 8]);

    gameboard.reset();

    expect(gameboard.hasShipAt([4, 4])).toBe(false);
    expect(gameboard.getHitAttacks()).toEqual([]);
    expect(gameboard.getMissedAttacks()).toEqual([]);
    expect(gameboard.hasBeenAttacked([4, 4])).toBe(false);
    expect(gameboard.hasBeenAttacked([8, 8])).toBe(false);
  });
});
