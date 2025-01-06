import { world } from "@minecraft/server";

export const boop = {
    onPlayerInteract(e) {
        const { block } = e;

        world.playSound("random.boop",block.location)
    }
}