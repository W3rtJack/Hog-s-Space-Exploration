import { world, BlockVolume } from "@minecraft/server";
import { minYFactor, psuedoRNG, seed, yfactor } from "./chunk";
import { PerlinNoise } from "./generation";
import { clamp } from "./maths";

const dimension = world.getDimension("the_end")
// This file is used to replicate dimensions
// Each planet surface acting as a new dimension. and having terrain gen
// There will be no limit to the generation, however this will and could cause issues with mixing of planets
// For instance travelling 50,000 blocks in opposite directions toward each other on different "dimensions" will overlap
// This distance is large enough I wont worry about it. just a thought in mind

// Planet Dimension class wont directly take from dimension but will copy all features just in case
// Deciding to copy the subroutines now too cuz why not


export class PlanetDimension {
    constructor (id,location,generationRules,gravityRules,leaveLocation={x:0,y:1500,z:0},ambience=function(player){return},weatherTypes=["None"]){
        this.id = id; // Unique Identifier
        this.location = location; // Where the center of the "dimension" will start
        this.heightRange = dimension.heightRange; // Just to replicate the dimension format
        this.leaveLocation = leaveLocation;
        this.ambience = ambience

        this.weatherTypes = weatherTypes; // Weather types, array of weather types, enum
        this.weather = { // The weather applied on the planet
            weather: "None",
            duration: 0
        }

        this.perlin = new PerlinNoise(seed,generationRules.perlinRules.mountains.valid,generationRules.perlinRules.mountains.chance,generationRules.perlinRules.mountains.heightMultiplier)

        this.rules = generationRules;

        this.gravity = gravityRules; // Gravity strength (multiplier)
        this.rng = psuedoRNG(seed);
    }


    // Planet dimension specific subroutines

    // Uses relative position to return actual position
    getActualPosition(location){
        return {
            x: location.x + this.location.x,
            y: location.y + this.location.y,
            z: location.z + this.location.z
        }
    }


    // Uses actual position to create a relative position inside dimension
    getRelativePosition(location){
        return {
            x: location.x - this.location.x,
            y: location.y - this.location.y,
            z: location.z - this.location.z
        }
    }

    applyGravity(entity){
        //entity.runCommand(`say ${entity.getVelocity().y}`)

        if (entity.airTime > 0){
            let magnitude = 0
            if ((entity.airTime < 2 && !entity.isJumping && entity.airTime > 0) || entity.jumpFall){ // Used inequalities in case i wanted a timeframe
                magnitude = this.gravity.m
                entity.jumpFall = true;
            }

            /*
            if (entity.jumpfall != true){
                const loc = entity.location; loc.y++;
                entity.runCommand(`say ${loc.y}`)
                if (entity.dimension.getBlock(loc)?.typeId != "minecraft:air" && entity.dimension.getBlock(loc)?.typeId != undefined){
                    magnitude = this.gravity.m
                    entity.jumpFall = true;
                    entity.airTime = 
                }
            }*/

            const vel = {
                x: entity.getVelocity().x >= 0.1 ? entity.getVelocity().x : entity.getVelocity().x <= -0.1 ? entity.getVelocity().x : 0,
                y: ((-Math.log10(entity.airTime+1+this.gravity.t))/this.gravity.g) + (this.gravity.f - magnitude),
                z: entity.getVelocity().z >= 0.1 ? entity.getVelocity().z : entity.getVelocity().z <= -0.1 ? entity.getVelocity().z : 0
            }
            entity.applyKnockback(vel.x,vel.z,0.2,vel.y)
        }

    }


    update(dt=1){
        if (this.weather.duration > 0) this.weather.duration -= dt;

        for (const entity of this.getEntities()){
            entity.airUpdate();
            this.applyGravity(entity);
        }

        for (const player of this.getPlayers()){
            try {
                this.ambience(player);
            }catch {}
        }
    }

    loadChunk(relativeChunkLocation, chunkSize) {
        if (!relativeChunkLocation) return false;
    
        const baseX = Math.floor(relativeChunkLocation.x) * chunkSize;
        const baseZ = Math.floor(relativeChunkLocation.z) * chunkSize;

        try {
            for (let x = 0; x < chunkSize; x++) {
                for (let z = 0; z < chunkSize; z++) {
                    const loc = { x: baseX + x, y: 0, z: baseZ + z };
                    this.generateColumn(loc);
                }
            }
        
            const key = `${relativeChunkLocation.x},${relativeChunkLocation.z}`;
            this.dimensionData = dimension.getEntities({type:"hog:data"})[0];
            this.dimensionData.setDynamicProperty(key, true);
        }catch {}
    }
    
    generateColumn(location) {
        const { x, z } = location;
        const { surface, cave } = this.rules.perlinRules;
    
        const height = this.perlin.getOctaveNoise(
            x, z,
            surface.octaves,
            surface.persistence,
            surface.lacunarity,
            surface.scale
        ) * yfactor;
    
        this.generateLayers(location, height);
        let caveValues = [1000,0];
        if (cave.valid != false){
            caveValues = this.generateCave(location, height);
        }
        this.generateFeatures(location, height, caveValues);
        this.generateBedrockLayer(location);
    }
    
    generateLayers(location, height) {
        const { blockLayers } = this.rules;
    
        for (const layer of blockLayers) {
            const l = typeof layer.layer === "number" ? layer.layer : layer.layer(height);
            const h = typeof layer.height === "number" ? layer.height : layer.height(height);
    
            if (l < 0 || h < 0) continue;
    
            const volume = new BlockVolume(
                { x: location.x, y: clamp(minYFactor + l, minYFactor, 255), z: location.z },
                { x: location.x, y: clamp(minYFactor + l + h, minYFactor, 255), z: location.z }
            );
    
            dimension.fillBlocks(volume, layer.block);
        }
    }
    
