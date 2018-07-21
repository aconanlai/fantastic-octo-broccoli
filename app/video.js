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
  // const videoPath = 'https://d3ngapjou6irsp.cloudfront.net';
  return `${videoPath}/${filename}`;
}

function buildImagePath(filename) {
  // const imagePath = 'https://d1hrqqb6z8fafj.cloudfront.net';
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

function setInitialGifs(state) {
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

function fadeOutImages(state, initializeAudio, videoSuccess) {
  if (!state.imageFadeOutInitiated) {
    state.imageFadeOutInitiated = true;
    initializeAudio(state);
    if (videoSuccess) {
      requestInterval(cycleVideo, 30000);
      requestInterval(cycleOpacity, 5000);
    }
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
    fadeOutImages(state, initializeAudio, false);
    return;
  }
  const vids = document.querySelectorAll('.video');
  for (let index = 0; index < vids.length; index += 1) {
    const element = vids[index];
    const videoToPlay = selectRandomVideo();
    element.src = videoToPlay;

    const playPromise = element.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        state.videoPlaying = true;
        // console.log('promsioe fhere')
        // throw new Error();
        fadeOutImages(state, initializeAudio, true);
      }).catch((err) => {
        console.log(err)
        setInitialGifs(state);
        fadeOutImages(state, initializeAudio, false);
        return null;
      });
    } else {
      setInitialGifs(state);
      fadeOutImages(state, initializeAudio, false);
    }
  }
}

export default async function initializeVideos(state, initializeAudio) {
  setInitialVideos(state, initializeAudio);
}
