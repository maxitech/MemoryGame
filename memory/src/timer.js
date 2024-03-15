const timer = document.getElementById('timer');

const timerData = {
  counter: 0,
  timerId: undefined,
};

function startCounter() {
  return (timerData.timerId = setInterval(() => {
    timerData.counter++;
    const minutes = Math.floor(timerData.counter / 60);
    const seconds = timerData.counter % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;

    timer.textContent = timeString;
  }, 1000));
}

function resetCounter() {
  clearInterval(timerData.timerId);
  timer.textContent = '00:00';
  timerData.counter = 0;
  startCounter();
}

export { startCounter, resetCounter, timerData };
