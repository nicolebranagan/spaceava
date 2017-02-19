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
            function() {music.playMusic("prelude");},
            [[], "SPACE YEAR 99\n \n Starship Zip", Dialogue.textStyle.CENTERED],
            [[[4,4]], "AVA: Wow! What a great day! Nothing could go wrong today!"],
            [[[1,4], [8,16]], "???: Hey there."],
            [[[3,4], [8,16]], "AVA: An intruder! State your name, criminal!"],
            [[[3,4], [10,16]], "???: Well that's not very friendly. For all you know I was here to help you."],
            [[[6,4], [10,16]], "AVA: I am Captain Ava Marie St.Janet Crispin VII, and this is a starship of the Amalgamation of Worlds! I know you're not supposed to be in my quarters!"],
            [[[6,4], [11,16]], "???: My name's Lilith, you can call me Lily. And honestly, I just wanted to loot the place; I thought you were all dead."],
            [[[1,4], [11,16]], "...\n ..."],
            [[[3,4], [11,16]], "AVA: Well let me tell you Lilt- All dead?"],
            [[[1,4], [10,16]], "LILY: Well, those flashing lights can't be good."],
            [[[2,4], [8,16]], "AVA: Huh..."],
            [[[2,4], [11,16]], "AVA: I don't know what would do this kind of damage, it looks like we crashed or something."],
            [[[1,4], [11,16]], "LILY: You crashed."],
            [[[2,4], [11,16]], "AVA: Huh..."],
            [[[1,4], [8,16]], "LILY: Like two weeks ago."],
            [[[2,4], [8,16]], "AVA: Huh..."],
            [[[1,4], [8,16]], "LILY: Into a black hole."],
            [[[2,4], [8,16]], "AVA: Huh..."],
            [[[5,4], [12,16]], "AVA: Well, how was I supposed to know? The food machines still work!"],
        ]
    },
    scene1: {
        bg: new Dialogue.Background(
            function (ctx) {
                ctx.drawImage(gfx.bg[0], 0, 0, this.width, this.height, 32, 16, this.width, this.height);
            }
        ),
        script: [
            function() {music.playMusic("prelude");},
            [[[1,4], [10,16]], "AVA: So if this is the inside of a black hole, then what are you doing here?"],
            [[[1,4], [10,16]], "LILY: I live here. Obviously."],
            [[[2,4], [10,16]], "AVA: You live inside a black hole? Is that possible?\n ???: Don't judge."],
            [[[1,4], [11,16]], "AVA: Wait... there was a whole crew on my ship. Like at least ten people. Maybe more."],
            function() {music.playMusic("steady");},
            [[[3,4], [10,16]], "LILY: I saw a bunch of people leaving! But you won't last long inside the black hole, there's too much quantum for your types."],
            [[[3,4], [10,16]], "AVA: What?! I have to save them!"],
            [[[3,4], [11,16]], "LILY: You'd never make it through all the quantum..."],
            [[[3,4], [8,16]], "LILY: Without my help."],
            [[[4,4], [8,16]], "AVA: Then help me! What do I do?"],
            [[[1,4], [8,16]], "LILY: To make it through the black hole, you'll need to form photon-antiphoton pairs. Once united, they'll give off Hawking radiation and move you forward."],
            [[[5,4], [8,16]], "AVA: Aren't photons and antiphotons the same thing?"],
            [[[1,4], [10,16]], "LILY: It's a black hole. It's weird. Find the two wiggly things and combine them. Easy enough for you, Captain?"],
            [[[6,4], [10,16]], "AVA: Yeah, yeah, let's just get going..."]
        ]
    },
    scene2: {
        bg: new Dialogue.Background(
            function(ctx) {
                ctx.drawImage(gfx.bg[0], 256, 0, this.width, this.height, 32, 16, this.width, this.height);
            }
        ),
        script: [
            function() {music.playMusic("steady");},
            [[[4,0], [8,4]], "LILY: Great job! I knew you'd be fine against the quantum!"],
            [[[1,0], [8,4]], "AVA: Yeah, yeah, Lilith, I have some questions here. Specifically, two."],
            [[[1,0], [10,4]], "LILY: Fine, fine. I have to admit--"],
            [[[6,0], [11,4]], "AVA: 1. What with with that timestep?"],
            [[[1,0], [10,4]], "LILY: Well that's easy. It's a black hole, time is proportional to the observer. Time only moves when the observer does."],
            [[[1,0], [11,4]], "AVA: Is that how it works?"],
            [[[1,0], [9,4]], "LILY: Sure, why not."],
            [[[1,0], [8,4]], "AVA: Uh-huh...\nAnyway, Number 2. Why are people shooting at me? I just want to help my friends!"],
            [[[1,0], [11,4]], "LILY: About that..."],
            [[[1,0], [10,4]], "LILY: Not all of us in the black hole are so friendly, unfortunately... There are a lot of us who don't like outsiders."],
            [[[3,0], [10,4]], "AVA: But I'm in need! Shouldn't they be more helpful?"],
            [[[6,0], [11,4]], "LILY: Your Amalgamation must be a wonderful place, if that's how you think the world works.."]
        ]
    }
}
