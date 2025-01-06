import { PlanetDimension } from "../dimension"
import { lerpColor } from "../maths"
import { Planet } from "../planet"
import { MolangVariableMap, system } from "@minecraft/server";

const generationRules = {
    perlinRules: {
        surface: {
            // Define terrain parameters
            octaves: 4,
            persistence: 5,
            lacunarity: 0,
            scale: 0.01
        },
        cave: {
            valid: false
        },
        mountains: {
            valid: false
        }
    },

    blockLayers: [
        // Layers and rules of blocks
        // Bedrock uneeded as is final pass anyways
        {
            layer: 1,
            height: function(h){ return Math.floor(h/3)+1 },
            block: "minecraft:blue_ice"
        },
        {
            layer: function(h){ return Math.floor(h/3)+2 },
            height: function(h){ return h - Math.floor(h/3)*2 },
            block: "minecraft:packed_ice"
        },
        {
            layer: function(h){ return h - Math.floor(h/3)*2 + 1 },
            height: function(h){ return h },
            block: "minecraft:ice"
        },
    ],

    features: [
    ]
}

const gravityRules = {
    m: 1,
    f: 1,
    g: 1,
    t: 1,
    event: "hog:krystallos"
}


const id = "krystallos"
const location = {
    x: -100000,
    y: 0,
    z: 0
}

const leaveLocation = {
    x: 66.5,
    y: 1364,
    z: -33.5
}

const molang = new MolangVariableMap()
const color = {
    red: 0.47,
    green: 0.79,
    blue: 0.851,
    alpha: 0.01
}
molang.setFloat("distance", 20);
molang.setFloat("particle_count", 100);
molang.setColorRGBA("col", color);

function fog(player){
    if (player.location.y > 190){
        if (system.currentTick % 2 === 0){
            player.dimension.spawnParticle("hog:fog_surface",player.location,molang)
            player.dimension.spawnParticle("hog:snow_emitter",player.location)
        }
        if (Math.random() < 0.1){
            player.applyKnockback(-0.25,1,0.2,0)
        }
    }
    
    player.runCommand(`fog @s remove planet`)
    player.runCommand(`fog @s push hog:fog_krystallos planet`)
    player.runCommand(`fog @s push hog:fog_krystallos_darken planet`)
}

export const Krystallos = new PlanetDimension(id,location,generationRules,gravityRules,leaveLocation,fog);

const radius = 8;

const colorFunc = {
    // Smoothly interpolate between top (red), middle (green), and bottom (blue), including alpha
    getColor: function(a) {
        //return [0.9 + Math.random()/10,0.9 + Math.random()/10,0.9 + Math.random()/10,0.2]
        return [0.9,0.9,0.9,0.2]
    }
};
const colorFunc2 = {
    // Smoothly interpolate between top (red), middle (green), and bottom (blue), including alpha
    getColor: function(a) {
        const normalizedY = (a.y + radius) / (2 * radius); // Normalize y to 0–1
        const normalizedX = (a.x + radius) / (2 * radius); // Normalize y to 0–1
        const normalizedZ = (a.z + radius) / (2 * radius); // Normalize y to 0–1
        let c;

        if (normalizedY <= 0.5) {
            // From top to middle
            const t = normalizedY * 2; // Scale 0–0.5 to 0–1
            c = lerpColor([0.1, 0.4, 0.5, 1], [0.1, 0.2, 0.5, 1], t); // Red to Green with alpha
        } else {
            // From middle to bottom
            const t = (normalizedY - 0.5) * 2; // Scale 0.5–1 to 0–1
            c = lerpColor([0.1, 0.2, 0.5, 1], [0.1, 0.2, 0.3, 1], t); // Green to Blue with alpha
        }

        
        const tZ = Math.min(1, Math.max(0, (normalizedZ - 0.3) / 0.7));
        const tX = Math.min(1, Math.max(0, (normalizedX - 0.3) / 0.7));
        const tY = Math.min(1, Math.max(0, (0.3 - (normalizedY - 0.2)) / 0.3));
        const t = (tX + tY + tZ) / 3
        c = lerpColor(c,[1,1,1,1],t)

        return c
    }
};



// Old krystallos location before swapping with toxicar
// {x:1414,y:352+1000,z:-408}

export const KrystallosPlanet = new Planet("krystallos","Krystallos",colorFunc2,radius,{x:83,y:352+1000,z:-35},colorFunc,0.2,Krystallos,4)