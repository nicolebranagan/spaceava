'use strict';
var Game = function() {
    this.stage = new Game.stage(10, 2);
    this.player = new Game.object(this, new Point(0,0));
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
Game.TileType = {
    EMPTY: 0,
    SOLID: 1,
    // Slopes named after which side is the low side
    SLOPE_DOWN: 2,
    SLOPE_UP: 3,
    SLOPE_LEFT: 4,
    SLOPE_RIGHT: 5,
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

Game.object = function(parent, pt) {
    this.parent = parent;
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
    this.moving = false;
    this.offset = new Position(0,0,0);
    this.dy = 0;
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
        
        if (this.ready)
            return;

        if (mode == Game.Mode.PLAYER)
            this.cycle();
        if (mode == Game.Mode.PLAYER_ANIM) {
            if (!this.moving)
                this.ready = true;
            else
                this.animate();
        }
    },

    cycle: function() {
        // TODO: Create actual controls
        if (Controls.Up) {
            Controls.Up = false;
            this.facing = Dir.Up;
            this.ready = true;
            //this.moving = true;
        } else if (Controls.Down) {
            Controls.Down = false;
            this.facing = Dir.Down;
            this.ready = true;
            //this.moving = true;
        } else if (Controls.Left) {
            Controls.Left = false;
            this.facing = Dir.Left;
            this.ready = true;
            //this.moving = true;
        } else if (Controls.Right) {
            Controls.Right = false;
            this.facing = Dir.Right;
            this.ready = true;
            //this.moving = true;
        }
        if (this.ready) {
            var test = new Point(this.point);
            if (this.facing == Dir.Up)
                test.y--;
            else if (this.facing == Dir.Down)
                test.y++;
            else if (this.facing == Dir.Left)
                test.x--;
            else if (this.facing == Dir.Right)
                test.x++;
            var onTile = this.parent.stage.getTile(this.point, this.layer);
            var testTile = this.parent.stage.getTileType(test,this.layer);
            var upTile = this.parent.stage.getTileType(test,this.layer+1);
            var downTile = this.parent.stage.getTileType(test, this.layer-1);
            if (testTile == Game.TileType.SOLID && upTile == Game.TileType.EMPTY) {
                this.moving = true;
            } else if ((upTile == Game.TileType.SLOPE_UP && this.facing == Dir.Up)
                    || (upTile == Game.TileType.SLOPE_DOWN && this.facing == Dir.Down)
                    || (upTile == Game.TileType.SLOPE_LEFT && this.facing == Dir.Left)
                    || (upTile == Game.TileType.SLOPE_RIGHT && this.facing == Dir.Right)) {
                this.dy = +1;
                this.moving = true;
                this.layer = this.layer + 1;
            } else if ((onTile == Game.TileType.SLOPE_UP && this.facing == Dir.Down)
                    || (onTile == Game.TileType.SLOPE_DOWN && this.facing == Dir.Up)
                    || (onTile == Game.TileType.SLOPE_LEFT && this.facing == Dir.Right)
                    || (onTile == Game.TileType.SLOPE_RIGHT && this.facing == Dir.Left)
                    && this.downTile == Game.TileType.SOLID) {
                this.moving = true;
                this.layer = this.layer - 1;
                this.dy = -1;
            } else if ((testTile == Game.TileType.SLOPE_UP && this.facing == Dir.Down)
                    || (testTile == Game.TileType.SLOPE_DOWN && this.facing == Dir.Up)
                    || (testTile == Game.TileType.SLOPE_LEFT && this.facing == Dir.Right)
                    || (testTile == Game.TileType.SLOPE_RIGHT && this.facing == Dir.Left)
                    && this.downTile == Game.TileType.SOLID) {
                this.moving = true;
            }
            this.offset.layer = -this.dy*8;
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
            this.offset = new Position(0,0,0);
            this.animFrame = -1;
            this.ready = true;
            this.moving = false;
            this.dy = 0;
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

        if (this.dy == 1) {
            this.offset.layer = +this.animFrame-8;
        } else if (this.dy == -1) {
            this.offset.layer = -this.animFrame+8;
        }
    },

    draw: function(ctr) {
        var drawable = {};
        var base = this;
        var iso_pt = new Point(ctr.x, ctr.y).getIsometric();
        ctr = new Point(Game.center).subtract(iso_pt);
        var iso_c = new Point((this.point.x-this.layer)*8+this.offset.x-this.offset.layer, (this.point.y-this.layer)*8+this.offset.y-this.offset.layer).getIsometric();
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
    this.key = [Game.TileType.EMPTY, Game.TileType.SOLID, Game.TileType.SOLID, Game.TileType.SLOPE_UP];
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
        if (pt.x < 0 || pt.x > this.width || pt.y < 0 || pt.y > this.height)
            return 0;
        if (layer >= this.layers || layer < 0)
            return 0;
        return this.tileMap[layer][pt.x + pt.y*this.width];
    },
    getTileType: function(pt, layer) {
        return this.key[this.getTile(pt, layer)];
    },
    onSlope: function(pt, layer) {
        var tile = this.getTileType(pt, layer);
        return ((tile == Game.TileType.SLOPE_UP) || (tile == Game.TileType.SLOPE_DOWN)
            || (tile == Game.TileType.SLOPE_LEFT) || (tile == Game.TileType.SLOPE_RIGHT))
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