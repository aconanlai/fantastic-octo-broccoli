export default function initializeState() {
  const state = {
    isMobile: false,
    isMobileAudioPlaying: false,
    imagesPlaying: true,
    imageFadeOutInitiated: false,
    videoPlaying: false,
    gifsPlaying: false,
  };

  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    state.isMobile = true;
    const mobileText = document.querySelector('#mobileText');
    const intro = document.querySelector('#intro-wrapper');
    mobileText.style.display = 'block';
    intro.style.display = 'none';
  } else {
    const start = document.querySelector('#startButton');
    const best = document.querySelector('#best-viewed-text');
    start.style.display = 'block';
    best.style.display = 'block';
  }

  return state;
}
