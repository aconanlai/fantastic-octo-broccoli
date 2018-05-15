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

export function getRandomNumNear(number, offset) {
  const min = number - offset;
  const max = number + offset;
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

export function fadeOutYoutube(player, duration) {
  return new Promise((resolve) => {
    const volume = player.getVolume();
    const toLowerIncrement = Math.floor(volume / duration);
    let incremented = 0;
    const timer = setInterval(() => {
      lowerVolume(player, toLowerIncrement);
      incremented += 1;
      if (incremented > duration) {
        clearInterval(timer);
        resolve();
      }
    }, 1000);
  });
}

export function fadeInYoutube(player, duration, volume) {
  return new Promise((resolve) => {
    const toRaiseIncrement = Math.floor(volume / duration);
    let incremented = 0;
    const timer = setInterval(() => {
      increaseVolume(player, toRaiseIncrement);
      incremented += 1;
      if (incremented > duration) {
        clearInterval(timer);
        resolve();
      }
    }, 1000);
  });
}

export function getParameterByName(name) {
  const url = window.location.href;
  const convertedName = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp("[?&]" + convertedName + "(=([^&#]*)|&|#|$)");
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export function fadeOutAudio(player, duration) {
  return new Promise((resolve) => {
    const { volume } = player;
    const toLowerIncrement = Math.floor(volume / duration);
    let incremented = 0;
    const timer = setInterval(() => {
      // lowerVolume(player, toLowerIncrement);
      player.volume = volume - toLowerIncrement;
      incremented += 1;
      if (incremented > duration) {
        clearInterval(timer);
        resolve();
      }
    }, 1000);
  });
}

export function fadeInAudio(player, duration, volume) {
  return new Promise((resolve) => {
    const toRaiseIncrement = Math.floor(volume / duration);
    let incremented = 0;
    const timer = setInterval(() => {
      player.volume = volume - toRaiseIncrement;
      incremented += 1;
      if (incremented > duration) {
        clearInterval(timer);
        resolve();
      }
    }, 1000);
  });
}
