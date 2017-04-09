'use strict'
Game.object = class {
    constructor() {
        this.point = new Point(0,0);
        this.facing = Dir.Down;
        this.frame = 0;
        this.frameMax = 3;
        this.timerMax = 15;
        this.tile = 0;
        this.timer = this.timerMax;
        this.up = true;
        this.layer = 0;
        this.ready = false;
        this.animFrame = -1;
        this.moving = false;
        this.offset = new Position(0,0,0);
        this.dy = 0;
        this.active = true;
        this.flipupdown = true;
        this.visible = true;
    }
    initialize(parent, point) {
        this.parent = parent;
        this.point = point;
    }
    update(mode) {
        this.timer--;
        if (this.timer == 0) {
            this.timer = this.timerMax;
            if (this.frameMax > 1) {
                if (this.up)
                    this.frame++;
                else
                    this.frame--;
                if (this.frame >= this.frameMax) {
                    this.frame = this.frameMax - 2;
                    if (this.flipupdown)
                        this.up = false;
                    else
                        this.frame = 0;
                } else if (this.frame == -1) {
                    this.frame = this.frame + 2;
                    this.up = true;
                }
            }
        }
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
        if (!this.visible)
            return Game.nullDrawable;
        var drawable = {};
        var base = this;
        var iso_pt = new Point(ctr.x, ctr.y);
        ctr = new Point(Game.center).subtract(iso_pt);
        var iso_c = new Point((this.point.x-this.layer)*8+this.offset.x-this.offset.layer, (this.point.y-this.layer)*8+this.offset.y-this.offset.layer).getIsometric();
        iso_c.add(ctr);
        drawable.coord = iso_c.subtract(new Point(8, 8));
        iso_c.round();
        drawable.position = new Position(this.point.x, this.point.y, this.layer);
        drawable.draw = function(ctx) {
            ctx.drawImage(gfx.objects, (base.facing*base.frameMax + base.frame)*16 + base.tile*16, 0, 16, 16, iso_c.x, iso_c.y, 16, 16);
        }
        return drawable;
    }
    draw_frames(ctr, frames) {
        if (!this.visible)
            return Game.nullDrawable;
        var drawable = {};
        var base = this;
        var iso_pt = new Point(ctr.x, ctr.y);
        ctr = new Point(Game.center).subtract(iso_pt);
        var iso_c = new Point((this.point.x-this.layer)*8+this.offset.x-this.offset.layer, (this.point.y-this.layer)*8+this.offset.y-this.offset.layer).getIsometric();
        iso_c.add(ctr);
        drawable.coord = iso_c.subtract(new Point(8, 8));
        drawable.position = new Position(this.point.x, this.point.y, this.layer);
        drawable.draw = function(ctx) {
            ctx.drawImage(gfx.objects, (frames[base.frame])*16, 0, 16, 16, iso_c.x, iso_c.y, 16, 16);
        }
        return drawable;
    }
    draw_frame(ctr, frame) {
        if (!this.visible)
            return Game.nullDrawable;
        var drawable = {};
        var base = this;
        var iso_pt = new Point(ctr.x, ctr.y);
        ctr = new Point(Game.center).subtract(iso_pt);
        var iso_c = new Point((this.point.x-this.layer)*8+this.offset.x-this.offset.layer, (this.point.y-this.layer)*8+this.offset.y-this.offset.layer).getIsometric();
        iso_c.add(ctr);
        drawable.coord = iso_c.subtract(new Point(8, 8));
        drawable.position = new Position(this.point.x, this.point.y, this.layer);
        drawable.draw = function(ctx) {
            ctx.drawImage(gfx.objects, frame*16, 0, 16, 16, iso_c.x, iso_c.y, 16, 16);
        }
        return drawable;
    }
    interact(interactor) {
        return;
    }
}

