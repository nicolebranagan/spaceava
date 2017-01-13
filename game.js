'use strict';
var Game = function() {
    this.stage = new Game.stage(10);
};

Game.prototype = {
    update: function() {

    },
    draw: function(ctx) {
        this.stage.drawBase(ctx, 160,90);
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

    this.buffer = document.createElement('canvas');
    this.buffer.height = (this.width+this.height)*4+8;
    this.buffer.width = (this.width+this.height)*8+8;
    this.renderBase(this.buffer.getContext('2d'));
}

Game.stage.prototype = {
    getTile: function(x,y) {
        return this.tileMap[x + y*this.width];
    },
    renderBase: function(ctx) {
        var drawTile = (pt, tile) => {ctx.drawImage(gfx.player, (15-tile)*16, 0, 16, 16, pt.x + ((this.width+this.height)*4), pt.y, 16, 16)};
        for(var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                drawTile((new Point(i*8, j*8)).getIsometric(), this.getTile(i,j));
            }
        }
    },
    // Draws the base layer at a point centered on x,y
    drawBase: function(ctx,x,y) {
        var base_ctx = this.buffer.getContext('2d');
        var ctr_x = x - (this.buffer.width / 2);
        var ctr_y = y - (this.buffer.height / 2);
        ctx.putImageData(base_ctx.getImageData(0,0,this.buffer.width,this.buffer.height),ctr_x,ctr_y);
    }
}