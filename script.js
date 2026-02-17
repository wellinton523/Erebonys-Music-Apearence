// Estado do player
const player = {
    isPlaying: false,
    currentTrack: 0,
    volume: 70,
    tracks: [
        { title: 'Música 1', artist: 'Artista 1', duration: 240 },
        { title: 'Música 2', artist: 'Artista 2', duration: 180 },
        { title: 'Música 3', artist: 'Artista 3', duration: 200 }
    ]
};

// Elementos DOM
const btnPlay = document.getElementById('btnPlay');
const btnNext = document.getElementById('btnNext');
const btnPrevious = document.getElementById('btnPrevious');
const btnLoadMusic = document.getElementById('btnLoadMusic');
const btnSearch = document.getElementById('btnSearch');
const songTitle = document.getElementById('songTitle');
const artistName = document.getElementById('artistName');
const durationInfo = document.getElementById('durationInfo');
const progressSlider = document.getElementById('progressSlider');
const volumeSlider = document.getElementById('volumeSlider');
const albumArt = document.getElementById('albumArt');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    btnPlay.addEventListener('click', togglePlay);
    btnNext.addEventListener('click', nextTrack);
    btnPrevious.addEventListener('click', previousTrack);
    volumeSlider.addEventListener('change', setVolume);
    progressSlider.addEventListener('change', seek);
    btnLoadMusic.addEventListener('click', loadMusic);
    btnSearch.addEventListener('click', searchSpotify);
}

// Toggle play/pause
function togglePlay() {
    player.isPlaying = !player.isPlaying;
    updateUI();
    
    if (typeof Android !== 'undefined' && Android.playMusic) {
        Android.playMusic(player.isPlaying, player.currentTrack);
    }
}

// Next track
function nextTrack() {
    player.currentTrack = (player.currentTrack + 1) % player.tracks.length;
    player.isPlaying = true;
    updateUI();
    
    if (typeof Android !== 'undefined' && Android.nextTrack) {
        Android.nextTrack(player.currentTrack);
    }
}

// Previous track
function previousTrack() {
    player.currentTrack = (player.currentTrack - 1 + player.tracks.length) % player.tracks.length;
    player.isPlaying = true;
    updateUI();
    
    if (typeof Android !== 'undefined' && Android.previousTrack) {
        Android.previousTrack(player.currentTrack);
    }
}

// Play music by index
function playMusic(index) {
    player.currentTrack = index;
    player.isPlaying = true;
    updateUI();
    
    if (typeof Android !== 'undefined' && Android.playMusic) {
        Android.playMusic(true, index);
    }
}

// Set volume
function setVolume() {
    player.volume = volumeSlider.value;
    
    if (typeof Android !== 'undefined' && Android.setVolume) {
        Android.setVolume(player.volume);
    }
}

// Seek to position
function seek() {
    const position = progressSlider.value;
    
    if (typeof Android !== 'undefined' && Android.seek) {
        Android.seek(position);
    }
}

// Load music files
function loadMusic() {
    console.log('Carregando músicas...');
    
    if (typeof Android !== 'undefined' && Android.loadMusicFiles) {
        Android.loadMusicFiles();
    } else {
        alert('Funcionalidade disponível apenas no app Android');
    }
}

// Search Spotify
function searchSpotify() {
    const query = prompt('Digite o nome da música ou artista:');
    
    if (query) {
        console.log('Buscando:', query);
        
        if (typeof Android !== 'undefined' && Android.searchSpotify) {
            Android.searchSpotify(query);
        } else {
            alert('Funcionalidade Spotify será adicionada em breve!');
        }
    }
}

// Update UI
function updateUI() {
    const track = player.tracks[player.currentTrack];
    
    // Update song info
    songTitle.textContent = track.title;
    artistName.textContent = track.artist;
    durationInfo.textContent = formatTime(0) + ' / ' + formatTime(track.duration);
    
    // Update play button
    btnPlay.innerHTML = player.isPlaying ? '<span>⏸</span>' : '<span>▶</span>';
    
    // Rotate album if playing
    if (player.isPlaying) {
        albumArt.style.animationPlayState = 'running';
    } else {
        albumArt.style.animationPlayState = 'paused';
    }
    
    // Update volume slider
    volumeSlider.value = player.volume;
}

// Format time (seconds to MM:SS)
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Java bridge functions (chamadas do Android)
function updateProgress(currentTime, duration) {
    progressSlider.value = (currentTime / duration) * 100;
    durationInfo.textContent = formatTime(currentTime) + ' / ' + formatTime(duration);
}

function updatePlaylist(tracks) {
    if (tracks && tracks.length > 0) {
        player.tracks = tracks;
        updateUI();
        updatePlaylistUI();
    }
}

function updatePlaylistUI() {
    const playlistDiv = document.getElementById('playlist');
    playlistDiv.innerHTML = '';
    
    player.tracks.forEach((track, index) => {
        const item = document.createElement('div');
        item.className = 'playlist-item' + (index === player.currentTrack ? ' active' : '');
        item.onclick = () => playMusic(index);
        item.innerHTML = `
            <span class="music-icon">🎵</span>
            <div>
                <p class="music-title">${track.title}</p>
                <p class="music-artist">${track.artist}</p>
            </div>
        `;
        playlistDiv.appendChild(item);
    });
}

function showSpotifyResults(results) {
    alert('Resultados do Spotify:\n' + results);
}

// Simular progresso da música
let simulationInterval;
function startProgressSimulation() {
    if (player.isPlaying && simulationInterval === undefined) {
        let currentTime = 0;
        const track = player.tracks[player.currentTrack];
        simulationInterval = setInterval(() => {
            if (player.isPlaying) {
                currentTime += 0.1;
                if (currentTime >= track.duration) {
                    clearInterval(simulationInterval);
                    simulationInterval = undefined;
                    nextTrack();
                } else {
                    updateProgress(currentTime, track.duration);
                }
            }
        }, 100);
    }
}

// Override togglePlay para incluir simulação
const originalTogglePlay = togglePlay;
window.togglePlay = function() {
    originalTogglePlay();
    if (player.isPlaying) {
        startProgressSimulation();
    } else {
        clearInterval(simulationInterval);
        simulationInterval = undefined;
    }
};

console.log('Script carregado com sucesso!');