Game.object.player = class extends Game.object {
    constructor(parent, point) {
        super();
        super.initialize(parent, point);
        this.frame = 1;

        this.winAnim = [1, 12];
        this.dieAnim = [1, 13, 14];
        this.ghostDie = [1, 1, 44, 45, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46];
        this.mode = Game.object.player.Mode.ACTIVE;
    }
    update(mode) {
        super.update(mode);

        if (mode == Game.Mode.PLAYER)
            this.cycle();
        else if (mode == Game.Mode.PLAYER_ANIM) {
            if (!this.moving)
                this.ready = true;
            else
                this.animate();
        } else if (mode == Game.Mode.ENEMY || mode == Game.Mode.ENEMY_ANIM) {
            this.ready = true;
        }
        if (this.mode == Game.object.player.Mode.DEATH_ANIM) {
            if (this.frame == this.dieAnim.length)
                this.mode = Game.object.player.Mode.NOT_DRAWN;
        }
    }
    draw(ctx) {
        if (this.mode == Game.object.player.Mode.ACTIVE) {
            return super.draw(ctx);
        } else if (this.mode == Game.object.player.Mode.DEATH_ANIM) {
            return super.draw_frames(ctx, this.dieAnim);
        } else if (this.mode == Game.object.player.Mode.WIN_ANIM) {
            if (this.frame >= this.frameMax)
                this.frame = 1;
            this.frameMax = 2;
            this.timerMax = 20;
            return super.draw_frames(ctx, this.winAnim);
        } else if (this.mode == Game.object.player.Mode.DIE_ANIM) {
            this.timerMax = 40;
            return super.draw_frames(ctx, this.dieAnim);
        } else if (this.mode == Game.object.player.Mode.NOT_DRAWN) {
            return Game.nullDrawable;
        }
    }
    cycle() {
        if (Controls.Up) {
            Controls.Up = false;
            this.facing = Dir.Up;
            this.ready = true;
        } else if (Controls.Down) {
            Controls.Down = false;
            this.facing = Dir.Down;
            this.ready = true;
        } else if (Controls.Left) {
            Controls.Left = false;
            this.facing = Dir.Left;
            this.ready = true;
        } else if (Controls.Right) {
            Controls.Right = false;
            this.facing = Dir.Right;
            this.ready = true;
        } else if (Controls.Reset) {
            Controls.Reset = false;
            this.parent.hurt(this);
            this.ready = true;
            return;
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

            var interact = false;
            for (var i = 0; i < this.parent.enemies.length; i++) {
                var e = this.parent.enemies[i];
                if (e.point.equals(test) && e.layer == (this.layer + this.dy)) {
                    interact = true;
                    this.moving = e.interact(this);
                }
            }

            if (interact) {
                this.ready = this.moving;
                return;
            }
            this.ready = this.moving;
        }
    }
    hurt(hurter) {
        this.mode = Game.object.player.Mode.DEATH_ANIM;
        this.frame = 0;
        this.frameMax = 100;
    }

}

Game.object.player.Mode = {
    ACTIVE: 0,
    DEATH_ANIM: 1,
    WIN_ANIM: 2,
    NOT_DRAWN: 3,
}

Game.object.enemy = class extends Game.object {
    constructor() {
        super(null);
    }
}

