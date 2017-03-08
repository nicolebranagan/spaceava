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
            if (this.position == Script.tickerTape.length) {
                console.log("Ran out of tape!")
                runner = new TitleScreen();
                return;
            }
        }
        try {
            window.location.hash = this.position.toString() + (__debug ? "debug" : "");
        } catch (e) { /* We don't care if it fails */ }
        Script.tickerTape[this.position][1](this);
    }
}
