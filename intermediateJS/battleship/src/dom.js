import { BOARD_SIZE } from './constants';

function isInList(list, coordinates) {
  return list.some(([x, y]) => x === coordinates[0] && y === coordinates[1]);
}

function getCellStatus(gameboard, coordinates, reveal) {
  if (isInList(gameboard.getHitAttacks(), coordinates)) return 'hit';
  if (isInList(gameboard.getMissedAttacks(), coordinates)) return 'miss';
  if (reveal && gameboard.hasShipAt(coordinates)) return 'ship';
  return 'empty';
}

function renderBoard(container, gameboard, { reveal = false, onCellClick, onCellDrop } = {}) {
  container.innerHTML = '';

  const grid = document.createElement('div');
  grid.classList.add('board-grid');

  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      const coordinates = [x, y];
      const status = getCellStatus(gameboard, coordinates, reveal);

      const cell = document.createElement('div');
      cell.classList.add('cell', `cell--${status}`);
      cell.dataset.x = x;
      cell.dataset.y = y;

      const alreadyAttacked = status === 'hit' || status === 'miss';
      if (onCellClick && !alreadyAttacked) {
        cell.addEventListener('click', () => onCellClick(coordinates));
      }

      if (onCellDrop) {
        cell.addEventListener('dragover', (event) => event.preventDefault());
        cell.addEventListener('dragenter', () => cell.classList.add('cell--drag-over'));
        cell.addEventListener('dragleave', () => cell.classList.remove('cell--drag-over'));
        cell.addEventListener('drop', (event) => {
          event.preventDefault();
          cell.classList.remove('cell--drag-over');
          onCellDrop(coordinates, event);
        });
      }

      grid.appendChild(cell);
    }
  }

  container.appendChild(grid);
}

function renderMessage(container, text) {
  container.textContent = text;
}

function renderFleetList(container, fleet) {
  container.innerHTML = '';

  fleet.forEach((entry, index) => {
    if (entry.placed) return;

    const item = document.createElement('div');
    item.classList.add('fleet-ship');
    item.textContent = `Ship (${entry.ship.length})`;
    item.draggable = true;
    item.addEventListener('dragstart', (event) => {
      event.dataTransfer.setData('text/plain', String(index));
    });

    container.appendChild(item);
  });
}

export { renderBoard, renderMessage, renderFleetList };