Game.object.shooter = class extends Game.object {
    constructor(facing, type, frequency) {
        super();
        this.facing = facing;
        this.frequency = frequency;
        this.frameMax = 1;
        this.tile = 16;
        this.movetime = 0;
        this.type = type;
        this.moving = false;
    }
    initialize(parent, point) {
        super.initialize(parent, point);
        this.parent.stage.register(this.point, this.layer+1, Game.TileType.SOLID);
    }
    update(mode) {
        super.update(mode);
        if (this.ready)
            return;
        if (mode == Game.Mode.PLAYER || mode == Game.Mode.PLAYER_ANIM) {
            this.ready = true;
        } else if (mode == Game.Mode.ENEMY) {
            this.cycle();
        } else if (mode == Game.Mode.ENEMY_ANIM) {
            this.ready = true;
        }
    }
    cycle() {
        this.movetime++;
        if (this.movetime == this.frequency)
            this.movetime = 0;
        if (this.movetime == Math.floor(this.frequency/2)) {
            this.parent.enemies.push(new Game.object.flash(this.parent, new Point(this.point), this.layer, this.facing))
            this.parent.enemies.push(new Game.object.bullet(this.parent, new Point(this.point), this.layer, this.facing, this.visible));
            music.queueSound('boom', true);
        }
        if (this.type == Game.object.shooter.Type.SPINNER) {
            if (this.movetime == 0) {
                if (this.facing == Dir.Up)
                    this.facing = Dir.Right;
                else if (this.facing == Dir.Right)
                    this.facing = Dir.Down;
                else if (this.facing == Dir.Down)
                    this.facing = Dir.Left;
                else if (this.facing == Dir.Left)
                    this.facing = Dir.Up;
            }
        }
        this.ready = true;
    }
}

Game.object.shooter.Type = {
    STATIONARY: 0,
    SPINNER: 1
}

Game.object.flash = class extends Game.object {
    constructor(parent, pt, layer, facing) {
        super();
        super.initialize(parent, pt);
        this.layer = layer;
        this.facing = facing;
        this.frameMax = 3;
        this.timerMax = 10;
        this.tile = 96;
        this.start = false;
    }

    update(mode) {
        if (!this.start && mode !== Game.Mode.ENEMY_ANIM) {
            this.ready = true;
            return;
        }
        this.start = true;
        super.update(mode);
        if (this.frame == 2 && this.timer <= 1) {
            this.active = false;
        }
        this.ready = true;
    }
}

Game.object.bullet = class extends Game.object {
    constructor(parent, pt, layer, facing, visible) {
        super();
        super.initialize(parent, pt);
        this.layer = layer;
        this.facing = facing;
        this.frameMax = 1;
        this.tile = 32;
        this.byte = 1;
        this.doomed = false;
        this.visible = visible;
    }
    update(mode) {
        super.update(mode);
        if (this.ready)
            return;
        if (mode == Game.Mode.PLAYER || mode == Game.Mode.PLAYER_ANIM) {
            this.ready = true;
        } else if (mode == Game.Mode.ENEMY) {
            this.cycle();
        } else if (mode == Game.Mode.ENEMY_ANIM) {
            this.animate();
            if (this.animFrame == 4 && this.doomed)
                this.active = false;
        }
    }
    cycle() {
        var test = new Point(this.point);
        if (this.facing == Dir.Up)
            test.y--;
        else if (this.facing == Dir.Down)
            test.y++;
        else if (this.facing == Dir.Left)
            test.x--;
        else if (this.facing == Dir.Right)
            test.x++;
        var testTile = this.parent.stage.getTileType(test,this.layer+1);
        if (testTile === Game.TileType.EMPTY)
            this.moving = true;
        else
            this.doomed = true;
        if (!this.doomed && (test.x >= this.parent.stage.width || test.y >= this.parent.stage.height || test.x < 0 || test.y < 0))
            this.doomed = true;
        this.ready = true;
        if ((test.equals(this.parent.player.point)) && (this.layer == this.parent.player.layer))
            this.parent.hurt(this);
    }

    interact(interactor) {
        if (interactor === this.parent.player)
            this.parent.hurt(this);
        return true;
    }
}

