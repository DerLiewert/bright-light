// Підключення функціоналу "Чертоги Фрілансера"
import { isMobile } from './functions.js';
// Підключення списку активних модулів
import { flsModules } from './modules.js';

// типа с сервера пришли, чтоб получить длину музыки для отображения и возможности двигать ползунок плеера,
// без предварительной загрузки самой музыки (как на музыкальных сайтах)
const tracks = [
  {
    id: 1,
    url: 'audio/Bright-Lights_Kaleena-Zanders_Kandy_-_War-For-Love.mp3',
    title: 'War For Love',
    artists: 'Bright Lights, Kaleena Zanders, Kandy',
    duration: 174.759184,
    isNew: true,
  },
  {
    id: 2,
    url: 'audio/3LAU_Bright-Lights_-_How-You-Love-Me.mp3',
    title: 'How You Love Me',
    artists: '3LAU, Bright Lights',
    duration: 210.520816,
    isNew: false,
  },
  {
    id: 3,
    url: 'audio/Pink-Is-Punk_Benny-Benassi_Bright-Lights_-_Ghost.mp3',
    title: 'Ghost',
    artists: 'Pink Is Punk, Benny Benassi, Bright Lights',
    duration: 219.9803,
    isNew: false,
  },
  {
    id: 4,
    url: 'audio/Hardwell_Dyro_Bright-Lights_-_Never-Say-Goodbye.mp3',
    title: 'Never Say Goodbye',
    artists: 'Hardwell, Dyro, Bright Lights',
    duration: 205.035102,
    isNew: false,
  },
  {
    id: 5,
    url: 'audio/Zeds-Dead_Dirtyphonics_Bright-Lights_-_Where-Are-You-Now.mp3',
    title: 'Where Are You Now',
    artists: 'Zeds Dead, Dirtyphonics, Bright Lights',
    duration: 267.284898,
    isNew: false,
  },
  {
    id: 6,
    url: 'audio/Zedd_Bright-Lights_-_Follow-You-Down.mp3',
    title: 'Follow You Down',
    artists: 'Zedd, Bright Lights',
    duration: 347.446667,
    isNew: false,
  },
];

// отображение треков в нужных блоках
function initIntroBlock() {
  let newSong = tracks.find((obj) => obj.isNew);
  if (!newSong) newSong = tracks[0];
  document.querySelector('.intro__title').innerHTML = newSong.title;
  document.querySelector('.intro__player').setAttribute('data-audio-src', newSong.url);
  setTimeInHTML(document.querySelector('.intro__player .player__time_diration'), newSong.duration);
}
initIntroBlock();

function initTracksBlock() {
  const tracksList = document.querySelector('.tracks__list');
  tracks.forEach((track) => {
    const li = document.createElement('li');
    li.classList.add('tracks__item');
    li.setAttribute('data-src', track.url);
    li.insertAdjacentText('beforeend', `${track.artists} - ${track.title}`);
    tracksList.insertAdjacentElement('beforeend', li);
  });

  setTimeInHTML(document.querySelector('.tracks .player__time_diration'), tracks[0].duration);
}
initTracksBlock();

function setTimeInHTML(timeBlock, timeSeconds = 0) {
  const minutes = Math.floor(timeSeconds / 60);
  const seconds = Math.floor(timeSeconds % 60);
  const timeToString = (value) => (value > 9 ? value : '0' + String(value));
  timeBlock.innerHTML = `${timeToString(minutes)}:${timeToString(seconds)}`;
}

