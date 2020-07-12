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
                // Continue                
                runner = new PasswordScreen();
            } else if (this.selection == 2) {
                // Arcade Mode
                runner = new Dialogue(Script.arcade, function() {new Governor(0, Governor.Mode.ARCADE)});
            } else if (this.selection == 3) {
                // Cinema Mode
                new Governor(0, Governor.Mode.CINEMA);
            } else if (this.selection == 4) {
                runner = new OptionsScreen();
            }
        } else if (Controls.Up) {
            if (this.selection != 0)
                this.selection--;
            Controls.Up = false;
        }   else if (Controls.Down) {
            if (this.selection != 4)
                this.selection++;
            Controls.Down = false;
        }
    }
    draw(ctx) {
        ctx.drawImage(gfx.title, 0, 0, 256, 192, 0, 0, 256, 192);
        drawText(ctx, 12*8, 12*8, "New Game");
        drawText(ctx, 12*8, 14*8, "Continue");
        drawText(ctx, 12*8, 16*8, "Arcade Mode");
        drawText(ctx, 10*8, (12 + (this.selection*2))*8, [26]);
        drawText(ctx, 12*8, 18*8, "Cinema Mode");
        drawText(ctx, 12*8, 20*8, "Options");
        drawText(ctx, 4*8 + 4, 22*8 + 4, [9])
        drawCenteredText(ctx, 22*8 + 4, " 2017-20 Nicole Express");
    }
};

class OptionsScreen {
    constructor() {
        this.music = music.music.concat(music.sounds);
        this.selection = 4;
        this.currentmusic = 0;
        this.locations = [8*8, 10*8, 13*8, 16*8, 21*8];
        this.bg = 2;
        this.timer = 20;
        music.playMusic("");
    }

