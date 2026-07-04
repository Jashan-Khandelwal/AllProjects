import {createShip} from "./Ship";

describe('createShip',() => {
    test('a new ship is not sunk', () => {
        const ship = createShip(3);
        expect(ship.isSunk()).toBe(false);
    })

    test('a ship is sunk when all parts are hit', () => {
        const ship = createShip(2);
        ship.hit();
        ship.hit();
        expect(ship.isSunk()).toBe(true);
    })

    test('hit() increases damage taken', () => {
        const ship = createShip(3);
        ship.hit();
        expect(ship.isSunk()).toBe(false);
    })
})