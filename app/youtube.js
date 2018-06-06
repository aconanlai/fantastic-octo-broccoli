import {
  getParameterByName,
  shuffle,
  getRandomNum,
  getRandomNumBetween,
  getRandomNumNear,
  removeRandomFromArray,
  getCycleDelay,
  fadeOutYoutube,
  fadeInYoutube,
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

const OPACITY_CYCLE_DURATION = Number(getParameterByName('OPACITY_CYCLE_DURATION')) || 30;
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

export default async function initializeYoutube() {
  initializeScreenSize();
  const [relaxation, nature, meditation] = await Promise.all([
    getType(RELAXATION_MUSIC, 'relaxation'),
    getType(NATURE_SOUNDS, 'nature'),
    getType(GUIDED_MEDITATION, 'meditation'),
  ]);

  videosQueued.relaxation = relaxation;
  videosQueued.nature = nature;
  videosQueued.meditation = meditation;

  // const selectedRelaxation = removeRandomFromArray(relaxation);
  // videosPlayed.relaxation.push(selectedRelaxation);
  // initialLoaded.push(selectedRelaxation);

  // const selectedNature = removeRandomFromArray(nature);
  // videosPlayed.nature.push(selectedNature);
  // initialLoaded.push(selectedNature);

  // const selectedMeditation = removeRandomFromArray(meditation);
  // videosPlayed.meditation.push(selectedMeditation);
  // initialLoaded.push(selectedMeditation);

  const selected1 = removeRandomFromArray(nature);
  videosPlayed.nature.push(selected1);
  initialLoaded.push(selected1);
  const selected2 = removeRandomFromArray(nature);
  videosPlayed.nature.push(selected2);
  initialLoaded.push(selected2);
  const selected3 = removeRandomFromArray(nature);
  videosPlayed.nature.push(selected3);
  initialLoaded.push(selected3);

  initialLoaded = shuffle(initialLoaded);

  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

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
  // const remainingCategories = Object.keys(videosQueued).filter((category) => {
  //   return videosQueued[category].length > 0;
  // });
  // if (remainingCategories.length === 0) {
  //   resetVideos();
  //   return findAvailableVideoType();
  // }
  // const randomNum = getRandomNum(remainingCategories.length);
  // return remainingCategories[randomNum];
  if (videosQueued.nature.length === 0) {
    resetVideos();
    return findAvailableVideoType();
  }
  return 'nature';
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
  await fadeOutYoutube(player, RAMP_DOWN_DURATION);
  const type = loadNewVideo(player);
  const newVolume = getRandomNumBetween(
    INITIAL_VOLUMES[type].min,
    INITIAL_VOLUMES[type].max,
  );
  await fadeInYoutube(player, RAMP_UP_DURATION, newVolume);
  const nextCycle = getCycleDelay(AVERAGE_TIME_DELAY);
  setTimeout(cycleOne, nextCycle);
}

const opacityDirections = [0, 1, 0];

function cycleOpacity() {
  for (let i = 0; i < 3; i += 1) {
    const div = document.getElementById(`player${i}`);
    const style = window.getComputedStyle(div);
    const opacity = Number(style.getPropertyValue('opacity'));
    if (opacityDirections[i] === 1) {
      if (opacity > 0.7) {
        opacityDirections[i] = 0;
      } else {
        div.style.opacity = opacity + 0.15;
      }
    }

    if (opacityDirections[i] === 0) {
    // opacity going down
      if (opacity < 0.2) {
        opacityDirections[i] = 1;
        div.style.opacity = opacity + 0.15;
      } else {
        div.style.opacity = opacity - 0.15;
      }
    }
  }
}

function initializeScreenSize() {
  const opacitys = [
    getRandomNumBetween(2, 7) / 10,
    getRandomNumBetween(2, 7) / 10,
    getRandomNumBetween(2, 7) / 10,
  ];

  const content = document.getElementById('content');
  width = window.innerWidth * 0.9;
  height = width * 0.619;
  content.style.width = `${width}px`;
  content.style.height = `${height}px`;
  for (let i = 0; i < 3; i += 1) {
    const name = `player${i}`;
    const div = document.createElement('div');
    div.id = name;
    div.classList.add('video');

    div.style.height = `${height}px`;
    div.style.width = `${width}px`;
    div.style.width = `${width}px`;
    div.style.opacity = opacitys[i];
    // div.style.background = 'black';
    // div.style.border = '1px solid black';
    // div.style.margin = ``;
    content.appendChild(div);
  }
  setInterval(cycleOpacity, 5000);
}

function fadeSplash() {
  // const splash = document.querySelector('#splash');
  // splash.classList.add('faded');
}

let totalInitialPlayed = 0;
let splashFaded = false;

function loadInitial() {
  console.log('loadi nitial')
  for (let i = 0; i < 3; i += 1) {
    const videoToLoad = removeRandomFromArray(initialLoaded);
    const name = `player${i}`;
    console.log(width);
    console.log(height);
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
          fadeInYoutube(event.target, RAMP_UP_DURATION, volume);
          document.getElementById(name).style.border = 'none';
        },
        // onStateChange: handleStateChange,
      },
    });
    window.players[i].type = videoToLoad.id.type;
  }
  setTimeout(cycleOne, 20000);
}

window.onYouTubeIframeAPIReady = function() { // eslint-disable-line
  console.log('youtube API ready')
  loadInitial();
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
