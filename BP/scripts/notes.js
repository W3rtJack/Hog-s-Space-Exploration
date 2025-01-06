// Completely useless document just to type up some notes im thinking throughout the project
// Currently made this on the 24th. A week before deadline pretty much
// Got the planets generating
// The surface of the planets generating with random generation, ore gen and caves
// Albeit slow and a little tacky on the ore generation

// Currently working on the "space ores"
// Honestly one of the more tedious parts of the project
// The space iron ore was the test
// For simplicity sakes, i will use discrete uniform distribution for the fortune enchantment
// Making it use the formula would mean the loot table is so much longer than I want it to be
// Could I use scripting? Sure. But for the slow performance already;
// I dont want a lag spike from 10 people exploring the world to gamble on whether the item will drop
// Or crash the game >:(


// Ok. Starting to freak out that this project is partially impossible
// Trying to figure out a good solution to moving between planets
// I wanted to move the planets relative to the player
// But the only solution i can think of is respawning the planets every few seconds and applying a new velocity based on what the player is inputting
// However that is laggy
// Another solution, attaching all the particles to entities and moving those entities around
// For 1, id need to rewrite my script to attach them all to an entity model, with color data and lots of other stuff
// Would take the rest of the time to finish (not viable)
// And the world would have to be loaded around the player which is not ideal

// Solution no.2. Make the player actually travel around in a space shuttle, and have a "space station" which are the blocks that stay static
// And actually have the player travel around relative to the planets instead. This means no fancy rotation (id probably avoid in other example for time reasons anyways)
// But also is just not as well rounded as i wanted it to be
// Then again, dont entirely need the space station. But its the option I think i'll go for

// Issue no.2. The end. Removing the end using data driven dimensions, will remove the end. But also remove the overworld and the end
// Removing the overworld will remove the nether and overworld. And removing the nether only removes the nether as expected.
// This is so frustrating as I cant just remove the entire overworld It ruins the whole layout and plan
// But I cant have end generation as it will overlap with my features
// So. Kinda at a roadblock. Could make it a world. But I do not like that solution (with edited nbt.)
// I also dont think its allowed in the competition
// So yeah. Not sure what Im gonna do. Suffer ig :/



// Alright. 26th now. 5 days left
// Its all coming together now
// Got the space station back from Yumi and it is awesome. Of course I wouldve wanted the player to start with a small one and build it up. But this is still perfect omg
// Genuinely dont know how they made such a good build in this time. But anyways
// Going to impliment it soon. Fixed the planet issue, made everything smaller and just made the player move slower and shrunk them, but to make sure the immersion
// isnt ruined i will prevent the player from going into third person
// And for the end islands. I generate above them
// I found out, using /place for generating structures doesnt work, however with jigsaw it does.
// And i have finished off the pottery parts now. Ngl, bubbles is ugly and barely recognisable. But I did my best!! (not really but dont tell them that)
// Oh also got the solar panel. And it is good. I like. Thats pretty much that


// Okay. Got a bunch of assets, time to just put it all together
// Then im gonna make sure all the blocks and stuff are polished
// So tools work, they drop what they should. Any custom functionality
// The flags are good
// And then. Pray I can fix the issue of lag actually teleporting to the planet dimensions
// Also dont forget to make the behind of planets dark because of no light reflecting from the sun
// The dark side


// Alright. 29 hours remaining. Ive estimated 15 man hours.
// Flags are all done, they look amazing. Space suit is implimented
// Currently making oxygen and changing the fall damage on each planet
// Also making every entity on planets have low gravity. Tho might be a pain...
// But feeling the slight time crunch now.
// Still dont have the dark sides of planets
// Still dont have airlock doors. Or the space station
// Might not impliment the slabs and stairs for time purposes
// Gonna see how much can i do tonight
// But no matter what tomorrow night is the deadline. Midnight.
// Here goes nothing
// Also a fun fact, at the time of writing this (19:20 on the 30th)
// There is 20 js files and 2038 lines of javascript code. That will include comments and blank space. But
// Thats alot... (for the time span lol)


// Alright. Airlock doors. Scrapped, for now. Rockets now work on all planets (except the nether but that just doesnt make sense)
// The time has been extended 6 days due to new years eve. Luckily for me I needed that
// There is so much polish needed. and a ton of bug fixing just to make it playable
// And alot of lag, only when loading from the solar system into planets though
// Also, leaving dark sides of planets and slabs out. Due to time limits and I wanna get it out rather than leave it till last minute. again.
// So whats to do :
// - Make an icon
// - Fix the issue of lag spawning from solar system to planet (done)
// - Make it so that spawning into the solar system and planets spawns with a ride (done)
// - Have an official way to get to the space station and solar system
// - The whole oxygen system (somehow i forgot)
// - And a few crafting recipes (the rocket, space suit, steel)
// - A config menu, to configure chunk spawning distance for simulation chunks, and performance changes for lower end devices
// - Add ambience to the planets (done) (this was just fun to do)
// Once again, here goes nothing

// Alright, a little late in the game. But a solution to the lag of particles when loading onto new planets
// Its not always an issue, but i want it fixed.
// I spawn the planets in the nether and the planet dimensions in the end.
// The nether can have the black sky and fog like the end and can spawn particles
// Transferring dimensions will despawn all particles for that player, stopping the major lag cause (hopefully)
// Just a test but the planets will stay in the nether from now on

// Okay. Another note to make sure i remember what im supposed to do
// Make the space station a planet with model (done)
// crafting recipes (done)
// Config menu (ignore)
// Fix camera when leaving rocket (done)
// Make the armor enchantable (done)
// Bugtest with some friends (done)
// Make the seat hide the player when sitting (ignored, kinda funny)


// Bugs :
// - Issue with multiple ships at once (done)
// - Issue when loading into the solar system together (fixed kinda)
// - Major lag when loading chunks of planets with fog with multiple people (fixed kinda)
// - Rejoining the world in the solar system results in weird positioning (fixed)

// Alright. Almost ready to post
// Am i happy with the state its in. Kinda.
// Is it buggy. Sure. Was it a game jam. Yes
// My main issue is the major frame drops loading chunks in planet dimensions
// For some reason, particles and block placement is linked in some invisible way
// But alas. We live. and hope people can see past it lol
// Also the bug of the solar system overriding in multiple particles
// In this case, im not sure how to link players and keep track of their solar systems. Make each of them have individual ones millions of blocks away?
// But then i like the silly idea of everyone seeing each other flying about
// Im not sure.
// Definitely planning on working on this even after the jam. The infinite potential of space is amazing. Literally anything I want to add.
// the only limits being performance, bedrock edition and my abilities. 3 kind of major flaws lol
// But start off with adding small features and build up. And I'm looking forward to the future
// Repeating what i said. I'm happy with it. Even though it isnt perfect.


// Changes / bugs :
// - Adjust the size of the overlay to fit on most devices
// - Make the players be able to get on the same ship at the space station (done (buggy maybe))
// - Make the ship reload the solar system and not the players (done, needs testing)
// - Maybe redo the stars, tho theyre laggy
// - Rework the movement in the seat (Raidz, you were terrible at controlling that)
// - make the players spawn outside the planets they leave
// I need to stop adding to this list. Feature creep! (only because the date got extended. so ofc, im pushing it to the limits. like the idiot i am)