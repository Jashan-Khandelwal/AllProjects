let container = document.getElementById("grid-container");
let button = document.getElementById("resize-button");

function createGrid(n) {
  container.innerHTML = "";
  const containersize = container.clientWidth;
  const cellsize = Math.floor(containersize / n);

  for (let i = 0; i < n * n; i++) {
    const cell = document.createElement("div");
    cell.classList.add("grid-cell");
    cell.style.width = `${cellsize}px`;
    cell.style.height = `${cellsize}px`;

    cell.dataset.step = 0;
    cell.addEventListener("mouseenter", () => {
      let step = parseInt(cell.dataset.step, 10);
      if (step   === 0) {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        cell.dataset.r = r;
        cell.dataset.g = g;
        cell.dataset.b = b;

        cell.style.background = `rgb(${r},${g},${b})`;
        cell.dataset.step = 1;
      } else {
        const origR = parseInt(cell.dataset.r, 10);
        const origG = parseInt(cell.dataset.g, 10);
        const origB = parseInt(cell.dataset.b, 10);
        const factor = 1 - step * 0.1;

        const nr = Math.floor(origR * factor);
        const ng = Math.floor(origG * factor);
        const nb = Math.floor(origB * factor);

        cell.style.background = `rgb(${nr},${ng},${nb})`;

        cell.dataset.step = step + 1;
      }
      //   cell.style.backgroundColor = `#${Math.floor(Math.random() * 999999)}`;
    });
    container.appendChild(cell);
  }
}

button.addEventListener("click", () => {
  const input = prompt("Enter number of squares per side (1-100):", "16");
  const newSize = parseInt(input, 10);

  if (isNaN(newSize) || newSize < 1 || newSize > 100) {
    alert("Invalid entry. Please enter a number between 1 and 100.");
    return;
  }

  createGrid(newSize);
});

// Initial 16×16 grid
createGrid(16);
