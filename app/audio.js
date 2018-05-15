import {
  getParameterByName,
  getRandomNum,
  getRandomNumBetween,
  removeRandomFromArray,
  shuffle,
  fadeOutAudio,
  fadeInAudio,
  getCycleDelay,
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
  return `/media/${type}/${filename}`;
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
  audio.src = buildFilepath(category, newAudio);
  audioPlayed[category].push(newAudio);
  return category;
}

async function cycleOne() {
  const random = getRandomNum(window.players.length);
  const audio = window.audios[random];
  await fadeOutAudio(audio, RAMP_DOWN_DURATION);
  const type = loadNewAudio(audio);
  audio.volume = 0;
  audio.play();
  const newVolume = getRandomNumBetween(
    INITIAL_VOLUMES[type].min,
    INITIAL_VOLUMES[type].max,
  );
  await fadeInAudio(audio, RAMP_UP_DURATION, newVolume);
  const nextCycle = getCycleDelay(AVERAGE_TIME_DELAY);
  setTimeout(cycleOne, nextCycle);
}

export default function initializeAudios() {
  const { relaxation, naturesounds, meditation } = files;
  audioQueued.relaxation = [...relaxation];
  audioQueued.meditation = [...meditation];
  audioQueued.naturesounds = [...naturesounds];

  let initialLoaded = [];

  const firstRandomNum = getRandomNumBetween(4, 7);
  const secondRandomNum = getRandomNumBetween(4, 7);
  const thirdRandomNum = 16 - secondRandomNum - firstRandomNum;

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

  const targetDiv = document.getElementById('audios');

  for (let i = 0; i < 13; i += 1) {
    const newAudio = document.createElement('audio');
    window.audios.push(newAudio);
    const audioToLoad = initialLoaded[i];
    const volume = (getRandomNumBetween(
      INITIAL_VOLUMES[audioToLoad.type].min,
      INITIAL_VOLUMES[audioToLoad.type].max,
    ) / 100);
    newAudio.volume = volume;
    newAudio.src = buildFilepath(audioToLoad.type, audioToLoad.filename);
    targetDiv.appendChild(newAudio);
    newAudio.play();
    fadeInAudio(newAudio, RAMP_UP_DURATION, volume);
  }

  setTimeout(() => cycleOne, 30000);
}
