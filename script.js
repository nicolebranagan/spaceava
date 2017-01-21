var Script = { 
    opening: {
        bg: new Dialogue.Background(
            function (ctx) {
                ctx.drawImage(gfx.bg[0], 0, 0, this.width, this.height, 32, 16, this.width, this.height);
                if (this.timer < 120) {
                    ctx.drawImage(gfx.bg[0], this.width, 0, 32*3, 32*2, 32+64+8, 24, 32*3, 32*2);
                }
            }
        ),
        script: [
            [0, 0, "SPACE YEAR 99\n \n Starship Zip", Dialogue.textStyle.CENTERED],
            [4, 0, "AVA: Wow! What a great day! Nothing could go wrong today!"],
            [1, 8, "???: Hey there."],
            [3, 8, "AVA: An intruder! State your name, criminal!"],
            [3, 10, "???: Well that's not very friendly. For all you know I was here to help you."],
            [6, 10, "AVA: I am Captain Ava Marie St.Janet Crispin VII, and this is a starship of the Amalgamation of Worlds! I know you're not supposed to be in my quarters!"],
            [6, 10, "???: Honestly, I just thought you were all dead, I swear."],
            [1, 10, "...\n ..."],
            [3, 10, "AVA: All dead?"],
            [1, 9, "???: Well, those flashing lights can't be good."],
            [2, 8, "AVA: Huh..."],
        ]
    },
    scene1: {
        bg: new Dialogue.Background(
            function (ctx) {
                ctx.drawImage(gfx.bg[0], 0, 0, this.width, this.height, 32, 16, this.width, this.height);
            }
        ),
        script: [
            [9, 0, "*wink*"]
        ]
    }
}