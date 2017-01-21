class Dialogue {
    constructor(convo, returner) {
        this.convo = convo;
        this.returner = returner;
        this.chara1 = 0;
        this.chara2 = 0;
        this.blinkTimer = 0;
        this.position = -1;
        this.script = Dialogue.parseScript(28, convo.script);
        this.talkTimer = -1;
        this.string = "";

        this.next();
    }
    update () {
        this.convo.bg.update();
        this.blinkTimer++;
        if (this.blinkTimer == 80)
            this.blinkTimer = 0;
        if (Controls.Shoot) {
            Controls.Shoot = false;
            if (this.talkTimer == -1) {
                if (this.position == (this.script.length - 1))
                    this.returner();
                else
                    this.next();
            }
        } else if (Controls.Enter) {
            // You can always skip dialog
            Controls.Enter = false;
            this.returner();
        }
        if (this.talkTimer > -1)
            this.talkTimer--;
    }
    draw(ctx) {
        this.convo.bg.draw(ctx);
        if (this.chara1 > 0)
            ctx.drawImage(gfx.faces, 32 * this.chara1, 0, 32, 40, 64, 40, 32, 40);
        if (this.chara2 > 0)
            ctx.drawImage(gfx.faces, 32 * this.chara2, 0, 32, 40, 160, 40, 32, 40);
        if (this.blinkTimer > 40 && this.talkTimer == -1) {
            var point = (this.position == (this.script.length - 1) ? 22 : 31);
            ctx.drawImage(gfx.font, point*8, 0, 8, 8, 256-16, 192-16, 8, 8);
        }
        var string = this.string;
        if (this.talkTimer != -1) {
            string = string.slice(0, string.length - this.talkTimer);
        }
        drawText(ctx, 24, 88, string);
    }
    next() {
        var newpos = this.position + 1;
        if (newpos == this.script.length) {
            this.talkTimer = -1;
            return;
        }
        this.position = newpos;
        this.string = this.script[this.position][2];
        this.chara1 = this.script[this.position][0];
        this.chara2 = this.script[this.position][1];
        this.talkTimer = this.script[this.position][2].length;
        return;
    }
    // Static methods
    static parseScript(width, script) {
        var newscript = script.slice();
        for (var i = 0; i < script.length; i++) {
            var newtext = [];
            var words = script[i][2].split(' ');
            var str = "";
            for(var j=0; j < words.length; j++) {
                var word = words[j];
                if (word.length + str.length > width) {
                    newtext.push(str);
                    str = word + " ";
                } else {
                    if (word[word.length-1] == '\n') {
                        newtext.push(str+word.slice(0, word.length-1));
                        str = "";
                    } else
                        str = str + word + " ";
                }
            }
            newtext.push(str);
            while (script[i][0] !== -1 && newtext.length < 4) {
                newtext.push("");
            }
            if (script[i][3] == Dialogue.textStyle.CENTERED) {
                for (var j = 0; j < newtext.length; j++) {
                    var text = newtext[j];
                    var pad = Math.floor(((width - text.length) / 2));
                    for (var k = 0; k < pad; k++)
                        text = " " + text;
                    newtext[j] = text;
                }
            }

            newscript[i] = [script[i][0], script[i][1], newtext.join('\n')];
        }
        return newscript
    }
    
}

Dialogue.textStyle = {
    NONE: 0,
    CENTERED: 1,
}

Dialogue.Background = class {
    constructor(draw) {
        this.draw = draw;
        this.height = 8*8;
        this.width = 64*3;
        this.timer = 0;
    }
    update() {
        this.timer++;
        if (this.timer > 240)
            this.timer = 0;
    }
}


