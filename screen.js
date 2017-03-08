"use strict";

class TitleScreen {
    constructor() {
        this.selection = 0;
        music.playMusic("title");
    }
    update() {
        if (Controls.Enter || Controls.Shoot) {
            Controls.Enter = false;
            if (this.selection == 0) {
                // New Game
                runner = new ControlsScreen();
            } else if (this.selection == 1) {

            } else if (this.selection == 2) {
                runner = new OptionsScreen();
            } else if (this.selection == 3) {
                runner = new LevelSelect();
            }
        } else if (Controls.Up) {
            if (this.selection != 0)
                this.selection--;
            Controls.Up = false;
        }   else if (Controls.Down) {
            if (this.selection != 2)
                this.selection++;
            Controls.Down = false;
        }
    }
    draw(ctx) {
        ctx.drawImage(gfx.title, 0, 0, 256, 192, 0, 0, 256, 192);
        drawText(ctx, 12*8, 14*8, "New Game");
        drawText(ctx, 12*8, 16*8, "Continue");
        drawText(ctx, 12*8, 18*8, "Options");
        drawText(ctx, 10*8, (14 + (this.selection*2))*8, [26]);
        drawCenteredText(ctx, 21*8, "(c) 2017 Nicole Express");
    }
};

class OptionsScreen {
    constructor() {
        this.music = music.music.concat(music.sounds);
        this.selection = 7;
        this.currentmusic = 0;
        this.locations = [4*8, 5*8, 6*8, 8*8, 9*8, 11*8, 13*8, 16*8];
        music.playMusic("");
    }

    draw(ctx) {
        //ctx.drawImage(gfx.objects, 0, 0, 16, 16, 16, 16, 16, 16);
        //ctx.drawImage(gfx.blocks, 14*16, 0, 16, 16, 144 - 16, 16, 16, 16);
        drawCenteredText(ctx, 1*8, "Space Ava");
        drawCenteredText(ctx, 2*8, "Options");
        
        drawText(ctx, 3*8, 4*8, saveEnabled ? "Do save game" : "Do not save game")
        /*drawText(ctx, 3*8, 5*8, this.saveFailed ? "No save data" : "Save to file");
        drawText(ctx, 3*8, 6*8, "Load from file");*/

        drawText(ctx, 3*8, 8*8, musicEnabled ? "Music enabled" : "Music disabled");
        drawText(ctx, 3*8, 9*8, soundEnabled ? "Sound enabled" : "Sound disabled");
        //drawText(ctx, 3*8, 11*8, "Palette " + this.currentpalette.toString());
        drawText(ctx, 3*8, 13*8, "Sound test");
        drawText(ctx, 5*8, 14*8, this.music[this.currentmusic]);
        
        drawText(ctx, 3*8, 16*8, "Return       v0")
        
        drawText(ctx, 1*8, this.locations[this.selection], [26]);
    }
    update() {
        if (Controls.Enter || Controls.Shoot) {
            Controls.Enter = false;
            Controls.Shoot = false;
            if (this.selection == 0) {
                // Disable saving
                saveEnabled = !saveEnabled;
            } else if (this.selection == 1) {
                // Save game to file
                /*var data = "";
                if (localStorage.getItem('saved'))
                    data = localStorage.getItem('saved');
                else {
                    this.saveFailed = true;
                    return;
                }
                var string = btoa(data);
                string = "data:application/octet-stream," + string;
                newWindow = window.open(string, 'saved.sav');*/
            } else if (this.selection == 2) {
                // Load file screen
                runner = new LoadFileScreen(this);
            } else if (this.selection == 3) {
                // Disable music
                music.playMusic("");
                musicEnabled = !musicEnabled;
            } else if (this.selection == 4) {
                // Disable sound
                soundEnabled = !soundEnabled;
            } else if (this.selection == 5) {
                // Change palette
                //gfx.adapt(this.currentpalette);
            } else if (this.selection == 6) {
                // Sound test
                music.playMusic(this.
                music[this.currentmusic]);
            } else if (this.selection == 7) {
                // Return to title screen
                runner = new TitleScreen();
            }
        } else if (Controls.Up) {
            if (
                this.selection != 0)
                this.selection--;
            Controls.Up = false;
        }   else if (Controls.Down) {
            if (this.selection != 7)
                this.selection++;
            Controls.Down = false;
        }
        
        if (this.selection == 5) {
            if (Controls.Left) {
                Controls.Left = false;
                //if (this.currentpalette != 0)
                //    this.currentpalette--;
            } else if (Controls.Right) {
                Controls.Right = false;
                //if (this.currentpalette != (gfx.backgrounds.length - 1))
                //    this.currentpalette++;
            }
        }
        
        if (this.selection == 6) {
            if (Controls.Left) {
                Controls.Left = false;
                if (this.currentmusic != 0)
                    this.currentmusic--;
            } else if (Controls.Right) {
                Controls.Right = false;
                if (this.currentmusic != (this.music.length - 1))
                    this.currentmusic++;
            }
        }
    }
};

