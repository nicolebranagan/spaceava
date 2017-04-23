'use strict';
class Game {
    constructor(stage, winfunc, arcade, arcadefunc, turns, deaths) {
        this.winfunc = winfunc;
        this.diefunc = null;
        this.level = stage;
        this.stage = new Game.stage(worldfile.rooms[stage]);
        this.music = worldfile.rooms[stage].music;
        this.bg = worldfile.rooms[stage].bg;
        var start = worldfile.rooms[stage].startpoint;
        this.player = new Game.object.player(this, new Point(start[1],start[2]));
        this.player.layer = start[0];
        this.turns = turns ? turns : 0;
        this.enemies = this.stage.getEnemies(this);
        this.mode = Game.Mode.STARTUP;
        this.startTimer = 0;
        this.startString = "Singularity" + (stage+1).toString();
        this.willDie = false;
        this.arcade = arcade;
        this.arcadefunc = arcadefunc;
        this.deaths = deaths ? deaths : 0;

        if (!this.arcade)
            SaveGame.savePass(stage);

        this.winCount = 0;
        for (var i = 0; i < this.enemies.length; i++) {
            if (this.enemies[i].need)
                this.winCount++;
        }
        this.winGot = 0;
        music.playMusic("");
        music.clearQueue();
    }
    update() {
        if (this.mode == Game.Mode.STARTUP) {
            this.startTimer++;
            if (this.startTimer == 225) {
                this.mode = Game.Mode.PLAYER
                music.playMusic(this.music);
            } else
                return;
        } else if (this.mode == Game.Mode.PAUSED) {
            if (Controls.Enter) {
                Controls.Enter = false;
                music.pauseMusic();
                this.mode = Game.Mode.PLAYER;
            } else
                return;
        } else if (this.mode == Game.Mode.DIE_ANIM) {
            this.deathTimer++;
            if (this.deathTimer == 150) {
                if (!this.diefunc)
                    runner = new Game(this.level, this.winfunc, this.arcade, this.arcadefunc, this.turns, this.deaths + 1);
                else
                    this.diefunc();
            }
            //return;
        } else if (this.mode == Game.Mode.WIN_ANIM) {
            if (this.arcade) {
                runner = new Game.resultsScreen(this);
            }
            this.winTimer++;
            if (this.winTimer == 150) {
                this.winfunc();
            }
        }

        if (this.mode == Game.Mode.PLAYER && Controls.Enter) {
            Controls.Enter = false;
            music.pauseMusic();
            this.mode = Game.Mode.PAUSED;
        }

        // Check if mode should be changed
        var changeMode = true;
        if (!this.player.ready) {
            changeMode = false;
        } else {
            for (var i = 0; i < this.enemies.length; i++) {
                if (!this.enemies[i].ready) {
                    changeMode = false;
                    break;
                }
            }
        }
        if (changeMode) {
            music.playQueue();
            if (this.mode == Game.Mode.PLAYER)
                this.mode = Game.Mode.PLAYER_ANIM
            else if (this.mode == Game.Mode.PLAYER_ANIM){
                if (this.winGot == this.winCount) {
                    this.mode = Game.Mode.WIN_ANIM;
                    this.player.mode = Game.object.player.Mode.WIN_ANIM;
                    this.winTimer = 0;
                    music.playMusic("power");
                } else if (this.willDie) {
                    this.deathTimer = 0;
                    this.mode = Game.Mode.DIE_ANIM;
                    this.player.hurt();
                    this.deathTimer = 0;
                    music.playMusic("");
                    if (!this.dieMusic)
                        music.playSound("die");
                    else
                        music.playMusic(this.dieMusic);
                } else
                    this.mode = Game.Mode.ENEMY
            } else if (this.mode == Game.Mode.ENEMY)
                this.mode = Game.Mode.ENEMY_ANIM
            else if (this.mode == Game.Mode.ENEMY_ANIM) {
                if (this.willDie) {
                    this.deathTimer = 0;
                    this.mode = Game.Mode.DIE_ANIM;
                    this.player.hurt();
                    this.deathTimer = 0;
                    music.playMusic("");
                    if (!this.dieMusic)
                        music.playSound("die");
                    else
                        music.playMusic(this.dieMusic);
                } else
                    this.mode = Game.Mode.PLAYER
                this.turns++;
            }

            this.player.ready = false;
            this.enemies.forEach((e) => e.ready = false);
        }

        // Run the update cycle
        this.player.update(this.mode);
        this.enemies.forEach((e) => {
                e.update(this.mode);
                if (e.active == false) {
                    var index = this.enemies.indexOf(e);
                    this.enemies.splice(index, 1);
                };
            });
    }
    draw(ctx) {
        var drawBg = true;
        var drawStage = true;
        var drawSprites = true;
        var drawPlayer = true;
        if (this.mode === Game.Mode.STARTUP) {
            if (this.level !== 12)
                drawStage = (this.startTimer > 75);
            else {
                drawStage = false;
                drawBg = false;
            }
            drawSprites = (this.startTimer > 150)
            drawPlayer = false;
        } else if (this.mode === Game.Mode.PAUSED || this.mode === Game.Mode.DIE_ANIM || 
            (this.mode === Game.Mode.WIN_ANIM) && this.level !== 12) {
            drawSprites = false;
        }
        if (this.level == 12 && ((this.mode === Game.Mode.DIE_ANIM) || (this.mode == Game.Mode.PAUSED))) {
            drawBg = false;
            drawStage = false;
        }

        if (drawBg) {
            for (var i = 0; i < (256/16)+1; i++)
                for (var j = 0; j < (192/16); j++) {
                    ctx.drawImage(gfx.tiles, (254-this.bg)*16, 0, 16, 16, i*16-j, j*16, 16, 16);
            }
        }

        if (drawStage) {
            var drawPt = new Point(this.player.point).multiply(8).add(this.player.offset);
            if (this.stage.centered)
                drawPt = new Point(this.stage.center);
            else if (this.stage.centerx)
                drawPt = new Point(this.stage.center.x, drawPt.y);
            else if (this.stage.centery)
                drawPt = new Point(drawPt.x, this.stage.center.y)
            drawPt = drawPt.getIsometric();
            drawPt.y = drawPt.y - 8;
            this.stage.drawBase(ctx, drawPt, i);

            var enemy_drawables = [];
            for (var i = 0; i < this.enemies.length; i++) {
                var d = this.enemies[i].draw(drawPt);
                if (d.position.layer == -1)
                    d.draw(ctx);
                else {
                    enemy_drawables.push(d);
                }
            }

            var drawables = [];
            for (var i = 0; i <= this.stage.layers; i++) {
                if (i !== 0 && i !== this.stage.layers)
                    drawables = drawables.concat(this.stage.getDrawables(i, drawPt));
                if (i == this.player.layer+1 && drawPlayer)
                    drawables.push(this.player.draw(drawPt));
                for (var j = 0; j < enemy_drawables.length; j++) {
                    if (!drawSprites)
                        break;
                    var e = enemy_drawables[j];
                    if (e.position.layer == i)
                        drawables.push(e);
                }
            }
            drawables.sort(
                function(a,b) {
                    if (a.position.layer !== b.position.layer) {
                        return a.position.layer - b.position.layer;
                    } else if (a.position.y !== b.position.y) {
                        return a.position.y - b.position.y;
                    } else if (a.position.x !== b.position.x) {
                        return a.position.x - b.position.x;
                    } else {
                        return (drawables.indexOf(b) - drawables.indexOf(a));
                    }
                }
            );
            /*drawables.stablesort(function(a,b) {
                return a.position.x - b.position.x;
            });
            drawables.stablesort(function(a,b) {
                return a.position.y - b.position.y;
            });
            drawables.stablesort(function(a,b) {
                return a.position.layer - b.position.layer;
            });*/
            drawables.forEach(function (e) {e.draw(ctx);});
        } else if (drawPlayer) {
            var drawPt = this.stage.center.getIsometric();
            drawPt.y -= 8;
            this.player.draw(drawPt).draw(ctx);
        }

        if (this.mode == Game.Mode.STARTUP && Math.floor(this.startTimer / 20) % 2 == 0) {
            drawCenteredText(ctx, 80, this.startString);            
        } else if (this.mode == Game.Mode.PAUSED) {
            drawCenteredText(ctx, 72, "Paused");
            if (!this.arcade) {
                drawCenteredText(ctx, 88, "Password:");
                drawCenteredText(ctx, 96, SaveGame.getPass(this.level));
            }
        }
        if (drawBg)
            for (var j = 0; j < (256/16); j++) {
                ctx.drawImage(gfx.tiles, (255)*16, 0, 16, 16, j*16, 0, 16, 16);
            }

        if (__debug) {
            drawText(ctx, 0, 8, "M"+this.mode.toString());
            drawText(ctx, 0, 16, "T"+this.turns.toString());
        }
    }
    hurt(hurter, mus) {
        this.willDie = true;
        if (mus)
            this.dieMusic = mus;
    }
    win() {
        this.winGot++;
        return (this.winGot === this.winCount)
    }
    hookDeath(func) {
        this.diefunc = func;
    }
}

