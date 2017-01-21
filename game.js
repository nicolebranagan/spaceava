'use strict';
class Game {
    constructor(stage, winfunc) {
    this.winfunc = winfunc;
    this.stage = new Game.stage(worldfile.rooms[stage]);
    this.player = new Game.object.player(this, new Point(0,0));
    this.turns = 0;
    this.enemies = this.stage.getEnemies(this);
    this.mode = Game.Mode.PLAYER;
    }
    update() {
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
            if (this.mode == Game.Mode.PLAYER)
                this.mode = Game.Mode.PLAYER_ANIM
            else if (this.mode == Game.Mode.PLAYER_ANIM)
                this.mode = Game.Mode.ENEMY
            else if (this.mode == Game.Mode.ENEMY)
                this.mode = Game.Mode.ENEMY_ANIM
            else if (this.mode == Game.Mode.ENEMY_ANIM)
                this.mode = Game.Mode.PLAYER

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
            for (var j = 0; j < this.enemies.length; j++) {
                var e = this.enemies[j];
                if (e.layer == i)
                    drawables.push(e.draw(drawPt));
            }
            if (i == this.player.layer)
                drawables.push(this.player.draw(drawPt));
        }
        drawables.sort(function(a,b) {
            return a.position.x - b.position.x;
        });
        drawables.sort(function(a,b) {
            return a.position.y - b.position.y;
        });
        drawables.forEach(function (e) {e.draw(ctx);});
    }
}

Game.center = new Point(gamecanvas.width / 2, gamecanvas.height / 2);
Game.Mode = {
    PAUSED: -1,
    PLAYER: 0,
    PLAYER_ANIM: 1,
    ENEMY: 2,
    ENEMY_ANIM: 3
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

Game.stage = class {
    constructor(room) {
        this.source = room;
        this.width = room.width;
        this.height = room.height;
        this.layers = room.tiles.length;
        this.tileMap = room.tiles;
        this.registeredPoints = [];
        this.key = worldfile.key;

        this.buffer = document.createElement('canvas');
        this.buffer.height = (this.width+this.height)*4+8;
        this.buffer.width = (this.width+this.height)*8+8;
        this.renderLayer(this.buffer.getContext('2d'), 0);
    }
    register(pt, layer, type) {
        this.registeredPoints.push(
            {
                pt: pt,
                layer: layer,
                type: type
            }
        );
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
        var iso_pt = new Point(pt.x, pt.y).getIsometric();
        var ctr_x = -iso_pt.x + Game.center.x - ((this.width+this.height)*4) - 8;
        var ctr_y = -iso_pt.y + Game.center.y + 2;
        ctx.drawImage(this.buffer,ctr_x,ctr_y);
        //return new Point(Game.center).subtract(iso_pt);
    }
}