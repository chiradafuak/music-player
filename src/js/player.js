document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('audio-player');
    const playBtn = document.getElementById('play');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const volumeControl = document.getElementById('volume');
    const albumArt = document.getElementById('album-art');
    const songTitle = document.getElementById('song-title');
    const songArtist = document.getElementById('song-artist');
    const playlistEl = document.getElementById('playlist');
    const shuffleBtn = document.getElementById('shuffle');
    const repeatBtn = document.getElementById('repeat');
   
    const playlist = [
      {
        title: "Champagne Poetry",
        artist: "Drake",
        src: "/audio/sample1.mp3",
        cover: "/assets/images/cover.jpg"
      },
      {
        title: "Way 2 Sexy",
        artist: "Drake",
        src: "/audio/sample2.mp3",
        cover: "/assets/images/cover.jpg"
      },
      {
        title: "TSU",
        artist: "Drake",
        src: "/audio/sample3.mp3",
        cover: "/assets/images/cover.jpg"
      },
      {
        title: "N 2 Deep",
        artist: "Drake",
        src: "/audio/sample4.mp3",
        cover: "/assets/images/cover.jpg"
      },
      {
        title: "Girls Want Girls",
        artist: "Drake",
        src: "/audio/sample5.mp3",
        cover: "/assets/images/cover.jpg"
      },
      {
        title: "Knife Talk",
        artist: "Drake",
        src: "/audio/sample6.mp3",
        cover: "/assets/images/cover.jpg"
      }
    ];
  
    let currentSongIndex = 0;
    let isPlaying = false;
    let isShuffle = false;
    let isRepeat = false;
  
    function initPlayer() {
      renderPlaylist();
      loadSong(currentSongIndex);
      
      audioPlayer.volume = volumeControl.value;
    }
  
    function loadSong(index) {
      const song = playlist[index];
      audioPlayer.src = song.src;
      albumArt.src = song.cover;
      songTitle.textContent = song.title;
      songArtist.textContent = song.artist;
      
      updateActiveSong();
    }

    function playSong() {
      isPlaying = true;
      audioPlayer.play();
      playBtn.innerHTML = '<i class="fas fa-pause"></i>';
      albumArt.classList.add('rotate-album');
    }
  
    function pauseSong() {
      isPlaying = false;
      audioPlayer.pause();
      playBtn.innerHTML = '<i class="fas fa-play"></i>';
      albumArt.classList.remove('rotate-album');
    }
 
    function prevSong() {
      currentSongIndex--;
      if (currentSongIndex < 0) {
        currentSongIndex = playlist.length - 1;
      }
      loadSong(currentSongIndex);
      if (isPlaying) playSong();
    }
  
    function nextSong() {
      if (isShuffle) {
        currentSongIndex = Math.floor(Math.random() * playlist.length);
      } else {
        currentSongIndex++;
        if (currentSongIndex > playlist.length - 1) {
          if (isRepeat) {
            currentSongIndex = 0;
          } else {
            currentSongIndex = playlist.length - 1;
            pauseSong();
            return;
          }
        }
      }
      loadSong(currentSongIndex);
      if (isPlaying) playSong();
    }

    function updateProgress() {
      const { currentTime, duration } = audioPlayer;
      const progressPercent = (currentTime / duration) * 100;
      progressBar.style.width = `${progressPercent}%`;
 
      currentTimeEl.textContent = formatTime(currentTime);
      if (duration) {
        durationEl.textContent = formatTime(duration);
      }
    }

    function setProgress(e) {
      const width = this.clientWidth;
      const clickX = e.offsetX;
      const duration = audioPlayer.duration;
      audioPlayer.currentTime = (clickX / width) * duration;
    }

    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function setVolume() {
      audioPlayer.volume = this.value;
    }

    function renderPlaylist() {
      playlistEl.innerHTML = '';
      playlist.forEach((song, index) => {
        const li = document.createElement('li');
        li.className = 'p-3 rounded-lg hover:bg-gray-700 cursor-pointer flex items-center';
        if (index === currentSongIndex) {
          li.classList.add('active-song');
        }
        li.innerHTML = `
          <img src="${song.cover}" alt="${song.title}" class="w-12 h-12 rounded-md mr-3">
          <div>
            <h3 class="font-medium">${song.title}</h3>
            <p class="text-sm text-gray-400">${song.artist}</p>
          </div>
        `;
        li.addEventListener('click', () => {
          currentSongIndex = index;
          loadSong(currentSongIndex);
          playSong();
        });
        playlistEl.appendChild(li);
      });
    }

    function updateActiveSong() {
      const items = playlistEl.querySelectorAll('li');
      items.forEach((item, index) => {
        if (index === currentSongIndex) {
          item.classList.add('active-song');
        } else {
          item.classList.remove('active-song');
        }
      });
    }

    function toggleShuffle() {
      isShuffle = !isShuffle;
      shuffleBtn.classList.toggle('text-purple-400', isShuffle);
      shuffleBtn.classList.toggle('text-gray-400', !isShuffle);
    }

    function toggleRepeat() {
      isRepeat = !isRepeat;
      repeatBtn.classList.toggle('text-purple-400', isRepeat);
      repeatBtn.classList.toggle('text-gray-400', !isRepeat);
    }
 
    playBtn.addEventListener('click', () => {
      isPlaying ? pauseSong() : playSong();
    });
  
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', nextSong);
    audioPlayer.addEventListener('loadedmetadata', updateProgress);
    progressBar.parentElement.addEventListener('click', setProgress);
    volumeControl.addEventListener('input', setVolume);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
  
    initPlayer();
  });