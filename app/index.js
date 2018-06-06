import initializeAudios from './audio';
import initializeGraphics from './graphics';
import initializeYoutube from './youtube';
import initializeVideo from './video';

let isMobile = false;
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  isMobile = true;
}

initializeAudios({ isMobile });
initializeGraphics();
initializeVideo();
// initializeYoutube();
