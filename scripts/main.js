import * as mc from "@minecraft/server";
import {} from "player.js";
import { getNearestUnloadedChunkOptimised } from "./chunk.js";
import { blockComponents } from "./blockComponents.js";
import { PlanetEntities, planetsEnum } from "./definitions.js";
import {  } from "./blockComponents.js";
import { oxygenUpdate } from "./oxygen.js";
import { rocketUpdate, seatRiding } from "./rocket.js";
import {} from "spaceStation.js";

export const dimension = mc.world.getDimension("the_end"); // The dimension used for the space exploration in my case, the end. Will not change
export const nether = mc.world.getDimension("nether") // The dimension used for the actual space exploration, due to a lag issue of the particles not despawning from distance but due to dimension transferring
export const overworld = mc.world.getDimension("overworld");

// The time for planets to live before redrawing (in seconds)
const tickTime = 60


var tick = -20;
const chunkSize = 8


var count = 0;
// On tick event
const onTick = () => {
    if (tick > -1){
        var i = 1;
        var solarSystemLoad = false;
        for (const player of mc.world.getPlayers()){
            if (player.getDynamicProperty("planetDimension") != "Null" || player.getDynamicProperty("planetDimension") != undefined) i++;
            player.update(tick)

            if (!player.hasTag("planetLoading") && (tick % count === (i-2)) && player.dimension.id == "minecraft:the_end"){
                const chunkSearch = getNearestUnloadedChunkOptimised(player,chunkSize,player.getRotation().x,player.getRotation().y);
                player.getPlanet()?.loadChunk(chunkSearch,chunkSize);

                player.prevChunkUpdate = chunkSearch == false ? false : true;
            }else {
                player.addDynamicProperty("planetLoading",-1)
                if (player.getDynamicProperty("planetLoading") <= 0){
                    player.removeTag("planetLoading")
                }
            }

            if (player.getDynamicProperty("planetDimension") == "solar_system"){
                solarSystemLoad = true;
            }

            if (player.hasTag("specialStart")){
                mc.world.structureManager.place("space_station",dimension,{x:445,y:86,z:456})
                player.runCommand("tickingarea add circle 0 0 0 4 true")
                nether.runCommand("tickingarea add circle 0 0 0 4 true")
                player.removeTag("specialStart")
            }
            
            oxygenUpdate(player,mc.system.currentTick);

        }

        count = i-1;


        for (const ship of nether.getEntities({type:"hog:seat"})){
            seatRiding(ship);
        }

        for (const rocket of mc.world.getDimension("overworld").getEntities({type:"hog:rocket"})) rocketUpdate(rocket);
        for (const rocket of dimension.getEntities({type:"hog:rocket"})) rocketUpdate(rocket);

        for (let [key,value] of planetsEnum){
            value.update(1);
        }


        
        for (var i = 0; i < PlanetEntities.length; i++){
            if (solarSystemLoad){
                if (tick % (tickTime*20 + i*2) === 0){
                    PlanetEntities[i].spawnPlanet(tickTime);
                }
                if ((tick % (tickTime*20 + i*2 + 1) === 0)){
                    PlanetEntities[i].spawnPlanetOverlay(tickTime,mc.world.getPlayers()[0].location);
                }

                const loc2 = {x:-102,y:1364,z:-45};
                if (nether.getEntities({type:"hog:space_station",location:loc2,distance:25}).length < 1){
                    // I know this will create multiple entities every time the nether it loaded.
                    // But ive done this quickly i dont care
                    const station = nether.spawnEntity("hog:space_station",{x:0,y:20,z:0});
                    station.tryTeleport(loc2,{dimension:nether});
                }
            }


            PlanetEntities[i].playerCheck()
        }
    }
    tick++;
    mc.system.run(onTick)
}

function startup(){
    for (var i = 0; i < 20; i++)
        nether.spawnParticle(`hog:orb_emitter`,{x:0,y:1400,z:0})
}

onTick()
//mc.system.run(startup)


mc.world.beforeEvents.worldInitialize.subscribe(event=> {
    const blockRegistry = event.blockComponentRegistry;

    for (const comp of blockComponents){
        blockRegistry.registerCustomComponent(comp.id, comp.code);
    }

    /*
    for (const comp of itemComponents){
        event.itemComponentRegistry.registerCustomComponent(comp.id, comp.code)
    }
    */
})



mc.system.afterEvents.scriptEventReceive.subscribe(event=> {
    const player = event.sourceEntity;
    if (event.id == "hog:planet"){
        player.setPlanet(event.message)
        player.addTag("planetLoading");
        player.setDynamicProperty("planetLoading",200)
        tick = -20
    }
    else if (event.id == "hog:tick"){
        tick = -20
    }
})


mc.world.afterEvents.playerSpawn.subscribe(event=> {
    const first = event.initialSpawn;
    const player = event.player;

    if (first){
        if (player.getDynamicProperty("planetDimension") == "solar_system"){
            player.setPlanet("solar_system")
        }
    }
})