Game.object.snake = class extends Game.object {
    constructor(facing) {
        super();
        this.facing = facing;
        this.frameMax = 2;
        this.tile = 20;
    }

    initialize(parent, pt) {
        super.initialize(parent, pt);
    }

    update(mode) {
        super.update(mode);
        if (this.ready)
            return;
        if (mode == Game.Mode.PLAYER || mode == Game.Mode.PLAYER_ANIM) {
            this.ready = true;
        } else if (mode == Game.Mode.ENEMY) {
            this.cycle();
        } else if (mode == Game.Mode.ENEMY_ANIM) {
            if (this.moving)
                this.animate();
            else
                this.ready = true;
        }
    }

    draw(ctr) {
        this.offset.layer -= 2;
        this.offset.x -= 1;
        var drawable = super.draw(ctr);
        this.offset.layer += 2; 
        this.offset.x += 1;
        return drawable;
    }

    cycle(recur) {
        var test = new Point(this.point);
        if (this.facing == Dir.Up)
            test.y--;
        else if (this.facing == Dir.Down)
            test.y++;
        else if (this.facing == Dir.Left)
            test.x--;
        else if (this.facing == Dir.Right)
            test.x++;
        var testTile = this.parent.stage.getTileType(test,this.layer+1);
        var downTile = this.parent.stage.getTileType(test,this.layer);
        if (testTile === Game.TileType.EMPTY && downTile === Game.TileType.SOLID) {
            if ((test.equals(this.parent.player.point)) && (this.layer == this.parent.player.layer))
                this.parent.hurt(this);
            this.moving = true;
            this.ready = true;
        }
        else {
            if (this.facing == Dir.Up)
                this.facing = Dir.Down;
            else if (this.facing == Dir.Down)
                this.facing = Dir.Up;
            else if (this.facing == Dir.Left)
                this.facing = Dir.Right;
            else if (this.facing == Dir.Right)
                this.facing = Dir.Left;
            if (!recur)
                this.cycle(true);
            else {
                this.ready = true;
                this.moving = false;
            }
        }
    }

    interact(interactor) {
        if (interactor === this.parent.player) {
            this.parent.hurt(this);
            return true;
        }
        return false;
    }
}

Game.object.portal = class extends Game.object {
    constructor(facing, frequency) {
        super();
        this.facing = facing;
        if (!frequency) frequency = 4;
        this.frequency = frequency;
        this.frameMax = 1;
        this.tile = 28;
        this.movetime = 0;
        this.moving = false;
        this.doomed = false;

        this.dieUD = [29, 60, 61, 62, 63];
        this.dieLR = [31, 76, 77, 78, 79];
    }
    initialize(parent, point) {
        super.initialize(parent, point);
    }
    update(mode) {
        super.update(mode);
        if (this.ready)
            return;
        if (mode == Game.Mode.PLAYER || mode == Game.Mode.PLAYER_ANIM) {
            this.ready = true;
        } else if (mode == Game.Mode.ENEMY) {
            this.cycle();
        } else if (mode == Game.Mode.ENEMY_ANIM) {
            if (this.doomed) {
                if (this.frameMax == 1) {
                    this.frameMax = 6;
                    if (this.facing == Dir.Down || this.facing == Dir.Up)
                        this.anim = this.dieUD;
                    else
                        this.anim = this.dieLR;
                } else {
                    if (this.frame == 5) {
                        this.active = false;
                        this.ready = true;
                    }
                }
            } else
                this.ready = true;
        }
    }
    draw(ctr) {
        if (this.doomed && this.frameMax !== 1) {
            return super.draw_frames(ctr, this.anim);
        } else {
            return super.draw(ctr);
        }
    }
    cycle() {
        this.movetime++;
        if (this.movetime == this.frequency)
            this.movetime = 0;
        if (this.movetime == Math.floor(this.frequency/2)) {
        var test = new Point(this.point);
            if (this.facing == Dir.Up)
                test.y--;
            else if (this.facing == Dir.Down)
                test.y++;
            else if (this.facing == Dir.Left)
                test.x--;
            else if (this.facing == Dir.Right)
                test.x++;
            var testTile = this.parent.stage.getTileType(test,this.layer+1);
            if (testTile == Game.TileType.EMPTY) {
                var ghost = new Game.object.ghost(this.facing);
                ghost.initialize(this.parent, new Point(this.point));
                ghost.layer = this.layer;
                this.parent.enemies.push(ghost);
                music.queueSound('ghost', true);
            } else {
                music.queueSound('boom', false);
                this.doomed = true;
            }
        }
        this.ready = true;
    }

    interact(interactor) {
        if (interactor === this.parent.player) {
            this.parent.hurt(this, 'power');
            return true;
        }
        return false;
    }
}

