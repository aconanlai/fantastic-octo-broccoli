import {
  getParameterByName,
  shuffle,
  getRandomOpacity,
  requestInterval,
} from './utils';

const TITLE_DURATION = Number(getParameterByName('TITLE_DURATION')) || 600;
const BACKGROUND_SPEED = Number(getParameterByName('BACKGROUND_SPEED')) || 60;

// gradient

const colors = shuffle([
  [62, 35, 255],
  [60, 255, 60],
  [255, 35, 98],
  [45, 175, 230],
  [255, 0, 255],
  [255, 128, 0],
  [255, 137, 161],
  [176, 255, 137],
  [137, 255, 217],
  [58, 88, 163],
  [162, 58, 72],
]);

let step = 0;
// color table indices for:
// current color left
// next color left
// current color right
// next color right
let colorIndices = [0, 1, 2, 3];

// transition speed
let gradientSpeed = 0.002;

// for title

const titleColors = shuffle([
  [62, 35, 255],
  [255, 35, 98],
  [45, 175, 230],
  [255, 0, 255],
  [255, 128, 0],
  [255, 137, 161],
  [176, 255, 137],
  [60, 255, 60],
  [137, 255, 217],
  [58, 88, 163],
  [162, 58, 72],
]);

let titleStep = 0;
// color table indices for:
// current color left
// next color left
// current color right
// next color right
let titleColorIndices = [0, 1, 2, 3];

// transition speed
let titleGradientSpeed = 0.002;

function updateGradient() {

  const t0_0 = titleColors[titleColorIndices[0]];
  const t0_1 = titleColors[titleColorIndices[1]];
  const t1_0 = titleColors[titleColorIndices[2]];
  const t1_1 = titleColors[titleColorIndices[3]];

  const istep = 1 - step;

  const title_r1 = Math.round(istep * t0_0[0] + step * t0_1[0]);
  const title_g1 = Math.round(istep * t0_0[1] + step * t0_1[1]);
  const title_b1 = Math.round(istep * t0_0[2] + step * t0_1[2]);
  const title_color1 = `rgb(${title_r1}, ${title_g1}, ${title_b1})`;

  const title_r2 = Math.round(istep * t1_0[0] + step * t1_1[0]);
  const title_g2 = Math.round(istep * t1_0[1] + step * t1_1[1]);
  const title_b2 = Math.round(istep * t1_0[2] + step * t1_1[2]);
  const title_color2 = `rgb(${title_r2}, ${title_g2}, ${title_b2})`;

  const headerTitle = document.querySelector('#header-title');
  headerTitle.style['background-image'] = `linear-gradient(${title_color1}, ${title_color2})`;
  step += gradientSpeed;
  if (step >= 1) {
    step %= 1;

    titleColorIndices[0] = titleColorIndices[1]; // eslint-disable-line
    titleColorIndices[2] = titleColorIndices[3]; // eslint-disable-line

    // pick two new target color indices
    // do not pick the same as the current one
    titleColorIndices[1] = (titleColorIndices[1] + Math.floor((1 + Math.random()) * (titleColors.length - 1)))
      % titleColors.length;
    titleColorIndices[3] = (titleColorIndices[3] + Math.floor((1 + Math.random()) * (titleColors.length - 1)))
      % titleColors.length;
  }
}

const title = document.querySelector('#header-title');
const eye = document.querySelector('#eye');
const x = document.querySelector('#x');
const modal = document.querySelector('#modal');
const modaltext = document.querySelector('#modaltext');
const fullscreenbutton = document.querySelector('#fullscreenbutton');

function handleEyeClick() {
  eye.style.opacity = 0;
  eye.style.display = 'none';
  x.style.display = 'block';
  x.style.opacity = 1;
  modal.style.opacity = 1;
  modaltext.style.opacity = 1;
  modaltext.style['z-index'] = 990;
  modal.style['z-index'] = 990;
}

function handleXClick() {
  x.style.opacity = 0;
  x.style.display = 'none';
  eye.style.display = 'block';
  eye.style.opacity = 1;
  modal.style.opacity = 0;
  modaltext.style.opacity = 0;
  setTimeout(() => {
    modaltext.style['z-index'] = 0;
    modal.style['z-index'] = 0;
  }, 1000);
}

function exitHandler() {
  fullscreenbutton.style.opacity = fullscreenbutton.style.opacity === '1' ? 0 : 1;
}

document.addEventListener('webkitfullscreenchange', exitHandler, false);
document.addEventListener('mozfullscreenchange', exitHandler, false);
document.addEventListener('fullscreenchange', exitHandler, false);
document.addEventListener('MSFullscreenChange', exitHandler, false);

function handleFullscreenClick() {
  const body = document.querySelector('body');
  if (body.requestFullscreen) {
    body.requestFullscreen();
  } else if (body.mozRequestFullScreen) { /* Firefox */
    body.mozRequestFullScreen();
  } else if (body.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    body.webkitRequestFullscreen();
  } else if (body.msRequestFullscreen) { /* IE/Edge */
    body.msRequestFullscreen();
  }
}

eye.addEventListener('click', handleEyeClick);
x.addEventListener('click', handleXClick);
fullscreenbutton.addEventListener('click', handleFullscreenClick);

window.initializeGraphics = () => {

  const start = document.querySelector('#startButton');
  const startWrapper = document.querySelectorAll('.start-wrapper')[0];
  startWrapper.style.opacity = 0;
  start.style.transition = 'all 10s';
  start.style.opacity = 0;
  fullscreenbutton.style.opacity = 1;
  setTimeout(() => {
    start.style.display = 'none';
    startWrapper.style.display = 'none';
  }, 10000);

  requestInterval(updateGradient, BACKGROUND_SPEED);
  requestInterval(cycleTitleOpacity, 10000);
};

let titleOpacityDirection = 1;
let opacityCeiling = 0.75;

function cycleTitleOpacity() {
  const style = window.getComputedStyle(title);
  const opacity = Number(style.getPropertyValue('opacity'));
  if (titleOpacityDirection === 1) {
    if (opacity > opacityCeiling) {
      titleOpacityDirection = 0;
    } else {
      title.style.opacity = opacity + 0.15;
    }
  }

  if (titleOpacityDirection === 0) {
    // opacity going down
    if (opacity < 0.2) {
      titleOpacityDirection = 1;
      const newOpacity = getRandomOpacity();
      opacityCeiling = newOpacity;
      title.style.opacity = opacity + 0.15;
    } else {
      title.style.opacity = opacity - 0.15;
    }
  }
}
