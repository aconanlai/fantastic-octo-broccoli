export default class AudioPlayer {
  constructor(url, loadAndFadeInNewAudio) {
    this.audio = new Audio(url);
    this.audio.volume = 0;
    this.loadAndFadeInNewAudio = loadAndFadeInNewAudio;
    this.audio.addEventListener('ended', () => {
      console.log(`video with id ${this.audio.src} ended, instantiating new`)
      loadAndFadeInNewAudio(this);
    });
  }

  play() {
    this.audio.play();
  }

  fade(start, finish, ms) {
    return new Promise((resolve) => {
      this.volume(start);
      let seconds = ms / 1000;
      const increment = (finish - start) / seconds;
      const interval = setInterval(() => {
        if (finish > start) {
          this.volume(this.audio.volume + increment);
        } else {
          this.volume(this.audio.volume - increment);
        }
        seconds -= 1;
        if (seconds < 1) {
          console.log(`fade complete after ${ms} millisseconds`);
          clearInterval(interval);
          resolve();
        }
      }, 1000);
    });
  }

  fadeOut(duration) {
    const vol = this.audio.volume;
    return this.fade(vol, 0, duration);
  }

  fadeIn(targetVol, duration) {
    return this.fade(0, targetVol, duration);
  }

  changeSrc(src) {
    this.audio.src = src;
  }

  volume(vol) {
    const realVol = Math.min(vol, 1);
    this.audio.volume = realVol;
  }

  getVolume() {
    return this.audio.volume;
  }
}