var ControlsScreen = function() {
    music.playMusic("");
    this.timer = 0;
};

ControlsScreen.prototype = {
    draw: function(ctx) {
        drawCenteredText(ctx, 2*8, "Controls");
        drawText(ctx, 6*8, 4*8, "Arrow keys");
        drawText(ctx, 6*8, 5*8, "or WASD");
        drawText(ctx, 2*8, 7*8, "Shoot: Space");
        drawText(ctx, 3*8, 8*8, "Talk: Space");
        drawCenteredText(ctx, 9*8, "Reset: Backspace");
        drawText(ctx, 2*8, 10*8, "Pause: Enter");

        drawCenteredText(ctx, 12*8, "For mobile,")
        drawCenteredText(ctx, 13*8, "tap screen")

        drawCenteredText(ctx, 15*8, "Press 'Pause'")
    },

    update: function(ctx) {
        if (Controls.Enter) {
            Controls.Enter = false;
            new Governor();
        }
    }
};

// TODO: Combine with LogoScreen
var LoadingScreen = function() {
    this.timer = 0;
    gfx.initialize();
};
LoadingScreen.prototype = {
    draw: function(ctx) {
        drawCenteredText(ctx, 10*8, "Loading...");
    },

    update: function(ctx) {
        if (this.timer < 2) 
            this.timer++;
        else if (this.timer == 2) {
            music.initialize();
            this.timer++;
        } else if (this.timer == 3) {
            // TODO: Actually check if loaded
            //if (Object.keys(music.data).length == 0)
                this.timer++;
        } else if (this.timer > 3) {
            this.timer++;
            if (this.timer == 150) {
                try {
                    var hash = window.location.hash.substring(1)
                    if (hash.length > 0) {
                        if (hash.substring(1, 6) == "debug" || hash == "debug") {
                            __debug = true;
                        }
                        let hashint = parseInt(hash);
                        if (!isNaN(hashint)) {
                            new Governor(hashint);
                        } else {
                            if (__debug) {
                                runner = new LevelSelect();
                                return;
                            }
                        }
                    }
                } catch (e) {}
                // If nothing else happened, then just start the game as usual
                if (runner === this)
                    runner = new Dialogue(Script.opening, function() {runner = new TitleScreen();});
            }
        }
    }
}

class LevelSelect {
    constructor() {
        this.posx = 0;
        this.posy = 0;
        this.width = (256 / 8) - 2; // Number of 8x8 tiles;
        this.perline = Math.floor(this.width / 3); 

        music.playMusic("steady");
    }
    update() {
        if (Controls.Left) {
            Controls.Left = false;
            if (this.posx > 0)
                this.posx--;
            else
                this.posx = this.perline-1;
        } else if (Controls.Right) {
            Controls.Right = false;
            if (this.posx < (this.perline-1))
                this.posx++;
            else
                this.posx = 0;
        } else if (Controls.Up) {
            Controls.Up = false;
            if (this.posy > 0)
                this.posy--;
        } else if (Controls.Down) {
            Controls.Down = false;
            this.posy++
        } else if (Controls.Enter || Controls.Shoot) {
            Controls.Enter = false;
            Controls.Shoot = false;
            var pos = this.posx + (this.posy*this.perline);
            if (pos < Script.tickerTape.length) {
                new Governor(pos);
            } else {
                console.log(pos);
            }
        }

    }
    draw(ctx) {
        drawCenteredText(ctx, 8, "Space Ava");
        drawCenteredText(ctx, 16, "Level Select");
        var x = 0;
        var y = 24;
        drawText(ctx, this.posx*24 + 8, this.posy*16 + 8 + 24, [25]);
        for (var i = 0; i < Script.tickerTape.length; i++) {
            if (i % this.perline == 0) {
                x = 8;
                y += 16;
            } else {
                x += 3*8;
            }
            drawText(ctx, x, y, Script.tickerTape[i][0]);
        }
    }
}

