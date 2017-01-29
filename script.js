var Script = { 
    opening: {
        bg: new Dialogue.Background(
            function (ctx) {
                ctx.drawImage(gfx.bg[0], 0, 0, this.width, this.height, 32, 16, this.width, this.height);
                if (this.timer < 120) {
                    ctx.drawImage(gfx.bg[0], this.width, 0, 16*3, 16*2, 32+64+8, 24, 16*3, 16*2);
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
            [6, 11, "???: My name's Lilith, you can call me Lily. And honestly, I just wanted to loot the place; I thought you were all dead."],
            [1, 11, "...\n ..."],
            [3, 11, "AVA: Well let me tell you Lilt- All dead?"],
            [1, 10, "LILY: Well, those flashing lights can't be good."],
            [2, 8, "AVA: Huh..."],
            [2, 11, "AVA: I don't know what would do this kind of damage, it looks like we crashed or something."],
            [1, 11, "LILY: You crashed."],
            [2, 11, "AVA: Huh..."],
            [1, 8, "LILY: Like two weeks ago."],
            [2, 8, "AVA: Huh..."],
            [1, 8, "LILY: Into a black hole."],
            [2, 8, "AVA: Huh..."],
            [5, 12, "AVA: Well, how was I supposed to know? The food machines still work!"],
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
            [1, 10, "LILY: I live here. Obviously."],
            [2, 10, "AVA: You live inside a black hole? Is that possible?\n ???: Don't judge."],
            [1, 11, "AVA: Wait... there was a whole crew on my ship. Like at least ten people. Maybe more."],
            [3, 10, "LILY: I saw a bunch of people leaving! But you won't last long inside the black hole, there's too much quantum for your types."],
            [3, 10, "AVA: What?! I have to save them!"],
            [3, 11, "LILY: You'd never make it through all the quantum..."],
            [3, 8, "LILY: Without my help."],
            [4, 8, "AVA: Then help me! What do I do?"],
            [1, 8, "LILY: To make it through the black hole, you'll need to form photon-antiphoton pairs. Once united, they'll give off Hawking radiation and move you forward."],
            [5, 8, "AVA: Aren't photons and antiphotons the same thing?"],
            [1, 10, "LILY: It's a black hole. It's weird. Find the two wiggly things and combine them. Easy enough for you, Captain?"],
            [6, 10, "AVA: Yeah, yeah, let's just get going..."]
        ]
    },
    scene2: {
        bg: new Dialogue.Background(
            function(ctx) {
                ctx.drawImage(gfx.bg[0], 256, 0, this.width, this.height, 32, 16, this.width, this.height);
            }
        ),
        script: [
                [4, 8, "LILY: Great job! I knew you'd be fine against the quantum!"],
                [1, 8, "AVA: Yeah, yeah, Lilith, I have some questions here. Specifically, two."],
                [1, 10, "LILY: Fine, fine. I have to admit--"],
                [6, 11, "AVA: 1. What with with that timestep?"],
                [1, 10, "LILY: Well that's easy. It's a black hole, time is proportional to the observer. Time only moves when the observer does."],
                [1, 11, "AVA: Is that how it works?"],
                [1, 9, "LILY: Sure, why not."],
        ]
    }
}
