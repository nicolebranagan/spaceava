var Script = { 
    tickerTape: [
    ["D0", function(gov) {runner = new Dialogue(Script.scene1, function() {gov.step();})}],
    ["01", function(gov) {runner = new Game(0, function() {gov.step();})}],
    ["D1", function(gov) {runner = new Dialogue(Script.scene2, function() {gov.step();})}],
    ["02", function(gov) {runner = new Game(1, function() {gov.step();})}],
    ["03", function(gov) {runner = new Game(2, function() {gov.step();})}],
    ["D2", function(gov) {runner = new Dialogue(Script.scene3, function() {gov.step();})}],
    ["04", function(gov) {runner = new Game(3, function() {gov.step();})}],
    ["D3", function(gov) {runner = new Dialogue(Script.scene4, function() {gov.step();})}],
    ["05", function(gov) {runner = new Game(4, function() {gov.step();})}],
    ["D4", function(gov) {runner = new Dialogue(Script.scene5, function() {gov.step();})}],
    ["06", function(gov) {runner = new Game(5, function() {gov.step();})}],
    ["07", function(gov) {runner = new Game(6, function() {gov.step();})}]
    ],

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
            [[[6,4], [11,16]], "???: And you can call me Lily, Ms. the Seventh. And honestly, I just wanted to loot the place; I thought you were all dead."],
            [[[1,4], [11,16]], "...\n ..."],
            [[[3,4], [11,16]], "AVA: Well let me tell you Lilth- All dead?"],
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
            [[[1,4], [11,16]], "AVA: Wait... there was a whole crew on my ship. Like at least three people. Maybe more."],
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
    },
    scene3: {
        bg: new Dialogue.Background(
            function(ctx) {
                ctx.drawImage(gfx.bg[0], 256, 0, this.width, this.height, 32, 16, this.width, this.height);
            }
        ),
        script: [
            function() {music.playMusic("steady");},
            [[[4,0], [8,4]], "AVA: Gee Lilith, this is actually going really well!"],
            [[[4,0], [11,4]], "LILY: Don't get cocky..."],
            [[[4,0], [10,4]], "AVA: What could possibly go wrong?"],
            function() {music.playMusic("chime");},
            [[[3,0], [11,4], [16, 19]], "MAN: Halt in the name of Quantum!"],
            [[[6,0], [12,4], [16, 19]], "LILY: Oh brother..."],
            [[[1,0], [11,4], [16, 19]], "AVA: Wait a second..."],
            [[[3,0], [12,4], [16, 19]], "AVA: Quantum's a group?!"],
            [[[3,0], [14,4], [17, 19]], "MAN: Of course it is! And we rule this black hole!"],
            [[[6,0], [12,4], [16, 19]], "MAN: I don't know why you're hanging with this outsider, Lilith, but I'll take care of this little problem..."],
            [[[3,0], [13,4], [16, 19]], "MAN: Just like I took care of the last one!"],
            [[[6,0], [12,4], [17, 19]], "MAN: Praise Quantum! Shut up and calculate!"]
        ]
    },
    scene4: {
        bg: new Dialogue.Background(
            function(ctx) {
                ctx.drawImage(gfx.bg[0], 256, 0, this.width, this.height, 32, 16, this.width, this.height);
            }
        ),
        script: [
            function() {music.playMusic("chime");},
            [[[5, 0], [8, 4], [16, 19]], "AVA: We did it! And by we I mostly mean I!"],
            [[[2, 0], [12, 4], [18, 19]], "MAN: Quantum may have lost today... but we live on to fight tomorrow! ...Probably..."],
            function() {music.playMusic("steady");},
            [[[1, 0], [8, 4]], "AVA: Glad that's done with... But, Lilith, what about that person he was talking about? I bet they were one of my friends..."],
            [[[1, 0], [14, 4]], "LILY: As a rule, Quantum doesn't kill people... it's a long story, but I'm sure your friend is around here somewhere."],
            function() {music.playMusic("spaceless")},
            [[[5, 0], [8, 4], [24, 18]], "???: It is I, Ava. Lieutenant Nelehu, Chief Engineer."],
            [[[3, 0], [11, 4], [24, 18]], "AVA: Nelehu! Are you okay? Did they hurt you?!"],
            [[[1, 0], [11, 4], [25, 18]], "NELEHU: Shh. I am communing with the ship..."],
            [[[1, 0], [12, 4], [24, 18]], "NELEHU: She is hurt. You have taken bad care of the ship. I will rectify this."],
            function() {music.playMusic("steady");},
            [[[2, 0], [12, 4]], "AVA: I never really see them outside the engine bay, you see..."],
            [[[4, 0], [10, 4]], "LILY: You guys are weird."]
        ]
    },
    scene5: {
        bg: new Dialogue.Background(
            function(ctx) {
                ctx.drawImage(gfx.bg[0], 512, 0, this.width, this.height, 32, 16, this.width, this.height);
            }
        ),
        script: [
            function() {music.playMusic("jungle")},
            [[[2, 0], [8,4]], "AVA: Lilith, I'm concerned. This doesn't look like the inside of a black hole at all?"],
            [[[1, 0], [9,4]], "LILY: What did you expect the inside of a black hole to look like?"],
            [[[3, 0], [9,4]], "AVA: Whoa..."],
            [[[4, 0], [12,4]], "LILY: If you look up and see the event horizon, then you know you're still stuck in here."],
            [[[2, 0], [13,4]], "AVA: So that's what that is..."]
        ]
    }
}