//------------------- Работа плеера ----------------------
const players = document.querySelectorAll('.player');
let activePlayer = null;
players.forEach((player) => {
  const playButton = player.querySelector('.player__play-btn');
  const progressBar = player.querySelector('.player__progress-bar');
  const thumb = progressBar.querySelector('.player__thumb');
  const currentTimeItem = player.querySelector('.player__time_current');
  const durationTimeItem = player.querySelector('.player__time_diration');
  const trackItems = player.dataset.tracksList
    ? document.querySelectorAll(`${player.dataset.tracksList} [data-src]`)
    : null;

  let audio = null;
  let currentTime = 0;
  let isMoving = false;

  if (trackItems && trackItems.length) {
    player.dataset.audioSrc = trackItems[0].dataset.src;
    trackItems[0].classList.add('_active');

    trackItems.forEach((item) => {
      item.addEventListener('click', () => {
        if (!audio) initAudio();
        if (audio.src === item.dataset.src) return;
        if (activePlayer) pauseMusic();
        nextActiveMusic(item);
        playMusic();
      });
    });
  }

  playButton.addEventListener('click', onPlayButton);
  function onPlayButton() {
    if (!audio) initAudio();

    if (audio.paused) {
      if (activePlayer) pauseMusic(); // если при запуске текущего плеера уже запущен какой-то другой, то останавливаем его
      playMusic();
    } else {
      pauseMusic();
    }
  }

  function initAudio() {
    audio = new Audio(player.dataset.audioSrc);
    player.insertAdjacentElement('beforeend', audio);

    audio.addEventListener('loadedmetadata', () => {
      audio.currentTime = currentTime;
      setTimeInHTML(currentTimeItem, currentTime);
      setTimeInHTML(durationTimeItem, audio.duration);
    });

    // Update html-elements, when change music current time (audio.currentTime)
    audio.addEventListener('timeupdate', () => {
      currentTime = audio.currentTime;
      updateProgressBar();
      setTimeInHTML(currentTimeItem, currentTime);
    });

    audio.addEventListener('ended', endedMusic);

    window.addEventListener('resize', updateProgressBar);
  }

  function playMusic() {
    audio.play();
    activePlayer = player;
    playButton.classList.add('_play');
    playButton.setAttribute('aria-label', 'Pause music');
  }

  function pauseMusic() {
    if (!activePlayer) return;
    activePlayer.querySelector('audio').pause();
    activePlayer.querySelector('.player__play-btn').classList.remove('_play');
    activePlayer.querySelector('.player__play-btn').setAttribute('aria-label', 'Play music');
    activePlayer = null;
  }

  // Click on progress bar
  progressBar.addEventListener('click', (e) => {
    e.preventDefault(); // предотвратить запуск выделения (действие браузера)
    if (!audio) initAudio();
    updatePlayer(e.clientX);
  });

  // Moving thumb on progress bar
  thumb.addEventListener(isMobile.any() ? 'touchstart' : 'mousedown', (e) => {
    if (!audio) initAudio();

    // предотвратить запуск выделения (действие браузера)
    if ((isMobile.any() && e.cancelable) || !isMobile.any()) e.preventDefault();

    const clientX = isMobile.any() ? e.touches[0].clientX : e.clientX;
    let shiftX = clientX - e.target.getBoundingClientRect().left;

    document.addEventListener(isMobile.any() ? 'touchmove' : 'mousemove', onMove);
    document.addEventListener(isMobile.any() ? 'touchend' : 'mouseup', onMoveEnd);

    const isAudioPaused = audio.paused;
    if (!isAudioPaused) pauseMusic();
    isMoving = true;

    function onMove(e) {
      const clientX = isMobile.any() ? e.touches[0].clientX : e.clientX;
      updatePlayer(clientX, shiftX);
    }

    function onMoveEnd() {
      if (!isAudioPaused) playMusic();
      isMoving = false;
      document.removeEventListener(isMobile.any() ? 'touchmove' : 'mousemove', onMove);
      document.removeEventListener(isMobile.any() ? 'touchend' : 'mouseup', onMoveEnd);
    }
  });

  thumb.addEventListener('focus', () => {
    if (!audio) initAudio();
    document.addEventListener('keydown', onKeyDown);
  });
  thumb.addEventListener('blur', () => {
    document.removeEventListener('keydown', onKeyDown);
  });
  function onKeyDown(e) {
    e.preventDefault();
    const charCode = typeof e.which == 'number' ? e.which : e.keyCode;
    if (!(charCode === 37 || charCode === 39)) return;

    if (charCode === 37) currentTime = currentTime - 5;
    else if (charCode === 39) currentTime = currentTime + 5;

    let audioDuration = getDuration();
    if (currentTime <= 0) {
      currentTime = 0;
    } else if (currentTime > audioDuration) {
      currentTime = audioDuration;
    }
    audio.currentTime = currentTime;
  }

  // Update music current time (audio.currentTime)
  function newCurrentTime(clientX, shiftX = 0) {
    // музыка ещё не загрузилась
    const track = tracks.find((obj) => obj.url === audio.getAttribute('src'));
    const duration = track ? track.duration : 0;

    let newLeft = clientX - progressBar.getBoundingClientRect().left - shiftX;
    if (newLeft <= 0) {
      currentTime = 0;
    } else if (newLeft >= progressBar.offsetWidth + thumb.offsetWidth) {
      currentTime = duration;
    } else {
      currentTime = (newLeft * duration) / progressBar.offsetWidth;
    }
    if (audio.currentTime) audio.currentTime = currentTime;
  }

  // Update progress bar
  function updateProgressBar() {
    let barWidth = progressBar.offsetWidth;
    let widthPerSecond = 0;
    let percentWidthPerSecond = 0;
    let audioDuration = getDuration();
    percentWidthPerSecond = ((barWidth / audioDuration) * 100) / barWidth;
    widthPerSecond = barWidth / audioDuration;

    // Через left будет дёрганный thumb, поэтому через transform, но в таком случае сдвига по горизонтали нужно использовать px, а не %. Поэтому добавим window.addEventListener('resize', ()={})
    // thumb.style.left = percentWidthPerSecond * audio.currentTime + "%";\
    thumb.style.transform = `translate(${
      widthPerSecond * currentTime - thumb.offsetWidth / 1.5
    }px, -50%)`;
    progressBar.querySelector('.player__progress').style.width =
      percentWidthPerSecond * currentTime + '%';
  }

  function endedMusic() {
    currentTime = 0;
    if (!trackItems) {
      pauseMusic();
      return;
    }
    if (isMoving) return;

    let nextTrack = document.querySelector(
      `${player.dataset.tracksList} ._active`,
    ).nextElementSibling;

    pauseMusic();
    if (nextTrack) {
      nextActiveMusic(nextTrack);
      playMusic();
    } else {
      nextActiveMusic(trackItems[0]);
      updateProgressBar();
    }
  }

  function nextActiveMusic(item) {
    if (!trackItems) return;
    document.querySelector(`${player.dataset.tracksList} ._active`)?.classList.remove('_active');
    item.classList.add('_active');
    audio.src = item.dataset.src;
  }

  function updatePlayer(clientX, shiftX = 0) {
    newCurrentTime(clientX, shiftX);
    updateProgressBar();
    setTimeInHTML(currentTimeItem, currentTime);
  }

  function getDuration() {
    let audioDuration = 0;
    if (audio?.duration) {
      audioDuration = audio.duration;
    } else {
      audioDuration = tracks.find((obj) => obj.url === audio.getAttribute('src'))?.duration;
    }
    return audioDuration;
  }
});