// Static members
Game.center = new Point(gamecanvas.width / 2, gamecanvas.height / 2);

Game.Mode = {
    PLAYER: 0,
    PLAYER_ANIM: 1,
    ENEMY: 2,
    ENEMY_ANIM: 3,

    PAUSED: -1,
    STARTUP: -2,
    DIE_ANIM: -3,
    WIN_ANIM: -4,
}

Game.TileType = {
    EMPTY: 0,
    SOLID: 1,
    // Slopes named after which side is the low side
    SLOPE_DOWN: 2,
    SLOPE_UP: 3,
    SLOPE_LEFT: 4,
    SLOPE_RIGHT: 5,
}

Game.nullDrawable = {
    position: Position.null,
    draw: function(ctx) { return; }
}

Game.stage = class {
    constructor(room) {
        this.source = room;
        this.width = room.width;
        this.height = room.height;
        this.layers = room.tiles.length;
        this.tileMap = room.tiles.slice();
        for (var i = 0; i < this.layers; i++) {
            this.tileMap[i] = this.tileMap[i].slice();
        }
        this.registeredPoints = [];
        this.key = worldfile.key;
        this.code = 0;

        this.centered = false;
        this.centerx = false;
        this.centery = false;
        for (var i = 0; i < room.properties; i++) {
            switch (room.properties[i]) {
                case Game.stage.Properties.CENTERED:
                    this.centered = true;
                    break;
                case Game.stage.Properties.CENTER_X:
                    this.centerx = true;
                    break;
                case Game.stage.Properties.CENTER_Y:
                    this.centery = true;
                    break;
            }
        }

        this.buffer = document.createElement('canvas');
        this.buffer.height = (2+this.width+this.height)*4+16;
        this.buffer.width = (2+this.width+this.height)*8+16;
        this.renderLayer(this.buffer.getContext('2d'), 0);
        this.center = new Point(this.width * 4, this.height * 4);
    }
    getWidth() {
        return this.buffer.width;
    }
    register(pt, layer, type) {
        var code = ++this.code;
        this.registeredPoints.push(
            {
                pt: pt,
                layer: layer,
                type: type,
                code: code,
            }
        );
        return code;
    }
    unregister(code) {
        for (var i = 0; i < this.registeredPoints.length; i++) {
            var pt = this.registeredPoints[i];
            if (pt.code === code) {
                this.registeredPoints.splice(i, 1);
                break;
            }
        }
    }
    set(pt, layer, tile) {
        if (layer == 0)
            return false;
        this.tileMap[layer][this.width * pt.y + pt.x] = tile;
        return true;
    }
    getTile(pt,layer) {
        if (pt.x < 0 || pt.x >= this.width || pt.y < 0 || pt.y >= this.height)
            return 0;
        if (layer >= this.layers || layer < 0)
            return 0;
        return this.tileMap[layer][pt.x + pt.y*this.width];
    }
    getTileType(pt, layer) {
        for (var i = 0; i < this.registeredPoints.length; i++) {
            var e = this.registeredPoints[i];
            if (e.pt.equals(pt) && e.layer == layer)
                return e.type;
        }
        return this.key[this.getTile(pt, layer)];
    }
    onSlope(pt, layer) {
        var tile = this.getTileType(pt, layer);
        return ((tile == Game.TileType.SLOPE_UP) || (tile == Game.TileType.SLOPE_DOWN)
            || (tile == Game.TileType.SLOPE_LEFT) || (tile == Game.TileType.SLOPE_RIGHT))
    }
    renderLayer(ctx, layer) {
        this.getDrawables(layer).forEach(function (e) {e.draw(ctx);});
    }
    getDrawables(layer, ctrpt) {
        var out = [];
        var base = this;
        var drawTile = (ctx, pt, tile) => {if (tile == 0) return; ctx.drawImage(gfx.tiles, (tile)*16, 0, 16, 16, pt.x , pt.y, 16, 16)};
            for(let i = 0; i < this.width; i++) {
                for (let j = 0; j < this.height; j++) {
                    if (this.getTile(new Point(i,j), layer) == 0)
                        continue;
                    var drawable = {};
                    drawable.draw = function (ctx) {
                        drawTile(ctx, this.coord, base.getTile(new Point(i,j), layer));
                    };
                    drawable.coord = new Point((i-layer)*8, (j-layer)*8).getIsometric();
                    drawable.position = new Position(i, j, layer-1);
                    if (ctrpt) {
                        var iso_pt = new Point(ctrpt.x, ctrpt.y);
                        var ctr_x = -iso_pt.x + Game.center.x - 8;
                        var ctr_y = -iso_pt.y + Game.center.y + 2;
                        drawable.coord.add(new Point(ctr_x, ctr_y));
                    } else {
                        drawable.coord.x += ((base.width+base.height)*4)
                    }
                    out.push(drawable);
                }
            }
        return out;
    }
    getEnemies(parent) {
        var enemyList = [];
        this.source.objects.forEach(function(e) {
            var enemy = eval(e[0]);
            enemy.layer = e[1];
            enemy.initialize(parent, new Point(e[2], e[3]))
            enemyList.push(enemy)
        });
        return enemyList;
    }
    // Draws the base layer at the center, centered on a given coordinate
    drawBase(ctx,pt) {
        var iso_pt = new Point(pt.x, pt.y);
        var ctr_x = -iso_pt.x + Game.center.x - ((this.width+this.height)*4) - 8;
        var ctr_y = -iso_pt.y + Game.center.y + 2;
        ctx.drawImage(this.buffer,ctr_x,ctr_y);
        //return new Point(Game.center).subtract(iso_pt);
    }
}

