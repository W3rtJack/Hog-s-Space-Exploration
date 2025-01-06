function hasFullSuit(player){
    const equipment = player.getComponent("equippable");

    const helmet = equipment.getEquipment("Head");
    const chest = equipment.getEquipment("Chest");
    const legs = equipment.getEquipment("Legs");
    const feet = equipment.getEquipment("Feet");

    if (helmet?.typeId == "hog:space_helmet"){
        player.runCommand("title @s title helmet")
    }else {
        player.runCommand("title @s title ")
    }

    if (
        helmet?.typeId == "hog:space_helmet" &&
        chest?.typeId == "hog:space_chestplate" &&
        legs?.typeId == "hog:space_leggings" &&
        feet?.typeId == "hog:space_boots"
    ){
        return true
    }
    return false
}


export function oxygenUpdate(player,tick){
    const safe = hasFullSuit(player);
    const planetHasOxygen = planetOxygen(player);

    if (!planetHasOxygen){
        const oxygenLevel = player.getDynamicProperty("oxygen.value") != undefined ? player.getDynamicProperty("oxygen.value") : 100;

        player.runCommand(`title @s actionbar ${oxygenLevel}%`)
        const oxygenTickSpeed = safe ? 100 : 2
        
        if (tick % oxygenTickSpeed === 0){
            if (oxygenLevel == 21){
                player.sendMessage("§6Oxygen levels have reached 20\%")
            }else 
            if (oxygenLevel == 11){
                player.sendMessage("§cOxygen levels have reached 10\%")
            }else 
            if (oxygenLevel == 6){
                player.sendMessage("§4Oxygen levels are critically low")
            }else 
            if (oxygenLevel == 1){
                player.sendMessage("§l§4Oxygen levels have depleted")
            }


            if (oxygenLevel >= 1){
                player.addDynamicProperty("oxygen.value",-1)
            }else {
                if (player.getComponent("health").currentValue <= 2){
                    player.runCommand(`gamerule showdeathmessages false`)
                    player.setPlanet("Null")
                    player.runCommand(`tellraw @a {"rawtext":[{ "text": "${player.nameTag} didn't get back to their ship in time" }]}`);
                    player.kill()
                    player.runCommand(`gamerule showdeathmessages true`)
                }else {
                    player.applyDamage(2)
                }
            }
        }
        
    }else {
        player.setDynamicProperty("oxygen.value",100)
    }
}

const safePlanets = ["Null","space_station","solar_system",undefined];

function planetOxygen(player){
    if (player.dimension.id == "minecraft:the_end" && !safePlanets.includes(player.getDynamicProperty("planetDimension"))){
        return false
    }
    return true
}