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

let videosToPlay = videos;
let videosPlayed = [];

function buildVideoPath(filename) {
  const videoPath = 'http://localhost:7777/video';
  return `${videoPath}/${filename}`;
}

function buildImagePath(filename) {
  const imagePath = 'http://localhost:7778/image';
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
  console.log('cycling video');
  const random = getRandomNum(3);
  const videoPlayer = document.querySelector(`#video${random}`);
  const randomPath = selectRandomVideo();
  videoPlayer.src = randomPath;
  videoPlayer.play();
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

function fadeOutImages(state) {
  if (!state.imageFadeOutInitiated) {
    console.log('fading out images');
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

function setInitialVideos(state) {
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
        fadeOutImages(state);
      })
      .catch((err) => {
        // TODO: switch to GIF mode
        setInitialGifs(state);
        fadeOutImages(state);
        return null;
      });
  }
}

export default async function initializeVideos(state) {
  // requestInterval(cycleOpacity, 5000);

  setInitialImages();
  setInitialVideos(state);
  // TODO: handle jpg and gif fallback
  // requestInterval(cycleVideo, 30000);
}
