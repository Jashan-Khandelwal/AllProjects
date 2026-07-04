function createShip(length) {
  let hits = 0;

  return {
    length,
    hit() {
      hits += 1;
    },
    isSunk() {
      return hits >= length;
    },
  };
}


export {createShip};