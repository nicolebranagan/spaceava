"use strict";

var gamecanvas = document.getElementById('gamecanvas');
var gamecontrols = document.getElementById('gamecontrols');
var runner = new LoadingScreen();
var __debug = false;

function Loop() {
    setTimeout(Loop, 1000 / 60); // 60 fps
    var ctx = gamecanvas.getContext("2d");
    ctx.clearRect(0, 0, gamecanvas.width, gamecanvas.height);
    runner.update();
    runner.draw(ctx);
    if (__debug) {
        drawText(ctx, 0, 0, Math.floor(checkFPS()).toString());
    };
};

var fps = {
    lastTime: new Date,
    last: 0,
    set: []
}

function checkFPS() { 
    var thisTime = new Date;
    var newfps = 1000 / (thisTime - fps.lastTime);
    fps.lastTime = thisTime;
    fps.set.push(newfps)
    if (fps.set.length >= 60) {
        fps.last = 0;
        for (var i = 0; i < fps.set.length; i++) {
            fps.last += fps.set[i];
        }
        fps.last = fps.last / fps.set.length;
        fps.set = [];
    }
    return fps.last;
}

document.documentElement.addEventListener('keydown', function (e) {
    if ( ( e.keycode || e.which ) == 32) {
        e.preventDefault();
    }
}, false);

var Controls = {
    Up: false,
    Down: false,
    Left: false,
    Right: false,
    Shoot: false,
    Enter: false,
    Reset: false,

    keyDown: function(event) {
        if (event.keyCode == 32 || event.keyCode == 90) { // SPACE
            Controls.Shoot = true;
        }
        if (event.keyCode == 38 || event.keyCode == 87) {
            Controls.Up = true;
        }
        if (event.keyCode == 40 || event.keyCode == 83) {
            Controls.Down = true;
        }
        if (event.keyCode == 37 || event.keyCode == 65) {
            Controls.Left = true;
        }
        if (event.keyCode == 39 || event.keyCode == 68) {
            Controls.Right = true;
        }
        if (event.keyCode == 8) {
            Controls.Reset = true;
        }
        if (event.keyCode == 13) {
            Controls.Enter = true;
        }
    },

    keyUp: function(event) {
        if (event.keyCode == 32 || event.keyCode == 90) { // SPACE
            Controls.Shoot = false;
        }
        if (event.keyCode == 38 || event.keyCode == 87) {
            Controls.Up = false;
        }
        if (event.keyCode == 40 || event.keyCode == 83) {
            Controls.Down = false;
        }
        if (event.keyCode == 37 || event.keyCode == 65) {
            Controls.Left = false;
        }
        if (event.keyCode == 39 || event.keyCode == 68) {
            Controls.Right = false;
        }
        if (event.keyCode == 13) {
            Controls.Enter = false;
        }
        if (event.keyCode == 8) {
            Controls.Reset = false;
        }
        if (__debug && event.keyCode == 9) {
            // Take screenshot
            var offCanvas = document.createElement('canvas');
            offCanvas.width = gamecanvas.width; offCanvas.height = gamecanvas.height;
            var ctx = offCanvas.getContext("2d");
            ctx.fillStyle = gamecanvas.style.backgroundColor;
            ctx.fillRect(0, 0, gamecanvas.width, gamecanvas.height);
            ctx.drawImage(gamecanvas, 0, 0);
            var image = offCanvas.toDataURL("image/png");
            window.open(image, '_blank');
        }
    },
    
    touchActive: false,

    touchStart: function(events) {
        if (!this.touchActive) {
            document.getElementById('holderdiv2').innerHTML = "";
            Controls.enter = true;
            gamecontrols.style.display = "block";
            this.touchActive = true;
        }
        for (var i = 0; i < events.touches.length; i++) {
            var touch = events.touches[i];
            var posx = Math.round(96 * (touch.pageX - gamecontrols.offsetLeft) / gamecontrols.width);
            var posy = Math.round(40 * (touch.pageY - gamecontrols.offsetTop) / gamecontrols.height);
            if (inRectangle(posx, posy, 14, 6, 12, 10)) Controls.Up = true;
            if (inRectangle(posx, posy, 14, 24, 12, 10)) Controls.Down = true;
            if (inRectangle(posx, posy, 5, 14, 10, 12)) Controls.Left = true;
            if (inRectangle(posx, posy, 25, 14, 10, 12)) Controls.Right = true;
            if (inRectangle(posx, posy, 41, 30, 13, 8)) Controls.Enter = true;
            if (inRectangle(posx, posy, 41, 11, 13, 8)) Controls.Reset = true;
            if (inRectangle(posx, posy, 74, 16, 12, 12)) Controls.Shoot = true;
        }
    },
    
    touchEnd: function(events) {
        Controls.Up = false;
        Controls.Down = false;
        Controls.Left = false;
        Controls.Right = false;
        Controls.Shoot = false;
        Controls.Enter = false;
        Controls.Reset = false;
    },
};

