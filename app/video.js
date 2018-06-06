import {
  requestInterval,
  throttle,
} from './utils';

const opacityDirections = [0, 1, 0];

function cycleOpacity() {
  for (let i = 0; i < 3; i += 1) {
    const div = document.getElementById(`video${i}`);
    console.log(`video${i}`);
    console.log(div);
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

function findWindowSize() {
  console.log('find window size');
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  const ratio = windowHeight / windowWidth;

  const videos = document.getElementsByClassName('video');
  console.log(ratio)
  if (ratio >= 1.2) {
    for (let i = 0; i < videos.length; i += 1) {
      videos[i].style.height = '200vh';
      videos[i].style.width = 'auto';
    }
  } else if (ratio > 0.75 && ratio < 1.2) {
    for (let i = 0; i < videos.length; i += 1) {
      videos[i].style.height = '120vh';
      videos[i].style.width = 'auto';
    }
  } else {
    for (let i = 0; i < videos.length; i += 1) {
      videos[i].style.height = 'auto';
      videos[i].style.width = '150vw';
    }
  }
}

const throttledFindWindowSize = throttle((e) => {
  findWindowSize();
}, 1000);

export default async function initializeVideos() {
  findWindowSize();
  requestInterval(cycleOpacity, 5000);
  window.addEventListener('resize', throttledFindWindowSize);
}
