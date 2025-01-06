import { world } from "@minecraft/server";
import { dimension } from "./main";

// Ship Protection (for safe purposes)
world.beforeEvents.playerBreakBlock.subscribe(event=> {
    const player = event.player;
    const loc = event.block.location;

    if (player.getDynamicProperty("planetDimension") == "space_station"){
        const dimensionData = dimension.getEntities({type:"hog:data"})[0];
        if (dimensionData.getDynamicProperty(`${loc.x},${loc.y},${loc.z}`) != true){
            player.sendMessage(`§cYou can't break the space station!`)
            event.cancel = true;
        }else {
            dimensionData.setDynamicProperty(`${loc.x},${loc.y},${loc.z}`,undefined)
        }
    }
})

world.afterEvents.playerPlaceBlock.subscribe(event=> {
    const player = event.player;
    const loc = event.block.location;

    if (player.getDynamicProperty("planetDimension") == "space_station"){
        const dimensionData = dimension.getEntities({type:"hog:data"})[0];
        dimensionData.setDynamicProperty(`${loc.x},${loc.y},${loc.z}`,true)

    }
})