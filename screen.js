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

/*var LogoScreen = {
    timer: 0,
    draw: function(ctx) {
        ctx.drawImage(Logo, 0*64, 0*64, 160, 144, 0, 0, 160, 144);
        this.sprite.draw(ctx);
    },
    update: function() {
        this.sprite.update();
        this.timer++;
        if (this.timer > 320) {
            runner = new TextScreen(openingText, function() {runner = new TitleScreen()}, true);
        }
        if (this.timer == 110 || this.timer == 186)
            music.playSound("whistle");
        if (Controls.Enter || Controls.Shoot) {
            Controls.Shoot = false;
            Controls.Enter = false;
            runner = new TextScreen(openingText, function() {runner = new TitleScreen()}, true);
        };
    },
    sprite: {
        frame: 0,
        frameTimer: 0,
        y: 64,
        x: 0,
        draw: function(ctx, jump) {
            var jump = this.y < 48;
            var drawx = this.x - 8;
            var drawy = this.y - 15;
            var offset = this.frame;
            ctx.drawImage(Logo, offset * 16, 144, 16, 16, drawx, drawy, 16, 16);
        },
        update: function() {
            if (LogoScreen.timer % 2 == 0)
                this.x = this.x + 1;
            this.frameTimer++;
            if (this.frameTimer == 20) {
                this.frameTimer = 0;
                this.frame = ((this.frame + 1) % 2);
            };
        }
    }
};

var TextScreen = function(text, run, can_skip) {
    this.text = text;
    this.run = run;
    this.can_skip = can_skip;
};

TextScreen.prototype = {
    timer: 0,
    draw: function(ctx) {
        var cycles = Math.floor(this.timer / 6) - (144);
        for (var i = 0; i < this.text.length; i++) {
            drawCenteredText(ctx, i*16 - cycles, this.text[i]);
        }
    },
    update: function() {
        this.timer++;
        if (this.can_skip && (Controls.Enter || Controls.Shoot)) {
            Controls.Enter = false;
            Controls.Shoot = false;
            this.run();
        }
        if (this.timer > (144*3 + (this.text.length) * 128)) {
            this.run();
        }
    },
};*/

var OptionsScreen = function() {
    this.music = ["No", "music"];
    music.playMusic("");
};

