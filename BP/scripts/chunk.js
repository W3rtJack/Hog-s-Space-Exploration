import * as mc from "@minecraft/server";
import { Queue } from "./data";
import { dimension } from "./main";


const generatedChunks = new Map();

// Creates a map for the chunks
const emptyChunks = new Set();

const maxChunkLoadRange = 7;

// Seed (will be randomised based on values later)
export const seed = 150



export const yfactor = 100
export const minYFactor = 125

// Define terrain parameters
const octaves = 4;         // Number of layers (more = more detail)
const persistence = 1;   // Amplitude decay (smoothness)
const lacunarity = 0;    // Frequency increase per octave
const scale = 0.025;        // Overall frequency (smaller = smoother)

// Unused. was first attempt at chunk loading. Not bad, just poorly optimised. lots of backtracking
// Only really kept this to see how much my code has improved over the span of like 2 days lol
export function getNearestUnloadedChunk(player,chunkSize){
    const chunkLoadQueue = new Queue(maxChunkLoadRange**2)
    const chunkChecked = new Map()

    // Can use these names as they are in the inner scope
    const loc = player.getChunk(chunkSize);

    chunkLoadQueue.enqueue({
        x: loc.x,
        z: loc.z
    })

    var chunkFound = false;
    while (chunkFound == false){
        // Setting checking coordinates
        const dequeue = chunkLoadQueue.dequeue()
        var x = dequeue.x;
        var z = dequeue.z;
        if ( Math.sqrt( ( x - loc.x )** 2 + ( z - loc.z )** 2 ) >= maxChunkLoadRange ){
            chunkFound = true;
            return false;
        }
        else if (!generatedChunks.has(`${x},${z}`)){
            chunkFound = true;
            return { x: x, z: z}
        }else {
            chunkChecked.set(`${x},${z}`,true);
            
            // Checking right of chunk
            if (!chunkChecked.has(`${x+1},${z}`) && dequeue.direction != "west"){
                chunkLoadQueue.enqueue({
                    x: x + 1,
                    z: z,
                    direction: "east"
                })
            } 


            // Checking down of chunk
            if (!chunkChecked.has(`${x},${z-1}`) && dequeue.direction != "north"){
                chunkLoadQueue.enqueue({
                    x: x,
                    z: z - 1,
                    direction: "south"
                })
            }

            // Checking left of chunk
            if (!chunkChecked.has(`${x-1},${z}`) && dequeue.direction != "east"){
                chunkLoadQueue.enqueue({
                    x: x - 1,
                    z: z,
                    direction: "west"
                })
            } 

            // Checking up of chunk
            if (!chunkChecked.has(`${x},${z+1}`) && dequeue.direction != "south"){
                chunkLoadQueue.enqueue({
                    x: x,
                    z: z + 1,
                    direction: "north"
                })
            } 
        }
    }


    return false
}



export function getNearestUnloadedChunkOptimised(player, chunkSize, pitch, yaw) {
    // Getting the player's relative chunk location
    const loc = player.getChunk(chunkSize);

    // Check if chunk update is unnecessary
    if ((!player.prevChunkUpdate && !player.getChunkChanged(chunkSize)) || emptyChunks.has(`${loc.x},${loc.z}`)) {
        emptyChunks.add(`${loc.x},${loc.z}`);
        return false;
    }

    const visited = new Set([`0,0`]); // Initialize with the current chunk
    const queue = [{ x: 0, z: 0 }]; // BFS queue
    const directions = prioritizeDirections(pitch, yaw); // Precompute directions
    const maxDistSquared = maxChunkLoadRange ** 2; // Avoid recalculating max distance

    const dimensionDatas = mc.world.getDimension("the_end").getEntities({type:"hog:data"});
    if (dimensionDatas.length < 1){
        try {
            const entity = dimension.spawnEntity("hog:data",{x:0,y:100,z:0})
            entity.setDynamicProperty(`499,101,514`,true)
        }catch {}
        return true
    }

    const dimensionData = dimensionDatas[0]

    while (queue.length > 0) {
        const current = queue.shift();
        const globalX = current.x + loc.x;
        const globalZ = current.z + loc.z;

        // Check if this chunk is unloaded
        if (!dimensionData.getDynamicProperty(`${globalX},${globalZ}`)) {
            return { x: globalX, z: globalZ };
        }

        // Add neighboring chunks to the queue
        for (const dir of directions) {
            const neighborX = current.x + dir.x;
            const neighborZ = current.z + dir.z;

            const distSquared = neighborX ** 2 + neighborZ ** 2;
            if (distSquared >= maxDistSquared) continue; // Skip if out of range

            const neighborKey = `${neighborX},${neighborZ}`;
            if (!visited.has(neighborKey)) {
                visited.add(neighborKey);
                queue.push({ x: neighborX, z: neighborZ });
            }
        }
    }

    // No unloaded chunks found within range
    return false;
}

// Prioritize directions based on pitch and yaw
function prioritizeDirections(pitch, yaw) {
    const yawRadians = (yaw % 360) * (Math.PI / 180);

    // Define directions with angles
    const baseDirections = [
        { x: 0, z: 1, angle: Math.PI / 2 },   // Up
        { x: 1, z: 0, angle: 0 },            // Right
        { x: 0, z: -1, angle: (3 * Math.PI) / 2 }, // Down
        { x: -1, z: 0, angle: Math.PI }      // Left
    ];

    // Calculate priorities directly during sort
    return baseDirections.sort((a, b) => {
        const priorityA = getAngleDifference(yawRadians, a.angle);
        const priorityB = getAngleDifference(yawRadians, b.angle);
        return priorityA - priorityB;
    });
}

// Calculate the smallest angular difference
function getAngleDifference(a, b) {
    const diff = Math.abs(a - b);
    return diff > Math.PI ? 2 * Math.PI - diff : diff;
}



export function psuedoRNG() {
    let modulus = 2 ** 31 - 1;
    let multiplier = 48271;
    let state = seed || Math.floor(Math.random() * modulus);

    return function(x, z) {
        let increment = (x * z) % modulus; // Calculate an additional offset based on x and z
        state = (state * multiplier + increment) % modulus; // LCG formula with added increment
        return state / modulus; // Normalize to range [0, 1)
    };
}