window.addEventListener("keydown", Controls.keyDown, false);
window.addEventListener("keyup", Controls.keyUp, false);
document.body.addEventListener("touchstart", Controls.touchStart, false);
document.body.addEventListener("touchend", Controls.touchEnd, false);
window.oncontextmenu = function(event) {
    // Prevent popup menus
    event.preventDefault();
    event.stopPropagation();
    return false;
};


// Helper functions and classes

class Point {
    constructor(x, y) {
        if (x instanceof Point) {
            this.x = x.x;
            this.y = x.y;
        } else { 
            this.x = x;
            this.y = y;
        }
    }
    getIsometric() {
        return new Point(this.x - this.y, (this.x + this.y) / 2)
    }
    getCartesian() {
        return new Point((2*this.y + this.x) / 2, (2*this.y - this.x) / 2);
    }
    add(pt) {
        this.x = this.x + pt.x;
        this.y = this.y + pt.y;
        return this;
    }
    subtract(pt) {
        this.x = this.x - pt.x;
        this.y = this.y - pt.y;
        return this;
    }
    multiply(mul) {
        this.x = this.x * mul;
        this.y = this.y * mul;
        return this;
    }
    equals(pt) {
        return (this.x == pt.x && this.y == pt.y)
    }
    round() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
    }
}

class Position{ 
    constructor(x, y, l) {
        this.x = x;
        this.y = y;
        this.layer = l;
    }
}

Position.null = new Position(0, 0, 0);

var Dir = {
    Down: 0,
    Up: 1,
    Left: 3,
    Right: 2
}

// Fuck everything
// From https://medium.com/@fsufitch/is-javascript-array-sort-stable-46b90822543f
Array.prototype.stablesort = function(cmp) {
  let stabilizedThis = this.map((el, index) => [el, index]);
  let stableCmp = (a, b) => {
    let order = cmp(a[0], b[0]);
    if (order != 0) return order;
    return a[1] - b[1];
  }
  stabilizedThis.sort(stableCmp);
  for (let i=0; i<this.length; i++) {
    this[i] = stabilizedThis[i][0];
  }
  return this;
}

// Text-drawing functions

function drawText(ctx, x, y, text) {
    var oldx = x;
    for (var i = 0; i < text.length; i++) {
        var num;
        if (typeof text == "string") {
            num = text.charCodeAt(i);
            if (num == 10) {
                y = y + 16;
                x = oldx;
                continue;
            }
        } else
            num = text[i];
        ctx.drawImage(gfx.font, 8 * num, 0, 8, 8, x, y, 8, 8);
        x = x + 8;
    }
}

function drawCenteredText(ctx, y, text) {
    var x = Math.floor((gamecanvas.width - (8*(text.length)))/2);
    drawText(ctx, x, y, text);
}

function drawNumber(ctx, x, y, num, len) {
    var chars = num.toString();
    while(chars.length < len)
        chars = "0" + chars
    drawText(ctx, x, y, chars);
}

var saveEnabled = true;
var musicEnabled = true;
var soundEnabled = true;

Loop();
