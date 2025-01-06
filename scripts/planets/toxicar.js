import { PlanetDimension } from "../dimension"
import { lerpColor } from "../maths"
import { Planet } from "../planet"

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
            base: {
                octaves: 4,
                persistence: 6,
                lacunarity: -1,
                scale: 0.05
            },
            height: {
                octaves: 1,
                persistence: 4,
                lacunarity: 0.4,
                scale: 0.1
            },
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
    t: 1.4
}


const id = "toxicar"
const location = {
    x: 400000,
    y: 0,
    z: 0
}

//export const Toxicar = new PlanetDimension(id,location,generationRules,gravityRules);

const radius = 5;

const colorFunc = {
    // Smoothly interpolate between top (red), middle (green), and bottom (blue), including alpha
    getColor: function(a) {
        return [0.2,0.8,0.2,0.2]
    }
};
const colorFunc2 = {
    getColor: function(a) {
        const r = Math.random()/20+0.1
        
        const normalizedY = (a.y + radius) / (2 * radius); // Normalize y to 0–1

        if (normalizedY <= 0.5) {
            // From top to middle
            const t = normalizedY * 2; // Scale 0–0.5 to 0–1
            const c = lerpColor([0.7, 0.8, 0.7, 1], [0.6, 0.7, 0.6, 1], t); // Red to Green with alpha
            return [c[0]+r,c[1]+r,c[2]+r,1]
        } else {
            // From middle to bottom
            const t = (normalizedY - 0.5) * 2; // Scale 0.5–1 to 0–1
            const c = lerpColor([0.6, 0.7, 0.6, 1], [0.7, 0.8, 0.8, 1], t); // Green to Blue with alpha
            return [c[0]+r,c[1]+r,c[2]+r,1]
        }
    }
};



//export const ToxicarPlanet = new Planet("toxicar","Toxicar",colorFunc2,radius,{x:1363,y:352+1000,z:-488},colorFunc,0.2,Toxicar,100)