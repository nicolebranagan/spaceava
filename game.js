'use strict';
var Game = function() {
    this.stage = new Game.stage(10, 2);
    this.player = new Game.object(new Point(0,0));
    this.turns = 0;
    this.enemies = []; // Generate from Game.stage most likely
};
Game.center = new Point(gamecanvas.width / 2, gamecanvas.height / 2);
Game.Mode = {
    PAUSED: -1,
    PLAYER: 0,
    PLAYER_ANIM: 1,
    ENEMY: 2,
    //ENEMY_ANIM: 3
}

Game.prototype = {
    mode: Game.Mode.PLAYER,
    update: function() {
        if (this.mode == Game.Mode.PLAYER) {
            if (this.player.ready) {
                this.player.ready = false;
                this.mode = Game.Mode.PLAYER_ANIM;
            }
        } else if (this.mode == Game.Mode.PLAYER_ANIM) {
            if (this.player.ready) {
                this.player.ready = false;
                this.mode = Game.Mode.ENEMY;
            }
        } else if (this.mode == Game.Mode.ENEMY) {
            var ready = true;
            for (var i = 0; i < this.enemies.length; i++) {
                if (!this.enemies[i].ready) {
                    ready = false;
                    break;
                }
            }
            if (ready) {
                this.enemies.forEach(function(e) {e.ready = false;})
                this.mode = Game.Mode.PLAYER;
                this.turns++;
            }
        }
        this.player.update(this.mode);
        this.enemies.forEach((e) => {e.update(this.mode)});
    },
    draw: function(ctx) {
        if (__debug) {
            drawText(ctx, 0, 8, "M"+this.mode.toString());
            drawText(ctx, 0, 16, "T"+this.turns.toString());
        }
        var drawPt = new Point(this.player.point).multiply(8).add(this.player.offset);
        this.stage.drawBase(ctx, drawPt, i);
        var drawables = [];
        for (var i = 0; i < this.stage.layers; i++) {
            if (i !== 0)
                drawables = drawables.concat(this.stage.getDrawables(i, drawPt));
            if (i == this.player.layer)
                drawables.push(this.player.draw(drawPt));
        }
        drawables.sort(function(a,b) {
            return a.position.x - b.position.x;
        });
        drawables.sort(function(a,b) {
            return a.position.y - b.position.y;
        });
        drawables.forEach(function (e) {e.draw(ctx);})
    }
}

Game.object = function(pt) {
    this.point = pt;
    this.facing = Dir.Down;
    this.frame = 1;
    this.frameMax = 3;
    this.timerMax = 15;
    this.timer = this.timerMax;
    this.up = true;
    this.layer = 0;
    this.ready = false;
    this.animFrame = -1;
    this.offset = new Point(0,0);
}

