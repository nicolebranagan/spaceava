// The governor is the repository of state
class Governor {
    constructor() {
        this.position = 0;
        this.step();
    }
    step() {
        Governor.tickerTape[this.position](this);
        this.position++;
    }
}

Governor.tickerTape = [
    function(gov) {runner = new Dialogue(Script.scene1, function() {gov.step();})},
    function(gov) {runner = new Game(0, function() {gov.step();})},
]