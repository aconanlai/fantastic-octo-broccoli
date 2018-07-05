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
  const realDuration = duration * 1000;
  return new Promise((resolve) => {
    const vol = player.volume();
    player.fade(vol, 0, realDuration);
    setTimeout(() => {
      resolve();
    }, realDuration);
  });
}

export function fadeInAudio(player, duration, volume) {
  const realDuration = duration * 1000;
  return new Promise((resolve) => {
    player.fade(0, volume, realDuration);
    setTimeout(() => {
      resolve();
    }, realDuration);
  });
}

const opacities = [0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
const opacityWeights = [4, 5, 6, 4, 3, 1] //weight of each element above
const opacityWeightsNorm = new Array() //normalized weights

let sum = 0;
for (let i = 0; i < opacities.length; i++) {
  sum += opacityWeights[i];
  opacityWeightsNorm[i] = sum;
}

for (let i = 0; i < opacities.length; i++) {
  opacityWeightsNorm[i] = opacityWeightsNorm[i] / sum;
}

export function getRandomOpacity() {
  const needle = Math.random();
  let high = opacityWeightsNorm.length - 1;
  let low = 0;
  let probe;

  while (low < high) {
    probe = Math.ceil((high + low) / 2);

    if (opacityWeightsNorm[probe] < needle) {
      low = probe + 1;
    } else if (opacityWeightsNorm[probe] > needle) {
      high = probe - 1;
    } else {
      return probe;
    }
  }
  let answer;
  if (low !== high) {
    answer = (opacityWeightsNorm[low] >= needle) ? low : probe;
  } else {
    answer = (opacityWeightsNorm[low] >= needle) ? low : low + 1;
  }
  return opacities[answer];
}

export function requestInterval(fn, delay) {
  var requestAnimFrame = (function () {
    return window.requestAnimationFrame || function (callback, element) {
      window.setTimeout(callback, 1000 / 60);
    };
  })(),
  start = new Date().getTime(),
  handle = {};
  function loop() {
    handle.value = requestAnimFrame(loop);
    var current = new Date().getTime(),
    delta = current - start;
    if (delta >= delay) {
      fn.call();
      start = new Date().getTime();
    }
  }
  handle.value = requestAnimFrame(loop);
  return handle;
}

export function throttle(callback, wait, context = this) {
  let timeout = null;
  let callbackArgs = null;

  const later = () => {
    callback.apply(context, callbackArgs);
    timeout = null;
  };

  return () => {
    if (!timeout) {
      callbackArgs = arguments;
      timeout = setTimeout(later, wait);
    }
  };
}
