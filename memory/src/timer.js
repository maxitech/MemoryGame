const timer = document.getElementById('timer');

let counter = 0;
let timerId;

function startCounter() {
  return (timerId = setInterval(() => {
    counter++;
    const minutes = Math.floor(counter / 60);
    const seconds = counter % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;

    timer.textContent = timeString;
  }, 1000));
}

function resetCounter() {
  clearInterval(timerId);
  timer.textContent = '00:00';
  counter = 0;
  startCounter();
}

export { startCounter, resetCounter };
