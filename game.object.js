'use strict'
Game.object = class {
    constructor(parent, pt) {
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
    update(mode) {
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
    }
    cycle() {
        this.ready = true;
    }
    animate() {
        if (this.timer % 2 !== 0)
            return;
        this.animFrame++;
        if (this.animFrame == 8) {
            this.offset = new Position(0,0,0);
            if (this.dy == -1)
                this.layer = this.layer - 1;
            this.animFrame = -1;
            this.ready = true;
            this.moving = false;
            this.dy = 0;
            return;
        }
        if (this.animFrame == 4) {
            if (this.facing == Dir.Up) {
                this.point.y--;
            } else if (this.facing == Dir.Down) {
                this.point.y++;
            } else if (this.facing == Dir.Left) {
                this.point.x--;
            } else if (this.facing == Dir.Right) {
                this.point.x++;
            }
        }
        var del = 0;
        if (this.animFrame >= 4)
            del = 8;
        if (this.facing == Dir.Up) {
            this.offset.y = -(this.animFrame-del);
        } else if (this.facing == Dir.Down) {
            this.offset.y = +(this.animFrame-del);
        } else if (this.facing == Dir.Left) {
            this.offset.x = -(this.animFrame-del);
        } else if (this.facing == Dir.Right) {
            this.offset.x = +(this.animFrame-del);
        }

        if (this.dy == 1) {
            this.offset.layer = +this.animFrame-8;
        } else if (this.dy == -1) {
            this.offset.layer = -this.animFrame;
        }
    }
    draw(ctr) {
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

Game.object.player = class extends Game.object {
    constructor(parent, pt) {
        super(parent, pt);
    }
    update(mode) {
        super.update(mode);

        if (mode == Game.Mode.PLAYER)
            this.cycle();
        if (mode == Game.Mode.PLAYER_ANIM) {
            if (!this.moving)
                this.ready = true;
            else
                this.animate();
        }
    }
    cycle() {
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
            var onTile = this.parent.stage.getTileType(this.point, this.layer);
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
                this.dy = -1;
            } else if ((testTile == Game.TileType.SLOPE_UP && this.facing == Dir.Down)
                    || (testTile == Game.TileType.SLOPE_DOWN && this.facing == Dir.Up)
                    || (testTile == Game.TileType.SLOPE_LEFT && this.facing == Dir.Right)
                    || (testTile == Game.TileType.SLOPE_RIGHT && this.facing == Dir.Left)
                    && this.downTile == Game.TileType.SOLID) {
                this.moving = true;
            }
            if (this.dy > 0)
                this.offset.layer = -this.dy*8;
        }
    }
}
