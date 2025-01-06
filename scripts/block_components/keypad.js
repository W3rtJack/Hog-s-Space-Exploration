import { world } from "@minecraft/server";

export const keypad = {
    onPlayerInteract(e) {
        const { block, player, face } = e;

        world.playSound("random.click",block.location)
        if (block.location.x == 499 && block.location.y == 101 && block.location.z == 484 && block.dimension.id == "minecraft:the_end"){
            const rockets  = block.dimension.getEntities({type:"hog:rocket",location:{x:487.5,y:101,z:488.5},distance:4})
            if (rockets.length < 1){
                const entity = block.dimension.spawnEntity("hog:rocket",{x:487.5,y:101,z:488.5})
                entity.getComponent("rideable").addRider(player);
            }else {
                rockets[0].getComponent("rideable").addRider(player);
            }
        }
    }
}