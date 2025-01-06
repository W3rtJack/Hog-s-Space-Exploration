import { PlanetDimension } from "../dimension"
import { lerpColor } from "../maths"
import { Planet } from "../planet"
import { MolangVariableMap } from "@minecraft/server";

const generationRules = {
    perlinRules: {
        surface: {
            // Define terrain parameters
            octaves: 4,
            persistence: 1,
            lacunarity: 0,
            scale: 0.025
        },
        cave: {
            base: [
                {
                    octaves: 4,
                    persistence: 6,
                    lacunarity: -1,
                    scale: 0.05
                },
                {
                    octaves: 3,
                    persistence: 0.1,
                    lacunarity: 2,
                    scale: 0.02
                }
            ],
            height: [
                {
                    octaves: 1,
                    persistence: 4,
                    lacunarity: 0.4,
                    scale: 0.1
                },
                {
                    octaves: 3,
                    persistence: 0.1,
                    lacunarity: 2,
                    scale: 0.02
                }
            ],
            ores: {
                octaves: 3,
                persistence: 2,
                lacunarity: 2,
                scale: 0.2
            }
        },
        mountains: {
            valid: true,
            chance: 0.5,
            heightMultiplier: 5
        }
    },

    blockLayers: [
        // Layers and rules of blocks
        // Bedrock uneeded as is final pass anyways
        {
            layer: 1,
            height: function(h){ return h-4 },
            block: "hog:martian_stone"
        },
        {
            layer: function(h){ return h-3 },
            height: 3,
            block: "hog:martian_sand"
        }
    ],

    features: [
        // Features / feature rules,
        {
            type: "ore",
            value: "hog:martian_iron_ore",
            chance: 0.1
        },
        {
            type: "ore",
            value: "hog:martian_gold_ore",
            chance: 0.05
        }
    ]
}

const gravityRules = {
    m: 0.4,
    f: 0.8,
    g: 1.5,
    t: 1.4,
    event: "hog:rudra"
}

const id = "rudra"
const location = {
    x: 100000,
    y: 0,
    z: 0
}

const leaveLocation = {
    x: -45,
    y: 1351.5,
    z: -42.5
}


const molang = new MolangVariableMap()
const color = {
    red: 0.42745098039,
    green: 0.03137254901,
    blue: 0.04705882352,
    alpha: 0.01
}
molang.setFloat("distance", 12.5);
molang.setFloat("particle_count", 50);
molang.setColorRGBA("col", color);

function fog(player){
    player.dimension.spawnParticle("hog:fog",player.location,molang)
    player.dimension.spawnParticle("hog:red_dust",player.location)
    player.runCommand(`fog @s remove planet`)
    player.runCommand(`fog @s push hog:fog_mars planet`)
    player.runCommand(`fog @s push hog:fog_mars_darken planet`)
}


export const Rudra = new PlanetDimension(id,location,generationRules,gravityRules,leaveLocation,fog);

const radius = 6.25;


const colorFunc = {
    // Smoothly interpolate between top (red), middle (green), and bottom (blue), including alpha
    getColor: function(a) {
        return [1,1,1,0.2]
    }
};

const colorFunc2 = {
    // Smoothly interpolate between top (red), middle (green), and bottom (blue), including alpha
    getColor: function(a) {
        const normalizedY = (a.y + radius) / (2 * radius); // Normalize y to 0–1

        if (normalizedY <= 0.5) {
            // From top to middle
            const t = normalizedY * 2; // Scale 0–0.5 to 0–1
            return lerpColor([0.4, 0.2, 0, 1], [1, 0.4, 0, 1], t); // Red to Green with alpha
        } else {
            // From middle to bottom
            const t = (normalizedY - 0.5) * 2; // Scale 0.5–1 to 0–1
            return lerpColor([1, 0.4, 0, 1], [0.4, 0.2, 0, 1], t); // Green to Blue with alpha
        }
    }
};

export const RudraPlanet = new Planet("rudra","Rudra",colorFunc2,radius,{x:-40,y:1341,z:-58},colorFunc,0.5,Rudra,6)