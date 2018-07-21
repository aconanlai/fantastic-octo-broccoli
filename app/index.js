import initializeAudios from './audio';
import './graphics';
// import initializeYoutube from './youtube';
import initializeState from './state';
import initializeVideo from './video';

const state = initializeState();

window.Howler.mobileAutoEnable = false;

// initializeGraphics();
initializeVideo(state, initializeAudios);
// initializeYoutube();
