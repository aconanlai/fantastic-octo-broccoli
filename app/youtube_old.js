import {
  getParameterByName,
  shuffle,
  getRandomNum,
  getRandomNumBetween,
  getRandomNumNear,
  removeRandomFromArray,
  getCycleDelay,
  fadeOut,
  fadeIn,
} from './utils';

let videosQueued = {
  relaxation: [],
  nature: [],
  meditation: [],
};
let videosPlayed = {
  relaxation: [],
  nature: [],
  meditation: [],
};
window.players = [];
let initialLoaded = [];
let height;
let width;

const RELAXATION_MUSIC = 'relaxation%20music';
const NATURE_SOUNDS = 'nature%20sounds';
const GUIDED_MEDITATION = 'guided%20meditation';
const NUMBER_OF_VIDS = Number(getParameterByName('NUMBER_OF_VIDS')) || 16;
const RAMP_DOWN_DURATION = Number(getParameterByName('RAMP_DOWN_DURATION')) || 10;
const RAMP_UP_DURATION = Number(getParameterByName('RAMP_UP_DURATION')) || 10;
// const INITIAL_VOLUME_FLOOR = Number(getParameterByName('INITIAL_VOLUME_FLOOR')) || 60;
const AVERAGE_TIME_DELAY = Number(getParameterByName('AVERAGE_TIME_DELAY')) || 30; // 150
const INITIAL_VOLUMES = {
  relaxation: {
    min: Number(getParameterByName('RELAXATION_MIN_VOLUME')) || 80,
    max: Number(getParameterByName('RELAXATION_MAX_VOLUME')) || 100,
  },
  nature: {
    min: Number(getParameterByName('NATURE_MIN_VOLUME')) || 80,
    max: Number(getParameterByName('NATURE_MAX_VOLUME')) || 100,
  },
  meditation: {
    min: Number(getParameterByName('MEDITATION_MIN_VOLUME')) || 70,
    max: Number(getParameterByName('MEDITATION_MAX_VOLUME')) || 90,
  },
};

