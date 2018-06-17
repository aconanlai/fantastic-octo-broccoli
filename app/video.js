import {
  requestInterval,
  getRandomNum,
  removeRandomFromArray,
} from './utils';

import videos from './videos.json';

const opacityDirections = [0, 1, 0];

function cycleOpacity() {
  for (let i = 0; i < 3; i += 1) {
    const div = document.getElementById(`video${i}`);
    if (!div.isCycling) {
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
        if (opacity < 0.3) {
          opacityDirections[i] = 1;
          div.style.opacity = opacity + 0.15;
        } else {
          div.style.opacity = opacity - 0.15;
        }
      }
    }
  }
}

let videosToPlay = videos;
let videosPlayed = [];

function buildVideoPath(filename) {
  const videoPath = 'video';
  // const videoPath = 'http://riajv.adambasanta.com';
  return `${videoPath}/${filename}`;
}

function buildImagePath(filename) {
  const imagePath = 'image';
  return `${imagePath}/${filename}`;
}

function selectRandomVideo() {
  if (videosToPlay.length === 0) {
    videosToPlay = [...videosPlayed];
    videosPlayed = [];
  }
  const item = removeRandomFromArray(videosToPlay);
  videosPlayed.push(item);
  return buildVideoPath(item);
}

async function cycleVideo() {
  const random = getRandomNum(3);
  const videoPlayer = document.querySelector(`#video${random}`);
  const randomPath = selectRandomVideo();
  videoPlayer.isCycling = true;
  videoPlayer.opacity = 0;
  setTimeout(() => {
    videoPlayer.src = randomPath;
    videoPlayer.play();
    videoPlayer.opacity = 0.4;
    videoPlayer.isCycling = false;
  }, 5000);
}

function setInitialImages() {
  // TODO:
}

function setInitialGifs(state) {
  // TODO:
  if (!state.gifsPlaying) {
    state.gifsPlaying = true;

    // remove videos
    const vids = document.querySelectorAll('.video');
    vids.forEach((vid) => {
      vid.parentNode.removeChild(vid);
    });

    for (let index = 0; index < 3; index += 1) {
      const gifObject = document.createElement('img');
      gifObject.classList += 'gif';
      const src = buildImagePath(`${index}.gif`);
      gifObject.src = src;
      document.querySelector('body').appendChild(gifObject);
      gifObject.style.opacity = 0.5;
    }
  }
}

function fadeOutImages(state, initializeAudio) {
  if (!state.imageFadeOutInitiated) {
    initializeAudio(state);
    requestInterval(cycleVideo, 30000);
    requestInterval(cycleOpacity, 5000);
    state.imageFadeOutInitiated = true;
    const images = document.querySelectorAll('.image');
    images.forEach((image) => {
      image.style.opacity = 0;
    });
    setTimeout(() => {
      state.imagesPlaying = false;
    }, 10000);
  }
}

function setInitialVideos(state, initializeAudio) {
  if (state.isMobile) {
    setInitialGifs(state);
    fadeOutImages(state, initializeAudio);
    return;
  }
  const vids = document.querySelectorAll('.video');
  for (let index = 0; index < vids.length; index += 1) {
    const element = vids[index];
    const videoToPlay = selectRandomVideo();
    element.src = videoToPlay;
    element.play()
      .then((success) => {
        // TODO: start fading out images
        // throw new Error();
        // console.log('playing video success');
        state.videoPlaying = true;
        fadeOutImages(state, initializeAudio);
      })
      .catch((err) => {
        // TODO: switch to GIF mode
        setInitialGifs(state);
        fadeOutImages(state, initializeAudio);
        return null;
      });
  }
}

export default async function initializeVideos(state, initializeAudio) {

  setInitialImages();
  setInitialVideos(state, initializeAudio);
  // TODO: handle jpg and gif fallback
}
