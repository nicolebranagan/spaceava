var Script = { 
    tickerTape: [
        ["D~", function(gov) {runner = new Dialogue(Script.scene1, function() {gov.step();})}],
        ["01", function(gov) {runner = new Game(0, function() {gov.step();}, gov.arcade, function(n, t) {gov.store(n, t)})}],
        ["D0", function(gov) {runner = new Dialogue(Script.scene2, function() {gov.step();})}],
        ["02", function(gov) {runner = new Game(1, function() {gov.step();}, gov.arcade, function(n, t) {gov.store(n, t)})}],
        ["03", function(gov) {runner = new Game(2, function() {gov.step();}, gov.arcade, function(n, t) {gov.store(n, t)})}],
        ["D1", function(gov) {runner = new Dialogue(Script.scene3, function() {gov.step();})}],
        ["04", function(gov) {runner = new Game(3, function() {gov.step();}, gov.arcade, function(n, t) {gov.store(n, t)})}],
        ["D2", function(gov) {runner = new Dialogue(Script.scene4, function() {gov.step();})}],
        ["05", function(gov) {runner = new Game(4, function() {gov.step();}, gov.arcade, function(n, t) {gov.store(n, t)})}],
        ["D3", function(gov) {runner = new Dialogue(Script.scene5, function() {gov.step();})}],
        ["06", function(gov) {runner = new Game(5, function() {gov.step();}, gov.arcade, function(n, t) {gov.store(n, t)})}],
        ["07", function(gov) {runner = new Game(6, function() {gov.step();}, gov.arcade, function(n, t) {gov.store(n, t)})}],
        ["D4", function(gov) {runner = new Dialogue(Script.scene6, function() {gov.step();})}],
        ["08", function(gov) {runner = new Game(7, function() {gov.step();}, gov.arcade, function(n, t) {gov.store(n, t)})}],
        ["D5", function(gov) {runner = new Dialogue(Script.scene7, function() {gov.step();})}],
        ["09", function(gov) {runner = new Game(8, function() {gov.step();}, gov.arcade, function(n, t) {gov.store(n, t)})}],
        ["D6", function(gov) {runner = new Dialogue(Script.scene8, function() {gov.step();})}],
        ["10", function(gov) {runner = new Game(9, function() {gov.step();}, gov.arcade, function(n, t) {gov.store(n, t)})}],
        ["11", function(gov) {runner = new Game(10, function() {gov.step();}, gov.arcade, function(n, t) {gov.store(n, t)})}],
        ["D7", function(gov) {runner = new Dialogue(Script.scene9, function() {gov.step();})}],
        ["~12", function(gov) {runner = new Game(11, function() {gov.step();}, gov.arcade, function(n, t) {gov.store(n, t)})}],
        ["D8", function(gov) {runner = new Dialogue(Script.bosstalk, function() {gov.step();})}],
        ["13", function(gov) {runner = new Game(12, function() {gov.step();}, gov.arcade, function(n, t) {gov.store(n, t)})}],
        ["D9", function(gov) {runner = new Dialogue(Script.ending, function() {gov.step();})}],
        ["END", function(gov) {runner = new Dialogue(Script.credits, function() {runner = new TitleScreen();})}],
    ],

    par: [25, 25, 25, 20, 25, 80, 35, 35, 35, 17, 112, NaN, 79],

    arcade: {
        bg: new Dialogue.Background(
            function (ctx) {
                ctx.drawImage(gfx.bg[0], 0, 0, this.width, this.height, 32, 16, this.width, this.height);
                ctx.drawImage(gfx.bg[0], this.width, 16*2, 16*3, 16*2, 32+64+8, 24, 16*3, 16*2);
                ctx.drawImage(gfx.bg[0], 240, 0, 16, 32, 192, 48, 16, 32);
            }
        ),

        script: [
            function() {music.playMusic("carousel");},
            [[[4, 4]], "About Arcade Mode", Dialogue.textStyle.CENTERED],
            [[[1, 4]], "In arcade mode, you will be unable to save your game. After completing each level, your turns will be compared to a par value."],
            [[[Math.random() > 0.5 ? 39 : 38, 4]], "At the end, your results will be converted to a score, which can be used to show who is the best!"],
            [[[6, 4]], "Well, the best at Space Ava, anyway. Don't get too full of yourself."],
            [[[3, 4]], "Additionally, dialogue screens will not be shown. You will automatically progress to the next area."],
            [[], "Now that that's all set, let's begin!", Dialogue.textStyle.CENTERED]
        ]
    },

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
            [[[6,4], [12,16]], "AVA: I am Captain Ava Marie St.Janet Crispin VII, and this is a starship of the Amalgamation of Worlds! I know you're not supposed to be in my quarters!"],
            [[[6,4], [10,16]], "???: And you can call me Lily, Ms. the Seventh. And honestly, I just wanted to loot the place; I thought you were all dead."],
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
                if (this.timer < 200) {
                    ctx.drawImage(gfx.bg[0], this.width, 0, 16*3, 16*2, 32+64+8, 24, 16*3, 16*2);
                }
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
            [[[4,0], [9,4]], "LILY: Sure, why not."],
            [[[1,0], [8,4]], "AVA: Uh-huh...\nAnyway, Number 2. Why are people shooting at me? I just want to help my friends!"],
            [[[1,0], [11,4]], "LILY: About that..."],
            [[[6,0], [10,4]], "LILY: Not all of us in the black hole are so friendly, unfortunately... There are a lot of us who don't like outsiders."],
            [[[3,0], [10,4]], "AVA: But I'm in need! Shouldn't they be more helpful?"],
            [[[3,0], [11,4]], "LILY: Your Amalgamation must be a wonderful place, if that's how you think the world works.."]
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
            [[[3,0], [11,4], [16, 19]], "MAN: Halt in the name of quantum!"],
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
            [[[1, 0], [14, 4]], "LILY: As a rule, quantum doesn't kill people... it's a long story, but I'm sure your friend is around here somewhere."],
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
            function() {music.playMusic("carousel")},
            [[[2, 0], [8,4]], "AVA: Lilith, I'm concerned. This doesn't look like the inside of a black hole at all?"],
            [[[1, 0], [9,4]], "LILY: What did you expect the inside of a black hole to look like?"],
            [[[3, 0], [9,4]], "AVA: Whoa..."],
            [[[4, 0], [12,4]], "LILY: If you look up and see the event horizon, then you know you're still stuck in here."],
            [[[2, 0], [13,4]], "AVA: So that's what that is..."]
        ]
    },
    scene6: {
        bg: new Dialogue.Background(
            function(ctx) {
                ctx.drawImage(gfx.bg[0], 512, 0, this.width, this.height, 32, 16, this.width, this.height);
            }
        ),
        script: [
            function() {music.playMusic("carousel")},
            [[[2, 0], [8, 4]], "AVA: I wonder how there's a breathable atmosphere in here; that's pretty lucky, isn't it?"],
            [[[1, 0], [10, 4]], "LILY: Maybe it's best not to ask questions about that..."],
            [[[2, 0], [12, 4]], "AVA: Don't you ever wonder about these things, living here?"],
            function() {music.playMusic("chimier")},
            [[[6, 0], [11, 4], [20, 19]], "???: Halt, outsider. And you too, traitor."],
            [[[3, 0], [12, 4], [20, 19]], "AVA: Quantum again?!"],
            [[[6, 0], [12, 4], [19, 19]], "GREEN: Indeed. It is I, George Green. And I shall specify the boundary conditions of your defeat!"],
            [[[3, 0], [10, 4], [19, 19]], "LILY: Yeah, yeah, let's just get this over already."],
            [[[6, 0], [10, 4], [19, 19]], "GREEN: So be it. Set the initial conditions now! Shut up and calculate!"]
        ]
    },
    scene7: {
        bg: new Dialogue.Background(
            function(ctx) {
                ctx.drawImage(gfx.bg[0], 512, 0, this.width, this.height, 32, 16, this.width, this.height);
            }
        ),
        script: [
            function() {music.playMusic("chimier")},
            [[[5, 0], [8, 4], [19, 19]], "GREEN: So be it! I am bested. But before I go, I have but one thing to add."],
            [[[1, 0], [13, 4], [20, 19]], "GREEN: Had I been in charge, I would have called it... Electromagnetism."],
            function() {music.playMusic("carousel")},
            [[[2, 0], [11, 4]], "AVA: I don't get it..."],
            [[[6, 0], [10, 4]], "LILY: It's probably for the best."],
            function() {music.playMusic("spaceless")},
            [[[5, 0], [13, 4], [26, 16]], "CINDY: Commander Cindy Palisade on a scientific survey of the native species of the black hole. No sign of my comrades."],
            [[[2, 0], [14, 4], [26, 16]], "CINDY: I'm going to try to make contact. This could be a historic moment."],
            [[[4, 0], [14, 4], [26, 16]], "AVA: Um, Ava to Commander Palisade? Hello?"],
            [[[3, 0], [12, 4], [27, 16]], "CINDY: Ava?! Don't tell me I have to share authorship on this discovery..."],
            [[[4, 0], [11, 4], [26, 16]], "LILY: Another one of your friends, I suppose?"],
            [[[5, 0], [8, 4], [26, 16]], "AVA: That's right!"],
            function() {music.playMusic("steady")},
            [[[1, 0], [10, 4], [28, 16]], "AVA: Just one more to go..."]
        ]
    },
    scene8: {
        bg: new Dialogue.Background(
            function(ctx) {
                ctx.drawImage(gfx.bg[0], 768, 0, this.width, this.height, 32, 16, this.width, this.height);
            }
        ),
        script: [
            function() {music.playMusic("carousel")},
            [[[1, 6], [8, 2]], "LILY: I've got an idea for how to protect you from quantum!"],
            [[[4, 6], [9, 2]], "AVA: Oh?"],
            [[[1, 6], [15, 4]], "LILY: Just a second..."],
            [[[2, 6], [15, 5]], "AVA: Lilith... what are you doing?"],
            [[[2, 6], [15, 6]], "LILY: Just hold still, okay?"],
            function() {music.playSound("crash")},
            [[[6, 6], [15, 5]], "AVA: Ouch!"],
            [[[6, 6], [15, 6]], "LILY: I told you to stay still!"],
            [[[6, 6], [15, 6]], "AVA: ..."],
            [[[7, 6], [8, 2]], "LILY: There! Do you like it?"],
            [[[7, 6], [8, 2]], "AVA: Uh..."],
            [[[7, 6], [14, 2]], "AVA: Do you really think this is going to work?"],
            [[[7, 6], [9, 2]], "LILY: I don't know, but you look adorable!"]
        ]
    },
    scene9: {
        bg: new Dialogue.Background(
            function(ctx) {
                ctx.drawImage(gfx.bg[0], 768, 0, this.width, this.height, 32, 16, this.width, this.height);
            }
        ),
        script: [
            function() {music.playMusic("steady")},
            [[[7, 6], [8, 2]], "LILY: I haven't been this deep into quantum territory for a long time... you can feel the superposition."],
            [[[1, 6], [11, 2]], "AVA: Um... Lilith... you've been really helpful this whole quest, but maybe I should take the rest myself."],
            [[[1, 6], [13, 2]], "LILY: Captain the Seventh! I thought we were in this together! What brought this on?"],
            [[[4, 6], [10, 2]], "AVA: Well, things are going pretty well, right? So I can do this myself, right?"],
            [[[1, 6], [8, 2]], "LILY: Look, you're not bothering me any. I've been meaning to stick it to quantum for a long time."],
            [[[6, 6], [10, 2]], "AVA: It's just a little complicated, okay! And by the way--"],
            function() {music.playMusic("chime")},
            [[[3, 6], [12, 2], [17, 20]], "MAN: All rise for the supreme leader of quantum!"],
            [[[2, 6], [14, 2], [18, 20]], "AVA: But we're already standing."],
            [[[6, 6], [13, 2], [16, 20]], "MAN: Then... remain so! Good work... for traitors and outsiders, at least."],
            [[[2, 6], [11, 2], [17, 20]], "MAN: And now without any further ado... Shut up, calculate, and give a big round of applause for Schrodinger's Cat!"],
            [[[3, 6], [14, 2], [21, 16], [16, 20]], "AVA: The leader of quantum is a cat?! A black cat too, how stereotypical."],
            [[[3, 6], [13, 2], [21, 16], [16, 20]], "LILY: Ava, most black cats are perfectly nice. But Schrodinger's cat... this is serious."],
            function() {music.playMusic("deadboing")},
            [[[6, 6], [14, 2], [22, 16], [16, 20]], "CAT: I knew it would be humans! The species that ruined my life with their damned superposition!"],
            [[[1, 6], [14, 2], [21, 16], [16, 20]], "CAT: What kind of life is it anyway, being constantly alive or dead? It was just supposed to be a thought experiment!"],
            [[[3, 6], [14, 2], [23, 16], [18, 20]], "AVA: But I've certainly never meant you any harm! And... ... ... are you dead?"],
            [[[6, 6], [12, 2], [22, 16], [16, 20]], "CAT: See what your species has reduced me to! And now you invade here, the place I was finally able to be at home?"],
            [[[3, 6], [12, 2], [23, 16], [18, 20]], "AVA: No seriously though you were just dead and now you're alive and... now you're dead again!"],
            [[[3, 6], [14, 2], [22, 16], [17, 20]], "CAT: I tire of this. Prepare yourself! Ready your calculations, human, this ends now!"]
        ]
    },
    bosstalk: {
        bg: new Dialogue.Background(
            function(ctx) {
                for (var i = 0; i < (this.width / 16); i++)
                    for (var j = 0; j < (this.height/16); j++) {
                        ctx.drawImage(gfx.tiles, (254-7)*16, 0, 16, 16, 32+i*16, 16+j*16, 16, 16);
                    }
            }
        ),
        script: [
            function() {music.playMusic('deadboing')},
            [[[3, 5], [21, 14]], "AVA: That isn't fair! I thought there were rules to all of this!"],
            [[[6, 5], [22, 14]], "CAT: Meowhahahaha! I didn't call my organization quantum for nothing! You'll never take over this black hole!"],
            [[[3, 5], [23, 14]], "AVA: But all I want to do is leave! We ended up here by accident!"],
            function() {music.playMusic('steady')},
            [[[1, 5], [21, 14]], "CAT: All you wanted to do... was leave?"],
            [[[6, 5], [23, 14]], "AVA: That's right! You can have this black hole, just release us and let us figure out a way out of here!"],
            [[[1, 5], [22, 14]], "CAT: That's impossible! No one would enter a black hole just by accident... and even if you did, you can't get out."],
            [[[5, 5], [21, 14]], "AVA: You'd be amazed what Lieutenant Nelehu can do. I know we can get out, but you need to release our last crewmember first!"],
            [[[4, 5], [21, 14]], "CAT: Your sob story is oddly convincing! However, I can't just let you go that easily."],
            function() {music.playMusic('deadboing')},
            [[[6, 5], [22, 14]], "CAT: I'll have my men set up a challenge for you. And if you survive it, maybe I'll let you go."],
            [[[3, 5], [22, 14]], "CAT: And if you fail, then I'll make sure you don't ruin this black hole for the rest of us!"],
            [[[1, 5], [23, 14]], "..."],
            [[[1, 5], [23, 14]], "..."],
            [[[3, 5], [22, 14]], "..."],
        ]
    },
    ending: {
        bg: new Dialogue.Background(
            function(ctx) {
                ctx.drawImage(gfx.bg[0], 768, 0, this.width, this.height, 32, 16, this.width, this.height);
            }
        ),
        script: [
            function() {music.playMusic('power')},
            [[[5, 6], [8, 2], [23, 16]], "AVA: We did it!"],
            [[[4, 6], [8, 2], [23, 16]], "LILY: I'm impressed! I didn't think anyone could take on Schrodinger's Cat and win!"],
            [[[1, 6], [12, 2], [22, 16]], "CAT: I let you win. Sympathy is a weakness."],
            [[[5, 6], [8, 2], [21, 16]], "AVA: Still counts as a victory to me!"],
            function() {music.playMusic('carousel')},
            [[[1, 6], [10, 2], [23, 16]], "AVA: So um, Lilith, it was good doing business with you and now you can go back to scavenging or whatever it is you do..."],
            [[[1, 6], [11, 2], [23, 16]], "LILY: What's wrong, Captain? Why are you suddenly so eager to get rid of me?"],
            [[[6, 6], [10, 2], [21, 16]], "CAT: Um, not to interrupt anything, but don't you want me to release your friend?"],
            [[[3, 6], [10, 2], [22, 16]], "AVA: Yes of course you should release her it's just that..."],
            [[[6, 6], [10, 2], [22, 16]], "CAT: Look, I'm a busy animal, I've got a lot of things to do at once, okay? I'm going to go get her."],
            function() {music.playMusic('spaceless')},
            [[[3, 6], [11, 2], [31, 14]], "STELLA: Ensign Crispin! Good work, we were really in a bind here without you!"],
            function() {music.playMusic('steady')},
            [[[3, 6], [14, 2], [29, 14]], "LILY: Did she say ensign? But the Seventh, you told me that you were the captain..."],
            [[[6, 6], [14, 2], [30, 14]], "STELLA: Is this true? Have you been impersonating a Spacefleet captain, Ensign?"],
            [[[1, 6], [11, 2], [29, 14]], "STELLA: Ms. Alien, I'm sorry for my subordinate's behavior. I'm Captain Stella Harmony of the Starship Zip."],
            [[[1, 6], [10, 2], [29, 14]], "LILY: Ensign the Seventh's been great, Captain Harmony. I'm sure she had her reasons..."],
            [[[3, 6], [11, 2], [29, 14]], "AVA: I'm sorry, Lily! I just wanted to make you think I was important..."],
            function() {music.playMusic('spaceless')},
            [[[5, 6], [8, 2], [29, 14]], "LILY: Aww Ava, you didn't need to try to intimidate me. I helped you out, didn't I?"],
            [[[4, 6], [8, 2], [31, 14]], "STELLA: Well, since you apologized I don't think any further punishment is necessary..."],
            [[[1, 6], [11, 2], [29, 14]], "LILY: Is that really how you run a military?"],
            [[[5, 6], [12, 2], [31, 14]], "STELLA: Sure!"]
        ]
    },
    credits: {
        bg: new Dialogue.Background(
            function(ctx) {
                ctx.drawImage(gfx.bg[0], 256, 0, this.width, this.height, 32, 16, this.width, this.height);
            }
        ),
        bg2: new Dialogue.Background(
            function (ctx) {
                ctx.drawImage(gfx.bg[0], 0, 0, this.width, this.height, 32, 16, this.width, this.height);
                //ctx.drawImage(gfx.bg[0], this.width, 0, 16*3, 16*2, 32+64+8, 24, 16*3, 16*2);
            }
        ),
        bg3: new Dialogue.Background(
            function(ctx) {
                ctx.drawImage(gfx.title, 0, 0, 256, 192, 0, 8, 256, 192);
            }
        ),
        bg4: new Dialogue.Background( 
            function(ctx) {
                ctx.drawImage(gfx.bg[0], 64, 0, this.width-64, this.height, 32, 16, this.width-64, this.height);
                ctx.drawImage(gfx.bg[0], this.width-64, 0, 64, this.height, this.width - 32, 16, 64, this.height);
            }
        ),
        script: [
            function(e) {e.setAuto(true, 240); music.playMusic('imperfection')},
            [[[4, 8], [8, 12]], "Space Ava\n Credits", Dialogue.textStyle.CENTERED],
            (e) => {e.setAuto(true, 145); e.bg = Script.opening.bg},
            [[[4, 2], [24, 6]], "GAME CONCEPT\n \n Nicole", Dialogue.textStyle.CENTERED],
            [[[1, 2], [25, 6]], "PROGRAMMING\n \n Nicole", Dialogue.textStyle.CENTERED],
            [[[3, 2], [25, 6]], "LEVEL DESIGN\n \n Nicole", Dialogue.textStyle.CENTERED],
            (e) => {e.bg = Script.scene9.bg},
            [[[16, 15], [28, 19]], "GRAPHICS\n \n Nicole", Dialogue.textStyle.CENTERED],
            [[[17, 15], [27, 19]], "MUSIC\n \n Nicole", Dialogue.textStyle.CENTERED],
            [[[18, 15]], "SOUND EFFECTS\n \n Nicole", Dialogue.textStyle.CENTERED],
            (e) => {e.bg = Script.scene5.bg},
            [[[31, 7], [21, 13]], "TESTING\n \n No one!", Dialogue.textStyle.CENTERED],
            [[[30, 7], [22, 13]], "TESTING\n \n (sorry)", Dialogue.textStyle.CENTERED],
            (e) => {e.setAuto(true, 180); e.bg = Script.credits.bg2},
            [[[29, 4], [26, 12], [24, 16], [4, 20]], "SPECIAL THANKS TO\n howler.js\n \n Javascript audio library", Dialogue.textStyle.CENTERED],
            [[[29, 4], [26, 12], [24, 16], [4, 20]], "SPECIAL THANKS TO\n DefleMask\n \n Chiptune tracker", Dialogue.textStyle.CENTERED],
            [[[31, 4], [26, 12], [24, 16], [4, 20]], "SPECIAL THANKS TO\n neonlare\n \n Isometric base sprite", Dialogue.textStyle.CENTERED],
            (e) => {e.bg = Script.credits.bg},
            [[[21, 18], [19, 10], [16, 6], [16, 2]], "SPECIAL THANKS TO\n itch.io\n \n Distribution, hosting", Dialogue.textStyle.CENTERED],
            [[[21, 18], [19, 10], [16, 6], [16, 2]], "SPECIAL THANKS TO\n Sega Enterprises\n \n Master System graphics style", Dialogue.textStyle.CENTERED],
            [[[23, 18], [20, 10], [18, 6], [18, 2]], "SPECIAL THANKS TO\n You!\n \n Putting up with the\n nonsense that I call a game", Dialogue.textStyle.CENTERED],
            (e) => {e.setAuto(true, 200); e.bg = Script.credits.bg4},
            [[[40, 8], [41, 12]], "\n And of course,\n Marion\n", Dialogue.textStyle.CENTERED],
            (e) => {e.bg = Script.credits.bg3},
            [[[]], "\n \n A\n Nicole Express\n Production", Dialogue.textStyle.CENTERED],
            function(e) {e.setAuto(false); e.bg = Script.credits.bg},
            [[[35, 8], [36, 12]], "\n Thanks for playing!", Dialogue.textStyle.CENTERED],
        ]
    },
    null: {
        bg: new Dialogue.Background(
            function (ctx) {;}
        ),
        script: [
            function() {music.playMusic("")},
            [[], "..."]
        ]
    }
}