Game.object.ghost = class extends Game.object {
    constructor(facing) {
        super();
        this.facing = facing;
        this.frameMax = 2;
        this.tile = 36;
        this.doomed = false;
    }

    initialize(parent, pt) {
        super.initialize(parent, pt);
    }

    update(mode) {
        super.update(mode);
        if (this.ready)
            return;
        if (mode == Game.Mode.PLAYER || mode == Game.Mode.PLAYER_ANIM) {
            this.ready = true;
        } else if (mode == Game.Mode.ENEMY) {
            this.cycle();
        } else if (mode == Game.Mode.ENEMY_ANIM) {
            if (this.moving)
                this.animate();
            else
                this.ready = true;
            if (this.animFrame == 4 && this.doomed)
                this.active = false;
        }
    }

    draw(ctr) {
        var drawable = super.draw(ctr);
        if (this.flicker % (this.life+2) !== 0)
            return drawable;
        else
            return Game.nullDrawable;
    }

    cycle(recur) {
        var test = new Point(this.point);
        if (this.facing == Dir.Up)
            test.y--;
        else if (this.facing == Dir.Down)
            test.y++;
        else if (this.facing == Dir.Left)
            test.x--;
        else if (this.facing == Dir.Right)
            test.x++;
        var testTile = this.parent.stage.getTileType(test,this.layer+1);
        var downTile = this.parent.stage.getTileType(test,this.layer);
        if (testTile === Game.TileType.EMPTY) {
            if ((test.equals(this.parent.player.point)) && (this.layer == this.parent.player.layer)) {
                this.parent.hurt(this);
                this.parent.player.dieAnim = this.parent.player.ghostDie;
            }
            this.moving = true;
            this.ready = true;
        } else {
            if (!recur) {
                if (this.facing == Dir.Up)
                    this.facing = Dir.Right;
                else if (this.facing == Dir.Down)
                    this.facing = Dir.Left;
                else if (this.facing == Dir.Left)
                    this.facing = Dir.Up;
                else if (this.facing == Dir.Right)
                    this.facing = Dir.Down;
                this.cycle(true);
            } else {
                this.ready = true;
                this.moving = false;
            }
        }
        if ((test.x >= this.parent.stage.width || test.y >= this.parent.stage.height || test.x < 0 || test.y < 0))
            this.doomed = true;
    }

    interact(interactor) {
        if (interactor === this.parent.player) {
            this.parent.hurt(this);
            this.parent.player.dieAnim = this.parent.player.ghostDie;
            return true;
        }
        return false;
    }
}

Game.object.tile = class extends Game.object {
    constructor(health) {
        super();
        this.health = health ? health : 2;
        this.playerOn = false;
    }

    initialize(parent, point) {
        super.initialize(parent,point);
        this.code = this.parent.stage.register(this.point, this.layer, Game.TileType.SOLID);
    }

    draw(ctr) {
        var drawable = {};
        var tile = 94 - this.health;
        drawable.draw = function (ctx) {
            ctx.drawImage(gfx.objects, (tile)*16, 0, 16, 16, this.coord.x , this.coord.y, 16, 16)
        };
        drawable.coord = new Point((this.point.x-this.layer)*8, (this.point.y-this.layer)*8).getIsometric();
        drawable.position = new Position(this.point.x, this.point.y, this.layer-1);

        var iso_pt = new Point(ctr.x, ctr.y);
        var ctr_x = -iso_pt.x + Game.center.x - 8;
        var ctr_y = -iso_pt.y + Game.center.y + 2;
        drawable.coord.add(new Point(ctr_x, ctr_y));
        return drawable;
    }

    update(mode) {
        if (mode == Game.Mode.ENEMY && this.playerOn) {
            if (!(this.point.equals(this.parent.player.point))) {
                this.playerOn = false;
                if (this.health > 0)
                    this.health--;
                if (this.health == 0) {
                    music.queueSound("ding2");
                    this.parent.stage.unregister(this.code)
                } else
                    music.queueSound("ding1");
            }
        }
        this.ready = true;
    }

    interact(interactor) {
        if (this.health <= 0) {
            return false;
        }
        if (interactor === this.parent.player) {
            this.playerOn = true;
        }
        return true;
    }


}