async function getType(typeString, type) {
  const results = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${typeString}&type=video&videoEmbeddable=true&maxResults=50&key=AIzaSyBlCAvG8b1EN6BRnjkW20-gyvpNNO7uhac`);
  const json = await results.json();
  return json.items.map(item => (
    {
      id: item.id.videoId,
      type,
    }
  ));
}

async function initialize() {
  const [relaxation, nature, meditation] = await Promise.all([
    getType(RELAXATION_MUSIC, 'relaxation'),
    getType(NATURE_SOUNDS, 'nature'),
    getType(GUIDED_MEDITATION, 'meditation'),
  ]);

  videosQueued.relaxation = relaxation;
  videosQueued.nature = nature;
  videosQueued.meditation = meditation;

  const firstRandomNum = getRandomNumBetween(4, 7);
  const secondRandomNum = getRandomNumBetween(4, 7);
  const thirdRandomNum = 16 - secondRandomNum - firstRandomNum;
  for (let i = 0; i < firstRandomNum; i += 1) {
    const selected = removeRandomFromArray(relaxation);
    videosPlayed.relaxation.push(selected);
    initialLoaded.push(selected);
  }

  for (let i = 0; i < secondRandomNum; i += 1) {
    const selected = removeRandomFromArray(nature);
    videosPlayed.nature.push(selected);
    initialLoaded.push(selected);
  }

  for (let i = 0; i < thirdRandomNum; i += 1) {
    const selected = removeRandomFromArray(meditation);
    videosPlayed.meditation.push(selected);
    initialLoaded.push(selected);
  }
  initialLoaded = shuffle(initialLoaded);

  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

initialize();

function resetVideos() {
  videosQueued = {
    relaxation: [...videosPlayed.relaxation],
    nature: [...videosPlayed.nature],
    meditation: [...videosPlayed.meditation],
  };
  videosPlayed = {
    relaxation: [],
    nature: [],
    meditation: [],
  };
}


function findAvailableVideoType() {
  const remainingCategories = Object.keys(videosQueued).filter((category) => {
    return videosQueued[category].length > 0;
  });
  if (remainingCategories.length === 0) {
    resetVideos();
    return findAvailableVideoType();
  }
  const randomNum = getRandomNum(remainingCategories.length);
  return remainingCategories[randomNum];
}

function loadNewVideo(player) {
  const category = findAvailableVideoType();
  const newVideo = removeRandomFromArray(videosQueued[category]);
  player.loadVideoById(newVideo.id, 0, 'small');
  videosPlayed[newVideo.type].push(newVideo);
  return newVideo.type;
}

async function cycleOne() {
  const random = getRandomNum(window.players.length);
  const player = window.players[random];
  await fadeOut(player, RAMP_DOWN_DURATION);
  const type = loadNewVideo(player);
  const newVolume = getRandomNumBetween(
    INITIAL_VOLUMES[type].min,
    INITIAL_VOLUMES[type].max,
  );
  await fadeIn(player, RAMP_UP_DURATION, newVolume);
  const nextCycle = getCycleDelay(AVERAGE_TIME_DELAY);
  setTimeout(cycleOne, nextCycle);
}

function initializeScreenSize() {
  const content = document.getElementById('content');
  const windowRatio = window.innerWidth / window.innerHeight;
  if (windowRatio > 1.6 && windowRatio < 2) {
    content.style.width = '85vw';
    width = window.innerWidth / (windowRatio * 3);
  } else if (windowRatio < 1.6) {
    content.style.width = '98vw';
    width = window.innerWidth / (windowRatio * 3.3);
  }
  // const width = window.innerWidth / 5.5;
  height = width * 0.619;
  for (let i = 0; i < NUMBER_OF_VIDS; i += 1) {
    const name = `player${i}`;
    const div = document.createElement('div');
    div.id = name;
    div.classList.add('video');

    div.style.height = `${height}px`;
    div.style.width = `${width}px`;
    div.style.width = `${width}px`;
    // div.style.background = 'black';
    div.style.border = '1px solid black';
    div.style.display = 'inline-block';
    // div.style.margin = ``;
    content.appendChild(div);
  }
}

initializeScreenSize();

function fadeSplash() {
  // const splash = document.querySelector('#splash');
  // splash.classList.add('faded');
}

let totalInitialPlayed = 0;
let splashFaded = false;

function handleStateChange(event) {
  if (event.data === 1) {
    event.target.setPlaybackQuality('240p');
    if (totalInitialPlayed > 15) {
      return;
    }
    totalInitialPlayed += 1;
    if (splashFaded === false) {
      fadeSplash();
      splashFaded = true;
    }
    if (totalInitialPlayed === 7) {
      return loadBlock(8, 12); // eslint-disable-line
    }
    if (totalInitialPlayed === 11) {
      return loadBlock(12, 16); // eslint-disable-line
    }
    if (totalInitialPlayed > 12) {
      setTimeout(() => cycleOne, 30000);
    }
  }
}

const remainingInitial = [...Array(16).keys()];

function loadBlock(start, stop) {
  for (let i = start; i < stop; i += 1) {
    if (remainingInitial.length > 0) {
      const videoToLoad = removeRandomFromArray(initialLoaded);
      const randomPlayer = removeRandomFromArray(remainingInitial);
      const name = `player${randomPlayer}`;
      window.players[i] = new YT.Player(name, { // eslint-disable-line
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          showinfo: 0,
          rel: 0,
          playsinline: 1,
        },
        height,
        width,
        events: {
          onReady: (event) => {
            event.target.loadVideoById(videoToLoad.id, 0, 'tiny');
            event.target.setVolume(0);
            const volume = getRandomNumBetween(
              INITIAL_VOLUMES[videoToLoad.type].min,
              INITIAL_VOLUMES[videoToLoad.type].max,
            );
            fadeIn(event.target, RAMP_UP_DURATION, volume);
            document.getElementById(name).style.border = 'none';
          },
          onStateChange: handleStateChange,
        },
      });
      window.players[i].type = videoToLoad.id.type;
    }
  }
}

window.onYouTubeIframeAPIReady = function() { // eslint-disable-line
  loadBlock(0, 8);
};

// window.onYouTubeIframeAPIReady = function() { // eslint-disable-line
//   for (let i = 0; i < NUMBER_OF_VIDS; i += 1) {
//     const videoToLoad = removeRandomFromArray(initialLoaded);
//     const randomPlayer = removeRandomFromArray(remainingInitial);
//     const name = `player${randomPlayer}`;
//     const div = document.createElement('div');
//     const content = document.getElementById('content');
//     content.appendChild(div);
//     const volume = getRandomNumBetween(
//       INITIAL_VOLUMES[videoToLoad.type].min,
//       INITIAL_VOLUMES[videoToLoad.type].max,
//     );
//     players[i] = new YT.Player(name, { // eslint-disable-line
//       playerVars: {
//         autoplay: 1,
//         controls: 0,
//         modestbranding: 1,
//         showinfo: 0,
//         rel: 0,
//       },
//       height,
//       width,
//       events: {
//         onReady: (event) => {
//           event.target.loadVideoById(videoToLoad.id, 0, 'tiny');
//           event.target.setVolume(0);
//           const volume = getRandomNumBetween(
//             INITIAL_VOLUMES[videoToLoad.type].min,
//             INITIAL_VOLUMES[videoToLoad.type].max,
//           );
//           fadeIn(event.target, RAMP_UP_DURATION, volume);
//           document.getElementById(name).style.border = 'none';
//         },
//         onStateChange: handleStateChange,
//       },
//     });
//   }
//   const nextCycle = getCycleDelay(AVERAGE_TIME_DELAY);
//   setTimeout(cycleOne, nextCycle);
// };
