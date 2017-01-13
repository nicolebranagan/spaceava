'use strict';
var Game = function() {
    this.stage = new Game.stage(10);
};

Game.prototype = {
    update: function() {

    },
    draw: function(ctx) {
        var drawTile = function(pt, tile) {ctx.drawImage(gfx.player, (15-tile)*16, 0, 16, 16, pt.x, pt.y, 16, 16)};
        for(var i = 0; i < this.stage.width; i++) {
            for (var j = 0; j < this.stage.width; j++) {
                drawTile((new Point(i*8, j*8)).getIsometric(), this.stage.getTile(i,j));
            }
        }
    },
    getIso: function(x,y) {

    }
}

Game.object = function() {

}

Game.stage = function(width) {
    this.width = width;
    this.height = width;
    this.tileMap = [];
    for (var i = 0; i < (this.width*this.height); i++)
        this.tileMap.push(0);
    this.tileMap[15] = 2;
    this.tileMap[16] = 2;
    this.tileMap[25] = 2;
    this.tileMap[26] = 2;
}

Game.stage.prototype = {
    getTile: function(x,y) {
        return this.tileMap[x + y*this.width];
    }
}