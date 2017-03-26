"use strict";

class TitleScreen {
    constructor() {
        this.selection = 0;
        this.count = 0;
        music.playMusic("title");
    }
    update() {
        if (Controls.Enter || Controls.Shoot) {
            Controls.Enter = false;
            if (this.selection == 0) {
                // New Game
                runner = new ControlsScreen();
            } else if (this.selection == 1) {
                // Arcade Mode
                runner = new Dialogue(Script.arcade, function() {new Governor(0, true)});
            } else if (this.selection == 2) {
                // Continue                
                runner = new PasswordScreen();
            } else if (this.selection == 3) {
                runner = new OptionsScreen();
            }
        } else if (Controls.Up) {
            if (this.selection != 0)
                this.selection--;
            Controls.Up = false;
        }   else if (Controls.Down) {
            if (this.selection != 2 || (this.count == 9 && this.selection != 3))
                this.selection++;
            else {
                this.count++;
                if (this.count == 9)
                    this.selection++;
            }
            Controls.Down = false;
        }
    }
    draw(ctx) {
        ctx.drawImage(gfx.title, 0, 0, 256, 192, 0, 0, 256, 192);
        drawText(ctx, 12*8, 14*8, "New Game");
        drawText(ctx, 12*8, 16*8, "Arcade Mode");
        drawText(ctx, 12*8, 18*8, "Continue");
        drawText(ctx, 10*8, (14 + (this.selection*2))*8, [26]);
        if (this.count !== 9) {
            drawCenteredText(ctx, 21*8, "(c) 2017 Nicole Express");
        } else {
            drawText(ctx, 12*8, 20*8, "Options");
            drawCenteredText(ctx, 22*8, "(c) 2017 Nicole Express");
        }
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
        
        drawText(ctx, 3*8, 4*8, "Level Select");
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
                // Level selection
                runner = new LevelSelect();
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
    this.bg = Math.floor(Math.random() * 4)
};

ControlsScreen.prototype = {
    draw: function(ctx) {
        for (var i = 0; i < (256/16)+1; i++)
            for (var j = 0; j < (192/16); j++) {
                ctx.drawImage(gfx.tiles, (254-this.bg)*16, 0, 16, 16, i*16-j, j*16, 16, 16);
            }
        drawCenteredText(ctx, 2*8, "Controls");
        drawText(ctx, 19*8, 4*8 + 4, "Move Ava")
        drawText(ctx, 5*8, 4*8, "Arrow keys");
        drawText(ctx, 5*8, 5*8, "or WASD");
        drawText(ctx, 5*8, 7*8, "Enter         Pause");
        drawText(ctx, 5*8, 9*8, "Backspace     Reset")

        drawCenteredText(ctx, 13*8, "In Dialogue Mode");
        drawText(ctx, 5*8, 15*8, "Space         Continue");
        drawText(ctx, 5*8, 17*8, "Enter         Skip");

        //drawCenteredText(ctx, 12*8, "For mobile,")
        //drawCenteredText(ctx, 13*8, "tap screen")

        drawCenteredText(ctx, 21*8, "Press 'Pause' to start")
    },

    update: function(ctx) {
        if (Controls.Enter) {
            Controls.Enter = false;
            new Governor();
        }
    }
};

class LoadingScreen {
    constructor() {
        this.timer = 0;
        gfx.initialize();

        this.loaded = false;
        this.logo = new Image();
        this.logo.src = "./images/logo.gif"
        this.logo.onload = () => {this.loaded = true};
    }

    draw(ctx) {
        if (!this.loaded)
            drawCenteredText(ctx, 10*8, "Loading...");
        else {
            ctx.drawImage(this.logo, 128-80, 8*8);
            drawCenteredText(ctx, 12*8, "Loading...");
        }
    }

