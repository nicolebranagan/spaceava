var music = {
    sounds: ["die", "get", "boom", "crash", "shove", "ghost"],
    music: ["prelude", "title", "steady", "spaceless", "power", "chime", "bossy", "jungle", "carousel", "chimier"],
    data: {},
    loaded: 0,
    initialize: function() {
        for (var i = 0; i < this.sounds.length; i++) {
            var sound = new Howl({
                src: ["./music/sfx_" + this.sounds[i] + ".wav"],
                volume: 0.6,
                autoplay: false,
                loop: false
            });
            sound.once('load', () => {this.loaded++})
            this.data[this.sounds[i]] = sound;
        }
        for (var i = 0; i < this.music.length; i++) {
            var music = new Howl({
                src: ["./music/" + this.music[i] + ".ogg"],
                volume: 0.6,
                autoplay: false,
                loop: true
            })
            music.once('load', () => {this.loaded++})
            this.data[this.music[i]] = music;
        }
    },
    loaded: 0,
    isLoaded: function() {
        return (this.loaded == (this.sounds.length + this.music.length));
    },
    callback: function() {},
    currentSong: null,
    paused: false,
    playSound: function(sound) {
        if (soundEnabled) {
            this.data[sound].play();
        }
    },
    soundqueue: [],
    queueSound: function(sound, unique) {
        if (unique && this.soundqueue.indexOf(sound) !== -1)
            return;
        this.soundqueue.push(sound);
    },
    playQueue: function() {
        if (this.soundqueue.length == 0)
            return;
        else {
            var snd = this.data[this.soundqueue.shift()];
            snd.once('end', function() {
                music.playQueue();
            })
            snd.play();
        }
    },
    clearQueue: function() {
        this.soundqueue = [];
    },
    playMusic: function(music) {
        if (!isNaN(music))
            music = this.music[music];
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

// Graphics handlers
var gfx = {
    initialize: function() {
        this.font = new Image();
        this.font.src = "./images/font.png";
        this.objects = new Image();
        this.objects.src = "./images/objects.gif";
        this.tiles = new Image();
        this.tiles.src = "./images/tiles.gif";
        this.faces = new Image();
        this.faces.src = "./images/faces.gif"
        this.bg = [new Image()];
        this.bg[0].src = "./images/bg1.gif";
        this.title = new Image();
        this.title.src = "./images/title.gif";
    }
}
gfx.initialize();

