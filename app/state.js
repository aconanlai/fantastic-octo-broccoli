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
  }

  return state;
}
