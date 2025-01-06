import { dimension, nether } from "./main";
import { clamp } from "./maths";
import { world, ItemStack } from "@minecraft/server";

export function rocketUpdate(rocket){
    playerCheck(rocket);

    rocket.addEffect("slowness",100,{showParticles:false,amplifier:255});
    
    const time = rocket.getDynamicProperty("flightTime") ? rocket.getDynamicProperty("flightTime") : 0
    if (time > 0){
        const loc = rocket.location;
        loc.y++;
        try {
            rocket.dimension.spawnParticle("hog:fire_launch",loc)

            rocket.dimension.spawnParticle("hog:fire_launch_spread",loc)
        }catch {}

        if (time % 20 === 0){
            for (const player of rocket.dimension.getPlayers({location:rocket.location,distance:75})){
                player.runCommand(`camerashake add @s ${clamp(time/100,0,0.5)} 1`)
            }
        }
    }
    rocket.applyImpulse({x:0,y:time>100 ? 0.1 : 0,z:0})
    rocket.setRotation({x:0,y:0})


    if (rocket.location.y > 300) rocketSpace(rocket)
}


const riders = new Map();


function playerCheck(rocket){
    const ride = rocket.getComponent("rideable");
    const controller = ride.getRiders()[0];

    if (controller?.isJumping){
        rocket.addDynamicProperty("flightTime",1)
    }else {
        if (rocket.getDynamicProperty("flightTime") >= 1) rocket.addDynamicProperty("flightTime",-5)
    }
    
    const riderIds = [];

    for (const rider of ride.getRiders()){
        rider.camera.setCamera("minecraft:follow_orbit",{facingEntity:rocket})
        rider.setDynamicProperty("oxygen.value",100)
        riderIds.push(rider.id)
    }

    const r = riders.get(rocket.id); // Riders from previous tick
    if (r){
        for (const ride of r){
            const rider = rocket.dimension.getPlayers().filter(f=> f.id == ride)[0];
            if (!rider) break
            if (!rider.hasTag("transport")){
                if (!riderIds.includes(rider.id)){
                    rider.camera.clear()
                    if (rider.getDynamicProperty("planetDimension") == "space_station"){
                        rider.tryTeleport({x:499.5,y:100,z:485.5},{dimension:dimension});
                        rocket.triggerEvent("hog:despawn")
                    }
                }
            }
        }
    }

    riders.set(rocket.id,riderIds);
}


function rocketSpace(rocket){
    const ride = rocket.getComponent("rideable");
    const riders = ride.getRiders();

    const data = dataSetup(rocket);
    const destination = getDestination(riders[0]);
    var i = 0
    for (const player of riders){
        if (i == 0 && data) player.addTag("specialStart");
        i++;
        player.setPlanet(destination);
        player.camera.clear();
    }

    rocket.kill()
}

function getDestination(player){
    const data = player.getDynamicProperty("planetDimension");
    let result = "solar_system";


    if (player.dimension.id == "minecraft:overworld"){
        result = "space_station"
    }

    return result;
}

function dataSetup(){
    if (dimension.getEntities({type:"hog:data"}).length < 1){
        return true
    }

    return false
}



world.afterEvents.entityHitEntity.subscribe(event=> {
    const player = event.damagingEntity;
    const hit = event.hitEntity;

    if (player.typeId == "minecraft:player"){
        if (hit.typeId == "hog:rocket"){
            if (hit.getComponent("rideable").getRiders().length < 1){
                hit.dimension.spawnItem(new ItemStack("hog:rocket"), hit.location);
                hit.triggerEvent("hog:despawn")
            }
        }
    }
})


const seatRiders = new Map();

export function seatRiding(seat){
    const ride = seat.getComponent("rideable");

    const player = seat.getComponent("minecraft:rideable").getRiders()[0]
    const view = player?.getViewDirection();

    player?.camera.setCamera("minecraft:first_person")

    if (player){
        const vel2 = {
            x: 0,
            y: player.isJumping ? view.y < 0 ? -0.01 : 0.01 : 0,
            z: 0
        }

        seat.getComponent("minecraft:rideable").addRider(player);
        seat.applyImpulse(vel2)
    }

    const r = riders.get(seat.id); // Riders from previous tick
    if (r){
        const rider = seat.dimension.getPlayers().filter(f=> f.id == r)[0];
        if (rider){
            if (player?.id != rider.id){
                ride.addRider(rider);
                seat.clearVelocity()
            }
        }
    }

    if (player){
        riders.set(seat.id,player.id);
    }

}