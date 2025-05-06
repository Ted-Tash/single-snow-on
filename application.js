document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('sign-in-form');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    alert('This is a dummy sign-in. Nothing is actually submitted!');
  });
});

const snowContainer = document.getElementById('snow-container');
const snowPile = document.getElementById('snow-pile');

const screenWidth = window.innerWidth;
const columnWidth = 10; // resolution of columns
const columnCount = Math.floor(screenWidth / columnWidth);
const columnHeights = new Array(columnCount).fill(0);
const maxPileHeight = window.innerHeight;

function createSnowflake() {
  const flake = document.createElement('div');
  flake.classList.add('snowflake');
  flake.textContent = '❄️';

  const startX = Math.random() * screenWidth;
  flake.style.left = `${startX}px`;
  const size = Math.random() * 10 + 10;
  flake.style.fontSize = `${size}px`;

  const fallTime = Math.random() * 2 + 3;
  flake.style.animationDuration = `${fallTime}s`;

  snowContainer.appendChild(flake);

  setTimeout(() => {
    flake.remove();

    const columnIndex = Math.floor(startX / columnWidth);
    if (columnIndex < 0 || columnIndex >= columnCount) return;

    const pileHeight = columnHeights[columnIndex];
    if (pileHeight >= maxPileHeight) return;

    const piledFlake = document.createElement('div');
    piledFlake.classList.add('piled-snowflake');
    piledFlake.textContent = '❄️';
    piledFlake.style.left = `${startX}px`;
    piledFlake.style.fontSize = `${size}px`;
    piledFlake.style.bottom = `${pileHeight}px`;

    snowPile.appendChild(piledFlake);

    // Increase the snow height at this column
    columnHeights[columnIndex] += size * 1.5; // adjust stacking density
  }, fallTime * 1000);
}

setInterval(() => {
  for (let i = 0; i < 10; i++) {
    createSnowflake();
  }
}, 100);

// 🧤 Scraping
document.addEventListener('mousemove', (e) => {
  const radius = 60;
  const cursorX = e.clientX;
  const cursorY = e.clientY;

  const flakes = snowPile.querySelectorAll('.piled-snowflake');
  flakes.forEach((flake) => {
    const rect = flake.getBoundingClientRect();
    const flakeX = rect.left + rect.width / 2;
    const flakeY = rect.top + rect.height / 2;

    const dx = cursorX - flakeX;
    const dy = cursorY - flakeY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < radius) {
      const left = parseFloat(flake.style.left || '0');
      const columnIndex = Math.floor(left / columnWidth);
      if (columnHeights[columnIndex]) {
        columnHeights[columnIndex] -= 12; // lower the pile slightly
        columnHeights[columnIndex] = Math.max(0, columnHeights[columnIndex]);
      }
      flake.remove();
    }
  });
});