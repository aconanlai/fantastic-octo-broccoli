import initializeAudios from './audio';
import initializeGraphics from './graphics';
// import initializeYoutube from './youtube';
import initializeState from './state';
import initializeVideo from './video';

const state = initializeState();

initializeGraphics();
initializeVideo(state, initializeAudios);
// initializeYoutube();