Game.object.stationary = class extends Game.object {
    constructor() {
        super();
        this.facing = Dir.Down;
        this.frameMax = 1;
        this.collected = false;
        this.playSound = true;
    }

    initialize(parent, pt) {
        super.initialize(parent, pt);
    }

    update(mode) {
        super.update(mode);
        this.ready = true;
        if (this.collected && mode == Game.Mode.PLAYER_ANIM && this.parent.player.ready) {
            this.active = false;
            if (this.playSound)
                music.playSound("get");
        }
    }

    interact(interactor) {
        if (interactor === this.parent.player) {
            return this.action();
        } else {
            return false;
        }
    }
}

Game.object.winObject = class extends Game.object.stationary {
    constructor(polarity) {
        super();
        this.polarity = polarity;
        this.tile = 251 - (polarity ? 0 : 5);
        this.frameMax = 4;
        this.flipupdown = false;
        this.timerMax = 4;
        this.need = true; // Need this to win
    }

    action() {
        this.playSound = !(this.parent.win());
        this.collected = true;
        return true;
    }
}



Game.object.block = class extends Game.object {
    constructor() {
        super();
        this.facing = Dir.Down;
        this.frameMax = 0;
        this.moving = false;
        this.code = -1;
        this.tile = 245;
        this.offset.layer = -2;
        this.mobile = true;
    }

    initialize(parent, pt) {
        super.initialize(parent, pt);
    }

    update(mode) {
        super.update(mode);
        if (this.code == -1 && (this.mode == Game.Mode.PLAYER || mode == Game.Mode.ENEMY)) {
            this.code = this.parent.stage.register(this.point, this.layer+1, Game.TileType.SOLID);
        }
        if (this.moving == true && (mode == Game.Mode.PLAYER_ANIM || mode == Game.Mode.ENEMY_ANIM)) {
            this.animate();
            this.offset.layer = -2;
        } else
            this.ready = true;
    }

    interact(interactor) {
        this.facing = interactor.facing;
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
        }
        if (this.moving) {
            for (var i = 0; i < this.parent.enemies.length; i++) {
                var e = this.parent.enemies[i];
                if (e.point.equals(test) && e.layer == (this.layer + this.dy)) {
                    this.moving = e.interact(this);
                }
            }
            this.parent.stage.unregister(this.code);
            this.code = -1;
        }
        if (this.moving)
            music.playSound('shove');
        return this.moving;
    }
}

