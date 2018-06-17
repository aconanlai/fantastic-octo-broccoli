import {
  getParameterByName,
  shuffle,
  getRandomOpacity,
  requestInterval,
} from './utils';

const TITLE_DURATION = Number(getParameterByName('TITLE_DURATION')) || 600;
const BACKGROUND_SPEED = Number(getParameterByName('BACKGROUND_SPEED')) || 60;

// const playButton = document.querySelector('#playButton');
// playButton.addEventListener('click', () => {
//   for (let i = 0; i < NUMBER_OF_VIDS; i += 1) {
//     window.players[i].playVideo();
//   }
// });

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
  // const c0_0 = colors[colorIndices[0]];
  // const c0_1 = colors[colorIndices[1]];
  // const c1_0 = colors[colorIndices[2]];
  // const c1_1 = colors[colorIndices[3]];

  const t0_0 = titleColors[titleColorIndices[0]];
  const t0_1 = titleColors[titleColorIndices[1]];
  const t1_0 = titleColors[titleColorIndices[2]];
  const t1_1 = titleColors[titleColorIndices[3]];

  const istep = 1 - step;
  // const r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
  // const g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
  // const b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
  // const color1 = `rgb(${r1}, ${g1}, ${b1})`;

  // const r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
  // const g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
  // const b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
  // const color2 = `rgb(${r2}, ${g2}, ${b2})`;

  const title_r1 = Math.round(istep * t0_0[0] + step * t0_1[0]);
  const title_g1 = Math.round(istep * t0_0[1] + step * t0_1[1]);
  const title_b1 = Math.round(istep * t0_0[2] + step * t0_1[2]);
  const title_color1 = `rgb(${title_r1}, ${title_g1}, ${title_b1})`;

  const title_r2 = Math.round(istep * t1_0[0] + step * t1_1[0]);
  const title_g2 = Math.round(istep * t1_0[1] + step * t1_1[1]);
  const title_b2 = Math.round(istep * t1_0[2] + step * t1_1[2]);
  const title_color2 = `rgb(${title_r2}, ${title_g2}, ${title_b2})`;

  // document.body.style.background = `linear-gradient(${color1}, ${color2})`;
  const headerTitle = document.querySelector('#header-title');
  headerTitle.style['background-image'] = `linear-gradient(${title_color1}, ${title_color2})`;
  step += gradientSpeed;
  if (step >= 1) {
    step %= 1;




    // colorIndices[0] = colorIndices[1]; // eslint-disable-line
    // colorIndices[2] = colorIndices[3]; // eslint-disable-line

    // // pick two new target color indices
    // // do not pick the same as the current one
    // colorIndices[1] = (colorIndices[1] + Math.floor((1 + Math.random()) * (colors.length - 1)))
    //   % colors.length;
    // colorIndices[3] = (colorIndices[3] + Math.floor((1 + Math.random()) * (colors.length - 1)))
    //   % colors.length;


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

function handleEyeClick() {
  eye.style.opacity = 0;
  eye.style.display = 'none';
  x.style.display = 'block';
  x.style.opacity = 1;
  modal.style.opacity = 0.7;
  modaltext.style.opacity = 1;
}

function handleXClick() {
  x.style.opacity = 0;
  x.style.display = 'none';
  eye.style.display = 'block';
  eye.style.opacity = 1;
  modal.style.opacity = 0;
  modaltext.style.opacity = 0;
}


export default function initializeGraphics() {
  eye.addEventListener('click', handleEyeClick);
  x.addEventListener('click', handleXClick);

  requestInterval(updateGradient, BACKGROUND_SPEED);
  requestInterval(cycleTitleOpacity, 10000);
}

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
      console.log(newOpacity);
      opacityCeiling = newOpacity;
      title.style.opacity = opacity + 0.15;
    } else {
      title.style.opacity = opacity - 0.15;
    }
  }
}
