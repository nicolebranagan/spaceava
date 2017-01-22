// The governor is the repository of state
class Governor {
    constructor() {
        this.position = -1;
        this.step();
    }
    step() {
        // Test code; shouldn't make it into the final version
        if (__debug) {
            if (this.position == Governor.tickerTape.length) {
                console.log("Ran out of tape!")
                runner = new TitleScreen();
                return;
            }
        }
        this.position++;
        Governor.tickerTape[this.position](this);
    }
}

Governor.tickerTape = [
    function(gov) {runner = new Dialogue(Script.scene1, function() {gov.step();})},
    function(gov) {runner = new Game(0, function() {gov.step();})},
]