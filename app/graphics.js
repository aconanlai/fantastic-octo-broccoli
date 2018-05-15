import {
  getParameterByName,
  shuffle,
} from './utils';

const TITLE_DURATION = Number(getParameterByName('TITLE_DURATION')) || 600;
const BACKGROUND_SPEED = Number(getParameterByName('BACKGROUND_SPEED')) || 30;

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

function updateGradient() {
  const c0_0 = colors[colorIndices[0]];
  const c0_1 = colors[colorIndices[1]];
  const c1_0 = colors[colorIndices[2]];
  const c1_1 = colors[colorIndices[3]];

  const istep = 1 - step;
  const r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
  const g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
  const b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
  const color1 = `rgb(${r1}, ${g1}, ${b1})`;

  const r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
  const g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
  const b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
  const color2 = `rgb(${r2}, ${g2}, ${b2})`;

  document.body.style.background = `linear-gradient(${color1}, ${color2})`;
  step += gradientSpeed;
  if (step >= 1) {
    step %= 1;
    colorIndices[0] = colorIndices[1]; // eslint-disable-line
    colorIndices[2] = colorIndices[3]; // eslint-disable-line

    // pick two new target color indices
    // do not pick the same as the current one
    colorIndices[1] = (colorIndices[1] + Math.floor((1 + Math.random()) * (colors.length - 1)))
      % colors.length;
    colorIndices[3] = (colorIndices[3] + Math.floor((1 + Math.random()) * (colors.length - 1)))
      % colors.length;
  }
}

export default function initializeGraphics() {
  setInterval(updateGradient, BACKGROUND_SPEED);
  const title = document.querySelector('#header-title');
  title.style['animation'] = `color-change ${TITLE_DURATION}s infinite`;
}
