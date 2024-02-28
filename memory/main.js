import { startCounter, resetCounter } from './src/timer';

const game = {
  info: document.getElementById('counters'),
  startBtn: document.getElementById('play_game-btn'),
  symbolPool: ['😀', '😎', '🎉', '🚀', '🌈', '🍕', '🐱', '🦄', '🎈', '🌟', '🍦', '🌸'],
  symbols: null,
  initialized: false,
  flippedCards: [],
  matchedPairs: 0,
  previousScreenWidth: window.innerWidth,
  gameStarted: false,
  tryCount: 0,
};

function setGridBasedOnScreenSize() {
  const screenWidth = window.innerWidth;
  const gameBoard = document.getElementById('field_container');

  if (screenWidth !== game.previousScreenWidth) {
    reset();
    gameBoard.innerHTML = '';
    game.info.classList.add('hidden');
    game.previousScreenWidth = screenWidth;
    game.startBtn.textContent = 'Play';
  }

  gameBoard.className = screenWidth <= 720 ? 'grid-4x3' : 'grid-6x4';
  game.symbols = generateArray(screenWidth <= 720 ? 6 : 12);
}

window.addEventListener('resize', setGridBasedOnScreenSize);
setGridBasedOnScreenSize();

function generateArray(length) {
  if (length > 12) return;

  const newArray = [];

  while (newArray.length < length) {
    const randomIndex = Math.floor(Math.random() * game.symbolPool.length);
    const symbol = game.symbolPool[randomIndex];

    if (!newArray.includes(symbol)) {
      newArray.push(symbol);
    }
  }

  return newArray;
}

function createCard(symbol) {
  const card = document.createElement('button');
  card.classList.add('field');

  const contentContainer = document.createElement('div');
  contentContainer.classList.add('content');
  contentContainer.textContent = '';

  card.appendChild(contentContainer);

  card.addEventListener('click', () => {
    contentContainer.textContent = symbol;
    flipCard(card);
  });

  return card;
}

function initializeGame() {
  if (!game.symbols) return;

  const gameBoard = document.getElementById('field_container');
  gameBoard.innerHTML = '';

  const shuffledSymbols = [...game.symbols, ...game.symbols].sort(() => Math.random() - 0.5);

  shuffledSymbols.forEach((symbol) => {
    const card = createCard(symbol);
    gameBoard.appendChild(card);
  });
}

function flipCard(card) {
  const tryCountEl = document.getElementById('try_count');
  if (
    game.flippedCards.length < 2 &&
    !game.flippedCards.includes(card) &&
    !card.classList.contains('matched')
  ) {
    card.classList.add('flipped');
    game.flippedCards.push(card);

    if (game.flippedCards.length === 2) {
      game.tryCount++;
      tryCountEl.textContent = `Try's: ${game.tryCount}`;
      setTimeout(checkForMatch, 1000);
    }
  }
}

function checkForMatch() {
  const totalPairs = game.symbols.length;
  const [card1, card2] = game.flippedCards;
  const symbol1 = card1?.textContent;
  const symbol2 = card2?.textContent;

  if (!symbol1 || !symbol2) return;

  if (symbol1 === symbol2) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    card1.disabled = true;
    card2.disabled = true;

    game.matchedPairs++;

    if (game.matchedPairs === totalPairs) {
      setTimeout(() => {
        alert('Congratulations, you won!');
        startGame();
      }, 250);
      reset();
    }
  } else {
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
  }

  game.flippedCards = [];
}

function changePlayBtnText() {
  if (game.initialized) {
    if (game.gameStarted) {
      resetCounter();
    } else {
      startCounter();
      game.gameStarted = true;
    }
    game.startBtn.textContent = 'Reset';
  } else {
    game.startBtn.textContent = 'Play';
  }
}

function reset() {
  game.initialized = false;
  game.previousScreenWidth = window.innerWidth;
  game.flippedCards = [];
  game.matchedPairs = 0;
  game.tryCount = 0;
  changePlayBtnText();
  resetCounter();
}

function startGame() {
  game.initialized = true;
  initializeGame();
  game.info.classList.remove('hidden');
  changePlayBtnText();
}

game.startBtn.addEventListener('click', startGame);
