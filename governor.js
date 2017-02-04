'use strict';
// The governor is the repository of state
class Governor {
    constructor(pos) {
        if (!pos)
            this.position = -1;
        else
            this.position = pos - 1;
        this.step();
    }
    step() {
        this.position++;
        if (__debug) {
            // Test code; shouldn't make it into the final version
            if (this.position == Governor.tickerTape.length) {
                console.log("Ran out of tape!")
                runner = new TitleScreen();
                return;
            }
        }
        Governor.tickerTape[this.position][1](this);
    }
}

Governor.tickerTape = [
    ["D1", function(gov) {runner = new Dialogue(Script.scene1, function() {gov.step();})}],
    ["01", function(gov) {runner = new Game(0, function() {gov.step();})}],
    ["D2", function(gov) {runner = new Dialogue(Script.scene2, function() {gov.step();})}],
    ["02", function(gov) {runner = new Game(1, function() {gov.step();})}],
]