'use strict';
var Game = function() {
    this.stage = new Game.stage(10, 2);
    this.player = new Game.object(new Point(0,0));
};
Game.center = new Point(gamecanvas.width / 2, gamecanvas.height / 2);

Game.prototype = {
    update: function() {
        this.player.update();

        if (Controls.Up) {
            Controls.Up = false;
            this.player.facing = Dir.Up;
            this.player.point.y--;
        } else if (Controls.Down) {
            Controls.Down = false;
            this.player.facing = Dir.Down;
            this.player.point.y++;
        } else if (Controls.Left) {
            Controls.Left = false;
            this.player.facing = Dir.Left;
            this.player.point.x--;
        } else if (Controls.Right) {
            Controls.Right = false;
            this.player.facing = Dir.Right;
            this.player.point.x++;
        }
    },
    draw: function(ctx) {
        var drawPt = this.player.point;
        this.stage.drawBase(ctx, this.player.point, i);
        var drawables = [];
        for (var i = 0; i < this.stage.layers; i++) {
            if (i !== 0)
                drawables = drawables.concat(this.stage.getDrawables(i, drawPt));
            if (i == this.player.layer)
                drawables.push(this.player.draw(drawPt));
        }
        drawables.sort(function(a,b) {
            return a.coord.x - b.coord.x;
        });
        drawables.sort(function(a,b) {
            return a.coord.y - b.coord.y;
        });
        console.log(drawables);
        drawables.forEach(function (e) {e.draw(ctx);})
    }
}

Game.object = function(pt) {
    this.point = pt;
    this.facing = Dir.Down;
    this.cycle = 1;
    this.cycleMax = 3;
    this.cyclerMax = 15;
    this.cycler = this.cyclerMax;
    this.up = true;
    this.layer = 0;
}

Game.object.prototype = {
    update: function() {
        this.cycler--;
        if (this.cycler == 0) {
            this.cycler = this.cyclerMax;
            if (this.up)
                this.cycle++;
            else
                this.cycle--;
            if (this.cycle == this.cycleMax) {
                this.cycle = this.cycle - 2;
                this.up = false;
            } else if (this.cycle == -1) {
                this.cycle = this.cycle + 2;
                this.up = true;
            }
        }
    },

    draw: function(ctr) {
        var drawable = {};
        var base = this;
        var iso_pt = new Point(ctr.x*8, ctr.y*8).getIsometric();
        ctr = new Point(Game.center).subtract(iso_pt);
        var iso_c = new Point((this.point.x-this.layer)*8, (this.point.y-this.layer)*8).getIsometric();
        iso_c.add(ctr);
        drawable.coord = iso_c.subtract(new Point(8, 8));
        drawable.draw = function(ctx) {
            ctx.drawImage(gfx.player, (base.facing*3 + base.cycle)*16, 0, 16, 16, iso_c.x, iso_c.y, 16, 16);
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
    this.tileMap[1][41] = 2;
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
                    if (ctrpt) {
                        var iso_pt = new Point(ctrpt.x*8, ctrpt.y*8).getIsometric();
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
        var iso_pt = new Point(pt.x*8, pt.y*8).getIsometric();
        var ctr_x = -iso_pt.x + Game.center.x - ((this.width+this.height)*4) - 8;
        var ctr_y = -iso_pt.y + Game.center.y + 2;
        ctx.drawImage(this.buffer,ctr_x,ctr_y);
        //return new Point(Game.center).subtract(iso_pt);
    }
}