const audio = document.getElementById("audio");
const songTitle = document.getElementById("songTitle");
const artist = document.getElementById("artist");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const progress = document.getElementById("progress");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const volume = document.getElementById("volume");
const playlist = document.getElementById("playlist");

// Songs ko songs folder mein rakhna hai
const songs = [
    {
        title: "Hip Hop Music",
        artist: "Ivan Selivanov",
        src: "songs/song1.mp3"
    }
];

let currentSong = 0;

function loadSong(index) {
    currentSong = index;

    audio.src = songs[index].src;
    songTitle.textContent = songs[index].title;
    artist.textContent = songs[index].artist;

    [...playlist.children].forEach((item, i) => {
        item.classList.toggle("active", i === index);
    });

    progress.value = 0;
    currentTime.textContent = "0:00";
    duration.textContent = "0:00";
    playBtn.textContent = "▶️";
}

function playSong() {
    audio.play()
        .then(() => {
            playBtn.textContent = "⏸️";
        })
        .catch(() => {
            alert("Song file nahi mil rahi. Songs folder aur MP3 file names check karo.");
        });
}

function pauseSong() {
    audio.pause();
    playBtn.textContent = "▶️";
}

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}:${String(secs).padStart(2, "0")}`;
}

function createPlaylist() {
    playlist.innerHTML = "";

    songs.forEach((song, index) => {
        const li = document.createElement("li");
        li.textContent = `${song.title} — ${song.artist}`;

        li.addEventListener("click", () => {
            loadSong(index);
            playSong();
        });

        playlist.appendChild(li);
    });
}

playBtn.addEventListener("click", () => {
    if (audio.paused) {
        playSong();
    } else {
        pauseSong();
    }
});

prevBtn.addEventListener("click", () => {
    const index = (currentSong - 1 + songs.length) % songs.length;
    loadSong(index);
    playSong();
});

nextBtn.addEventListener("click", () => {
    const index = (currentSong + 1) % songs.length;
    loadSong(index);
    playSong();
});

audio.addEventListener("loadedmetadata", () => {
    duration.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
        progress.value = (audio.currentTime / audio.duration) * 100;
        currentTime.textContent = formatTime(audio.currentTime);
    }
});

progress.addEventListener("input", () => {
    if (audio.duration) {
        audio.currentTime = (progress.value / 100) * audio.duration;
    }
});

volume.addEventListener("input", () => {
    audio.volume = Number(volume.value);
});

audio.addEventListener("ended", () => {
    const nextIndex = (currentSong + 1) % songs.length;
    loadSong(nextIndex);
    playSong();
});

audio.volume = Number(volume.value);

createPlaylist();
loadSong(0);