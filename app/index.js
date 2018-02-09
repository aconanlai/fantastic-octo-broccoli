import {
  shuffle,
  getRandomNum,
  getRandomNumBetween,
  removeRandomFromArray,
  getCycleDelay,
  fadeOut,
  fadeIn,
} from './utils';

let videos = [];
let playedVideos = [];
const players = [];

const RELAXATION_MUSIC = 'relaxation%20music';
const NATURE_SOUNDS = 'nature%20sounds';
const MOTIVATIONAL_SPEECH = 'motivational%20speech';
const NUMBER_OF_VIDS = 2;
const INITIAL_VOLUME_FLOOR = 60;
const AVERAGE_TIME_DELAY = 20; // 150

async function getType(type) {
  const results = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${type}&type=video&videoEmbeddable=true&maxResults=50&key=AIzaSyBlCAvG8b1EN6BRnjkW20-gyvpNNO7uhac`)
  const json = await results.json();
  return json.items.map(item => item.id.videoId);
}

async function initialize() {
  const [relaxation, nature, motivational] = await Promise.all([
    getType(RELAXATION_MUSIC),
    getType(NATURE_SOUNDS),
    getType(MOTIVATIONAL_SPEECH),
  ]);

  const firstRandomNum = getRandomNum(10);
  const secondRandomNum = getRandomNum(16 - 10);
  const thirdRandomNum = 16 - secondRandomNum - firstRandomNum;

  for (let i = 0; i < firstRandomNum; i += 1) {
    playedVideos.push(removeRandomFromArray(relaxation));
  }

  for (let i = 0; i < secondRandomNum; i += 1) {
    playedVideos.push(removeRandomFromArray(nature));
  }

  for (let i = 0; i < thirdRandomNum; i += 1) {
    playedVideos.push(removeRandomFromArray(motivational));
  }

  playedVideos = shuffle(playedVideos);

  videos = [...videos, ...relaxation, ...nature, ...motivational];
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

initialize();

function loadNewVideo(player) {
  const newVideo = removeRandomFromArray(videos);
  player.loadVideoById(newVideo);
  playedVideos.push(newVideo);
}

async function cycleOne() {
  const random = getRandomNum(players.length);
  const player = players[random];
  await fadeOut(player);
  loadNewVideo(player);
  fadeIn(player);
  const nextCycle = getCycleDelay(AVERAGE_TIME_DELAY);
  setTimeout(cycleOne, nextCycle);
}

window.onYouTubeIframeAPIReady = function() { // eslint-disable-line
  const width = window.innerWidth / 4;
  const height = width * 0.619;
  for (let i = 0; i < NUMBER_OF_VIDS; i += 1) {
    const name = `player${i}`;
    const div = document.createElement('div');
    div.id = name;
    div.classList.add('video');
    const content = document.getElementById('content');
    content.appendChild(div);
    const volume = getRandomNumBetween(INITIAL_VOLUME_FLOOR, 100);
    players[i] = new YT.Player(name, { // eslint-disable-line
      playerVars: {
        autoplay: 1,
        controls: 0,
        modestbranding: 1,
        showinfo: 0,
        rel: 0,
      },
      height,
      width,
      videoId: playedVideos[i],
      events: {
        onReady: (event) => {
          event.target.setVolume(volume);
        },
      },
    });
  }
  const nextCycle = getCycleDelay(AVERAGE_TIME_DELAY);
  setTimeout(cycleOne, nextCycle);
};

const playButton = document.querySelector('#playButton');
playButton.addEventListener('click', () => {
  for (let i = 0; i < NUMBER_OF_VIDS; i += 1) {
    players[i].playVideo();
  }
});

