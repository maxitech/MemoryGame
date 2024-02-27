function setGridBasedOnScreenSize() {
  const screenWidth = window.innerWidth;
  const gameBoard = document.getElementById('field_container');

  if (screenWidth <= 600) {
    gameBoard.className = 'grid-4x3';
    generateCards(12);
  } else {
    gameBoard.className = 'grid-6x4';
    generateCards(24);
  }
}

function generateCards(numCards) {
  const gameBoard = document.getElementById('field_container');
  gameBoard.innerHTML = '';

  for (let i = 0; i < numCards; i++) {
    const card = document.createElement('button');
    card.className = 'field';
    card.textContent = i + 1;
    gameBoard.appendChild(card);
  }
}
window.addEventListener('resize', setGridBasedOnScreenSize);
setGridBasedOnScreenSize();
