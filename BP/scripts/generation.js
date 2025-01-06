// God damn i hate this
// Had it all working for one iteration
// Was unaware of the octave step
// Used it in a past attempt before
// But never got the interpolation step working
// Istg tho like
// Ugh
// It works tho!!!!
// Very slow and unoptimised but yk. Work with what we got
// Unoptimised is my middle name

export class PerlinNoise {
    constructor(seed = 1, mountains = false, mountainChance = 0.5, mountainMultiplier = 10) {
        this.seed = seed;
        this.memory = new Map();
        this.gradients = new Map();

        this.mountains = mountains;
        this.mountainChance = mountainChance;
        this.mountainMultiplier = mountainMultiplier;
    }

    random(seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    randomUnitVector(x, z) {
        const seed = x * 374761393 + z * 668265263 + this.seed * 1274126177;
        
        const theta = this.random(seed) * 2 * Math.PI;
        if (this.mountains && theta < this.mountainChance){
            return { x: Math.abs(Math.sin(theta)) * this.mountainMultiplier, z: Math.abs(Math.cos(theta)) * this.mountainMultiplier };
        }
        return { x: Math.sin(theta), z: Math.cos(theta) };
    }

    get(positionX, positionZ) {
        const x = Math.floor(positionX);
        const z = Math.floor(positionZ);

        const u = positionX - x;
        const v = positionZ - z;

        const tl = this.dotProduct(x, z, x, z, u, v);
        const tr = this.dotProduct(x, z, x + 1, z, u, v);
        const bl = this.dotProduct(x, z, x, z + 1, u, v);
        const br = this.dotProduct(x, z, x + 1, z + 1, u, v);

        const x1 = this.interpolate(tl, tr, u);
        const x2 = this.interpolate(bl, br, u);
        return this.interpolate(x1, x2, v);
    }

    dotProduct(x, z, x2, z2, u, v) {
        const vector = this.getVector(x2, z2);
        const dist = { x: (x + u) - x2, z: (z + v) - z2 };

        return vector.x * dist.x + vector.z * dist.z;
    }

    smoothStep(x) {
        return 6 * x ** 5 - 15 * x ** 4 + 10 * x ** 3;
    }

    interpolate(a, b, t) {
        return a + (b - a) * this.smoothStep(t);
    }

    getVector(x, z) {
        const key = `${x},${z}`;
        if (this.gradients.has(key)) {
            return this.gradients.get(key);
        } else {
            const rand = this.randomUnitVector(x, z);
            this.gradients.set(key, rand);
            return rand;
        }
    }


    getOctaveNoise(x, z, octaves = 4, persistence = 0.5, lacunarity = 2.0, scale = 0.1) {
        let total = 0;
        let frequency = 1;
        let amplitude = 1;
        let maxValue = 0;

        for (let i = 0; i < octaves; i++) {
            total += this.get(x * frequency * scale, z * frequency * scale) * amplitude;
            maxValue += amplitude;

            amplitude *= persistence;
            frequency *= lacunarity;
        }

        // Normalize to [0, 1] or [-1, 1]
        return ( ( total / maxValue ) + 1 ) / 2;
    }
}