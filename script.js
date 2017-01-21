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
            [1, 11, "...\n ..."],
            [3, 11, "AVA: All dead?"],
            [1, 10, "???: Well, those flashing lights can't be good."],
            [2, 8, "AVA: Huh..."],
            [2, 8, "AVA: I don't know what would do this kind of damage, it looks like we crashed or something."],
            [1, 8, "???: You crashed."],
            [2, 8, "AVA: Huh..."],
            [1, 8, "???: Like two weeks ago."],
            [2, 8, "AVA: Huh..."],
            [1, 8, "???: Into a black hole."],
            [2, 8, "AVA: Huh..."],
            [5, 8, "AVA: Well, how was I supposed to know? The food machines still work!"],
        ]
    },
    scene1: {
        bg: new Dialogue.Background(
            function (ctx) {
                ctx.drawImage(gfx.bg[0], 0, 0, this.width, this.height, 32, 16, this.width, this.height);
            }
        ),
        script: [
            [1, 10, "AVA: So if this is the inside of a black hole, then what are you doing here?"],
            [1, 10, "???: I live here. Obviously."],
            [2, 10, "AVA: You live inside a black hole? Is that possible?\n ???: Don't judge."],
            [1, 11, "AVA: Wait... there was a whole crew on my ship. Like at least ten people. Maybe more."],
            [3, 10, "???: I saw a bunch of people leaving! But you won't last long inside the black hole, there's too much quantum for your types."],
            [3, 10, "AVA: What?! I have to save them!"],
            [3, 11, "???: You'd never make it through all the quantum..."],
            [3, 8, "???: Without my help."],
            [4, 8, "AVA: Then help me! What do I do?"],
            [1, 8, "???: To make it through the black hole, you'll need to form photon-antiphoton pairs. Once united, they'll give off Hawking radiation and move you forward."],
            [5, 8, "AVA: Aren't photons and antiphotons the same thing?"],
            [1, 10, "???: It's a black hole. It's weird. Find the two wiggly things and combine them. Easy enough for you, Captain?"],
            [6, 10, "AVA: Yeah, yeah, let's just get going..."]
        ]
    }
}