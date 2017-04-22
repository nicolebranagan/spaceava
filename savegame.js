'use strict';

var SaveGame = {
    password: [
        "Y65M9", "YH9V8", "TH65G", "HTY65", 
        "F65ND", "9P9TT", "8RN7N", "TH7SB",
        "5TY65", "D7DNT", "R89LL", "?????",
        "Y6K9Y"
    ],

    savedPass: "",

    getStage: function(num) {
        var x = num % 4;
        var y = Math.floor(num / 4);
        var stage = 1 + 7*y;
        if (x == 1)
            stage = stage + 2;
        else if (x == 2)
            stage = stage + 3;
        else if (x == 3)
            stage = stage + 5;
        new Governor(stage);
    },

    tryPass: function(pass) {
        for (var i = 0; i < this.password.length; i++) {
            if (pass == this.password[i])
                return i;
        }
        return -1;
    },

    getPass: function(stg) {
        return this.password[stg];
    },

    savePass: function(stg) {
        var pass = this.getPass(stg);
        if (pass == "?????")
            return;
        this.savedPass = pass;
        try {
            window.localStorage.setItem('ava_pass', pass);
            return true;
        } catch (e) {
            // We failed
            return false;
        }
    },
}

try {
    let pass = window.localStorage.getItem('ava_pass');
    SaveGame.savedPass = pass;
} catch (e) {
    // Not a big deal
}
