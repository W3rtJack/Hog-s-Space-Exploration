import { nether } from "../main";
import { Planet } from "../planet";
import * as mc from "@minecraft/server";

const loc = {x:-102,y:1364,z:-45};

class SpaceStation extends Planet {
    constructor (id, name, colorFunctions, radius, location, colorFunctionsOverlay, overlayAddition, dimension, padding = 1){
        super(id, name, colorFunctions, radius, location, colorFunctionsOverlay, overlayAddition, dimension, padding)
    }

    
    spawnPlanet(tickTime){
        return null;
    }

    spawnPlanetOverlay(tickTime){
        return null;
    }

    playerCheck(){
        for (const player of nether.getPlayers()){
            if (player.getDynamicProperty("planetDimension") != "solar_system") return
            const loc = player.location;
            const relativeLoc = {
                x: loc.x - this.location.x,
                y: loc.y - this.location.y,
                z: loc.z - this.location.z
            }

            if ((relativeLoc.x**2 + relativeLoc.z**2 + relativeLoc.y**2) < (this.radius**2 + this.padding**2)){
                player.setPlanet("space_station")
            }
        }
    }
}

export const SpaceStationPlanet = new SpaceStation("earth","Earth",5,null,loc,null,0.1,"space_station",3.5)