Game.object.prototype = {
    update: function(mode) {
        this.timer--;
        if (this.timer == 0) {
            this.timer = this.timerMax;
            if (this.up)
                this.frame++;
            else
                this.frame--;
            if (this.frame == this.frameMax) {
                this.frame = this.frame - 2;
                this.up = false;
            } else if (this.frame == -1) {
                this.frame = this.frame + 2;
                this.up = true;
            }
        }
        
        if (mode == Game.Mode.PLAYER && !this.ready)
            this.cycle();
        if (mode == Game.Mode.PLAYER_ANIM && !this.ready) {
            this.animate();
        }
    },

    cycle: function() {
        // TODO: Create actual controls
        if (Controls.Up) {
            Controls.Up = false;
            this.facing = Dir.Up;
            //this.point.y--;
            this.ready = true;
            this.moving = true;
        } else if (Controls.Down) {
            Controls.Down = false;
            this.facing = Dir.Down;
            //this.point.y++;
            this.ready = true;
            this.moving = true;
        } else if (Controls.Left) {
            Controls.Left = false;
            this.facing = Dir.Left;
            //this.point.x--;
            this.ready = true;
            this.moving = true;
        } else if (Controls.Right) {
            Controls.Right = false;
            this.facing = Dir.Right;
            //this.point.x++;
            this.ready = true;
            this.moving = true;
        }
    },

    animate: function() {
        if (this.timer % 2 !== 0)
            return;
        this.animFrame++;
        if (this.animFrame == 8) {
            if (this.facing == Dir.Up) {
                this.point.y--;
            } else if (this.facing == Dir.Down) {
                this.point.y++;
            } else if (this.facing == Dir.Left) {
                this.point.x--;
            } else if (this.facing == Dir.Right) {
                this.point.x++;
            }
            this.offset = new Point(0,0);
            this.animFrame = -1;
            this.ready = true;
            return;
        }
        if (this.facing == Dir.Up) {
            this.offset.y = -this.animFrame;
        } else if (this.facing == Dir.Down) {
            this.offset.y = +this.animFrame;
        } else if (this.facing == Dir.Left) {
            this.offset.x = -this.animFrame;
        } else if (this.facing == Dir.Right) {
            this.offset.x = +this.animFrame;
        }
    },

    draw: function(ctr) {
        var drawable = {};
        var base = this;
        var iso_pt = new Point(ctr.x, ctr.y).getIsometric();
        ctr = new Point(Game.center).subtract(iso_pt);
        var iso_c = new Point((this.point.x-this.layer)*8+this.offset.x, (this.point.y-this.layer)*8+this.offset.y).getIsometric();
        iso_c.add(ctr);
        drawable.coord = iso_c.subtract(new Point(8, 8));
        drawable.position = new Position(this.point.x, this.point.y, this.layer);
        drawable.draw = function(ctx) {
            ctx.drawImage(gfx.player, (base.facing*3 + base.frame)*16, 0, 16, 16, iso_c.x, iso_c.y, 16, 16);
        }
        return drawable;
    }
}

Game.stage = function(width, layers) {
    this.width = width;
    this.height = width;
    this.layers = 2;
    this.tileMap = [];
    for (var i = 0; i < this.layers; i++) {
        this.tileMap.push([]);
        for (var j = 0; j < (this.width*this.height); j++)
            this.tileMap[i].push(i == 0 ? 1 : 0);
    }
    this.tileMap[0][40] = 2;
    this.tileMap[0][15] = 0;
    this.tileMap[0][16] = 0;
    this.tileMap[0][25] = 0;
    this.tileMap[0][26] = 0;
    this.tileMap[1][11] = 1;
    this.tileMap[1][21] = 2;
    this.tileMap[1][31] = 1;
    this.tileMap[1][41] = 3;
    this.buffer = document.createElement('canvas');
    this.buffer.height = (this.width+this.height)*4+8;
    this.buffer.width = (this.width+this.height)*8+8;
    this.renderLayer(this.buffer.getContext('2d'), 0);
}

Game.stage.prototype = {
    getTile: function(pt,layer) {
        return this.tileMap[layer][pt.x + pt.y*this.width];
    },
    renderLayer: function(ctx, layer) {
        this.getDrawables(layer).forEach(function (e) {e.draw(ctx);});
    },
    getDrawables: function(layer, ctrpt) {
        var out = [];
        var base = this;
        var drawTile = (ctx, pt, tile) => {if (tile == 0) return; ctx.drawImage(gfx.player, (16-tile)*16, 0, 16, 16, pt.x , pt.y, 16, 16)};
            for(let i = 0; i < this.width; i++) {
                for (let j = 0; j < this.height; j++) {
                    if (this.getTile(new Point(i,j), layer) == 0)
                        continue;
                    var drawable = {};
                    drawable.draw = function (ctx) {
                        drawTile(ctx, this.coord, base.getTile(new Point(i,j), layer));
                    };
                    drawable.coord = new Point((i-layer)*8, (j-layer)*8).getIsometric();
                    drawable.position = new Position(i, j, layer);
                    if (ctrpt) {
                        var iso_pt = new Point(ctrpt.x, ctrpt.y).getIsometric();
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
    },
    // Draws the base layer at the center, centered on a given coordinate
    drawBase: function(ctx,pt) {
        var iso_pt = new Point(pt.x, pt.y).getIsometric();
        var ctr_x = -iso_pt.x + Game.center.x - ((this.width+this.height)*4) - 8;
        var ctr_y = -iso_pt.y + Game.center.y + 2;
        ctx.drawImage(this.buffer,ctr_x,ctr_y);
        //return new Point(Game.center).subtract(iso_pt);
    }
}