    draw(ctx) {
        for (var i = 0; i < (256/16)+1; i++)
            for (var j = 0; j < (192/16); j++) {
                ctx.drawImage(gfx.tiles, (254-this.bg)*16, 0, 16, 16, i*16-j, j*16, 16, 16);
            }

        ctx.fillRect(Game.center.x - 6*8, 12, 12*8, 4*8); 
        drawCenteredText(ctx, 2*8, "Space Ava");
        drawCenteredText(ctx, 4*8, "Options");
        
        ctx.fillRect(Game.center.x - 9*8, this.locations[0] - 4, 18*8, 4*8); 
        drawText(ctx, 10*8, this.locations[0], musicEnabled ? "Music enabled" : "Music disabled");
        drawText(ctx, 10*8, this.locations[1], soundEnabled ? "Sound enabled" : "Sound disabled");

        ctx.fillRect(Game.center.x - 9*8, this.locations[2] - 4, 18*8, 2*8); 
        drawText(ctx, 10*8, this.locations[2], "Level select");

        ctx.fillRect(Game.center.x - 9*8, this.locations[3] - 4, 18*8, 3*8); 
        drawText(ctx, 10*8, this.locations[3], "Sound test");
        drawText(ctx, 14*8, this.locations[3] + 8, this.music[this.currentmusic]);
        
        ctx.fillRect(Game.center.x - 9*8, this.locations[4] - 4, 10*8, 2*8);
        drawText(ctx, 10*8, this.locations[4], "Return")

        ctx.fillRect(Game.center.x + 3*8, this.locations[4] - 4, 6*8, 2*8);
        drawText(ctx, 20*8 - 4, this.locations[4], "v . ")
        drawText(ctx, 20*8 - 4, this.locations[4] + 1, " 1 01")
        
        drawText(ctx, 8*8, this.locations[this.selection], [26]);
    }
    update() {
        if (this.timer > 0) {
            this.timer--;
            return;
        }

        if (Controls.Enter || Controls.Shoot) {
            Controls.Enter = false;
            Controls.Shoot = false;

            if (this.selection == 0) {
                // Disable music
                music.playMusic("");
                musicEnabled = !musicEnabled;
            } else if (this.selection == 1) {
                // Disable sound
                soundEnabled = !soundEnabled;
            } else if (this.selection == 2) {
                // Level selection
                runner = new LevelSelect();
            } else if (this.selection == 3) {
                // Sound test
                music.playMusic(this.music[this.currentmusic]);
            } else if (this.selection == 4) {
                // Return to title screen
                runner = new TitleScreen();
            }
        } else if (Controls.Up) {
            if (
                this.selection != 0)
                this.selection--;
            Controls.Up = false;
        }   else if (Controls.Down) {
            if (this.selection != 4)
                this.selection++;
            Controls.Down = false;
        }
        
        if (this.selection == 3) {
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


class ControlsScreen {
    constructor() {
        music.playMusic("");
        this.timer = 0;
        this.bg = [0,3,4][Math.floor(Math.random() * 3)]
    }

    draw(ctx) {
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
        drawText(ctx, 5*8, 15*8, "Space or Z    Continue");
        drawText(ctx, 5*8, 17*8, "Enter         Skip");

        //drawCenteredText(ctx, 12*8, "For mobile,")
        //drawCenteredText(ctx, 13*8, "tap screen")

        drawCenteredText(ctx, 21*8, "Press 'Pause' to start")
    }

    update() {
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
        this.rows = 4;
        this.bg = 0;

        music.playMusic("carousel");
    }
    update() {
        if (this.posy == 0)
            this.bg = 0;
        else if (this.posy == 1)
            this.bg = 2;
        else if (this.posy == 2)
            this.bg = 4;
        else
            this.bg = 10;
        if (Controls.Left) {
            Controls.Left = false;
            if (this.posx > 0)
                this.posx--;
            else {
                if (this.posy == 3)
                    this.posx = 2;
                else
                    this.posx = this.perline-1;
            }
        } else if (Controls.Right) {
            Controls.Right = false;
            let max = this.perline-1;
            if (this.posy == 3)
                max = 2;
            if (this.posx < max)
                this.posx++;
            else
                this.posx = 0;
        } else if (Controls.Up) {
            Controls.Up = false;
            if (this.posy > 0)
                this.posy--;
            else {
                this.posy = this.rows - 1;
                if (this.posx > 2)
                    this.posy--;
            }
        } else if (Controls.Down) {
            Controls.Down = false;
            if (this.posy < (this.rows-1))
                this.posy++
            else
                this.posy = 0;
            if (this.posy == 3 && this.posx > 2)
                this.posx = 2;
        } else if (Controls.Enter || Controls.Shoot) {
            Controls.Enter = false;
            Controls.Shoot = false;
            var pos = this.posx + (this.posy*this.perline);
            if (pos < Script.tickerTape.length) {
                music.playMusic("");
                new Governor(pos + 1);
            }
        } else if (Controls.Reset) {
            Controls.Reset = false;
            runner = new TitleScreen();
        }

    }
    draw(ctx) {
        for (var i = 0; i < (256/16); i++)
            for (var j = 0; j < (192/16); j++) {
                ctx.drawImage(gfx.tiles, (254-this.bg)*16, 0, 16, 16, i*16, j*16, 16, 16);
            }
        ctx.fillRect(Game.center.x - 7*8, 4, 14*8, 4*8); 
        drawCenteredText(ctx, 8, "Space Ava");
        drawCenteredText(ctx, 24, "Level Select");
        var x = 0;
        var y = 32;
        ctx.fillRect(Game.center.x - 11*8, y + 8, 22*8, this.rows*3*8 + 8); 
        drawText(ctx, this.posx*24 + 48, this.posy*24 + 16 + 32, [25]);
        for (var i = 1; i < Script.tickerTape.length; i++) {
            if ((i-1) % this.perline == 0) {
                x = 48;
                y += 24;
            } else {
                x += 3*8;
            }
            var text = Script.tickerTape[i][0];
            if (text.substr(0, 1) == "~")
                text = text.substr(1, 2);
            drawText(ctx, x, y, text);
        }
        ctx.fillRect(4, 18*8 + 4, 31*8, 5*8); 
        drawCenteredText(ctx, 19*8, "Pause, Continue: Enter level")
        drawCenteredText(ctx, 21*8, "D# - Dialogue screen")
        drawCenteredText(ctx, 22*8, " # - Singularities  ")
    }
}

class PasswordScreen {
    constructor() {
        this.posx = 0;
        this.posy = 0;
        this.letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789      "
        this.perline = 7;
        this.width = this.perline * 2;
        this.rows = Math.ceil(this.letters.length / this.perline);
        this.triedPass = SaveGame.savedPass;
        if (this.triedPass.length == 5) {
            this.posy = this.rows - 1;
            this.posx = this.perline - 1;
        }
        this.lastInvalid = false;

        this.timer = 0;

        music.playMusic("steady");
    }
    update() {
        this.timer++;
        if (this.timer > 100)
            this.timer = 0;
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
        for (var i = 0; i < (256/16); i++)
            for (var j = 0; j < (192/16); j++) {
                ctx.drawImage(gfx.tiles, (254-8)*16, 0, 16, 16, i*16, j*16, 16, 16);
            }
        ctx.fillRect(Game.center.x - 10*8, 4, 20*8, 4*8); 
        drawCenteredText(ctx, 8, "Space Ava");
        drawCenteredText(ctx, 24, this.lastInvalid? "Invalid password!" : "Enter your password");

        ctx.fillRect(24, 40, 15*8, 12*8 + 4); 
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
        drawText(ctx, x-8, y, "OK!");

        ctx.fillRect(172, 40, 7*8, 3*8); 
        var char = this.triedPass.length == 5 ? 254 : 25;
        drawText(ctx, this.triedPass.length*8 + 180, 40, [char]);
        var drawStrip = this.triedPass;
        while (drawStrip.length < 5)
            drawStrip = drawStrip + "_";
        drawText(ctx, 180, 48, drawStrip);

        ctx.fillRect(172 + 1*8, 80, 4*8, 5*8);
        ctx.drawImage(gfx.tiles, 16, 0, 16, 16, 188, 88+11, 16, 16);
        ctx.drawImage(gfx.objects, 16 + (this.timer < 50 ? 0: 11*16), 0, 16, 16, 188, 88, 16, 16);

        ctx.fillRect(4, 18*8 + 4, 31*8, 5*8); 
        drawCenteredText(ctx, 19*8, "Pause, Continue: Add character")
        drawCenteredText(ctx, 20*8, "Reset: Backspace")
        drawCenteredText(ctx, 22*8, "Choose 'OK' when complete")
    }

    submit() {
        if (this.triedPass == "HELP ") {
            runner = new LevelSelect();
            return;
        }
        if (this.triedPass == "TITLE") {
            runner = new TitleScreen();
            return;
        }
        if (this.triedPass == "D8B5G") {
            __debug = !__debug
            runner = new TitleScreen();
            music.playSound("ghost");
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

class ArcadeResultsScreen {
    constructor(data, par, total) {
        this.data = data;
        this.par = par;
        this.total = total;
        this.stages = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12];
        this.timer = 0;
        music.playMusic('spaceless');
        this.showTotal = false;

        for (var i = 0; i < this.stages.length; i++) {
            if (this.data[this.stages[i]] > 9999)
                this.data[this.stages[i]] = 9999;
        }
    }

    draw(ctx) {
        for (var i = 0; i < (256/16); i++)
            for (var j = 0; j < (192/16); j++) {
                ctx.drawImage(gfx.tiles, (254-9)*16, 0, 16, 16, i*16, j*16, 16, 16);
            }

        ctx.fillRect(Game.center.x - 9*8, 4, 18*8, 3*8); 
        drawCenteredText(ctx, 8, "Space Ava");
        drawCenteredText(ctx, 16, "Arcade Results");

        ctx.fillRect(Game.center.x - 14*8, 36, 28*8, 14*8+4); 
        drawText(ctx, 24, 40, "               Turns   Par")
        var tiles = Math.min(Math.floor(this.timer/40), this.stages.length)
        for(var i = 0; i < tiles; i++) {
            let stg = (this.stages[i] + 1).toString();
            if (this.stages[i] < 9)
                stg = stg + " ";
            let data = this.data[this.stages[i]].toString();
            if (data.length < 4)
                while(data.length < 4)
                    data = " " + data;
            let par = this.par[this.stages[i]].toString();
            if (par.length < 3)
                while(par.length < 3)
                    par = " " + par;
            drawText(ctx, 24, 52 + (8*i), "Singularity"+stg+"   "+data+"   "+par);
        }

        ctx.fillRect(Game.center.x - 14*8, 160, 28*8, 16); 
        if (this.showTotal) {
            if (__debug) {
                drawText(ctx, 24, 164, "Total Score:    DEBUG MODE");
                return
            }
            drawText(ctx, 24, 164, "Total Score:    "+this.total.toString());
        }
    }

    update() {
        if (this.timer < ((this.stages.length) * 40)) {
            this.timer++;
            if (this.timer % 40 == 0 && this.timer !== 0)
                music.playSound('ding1');
        } else if (this.timer < ((this.stages.length) * 40) + 80) {
            this.timer ++;
            if (this.timer == ((this.stages.length) * 40) + 80) {
                music.playSound('get');
                this.showTotal = true;
            }
        } else {
            if (Controls.Enter || Controls.Shoot) {
                new Governor(Script.tickerTape.length-1);
            }
        }
    }
}
