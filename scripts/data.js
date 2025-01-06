// Unused queue class, sets were quicker and better optimised
export class Queue{
    constructor(length){
        this.array = Array(length)
        this.start = 0;
        this.end = 0;
        this.size = 0;
        this.maxSize = length;
    }

    enqueue(item){
        if (!this.isFull()){
            this.array[this.end] = item;
            this.end = (this.end+ 1) % this.maxSize
            this.size++;
            return true
        }
        return false
    }

    dequeue(){
        if (!this.isEmpty()){
            let item = this.array[this.start];
            this.start = (this.start + 1) % this.maxSize
            this.size--;
            return item
        }else {
            return null;
        }
    }

    isEmpty(){
        if (this.size == 0){
            return true;
        }else {
            return false
        }
    }

    isFull(){
        if (this.maxSize == this.size+1){
            return true
        }
        else {
            return false
        }
    }
}



// Generation rules template
// Outdated but yk
const generationRules = {
    perlinRules: {
        surface: {
            // Define terrain parameters
            octaves: 4,        // Number of layers (more = more detail)
            persistence: 1,    // Amplitude decay (smoothness)
            lacunarity: 0,     // Frequency increase per octave
            scale: 0.025       // Overall frequency (smaller = smoother)
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
        }
    },

    blockLayers: [
        // Layers and rules of blocks
        {
            layer: 0,                   // Starting layer, follows same rules as heights
            height: 1,                  // Can be a function or a fixed value
            block: "minecraft:bedrock"  // Block that is placed during call
        },
        {
            layer: 1,
            height: function(h){ return h-5 },
            block: "minecraft:stone"
        },
        {
            layer: function(h){ return h-4 },
            height: 4,
            block: "minecraft:dirt"
        },
        {
            layer: function(h){ return h },
            height: 1,
            block: "minecraft:grass"
        }
    ],

    features: [
        // Features / feature rules
        {
            type: "structure",      // Can be a "structure", "block" or "entity" (each respectively explaining themselves)
            value: "tree",          // Id of the structure, block or entity that is formed
            chance: 0.02,           // Chance value, chance at each block calculated by seed, chance is a float from (0,1)
            yOffset: 0              // Optional y offset they will offset from, otherwise set at height of the perlin noise + 1
        },
        {
            type: "block",
            value: "minecraft:short_grass",
            chance: 0.4
        },
        {
            type: "ore",            // Using type ore, ensures it uses the ore pass of perlin noise
            value: "minecraft:iron_ore",
            chance: 0.05
        },
        {
            type: "ore",
            value: "minecraft:gold_ore",
            chance: 0.03
        },
        {
            type: "block",
            value: "minecraft:diamond_ore",
            chance: 0.01
        }
    ]
}

// Outdated rules for gravity
const gravityRules = {
    m: 0.9, // Magnitude for falling
    f: 1.3, // Translation for y intercept (affects starting velocity)
    g: 1.2, // Smoothing of the gradient
    t: 1.4 // Smoothing of the starting position / gradient
}






export function dimensionLoaded(dimension){
    try {
        dimension.getBlock({x:0,y:1,z:0})
        return true
    }catch {
        return false
    }
}