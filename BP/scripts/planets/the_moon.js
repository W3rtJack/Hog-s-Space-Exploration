import { PlanetDimension } from "../dimension"
import { lerpColor } from "../maths"
import { Planet } from "../planet"

const generationRules = {
    perlinRules: {
        surface: {
            // Define terrain parameters
            octaves: 5,
            persistence: 1,
            lacunarity: 0,
            scale: 0.025
        },
        cave: {
            base: [
                {
                    octaves: 1,
                    persistence: 10,
                    lacunarity: -5,
                    scale: 0.05
                }
            ],
            height: [
                {
                    octaves: 1,
                    persistence: 2,
                    lacunarity: 0.1,
                    scale: 0.1
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
            heightMultiplier: -4
        }
    },

    blockLayers: [
        // Layers and rules of blocks
        // Bedrock uneeded as is final pass anyways
        {
            layer: 1,
            height: function(h){ return h-4 },
            block: "minecraft:stone"
        },
        {
            layer: function(h){ return h-3 },
            height: 3,
            block: "minecraft:andesite"
        }
    ],

    features: [
        // Features / feature rules,
        {
            type: "ore",
            value: "minecraft:coal_ore",
            chance: 3
        },
        {
            type: "ore",
            value: "minecraft:copper_ore",
            chance: 0.25
        },
        {
            type: "structure",
            value: "moon_ruins",
            chance: 0.0001,
            yOffset: 0
        }
    ]
}

const gravityRules = {
    m: 0.9,
    f: 1.3,
    g: 1.2,
    t: 1.4,
    event: "hog:moon"
}

const id = "the_moon"
const location = {
    x: -50000,
    y: 0,
    z: 0
}

const leaveLocation = {
    x: -95,
    y: 1369.5,
    z: 13.5
}

function fog(player){
    player.runCommand(`fog @s push hog:fog_mars_darken planet`)
}

export const The_Moon = new PlanetDimension(id,location,generationRules,gravityRules,leaveLocation,fog);

const radius = 0.5;

const colorFunc = {
    getColor: function(a) {
        return [0.1,0.1,0.1,0.2]
    }
};
const colorFunc2 = {
    getColor: function(a) {
        const normalizedY = (a.y + radius) / (2 * radius);

        if (normalizedY <= 0.5) {
            // From top to middle
            const t = normalizedY * 2;
            const c = lerpColor([0.4, 0.4, 0.4, 1], [0.4, 0.4, 0.3, 1], t);
            if (Math.random() < 0.1) return [c[0]-0.05,c[1]-0.05,c[2]-0.05,1]
            else return c
        } else {
            // From middle to bottom
            const t = (normalizedY - 0.5) * 2;
            const c = lerpColor([0.4, 0.4, 0.3, 1], [0.5, 0.5, 0.6, 1], t);
            if (Math.random() < 0.1) return [c[0]-0.05,c[1]-0.05,c[2]-0.05,1]
            else return c
        }
    }
};


export const TheMoonPlanet = new Planet("the_moon","Moon",colorFunc2,radius,{x:-95.5,y:1359.5,z:-18.2},colorFunc,0.05,The_Moon,2)