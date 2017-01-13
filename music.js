var music = {
    sounds: ['appear', 'aspect', 'crystal', 'die', 'key', 'pause', 'pew', 'push', 'whistle', 'win'],
    music: ['bold', 'cave', 'chant', 'distance', 'firmly', 'frenzy', 'march', 'mystery', 'phasic', 'right', 'spiral', 'tapenade', 'title', 'under', 'where'],
    data: {},
    initialize: function() {
        for (var i = 0; i < this.sounds.length; i++) {
            var sound = new Howl({
                urls: ["./sound/" + this.sounds[i] + ".wav"],
                volume: 0.9,
                autoplay: false,
                loop: false
            });
            this.data[this.sounds[i]] = sound;
        }
        for (var i = 0; i < this.music.length; i++) {
            var music = new Howl({
                urls: ["./music/" + this.music[i] + ".ogg"],
                volume: 0.6,
                autoplay: false,
                loop: true
            })
            this.data[this.music[i]] = music;
        }
        if (this.data.where) {
            this.data.where.loop = false;
        }
    },
    loaded: 0,
    callback: function() {},
    currentSong: null,
    paused: false,
    playSound: function(sound) {
        if (soundEnabled) {
            this.data[sound].play();
        }
    },
    playMusic: function(music) {
        if (music === "" || !music) {
            if (this.currentSong) {
                this.currentSong.stop();
                this.currentSong = null;
            }
            return;
        }
        if (!musicEnabled)
            return;
        if (this.currentSong) {
            if (this.currentSong === this.data[music])
                return; // Already playing
            this.currentSong.stop();
        }
        this.currentSong = this.data[music];
        this.currentSong.play();
    },
    pauseMusic: function() {
        if (!this.currentSong)
            return;
        if (this.paused) {
            this.currentSong.play();
            this.paused = false;
        } else {
            this.currentSong.pause();
            this.paused = true;
        }
    }
};

