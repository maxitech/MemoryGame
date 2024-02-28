const gameInfo = document.getElementById('counters');
const startBtn = document.getElementById('play_game-btn');
const symbolPool = ['😀', '😎', '🎉', '🚀', '🌈', '🍕', '🐱', '🦄', '🎈', '🌟', '🍦', '🌸'];
let symbols;
let initialized = false;
let previousScreenWidth = 0;
let cards = [];
let flippedCards = [];
let matchedPairs = 0;

function setGridBasedOnScreenSize() {
  const screenWidth = window.innerWidth;
  const gameBoard = document.getElementById('field_container');

  if (screenWidth !== previousScreenWidth) {
    reset();
    gameBoard.innerHTML = '';
    gameInfo.classList.add('hidden');
    previousScreenWidth = screenWidth;
    startBtn.textContent = 'Play';
  }

  if (screenWidth <= 720) {
    gameBoard.className = 'grid-4x3';
    symbols = generateArray(6);
  } else {
    gameBoard.className = 'grid-6x4';
    symbols = generateArray(12);
  }
}
window.addEventListener('resize', setGridBasedOnScreenSize);
setGridBasedOnScreenSize();

function generateArray(length) {
  if (length > 12) return;

  const newArray = [];

  while (newArray.length < length) {
    const randomIndex = Math.floor(Math.random() * symbolPool.length);
    const symbol = symbolPool[randomIndex];

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
  if (!symbols) return;

  const gameBoard = document.getElementById('field_container');
  gameBoard.innerHTML = '';

  const shuffledSymbols = [...symbols, ...symbols].sort(() => Math.random() - 0.5);

  shuffledSymbols.forEach((symbol) => {
    const card = createCard(symbol);
    gameBoard.appendChild(card);
  });
}
function flipCard(card) {
  if (
    flippedCards.length < 2 &&
    !flippedCards.includes(card) &&
    !card.classList.contains('matched')
  ) {
    card.classList.add('flipped');
    flippedCards.push(card);

    console.log(flippedCards);

    if (flippedCards.length === 2) {
      setTimeout(checkForMatch, 1000);
    }
  }
}

function checkForMatch() {
  const totalPairs = symbols.length;
  const [card1, card2] = flippedCards;
  const symbol1 = card1?.textContent;
  const symbol2 = card2?.textContent;

  console.log(symbol1, symbol2);
  if (!symbol1 || !symbol2) return;

  if (symbol1 === symbol2) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    card1.disabled = true;
    card2.disabled = true;

    matchedPairs++;

    console.log(matchedPairs, totalPairs);

    if (matchedPairs === totalPairs) {
      setTimeout(() => {
        alert('Glückwunsch, du hast gewonnen!');
        startGame();
      }, 250);
      reset();
    }
  } else {
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
  }

  flippedCards = [];
}
let started = false;
function changePlayBtnText() {
  const gameBoard = document.getElementById('field_container');

  started = !started;
  if (started || gameBoard) {
    startBtn.textContent = 'Reset';
  } else {
    startBtn.textContent = 'Play';
  }
}

function reset() {
  initialized = false;
  previousScreenWidth = 0;
  cards = [];
  flippedCards = [];
  matchedPairs = 0;
}

function startGame() {
  initializeGame();
  gameInfo.classList.remove('hidden');
  console.log('Game Start');
  changePlayBtnText();
  reset();
}
startBtn.addEventListener('click', () => startGame());
