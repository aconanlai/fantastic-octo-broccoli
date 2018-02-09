export function shuffle(array) {
  const newArray = [...array];
  let currentIndex = newArray.length;
  let temporaryValue;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = newArray[currentIndex];
    newArray[currentIndex] = newArray[randomIndex];
    newArray[randomIndex] = temporaryValue;
  }

  return newArray;
}

export function getRandomNum(max) {
  return Math.floor(Math.random() * max);
}

export function getRandomNumBetween(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function removeRandomFromArray(arr) {
  const randomNum = getRandomNum(arr.length - 1);
  return arr.splice(randomNum, 1)[0];
}

export function getCycleDelay(average) {
  const floor = average - 5;
  const ceiling = average + 5;
  return getRandomNumBetween(floor, ceiling) * 1000;
}

export function lowerVolume(player, decrement) {
  const currentVolume = player.getVolume();
  player.setVolume(currentVolume - decrement);
}

export function increaseVolume(player, increment) {
  const currentVolume = player.getVolume();
  player.setVolume(currentVolume + increment);
}

export function fadeOut(player) {
  return new Promise((resolve) => {
    let incremented = 0;
    const timer = setInterval(() => {
      lowerVolume(player, 10);
      incremented += 1;
      if (incremented > 8) {
        clearInterval(timer);
        resolve();
      }
    }, 1000);
  });
}

export function fadeIn(player) {
  return new Promise((resolve) => {
    let incremented = 0;
    const timer = setInterval(() => {
      increaseVolume(player, 10);
      incremented += 1;
      if (incremented > 8) {
        clearInterval(timer);
        resolve();
      }
    }, 1000);
  });
}