Game.stage.Properties = {
    CENTERED: 1,
    CENTER_X: 2,
    CENTER_Y: 3,
}

Game.resultsScreen = class {
    constructor(parent) {
        this.parent = parent;
        this.mode = Game.resultsScreen.State.OPEN_BOX;
        
        this.timer = 0;
        // These are rectangular radiuses, not heights
        this.boxw = 0;
        this.boxh = 0;
    }

    draw(ctx) {
        this.parent.draw(ctx);
        ctx.fillRect(Game.center.x - this.boxw, Game.center.y - this.boxh, 2 * this.boxw, 2 * this.boxh); 
        if (this.mode == Game.resultsScreen.State.DISPLAY) {
            drawCenteredText(ctx, 8*8, "Results" + (this.parent.level + 1).toString());
            drawText(ctx, 11*8, 10*8, "Turns: " + this.parent.turns.toString());
            drawText(ctx, 11*8, 11*8, "Par: ");          
            drawText(ctx, 11*8, 13*8, "Deaths: " + this.parent.deaths.toString());
            drawCenteredText(ctx, 15*8, "Press 'Pause'")
        }
    }

    update() {
        switch (this.mode) {
            case Game.resultsScreen.State.OPEN_BOX:
                this.open_box();
            break;
            case Game.resultsScreen.State.DISPLAY:
                this.cycle();
            break;
        }
    }

    open_box() {
        var goalh = 5*8;
        var goalw = 8*8;

        if (this.boxh != goalh) {
            this.boxh++;
        }
        if (this.boxw != goalw) {
            this.boxw++;
        }

        if (this.boxh == goalh && this.boxw == goalw) {
            this.mode = Game.resultsScreen.State.DISPLAY;
        }
    }

    cycle() {
        if (Controls.Enter) {
            this.parent.winfunc();
        }
    }

}

Game.resultsScreen.State = {
    OPEN_BOX: 1,
    DISPLAY: 2,
}
