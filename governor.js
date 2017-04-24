'use strict';
// The governor is the repository of state
class Governor {
    constructor(pos, mode) {
        if (!pos)
            this.position = -1;
        else
            this.position = pos - 1;
        this.mode = mode ? mode : Governor.Mode.STANDARD;
        this.arcade = (mode == Governor.Mode.ARCADE);
        this.storage = [];
        this.step();
    }
    step() {
        this.position++;
        if (this.mode == Governor.Mode.ARCADE) {
            if (Script.tickerTape[this.position][0] == "END") {
                let total = Governor.calcTotal(this.storage, Script.par);
                runner = new ArcadeResultsScreen(this.storage, Script.par, total);
                return;
            } else if (Script.tickerTape[this.position][0].substring(0, 1) == "D" || Script.tickerTape[this.position][0].substring(0, 1) == "~") {
                this.step();
                return;
            }
        } else if (this.mode == Governor.Mode.CINEMA) {
            if (Script.tickerTape[this.position][0].substring(0, 1) !== "D" && Script.tickerTape[this.position][0].substring(0, 1) !== "E") {
                runner = new Dialogue(Script.null, () => {this.step();});
                return;
            }
        }
        Script.tickerTape[this.position][1](this);
    }
    store(n, t) {
        this.storage[n] = t;
    }

    static calcTotal(data, par) {
        var total = 100;
        for (var i = 0; i < data.length; i++) {
            if (isNaN(data[i]) || isNaN(par[i]))
                continue;
            let del = data[i] - par[i];
            if (del > 0)
                del = del / 2;
            else
                del = del * 2;
            let gap = par[i] - del;
            if (gap < 0)
                gap = 0;
            total = total + Math.floor((gap/par[i])*100);
        }
        return total;
    }
}

Governor.Mode = {
    STANDARD: 0,
    ARCADE: 1,
    CINEMA: 2,
}
