'use strict';
// The governor is the repository of state
class Governor {
    constructor(pos, arcade) {
        if (!pos)
            this.position = -1;
        else
            this.position = pos - 1;
        this.arcade = arcade ? true : false;
        this.step();
    }
    step() {
        this.position++;
        if (__debug) {
            // Test code; shouldn't make it into the final version
            if (this.position == Script.tickerTape.length) {
                console.log("Ran out of tape!")
                runner = new TitleScreen();
                return;
            }
        }
        if (this.arcade) {
            if (Script.tickerTape[this.position][0].substring(0, 1) == "D" || Script.tickerTape[this.position][0].substring(0, 1) == "~") {
                this.step();
                return;
            }
        }
        Script.tickerTape[this.position][1](this);
    }
}