    update(ctx) {
        if (this.timer < 2) 
            this.timer++;
        else if (this.timer == 2) {
            music.initialize();
            this.timer++;
        } else if (this.timer == 3) {
            if (music.isLoaded())
                this.timer++;
        } else if (this.timer > 3) {
            this.timer++;
            if (this.timer == 5) {
                try {
                    var hash = window.location.hash.substring(1)
                    if (hash.length > 0) {
                        let hashint = parseInt(hash);
                        if (hash.substring(1, 6) == "debug" || hash == "debug") {
                            __debug = true;
                            runner = new LevelSelect();
                        } else if (!isNaN(hashint)) {
                            new Governor(hashint);
                        }
                    }
                } catch (e) {}
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
        this.perline = 7;
        this.width = this.perline * 3;
        this.rows = 3;

        music.playMusic("carousel");
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
            else
                this.posy = this.rows - 1;
        } else if (Controls.Down) {
            Controls.Down = false;
            if (this.posy < (this.rows-1))
                this.posy++
            else
                this.posy = 0;
        } else if (Controls.Enter || Controls.Shoot) {
            Controls.Enter = false;
            Controls.Shoot = false;
            var pos = this.posx + (this.posy*this.perline);
            if (pos < Script.tickerTape.length) {
                music.playMusic("");
                new Governor(pos + 1);
            } else {
                console.log(pos + 1);
            }
        }

    }
    draw(ctx) {
        drawCenteredText(ctx, 8, "Space Ava");
        drawCenteredText(ctx, 16, "Level Select");
        var x = 0;
        var y = 24;
        drawText(ctx, this.posx*24 + 48, this.posy*16 + 8 + 24, [25]);
        for (var i = 1; i < Script.tickerTape.length; i++) {
            if ((i-1) % this.perline == 0) {
                x = 48;
                y += 16;
            } else {
                x += 3*8;
            }
            drawText(ctx, x, y, Script.tickerTape[i][0]);
        }
    }
}

class PasswordScreen {
    constructor() {
        this.posx = 0;
        this.posy = 0;
        this.letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789     O"
        this.perline = 7;
        this.width = this.perline * 2;
        this.rows = Math.ceil(this.letters.length / this.perline);
        this.triedPass = SaveGame.savedPass;
        if (this.triedPass.length == 5) {
            this.posy = this.rows - 1;
            this.posx = this.perline - 1;
        }
        this.lastInvalid = false;

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
            else
                this.posy = this.rows - 1;
        } else if (Controls.Down) {
            Controls.Down = false;
            if (this.posy < (this.rows-1))
                this.posy++
            else
                this.posy = 0;
        } else if (Controls.Enter || Controls.Shoot) {
            Controls.Enter = false;
            Controls.Shoot = false;
            var pos = this.posx + (this.posy*this.perline);
            if (pos == this.letters.length - 1) {
                this.submit();
            } else {
                if (this.triedPass.length < 5) {
                    this.triedPass = this.triedPass + this.letters[pos];
                    this.lastInvalid = false;
                } else {
                    music.playSound("boom");
                }
            }
        } else if (Controls.Reset) {
            if (this.triedPass.length > 1)
                this.triedPass = this.triedPass.slice(0, -1);
            else
                this.triedPass = "";
            Controls.Reset = false;
        }

    }
    draw(ctx) {
        drawCenteredText(ctx, 8, "Space Ava");
        drawCenteredText(ctx, 24, this.lastInvalid? "Invalid password!" : "Enter your password");
        var x = 0;
        var y = 32;
        drawText(ctx, this.posx*16 + 32, this.posy*16 + 8 + 32, [25]);
        for (var i = 0; i < this.letters.length; i++) {
            if ((i) % this.perline == 0) {
                x = 32;
                y += 16;
            } else {
                x += 2*8;
            }
            drawText(ctx, x, y, this.letters[i]);
        }
        drawText(ctx, x+8, y, "K");

        var char = this.triedPass.length == 5 ? 254 : 25;
        drawText(ctx, this.triedPass.length*8 + 180, 40, [char]);
        var drawStrip = this.triedPass;
        while (drawStrip.length < 5)
            drawStrip = drawStrip + "_";
        drawText(ctx, 180, 48, drawStrip);

        drawCenteredText(ctx, 19*8, "Pause, Continue: Add character")
        drawCenteredText(ctx, 20*8, "Reset: Backspace")
        drawCenteredText(ctx, 22*8, "Choose 'OK' when complete")
    }

    submit() {
        if (this.triedPass == "HELP") {
            runner = new LevelSelect();
            return;
        }
        if (this.triedPass.length < 5) {
            music.playSound("boom");
            this.posx = 0;
            this.posy = 0;
            return;
        }
        var attempt = SaveGame.tryPass(this.triedPass);
        if (attempt == -1) {
            if (!this.lastInvalid)
                music.playSound("die");
            this.lastInvalid = true;
            this.triedPass = "";
        } else {
            SaveGame.getStage(attempt);
        }
    }
}