    generateCave( location ) {
        const { cave } = this.rules.perlinRules;

        var baseHeight = 1;
    
        for (const c of cave.base){
            baseHeight = baseHeight * this.perlin.getOctaveNoise(
                location.x, location.z,
                c.octaves,
                c.persistence,
                c.lacunarity,
                c.scale
            )
        }

        baseHeight = baseHeight * (yfactor * 0.5) - 10;

        var range = 1;
    
        for (const c of cave.height){
            range = range * this.perlin.getOctaveNoise(
                location.x, location.z,
                c.octaves,
                c.persistence,
                c.lacunarity,
                c.scale
            )
        }

        range = range * (yfactor * 0.3);


        if (baseHeight > 1 && baseHeight + range > 0) {
            const volume = new BlockVolume(
                { x: location.x, y: clamp(minYFactor + baseHeight + 3, minYFactor+1, 255), z: location.z },
                { x: location.x, y: clamp(minYFactor + baseHeight + range, minYFactor+1, 255), z: location.z }
            );
    
            dimension.fillBlocks(volume, "minecraft:air");
        }

        return [baseHeight,baseHeight+range];
    }
    
    generateFeatures(location, height, caveValues) {
        const { features, perlinRules } = this.rules;
    
        for (const feature of features) {
            if (this.rng(location.x, location.z) >= feature.chance) continue;
    
            const yOffset = feature.yOffset ? feature.yOffset : 0;
            const yPosition = minYFactor + height + yOffset;
    
            switch (feature.type) {
                case "structure":
                    this.runCommand(`structure load ${feature.value} ${location.x} ${yPosition} ${location.z}`);
                    break;
    
                case "block":
                    this.setBlockType({ x: location.x, y: yPosition, z: location.z }, feature.value);
                    break;
    
                case "ore":
    
                    const oreHeight = this.perlin.getOctaveNoise(
                        location.x, location.z,
                        perlinRules.cave.ores.octaves,
                        perlinRules.cave.ores.persistence,
                        perlinRules.cave.ores.lacunarity,
                        perlinRules.cave.ores.scale
                    ) * (yfactor * 0.5);
    
                    if (oreHeight > 0 && oreHeight < height - 4 && (oreHeight < caveValues[0] || oreHeight > caveValues[1])) {
                        dimension.setBlockType({ x: location.x, y: minYFactor + oreHeight, z: location.z }, feature.value);
                    }
                    break;
            }
        }
    }
    
    generateBedrockLayer(location) {
        dimension.setBlockType(
            { x: location.x, y: minYFactor, z: location.z },
            "minecraft:bedrock"
        );
    }
    



    // Regular dimension functions - transferred

    // These functions are just slightly different to normal dimension
    // Except they always run through the dimension / the end
    
    containsBlock(volume, filter, allowUnloadedChunks=false){
        return dimension.containsBlock(volume, filter, allowUnloadedChunks);
    }

    createExplosion(location, radius, number, explosionOptions=null){
        return dimension.createExplosion(location,radius,number,explosionOptions);
    }


    fillBlocks(volume, compoundBlockVolume, block, options=null){
        return dimension.fillBlocks(volume,compoundBlockVolume,block,options);
    }

    getBlock( location ){
        return dimension.getBlock(location);
    }

    getBlockFromRay(location, direction, options=null){
        return dimension.getBlockFromRay(location, direction, options);
    }

    getBlocks(volume, filter, allowUnloadedChunks=false){
        return dimension.getBlocks(volume, filter, allowUnloadedChunks)
    }

    getEntities(options=null){
        const entities = dimension.getEntities(options).filter(entity=> entity.getDynamicProperty("planetDimension") == this.id);
        return entities;
    }

    getEntitiesAtBlockLocation(location){
        const entities = dimension.getEntitiesAtBlockLocation(location).filter(entity=> entity.getDynamicProperty("planetDimension") == this.id);
        return entities;
    }

    getEntitiesFromRay(location, direction, options=null){
        const entities = dimension.getEntitiesFromRay(location, direction, options).filter(entity=> entity.getDynamicProperty("planetDimension") == this.id);
        return entities;
    }

    getPlayers(){
        const players = dimension.getPlayers().filter(player=> player.getDynamicProperty("planetDimension") == this.id);

        return players;
    }

    getTopmostBlock(locationXZ, minHeight = null){
        return dimension.getTopmostBlock(locationXZ,minHeight);
    }

    playSound(soundId, location, soundOptions = null){
        return dimension.playSound(soundId, location, soundOptions);
    }

    runCommand(commandString){
        return dimension.runCommand(commandString);
    }

    runCommandAsync(commandString){
        return dimension.runCommandAsync(commandString);
    }

    setBlockPermutation(location, permutation){
        return dimension.setBlockPermutation(location, permutation);
    }

    setBlockType(location, blockType){
        return dimension.setBlockType(location, blockType);
    }

    setWeather(weatherType, duration=null){
        if (this.WeatherTypes.includes(weatherType)){
            this.weather = {
                type: weatherType,
                duration: duration
            }
            return this.weather
        }
    }

    spawnEntity(identifier, location, options=null){
        return dimension.spawnEntity(identifier, location, options);
    }

    spawnItem(itemStack, location){
        return dimension.spawnItem(itemStack, location);
    }

    spawnParticle(effectName, location, molangVariables=null){
        return dimension.spawnParticle(effectName, location, molangVariables);
    }
}