OptionsScreen.prototype = {
    selection: 7,
    currentmusic: 0,
    currentpalette: 0,
    locations: [4*8, 5*8, 6*8, 8*8, 9*8, 11*8, 13*8, 16*8],
    saveFailed: false,
    
    draw: function(ctx) {
        //ctx.drawImage(gfx.objects, 0, 0, 16, 16, 16, 16, 16, 16);
        //ctx.drawImage(gfx.blocks, 14*16, 0, 16, 16, 144 - 16, 16, 16, 16);
        drawCenteredText(ctx, 1*8, "Space Ava");
        drawCenteredText(ctx, 2*8, "Options");
        
        drawText(ctx, 3*8, 4*8, saveEnabled ? "Do save game" : "Do not save game")
        drawText(ctx, 3*8, 5*8, this.saveFailed ? "No save data" : "Save to file");
        drawText(ctx, 3*8, 6*8, "Load from file");

        drawText(ctx, 3*8, 8*8, musicEnabled ? "Music enabled" : "Music disabled");
        drawText(ctx, 3*8, 9*8, soundEnabled ? "Sound enabled" : "Sound disabled");
        drawText(ctx, 3*8, 11*8, "Palette " + this.currentpalette.toString());
        drawText(ctx, 3*8, 13*8, "Sound test");
        drawText(ctx, 5*8, 14*8, this.music[this.currentmusic]);
        
        drawText(ctx, 3*8, 16*8, "Return       v0")
        
        drawText(ctx, 1*8, this.locations[this.selection], [26]);
    },
    
    update: function() {
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
                gfx.adapt(this.currentpalette);
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
                if (this.currentpalette != 0)
                    this.currentpalette--;
            } else if (Controls.Right) {
                Controls.Right = false;
                if (this.currentpalette != (gfx.backgrounds.length - 1))
                    this.currentpalette++;
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
    },
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
                if (__debug) {
                    runner = new LevelSelect();
                    return;
                }
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
    }
    update() {
        if (Controls.Left) {
            Controls.Left = false;
            if (this.posx > 0)
                this.posx--;
        } else if (Controls.Right) {
            Controls.Right = false;
            if (this.posx < (this.perline-1))
                this.posx++;
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
            if (pos < Governor.tickerTape.length) {
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
        for (var i = 0; i < Governor.tickerTape.length; i++) {
            if (i % this.perline == 0) {
                x = 8;
                y += 16;
            } else {
                x += 3*8;
            }
            drawText(ctx, x, y, Governor.tickerTape[i][0]);
        }
    }
}

/*var LoadFileScreen = function(last) {
    this.last = last;
    var block = function(e) {e.preventDefault(); e.stopPropagation();}
    window.ondragover = block;
    window.ondrop = (ev) => {ev.preventDefault(); ev.stopPropagation(); this.drop(ev);}
};

LoadFileScreen.prototype = {
    state: 0,
    draw: function(ctx) {
        if (this.state == 0) {
            drawCenteredText(ctx, 2*8, "Drop save file here");
            ctx.drawImage(gfx.blocks, 16*(13), 0, 16, 16, 8*9, 8*7, 16, 16);
        } else if (this.state == 1) {
            drawCenteredText(ctx, 2*8, "Loading...");
            ctx.drawImage(gfx.blocks, 16*(13+5*16), 0, 16, 16, 8*9, 8*7, 16, 16);
        } else if (this.state == 2) {
            drawCenteredText(ctx, 2*8, "Save file loaded!");
            ctx.drawImage(gfx.blocks, 16*(14+4*16), 0, 16, 16, 8*9, 8*7, 16, 16);
        } else if (this.state == -1) {
            drawCenteredText(ctx, 2*8, "Can't open file");
            ctx.drawImage(gfx.objects, 16*15, 0, 16, 16, 8*9, 8*7, 16, 16);
        } else if (this.state == -2) {
            drawCenteredText(ctx, 2*8, "File is invalid");
            ctx.drawImage(gfx.objects, 16*14, 0, 16, 16, 8*9, 8*7, 16, 16);
        }
        drawCenteredText(ctx, 14*8, "Press any key")
        drawCenteredText(ctx, 15*8, "to exit")
    },
    update: function(ctx) {
        if (Controls.Enter || Controls.Up || Controls.Down || Controls.Left || Controls.Right || Controls.Shoot || Controls.Reset) {
            Controls.Enter = false;
            Controls.Up = false;
            Controls.Down = false;
            Controls.Left = false;
            Controls.Right = false;
            Controls.Shoot = false;
            Controls.Reset = false;
            this.exit();
        }
    },
    drop: function(ev) {
        this.state = 1;
        window.ondrop = null;
        window.ondragover = null;
        try {
            var file = ev.dataTransfer.files[0];
            var reader = new FileReader();
            reader.onload = (e) => {
                if (e.target.readyState != 2) return;
                if (e.target.error) {
                    this.state = -1;
                    music.playSound("die");
                    return;
                }
                this.read(e.target.result);
            }
            reader.readAsText(file);
        } catch(e) {
            this.state = -1;
            music.playSound("die");
            return;
        }   
    },
    read: function(data) {
        var objstring = atob(data);
        if (!objstring.includes("aspect")) {
            // stupid check
            this.state = -2;
            return;
        }
        try {
            JSON.parse(objstring);
            localStorage.setItem('saved', objstring);
            this.state = 2;
        } catch(e) {
            this.state = -2;
        };
    },
    exit: function() {
        window.ondrop = null;
        window.ondragover = null;
        runner = this.last;
    }
};*/