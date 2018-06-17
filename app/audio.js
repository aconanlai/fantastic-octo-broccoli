import { Howl } from 'howler';
import {
  getParameterByName,
  getRandomNum,
  getRandomNumBetween,
  removeRandomFromArray,
  shuffle,
  fadeOutAudio,
  fadeInAudio,
  getCycleDelay,
  requestInterval,
} from './utils';

import files from './files.json';

const RAMP_DOWN_DURATION = Number(getParameterByName('RAMP_DOWN_DURATION')) || 10;
const RAMP_UP_DURATION = Number(getParameterByName('RAMP_UP_DURATION')) || 10;
// const INITIAL_VOLUME_FLOOR = Number(getParameterByName('INITIAL_VOLUME_FLOOR')) || 60;
const AVERAGE_TIME_DELAY = Number(getParameterByName('AVERAGE_TIME_DELAY')) || 30; // 150
const INITIAL_VOLUMES = {
  relaxation: {
    min: Number(getParameterByName('RELAXATION_MIN_VOLUME')) || 80,
    max: Number(getParameterByName('RELAXATION_MAX_VOLUME')) || 100,
  },
  naturesounds: {
    min: Number(getParameterByName('NATURE_MIN_VOLUME')) || 80,
    max: Number(getParameterByName('NATURE_MAX_VOLUME')) || 100,
  },
  meditation: {
    min: Number(getParameterByName('MEDITATION_MIN_VOLUME')) || 70,
    max: Number(getParameterByName('MEDITATION_MAX_VOLUME')) || 90,
  },
};

const NUMBER_OF_AUDIOS = Number(getParameterByName('RAMP_DOWN_DURATION')) || 18;

window.audios = [];

let audioPlayed = {
  relaxation: [],
  meditation: [],
  naturesounds: [],
};

let audioQueued = {
  relaxation: [],
  meditation: [],
  naturesounds: [],
};

function resetAudio() {
  audioQueued = {
    relaxation: [...audioPlayed.relaxation],
    nature: [...audioPlayed.nature],
    meditation: [...audioPlayed.meditation],
  };
  audioPlayed = {
    relaxation: [],
    nature: [],
    meditation: [],
  };
}

function buildFilepath(type, filename) {
  // return `audio/${type}/${filename}`;
  return filename;
}

function findAvailableAudioType() {
  const remainingCategories = Object.keys(audioQueued).filter((category) => {
    return audioQueued[category].length > 0;
  });
  if (remainingCategories.length === 0) {
    resetAudio();
    return findAvailableAudioType();
  }
  const randomNum = getRandomNum(remainingCategories.length);
  return remainingCategories[randomNum];
}

function loadNewAudio(audio) {
  const category = findAvailableAudioType();
  const newAudio = removeRandomFromArray(audioQueued[category]);
  const src = buildFilepath(category, newAudio);
  audio.unload();
  audio = new Howl({
    src,
    loop: true,
    html5: true,
  }).play();
  audioPlayed[category].push(newAudio);
  return category;
}

async function cycleOne() {
  const random = getRandomNum(window.audios.length);
  const audio = window.audios[random];
  audio.isCycling = true;
  await fadeOutAudio(audio, RAMP_DOWN_DURATION);
  const type = loadNewAudio(audio);
  audio.volume(0);
  audio.play();
  const newVolume = getRandomNumBetween(
    INITIAL_VOLUMES[type].min,
    INITIAL_VOLUMES[type].max,
  ) / 100;
  await fadeInAudio(audio, RAMP_UP_DURATION, newVolume);
  setTimeout(() => {
    audio.isCycling = false;
  }, RAMP_UP_DURATION * 1000);
  const nextCycle = getCycleDelay(AVERAGE_TIME_DELAY);
  setTimeout(cycleOne, nextCycle);
}

function cycleVolume() {
  for (let i = 0; i < NUMBER_OF_AUDIOS; i += 1) {
    const audio = window.audios[i];
    if (!audio.isCycling) {
      const targetVolume = (getRandomNumBetween(3, 10) / 10);
      const currentVolume = audio.volume();
      console.log(targetVolume);
      console.log(currentVolume);
      audio.fade(currentVolume, targetVolume, 10000);
    }
  }
}

export default function initializeAudios(state) {
  console.log('initializing audio');
  const { isMobile } = state;
  const { relaxation, naturesounds, meditation } = files;
  audioQueued.relaxation = [...relaxation];
  audioQueued.meditation = [...meditation];
  audioQueued.naturesounds = [...naturesounds];

  let initialLoaded = [];

  const firstRandomNum = getRandomNumBetween(4, 8);
  const secondRandomNum = getRandomNumBetween(4, 7);
  const thirdRandomNum = 18 - secondRandomNum - firstRandomNum;

  for (let i = 0; i < firstRandomNum; i += 1) {
    const selected = removeRandomFromArray(relaxation);
    audioPlayed.relaxation.push(selected);
    initialLoaded.push({
      type: 'relaxation',
      filename: selected,
    });
  }

  for (let i = 0; i < secondRandomNum; i += 1) {
    const selected = removeRandomFromArray(naturesounds);
    audioPlayed.naturesounds.push(selected);
    initialLoaded.push({
      type: 'naturesounds',
      filename: selected,
    });
  }

  for (let i = 0; i < thirdRandomNum; i += 1) {
    const selected = removeRandomFromArray(meditation);
    audioPlayed.meditation.push(selected);
    initialLoaded.push({
      type: 'meditation',
      filename: selected,
    });
  }

  initialLoaded = shuffle(initialLoaded);

  function playAll() {
    for (let i = 0; i < NUMBER_OF_AUDIOS; i += 1) {
      window.audios[i].play();
    }
  }

  for (let i = 0; i < NUMBER_OF_AUDIOS; i += 1) {
    // const newAudio = document.createElement('audio');
    // newAudio.id = `audio${i}`;
    // window.audios.push(newAudio);
    const audioToLoad = initialLoaded[i];
    // const volume = (getRandomNumBetween(
    //   INITIAL_VOLUMES[audioToLoad.type].min,
    //   INITIAL_VOLUMES[audioToLoad.type].max,
    // ) / 100);
    // newAudio.volume = volume;
    // newAudio.src = buildFilepath(audioToLoad.type, audioToLoad.filename);
    // newAudio.preload = 'true';
    // targetDiv.appendChild(newAudio);
    // newAudio.play();
    // fadeInAudio(newAudio, RAMP_UP_DURATION, volume);

    const src = buildFilepath(audioToLoad.type, audioToLoad.filename);
    const sound = new Howl({
      src,
      loop: true,
      html5: true,
    });
    window.audios.push(sound);
  }
  if (!isMobile) {
    playAll();
    setTimeout(cycleOne, 30000);
  } else {
    document.addEventListener('click', () => {
      if (!state.isMobileAudioPlaying) {
        playAll();
        state.isMobileAudioPlaying = true;
      }
    });
  }
  requestInterval(cycleVolume, 10000);
}
