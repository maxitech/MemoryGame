import { startCounter, resetCounter } from './src/timer';
import confetti from 'canvas-confetti';

const game = {
  info: document.getElementById('counters'),
  startBtn: document.getElementById('play_game-btn'),
  tryCountEl: document.getElementById('try_count'),
  symbolPool: ['😀', '😎', '🎉', '🚀', '🌈', '🍕', '🐱', '🦄', '🎈', '🌟', '🍦', '🌸'],
  symbols: null,
  initialized: false,
  flippedCards: [],
  matchedPairs: 0,
  previousScreenWidth: window.innerWidth,
  gameStarted: false,
  tryCount: 0,
};

const globalObj = game;

function setGridBasedOnScreenSize() {
  const screenWidth = window.innerWidth;
  const gameBoard = document.getElementById('field_container');

  if (screenWidth !== globalObj.previousScreenWidth) {
    reset();
    gameBoard.innerHTML = '';
    globalObj.info.classList.add('hidden');
    globalObj.previousScreenWidth = screenWidth;
    globalObj.startBtn.textContent = 'Play';
  }

  gameBoard.className = screenWidth <= 720 ? 'grid-4x3' : 'grid-6x4';
  globalObj.symbols = generateArray(screenWidth <= 720 ? 6 : 12);
}

window.addEventListener('resize', setGridBasedOnScreenSize);
setGridBasedOnScreenSize();

function generateArray(length) {
  if (length > 12) return;

  const newArray = [];

  while (newArray.length < length) {
    const randomIndex = Math.floor(Math.random() * globalObj.symbolPool.length);
    const symbol = globalObj.symbolPool[randomIndex];

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
  if (!globalObj.symbols) return;

  const gameBoard = document.getElementById('field_container');
  gameBoard.innerHTML = '';

  const shuffledSymbols = [...globalObj.symbols, ...globalObj.symbols].sort(
    () => Math.random() - 0.5
  );

  shuffledSymbols.forEach((symbol) => {
    const card = createCard(symbol);
    gameBoard.appendChild(card);
  });
}

function flipCard(card) {
  if (
    globalObj.flippedCards.length < 2 &&
    !globalObj.flippedCards.includes(card) &&
    !card.classList.contains('matched')
  ) {
    card.classList.add('flipped');
    globalObj.flippedCards.push(card);

    if (globalObj.flippedCards.length === 2) {
      globalObj.tryCount++;
      globalObj.tryCountEl.textContent = `Try's: ${globalObj.tryCount}`;
      setTimeout(checkForMatch, 1000);
    }
  }
}

function checkForMatch() {
  const totalPairs = globalObj.symbols.length;
  const [card1, card2] = globalObj.flippedCards;
  const symbol1 = card1?.textContent;
  const symbol2 = card2?.textContent;

  if (!symbol1 || !symbol2) return;

  if (symbol1 === symbol2) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    card1.disabled = true;
    card2.disabled = true;

    globalObj.matchedPairs++;

    if (globalObj.matchedPairs === totalPairs) {
      setTimeout(() => {
        confetti({
          particleCount: 300,
          spread: 70,
          origin: { y: 0.6 },
        });

        setTimeout(() => {
          reset();
          startGame();
        }, 3000);
      }, 500);
    }
  } else {
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
  }

  globalObj.flippedCards = [];
}

function changePlayBtnText() {
  if (globalObj.initialized) {
    if (globalObj.gameStarted) {
      reset();
    } else {
      startCounter();
      globalObj.gameStarted = true;
    }
    globalObj.startBtn.textContent = 'Reset';
  } else {
    globalObj.startBtn.textContent = 'Play';
  }
}

function reset() {
  globalObj.initialized = false;
  globalObj.previousScreenWidth = window.innerWidth;
  globalObj.flippedCards = [];
  globalObj.matchedPairs = 0;
  globalObj.tryCount = 0;
  globalObj.tryCountEl.textContent = `Try's: ${globalObj.tryCount}`;
  changePlayBtnText();
  resetCounter();
}

function startGame() {
  globalObj.initialized = true;
  initializeGame();
  globalObj.info.classList.remove('hidden');
  changePlayBtnText();
}

globalObj.startBtn.addEventListener('click', startGame);
