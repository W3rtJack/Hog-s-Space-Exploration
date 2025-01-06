import { Player, Entity, system, world } from "@minecraft/server";
import { planetsEnum } from "./definitions";
import { dimension, nether, overworld } from "./main";
import { dimensionLoaded } from "./data";


Player.prototype.airTime = 0;
Player.prototype.jumpFall = false;

Player.prototype.update = function(tick){
    if (!this.hasTag("int")){
        this.runCommand(`fog @s push "hog:fog_the_end" aaa`)
        this.addTag("int")
    }

    this.footprintCheck(tick)

    // This is a tacky solution to making this function only run when the player actually loaded into the dimension
    if (this.hasTag("solar_system_after") && dimensionLoaded(nether)){
        system.runTimeout(()=>{
            const loc = {x:-88,y:1368.5,z:-50};
            const ride = nether.spawnEntity("hog:seat",{x:0,y:20,z:0});
            ride.tryTeleport(loc,{dimension:nether});
            ride.getComponent("minecraft:rideable").addRider(this);
            this.runCommand(`fog @s remove planet`)
            this.runCommand(`fog @s push hog:fog_solar_system planet`)
            this.runCommand("scriptevent hog:tick")
            this.camera.clear()
        },20)
        this.removeTag("solar_system_after")
    }
    
    if (this.hasTag("earth_after") && dimensionLoaded(overworld)){
        system.runTimeout(()=>{
            this.runCommand(`fog @s remove planet`)
            this.camera.clear()
            const ride = overworld.spawnEntity("hog:rocket",{x:0,y:20,z:0});
            ride.tryTeleport({x:0,y:300,z:0},{dimension:overworld});
            ride.getComponent("minecraft:rideable").addRider(this)
        },5)
        this.removeTag("earth_after")
    }
}



// Doesnt seem worth it moving this entity function over to an entity class. This is the only one
Entity.prototype.airUpdate = function(){
    if (!this.isOnGround && !(this.isGliding || this.isFlying)){
        this.airTime++;
    }else {
        this.airTime = 0;
        this.jumpFall = false;
    }
}


Player.prototype.setPlanet = function(planetId){
    if (planetsEnum.has(planetId)){
        this.setDynamicProperty("planetDimension",planetId)
        

        const planet = planetsEnum.get(planetId);
        const loc = planet.location;
        loc.y = 290;
        loc.x += (Math.random()-0.5)*10
        loc.z += (Math.random()-0.5)*10

        this.triggerEvent(planet.gravity.event)

        this.tryTeleport(loc,{dimension:dimension});
        system.runTimeout(()=> {
            const ride = dimension.spawnEntity("hog:rocket",{x:loc.x,y:20,z:loc.z});
            ride.tryTeleport(loc,{dimension:dimension});
            ride.getComponent("minecraft:rideable").addRider(this)},
        40);
        this.runCommand(`fog @s remove planet`)
        
    }else if (planetId == "Null"){
        this.runCommand(`fog @s remove planet`)
        this.setDynamicProperty("planetDimension",null)

    }else if (planetId == "space_station"){
        this.setDynamicProperty("planetDimension",planetId)
        this.runCommand(`fog @s remove planet`)
        this.camera.clear()
        this.runCommand(`fog @s push hog:fog_space_station planet`)
        this.tryTeleport({x:500,y:103,z:500},{dimension:dimension});
        this.addEffect("slow_falling",30,{showParticles:false})

    }else if (planetId == "solar_system"){
        this.setDynamicProperty("planetDimension",planetId);
        const loc = {x:-88,y:1368.5,z:-50};
        this.tryTeleport(loc,{dimension:nether});
        this.addTag("solar_system_after")

    }else {
        throw Error(`Planet with ID ${planetId} does not exist`)
    }
}

Player.prototype.getPlanet = function(){
    return planetsEnum.get(this.getDynamicProperty("planetDimension"))
}

Player.prototype.isMoving = function(){
    return (this.getVelocity().x > 0.1 || this.getVelocity().x < -0.1) || (this.getVelocity().z > 0.1 || this.getVelocity().z < -0.1)
}

const footprintBlocks = [
    "hog:martian_sand",
    "hog:martian_stone",
    "hog:asteroid_stone",
    "hog:asteroid_sand",
    "minecraft:gravel",
    "minecraft:andesite",
    "minecraft:suspicious_gravel"
]

Player.prototype.footprintCheck = function(tick){
    if (this.location.y > 255 || this.location.y <= 0 || this.dimension.id != "minecraft:the_end") return;
    const loc = this.location; loc.y--;
    try {
        const block = this.dimension.getBlock(loc);
        
        if (footprintBlocks.includes(block?.typeId)){
            if (tick % 5 === 0 && this.isOnGround){
                if (this.isMoving()){
                    loc.y += 0.1
                    this.dimension.spawnParticle("hog:footprint",loc);
                }
            }
        }
    }catch {}
}






Player.prototype.getChunk = function(chunkSize){
    return {
        x: Math.floor(this.location.x/chunkSize),
        z: Math.floor(this.location.z/chunkSize)
    }
}

Player.prototype.getChunkChanged = function(chunkSize){
    const change = (this.prevChunk.x != this.getChunk(chunkSize).x) || (this.prevChunk.z != this.getChunk(chunkSize).z);
    this.prevChunk = this.getChunk(chunkSize);
    return change;
}


Entity.prototype.addDynamicProperty = function(property, value){
    return this.setDynamicProperty(property,this.getDynamicProperty(property) != undefined ? this.getDynamicProperty(property) + value : value);
}

Player.prototype.prevChunk = {x:0,z:0}
Player.prototype.prevChunkUpdate = true;