Game.object.boss1 = class extends Game.object {
    constructor() {
        super();
        this.facing = Dir.Down;
        this.frameMax = 3;
        this.tile = 48+16;
        this.need = true; // You need to beat this, specifically
        this.hp = 2;
        this.timerMax = 20;
        this.flicker = false;
    }

    initialize(parent, pt) {
        super.initialize(parent, pt);
    }

    update(mode) {
        super.update(mode);

        if (this.ready)
            return;
        if (mode == Game.Mode.PLAYER || mode == Game.Mode.PLAYER_ANIM) {
            this.ready = true;
            this.stall = false;
        } else if (mode == Game.Mode.ENEMY) {
            this.cycle();
        } else if (mode == Game.Mode.ENEMY_ANIM) {
            if (this.moving)
                this.animate();
            else
                this.ready = true;
            if (this.ready && this.stall) {
                for (var i = 0; i < this.parent.enemies.length; i++) {
                    var e = this.parent.enemies[i];
                    if (e === this)
                        continue;
                    if (!e.ready) {
                        // Wait for everyone to be ready
                        this.ready = false;
                        break;
                    }
                }
                if (this.ready)
                    this.checkoverlap();
            }
        }
    }

    draw(ctr) {
        if (this.hp > 0 && !this.flicker || (this.timer < 5 || this.timer > 14))
            return super.draw(ctr);
        else
            return Game.nullDrawable;
    }

    cycle() {
        if (this.flicker) {
            this.flicker = false;
            this.ready = true;
            return;
        }
        var player = this.parent.player.point;
        var delx = player.x - this.point.x;
        var dely = player.y - this.point.y;

        var tryx = new Point(this.point);
        var tryy = new Point(this.point);
        var facingx; var facingy;

        if (delx >= 0) {
            tryx.x = tryx.x + 1;
            facingx = Dir.Right;
        } else {
            tryx.x = tryx.x - 1;
            facingx = Dir.Left;
        }

        if (dely >= 0) {
            tryy.y = tryy.y + 1;
            facingy = Dir.Down;
        } else {
            tryy.y = tryy.y - 1;
            facingy = Dir.Up;
        }

        var try1; var try2; var backface;
        if (Math.abs(delx) > Math.abs(dely)) {
            try1 = tryx;
            try2 = tryy;
            this.facing = facingx;
            backface = facingy;
        } else {
            try1 = tryy;
            try2 = tryx;
            this.facing = facingy;
            backface = facingx;
        }

        var test;
        var testTile = this.parent.stage.getTileType(try1,this.layer+1);
        var downTile = this.parent.stage.getTileType(try1,this.layer);
        if (testTile === Game.TileType.EMPTY && downTile === Game.TileType.SOLID) {
            if ((try1.equals(this.parent.player.point)) && (this.layer == this.parent.player.layer))
                this.parent.hurt(this);
            test = try1;
            this.moving = true;
            this.ready = true;
        } else {
            testTile = this.parent.stage.getTileType(try2, this.layer+1);
            downTile = this.parent.stage.getTileType(try2, this.layer);
            if (testTile === Game.TileType.EMPTY && downTile === Game.TileType.SOLID) {
                if ((try2.equals(this.parent.player.point)) && (this.layer == this.parent.player.layer))
                    this.parent.hurt(this);
                test = try2;
                this.moving = true;
                this.ready = true; 
                this.facing = backface;               
            } else
                this.moving = false;
        }

        var interact = false;
        for (var i = 0; i < this.parent.enemies.length; i++) {
            var e = this.parent.enemies[i];
            if (e.point.equals(test) && e.layer == (this.layer)) {
                interact = true;
                this.moving = e.interact(this);
            }
        }

        this.ready = true;
        this.stall = true;
    }

    checkoverlap() {
        for (var i = 0; i < this.parent.enemies.length; i++) {
            var e = this.parent.enemies[i];
            if (e === this)
                continue;
            if (this.point.equals(e.point)) {
                this.flicker = true;
                this.hp--;
                this.tile = 48;
                music.playSound("crash");
                if (this.hp <= 0)
                    this.parent.win();
                e.active = false;
            }
        }
        this.ready = true;
        this.stall = false;
    }

    interact(interactor) {
        if (interactor == this.parent.player) {
            if (this.hp > 0)
                this.parent.hurt();
            return true;
        }
    }
}

