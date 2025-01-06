import { createSphere, createSphereOverlay } from "./maths";
import * as mc from "@minecraft/server";

const nether = mc.world.getDimension("nether");

export class Planet {
    constructor (id, name, colorFunctions, radius, location, colorFunctionsOverlay, overlayAddition, dimension, padding = 1){
        this.id = id;
        this.name = name;
        this.colorFunc = colorFunctions;
        this.radius = radius;
        this.location = location;
        this.points = 500;
        this.overlayPoints = 500;
        this.sizeOfPlane = (this.radius/(this.points/50))+(this.radius/(this.points/5))
        this.dimension = dimension;
        this.colorFuncOverlay = colorFunctionsOverlay;
        this.overlayRadius = radius + overlayAddition
        this.sizeOfPlaneOverlay = (this.overlayRadius/(this.overlayPoints/50))+(this.overlayRadius/(this.overlayPoints/5))
        this.padding = padding;
    }

    spawnPlanet(tickTime){
        createSphere(this.radius,{x:0,y:7,z:0},this.points,this.location,this.sizeOfPlane,tickTime,this.colorFunc);
    }

    spawnPlanetOverlay(tickTime){
        createSphereOverlay(this.overlayRadius,{x:0,y:7,z:0},this.overlayPoints,this.location,this.sizeOfPlaneOverlay,tickTime,this.colorFuncOverlay);
    }

    playerCheck(){
        for (const player of nether.getPlayers()){
            if (player.getDynamicProperty("planetDimension") != "solar_system") return
            const loc = player.location;
            const relativeLoc = {
                x: loc.x - this.location.x,
                y: loc.y - 6 - this.location.y,
                z: loc.z - this.location.z
            }

            // Debugging tools
            // Used for viewing the teleport radius around the planets
            // Not entirely accurate but gives good insight to the distance
            
            /*
            const l = {
                x: this.location.x,
                y: this.location.y + 6,
                z: this.location.z
            }

            const map = new mc.MolangVariableMap();
            map.setVector3("offset", l);
            map.setFloat("size", this.radius + this.padding);
            map.setFloat("life",20+0.01);
            the_end.spawnParticle("hog:planet_plane_opaque", {x:0,y:1,z:0}, map);
            */


            if ((relativeLoc.x**2 + relativeLoc.z**2 + relativeLoc.y**2) < (this.radius**2 + this.padding**2)){
                if (this.dimension == "overworld"){
                    nether.getEntities({type:"hog:seat",location:player.location,closest:1})[0]?.kill()
                    player.tryTeleport({x:0.5,y:300,z:0.5},{dimension:mc.world.getDimension("overworld")});
                    player.addEffect("slow_falling",200,{showParticles:false});
                    player.setPlanet("Null")
                    player.addTag("earth_after")
                }else if (this.dimension == "sun"){
                    if (player.getComponent("minecraft:health").currentValue <= 12){
                        nether.runCommand("gamerule showdeathmessages false")
                        nether.runCommand(`tellraw @a { "rawtext": [{ "text": "${player.nameTag} flew too close to the sun" }]}`)
                        player.setPlanet("Null")
                        player.kill()
                        nether.runCommand("gamerule showdeathmessages true")
                    }else {
                        player.applyDamage(12,{cause:"lava"});
                    }
                }else {
                    player.setPlanet(this.dimension.id)
                }
            }
        }
    }
}
