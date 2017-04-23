'use strict';
// The governor is the repository of state
class Governor {
    constructor(pos, arcade) {
        if (!pos)
            this.position = -1;
        else
            this.position = pos - 1;
        this.arcade = arcade ? true : false;
        this.storage = [];
        this.step();
    }
    step() {
        this.position++;
        if (this.arcade) {
            if (Script.tickerTape[this.position][0] == "END") {
                let total = Governor.calcTotal(this.storage, Script.par);
                runner = new ArcadeResultsScreen(this.storage, Script.par, total);
                return;
            } else if (Script.tickerTape[this.position][0].substring(0, 1) == "D" || Script.tickerTape[this.position][0].substring(0, 1) == "~") {
                this.step();
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