Game.object.boss2 = class extends Game.object {
    constructor() {
        super();
        this.timerMax = 45;
        this.frameMax = 2;
        this.frames = [88, 89];
        this.need = true;
        this.state = Game.object.boss2.State.START;
        this.round = 0;
        this.objects = [];
        this.willStep = false;
    }

    update(mode) {
        super.update(mode);
        if (mode == Game.Mode.PLAYER) {
            this.ready = true;
        } else if (mode == Game.Mode.PLAYER_ANIM) {
            this.ready = true;
        } else if (mode == Game.Mode.ENEMY) {
            if (!this.ready)
                this.cycle();
        } else if (mode == Game.Mode.ENEMY_ANIM) {
            this.ready = true;
        }
    }

    draw(ctr) {
        return super.draw_frames(ctr, this.frames);
    }

    cycle() {
        switch (this.state) {
            case Game.object.boss2.State.START:
                this.state = Game.object.boss2.State.DISPL;
                music.queueSound("boom");
                this.loadRound(this.round);
            break;
            case Game.object.boss2.State.DISPL:
                this.state = Game.object.boss2.State.CYCLE;
                if (this.round !== 4) {
                    music.queueSound("ghost");
                    this.hide();
                    this.visible = false;
                }
            break;
            case Game.object.boss2.State.CYCLE:
                if (this.willStep) {
                    this.round++;
                    this.willStep = false;
                    this.state = Game.object.boss2.State.DISPL;
                    this.parent.player.point = new Point(10, 10);
                    this.loadRound(this.round);
                    music.queueSound("boom");
                    this.visible = true;
                }
            break;
        }
        this.ready = true;
    }

    loadRound(stage) {
        this.annihilate();
        switch (stage) {
            case 0:
                this.summon(new Game.object.boss2.orb(true, () => {this.step();}),
                            new Point(7, 7));
            break;
            case 1:
                this.summon(new Game.object.boss2.orb(false, () => {this.step();}),
                            new Point(7, 7));
                this.summon(new Game.object.block(),
                            new Point(7, 6));
                this.summon(new Game.object.block(),
                            new Point(6, 7));

                this.summon(new Game.object.boss2.solid(),
                            new Point(8, 7));
                this.summon(new Game.object.boss2.solid(),
                            new Point(7, 8));
            break;
            case 2:
                this.summon(new Game.object.boss2.orb(true, () => {this.step();}),
                    new Point(7, 7));
                this.summon(new Game.object.ghost(Dir.Down),
                    new Point(8, 3));
                this.summon(new Game.object.ghost(Dir.Right),
                    new Point(3, 8));
            break;
            case 3:
                this.summon(new Game.object.boss2.orb(true, () => {this.step();}),
                    new Point(5, 5));

                this.summon(new Game.object.boss2.solid(),
                    new Point(7, 7));
                this.summon(new Game.object.boss2.solid(),
                    new Point(7, 6));
                this.summon(new Game.object.boss2.solid(),
                    new Point(7, 5));
                this.summon(new Game.object.boss2.solid(),
                    new Point(7, 4));
                this.summon(new Game.object.boss2.solid(),
                    new Point(7, 3));

                this.summon(new Game.object.shooter(Dir.Right, 0, 4),
                    new Point(3, 7));
            break;
            case 4:
                this.frames = [90, 90];
                this.summon(new Game.object.winObject(false),
                    new Point(8,8));
                music.playMusic('');
            break;
        }
    }

    summon(obj, point) {
        obj.initialize(this.parent, point);
        obj.layer = 0;
        this.parent.enemies.push(obj);
        this.objects.push(obj);
    }

    annihilate() {
        this.parent.enemies = [this];
        this.parent.stage.registeredPoints = [];
    }

    hide() {
        for (var i = 0; i < this.objects.length; i++) {
            var e = this.objects[i];
            e.visible = false;
        }
    }

    step() {
        this.willStep = true;
        this.ready = false;
    }
}

Game.object.boss2.State = {
    START: 0,
    DISPL: 1,
    CYCLE: 2,
}

Game.object.boss2.orb = class extends Game.object.winObject {
    constructor(polarity, winFunc) {
        super(polarity);
        this.need = false;
        this.layer = 0;
        this.winFunc = winFunc;
    }

    action() {
        music.playSound("get");
        this.winFunc();
        this.active = false;
        return true;
    }
}

Game.object.boss2.solid = class extends Game.object.stationary {
    constructor() {
        super();
        this.tile = 15;
        this.offset.layer = -2;
    }

    action() {
        return false;
    }
}
