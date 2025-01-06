import { PlanetDimension } from "../dimension"
import { lerpColor } from "../maths"
import { Planet } from "../planet"

const generationRules = {
    perlinRules: {
        surface: {
            // Define terrain parameters
            octaves: 3,
            persistence: 1,
            lacunarity: 0,
            scale: 0.05
        },
        cave: {
            base: [
                {
                    octaves: 4,
                    persistence: 6,
                    lacunarity: -1,
                    scale: 0.025
                }
            ],
            height: [
                {
                    octaves: 1,
                    persistence: 4,
                    lacunarity: 0.4,
                    scale: 0.02
                },
                {
                    octaves: 1,
                    persistence: 4,
                    lacunarity: 0.4,
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
            heightMultiplier: 10
        }
    },

    blockLayers: [
        // Layers and rules of blocks
        // Bedrock uneeded as is final pass anyways
        {
            layer: 1,
            height: function(h){ return h-4 },
            block: "hog:asteroid_stone"
        },
        {
            layer: function(h){ return h-3 },
            height: 3,
            block: "hog:asteroid_sand"
        }
    ],

    features: [
        // Features / feature rules,
        {
            type: "ore",
            value: "hog:asteroid_gold_ore",
            chance: 0.1
        },
        {
            type: "ore",
            value: "hog:asteroid_iron_ore",
            chance: 0.1
        }
    ]
}

const gravityRules = {
    m: 0.9,
    f: 1.3,
    g: 1.2,
    t: 1.4,
    event: "hog:vermiscar"
}


const id = "vermiscar"
const location = {
    x: 50000,
    y: 0,
    z: 0
}

const leaveLocation = {
    x: -10,
    y: 1414,
    z: 39
}

function fog(player){
    player.runCommand(`fog @s push hog:fog_mars_darken planet`)
    if (player.location.y < 156){
        player.runCommand(`fog @s remove planet`)
        player.runCommand(`fog @s push hog:fog_underground underground`)
    }else {
        player.runCommand(`fog @s remove underground`)
    }
}


export const Vermiscar = new PlanetDimension(id,location,generationRules,gravityRules,leaveLocation,fog);

const radius = 6.25;


const colorFunc = {
    // Smoothly interpolate between top (red), middle (green), and bottom (blue), including alpha
    getColor: function(a) {
        return [0.7,0.7,0.7,0.2]
    }
};
const colorFunc2 = {
    getColor: function(a) {
        const r = Math.random()/10+0.1
        
        const normalizedY = (a.y + radius) / (2 * radius); // Normalize y to 0–1

        if (normalizedY <= 0.5) {
            // From top to middle
            const t = normalizedY * 2; // Scale 0–0.5 to 0–1
            const c = lerpColor([0.1, 0.1, 0.1, 1], [0.3, 0.3, 0.3, 1], t); // Red to Green with alpha
            return [c[0]+r,c[1]+r,c[2]+r,1]
        } else {
            // From middle to bottom
            const t = (normalizedY - 0.5) * 2; // Scale 0.5–1 to 0–1
            const c = lerpColor([0.3, 0.3, 0.3, 1], [0.1, 0.1, 0.1, 1], t); // Green to Blue with alpha
            return [c[0]+r,c[1]+r,c[2]+r,1]
        }
    }
};

export const VermiscarPlanet = new Planet("vermiscar","Vermiscar",colorFunc2,radius,{x:-18,y:1413,z:50},colorFunc,0.2,Vermiscar,5)