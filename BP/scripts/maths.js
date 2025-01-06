import { MolangVariableMap } from "@minecraft/server";
import { dimension, nether } from "./main";

export function createSphere(radius, location, totalPoints, offset, sizeOfPlane, life, colorFunc ) {
    // The outer sphere with backface culling helps fix the blending issue
    // Because of the material setup they dont mix or blend either whilst staying smooth
    const phi = (1 + Math.sqrt(5)) / 2;

    // Setting up particle count for debugging purposes
    let particleCount = 0;
  
    for (let i = 0; i < totalPoints; i++) {
      const lat = Math.acos(1 - 2 * (i + 0.5) / totalPoints);
      const lon = 2 * Math.PI * (i / phi);
  
      const x = radius * Math.sin(lat) * Math.cos(lon);
      const y = radius * Math.cos(lat);
      const z = radius * Math.sin(lat) * Math.sin(lon);
  
      const loc = {
        x: x + offset.x,
        y: y + offset.y,
        z: z + offset.z
      };
  
      const dir = {
        x: x,
        y: y,
        z: z
      };
      const magnitude = Math.sqrt(dir.x ** 2 + dir.y ** 2 + dir.z ** 2);
      dir.x /= magnitude;
      dir.y /= magnitude;
      dir.z /= magnitude;
      
      const c = colorFunc.getColor({x:x,y:y,z:z})

      const c2 = {
        red: c[0],
        green: c[1],
        blue: c[2],
        alpha: c[3]
      };
  
      try {
        const map = new MolangVariableMap();
        map.setVector3("offset", loc);
        map.setVector3("direction", dir);
        map.setFloat("size", sizeOfPlane);
        map.setColorRGBA("col", c2);
        map.setFloat("radius", radius);
        map.setFloat("life",life+0.01)

        nether.spawnParticle("hog:planet_plane", location, map);
        particleCount++;
      } catch (err) {
        nether.runCommand(`say Error: ${err.message}`);
      }
    }
}

export function createSphereOverlay(radius, location, totalPoints, offset, sizeOfPlane, life, colorFunc ) {
  const phi = (1 + Math.sqrt(5)) / 2;
  let particleCount = 0;

  for (let i = 0; i < totalPoints; i++) {
    const lat = Math.acos(1 - 2 * (i + 0.5) / totalPoints);
    const lon = 2 * Math.PI * (i / phi);

    const x = radius * Math.sin(lat) * Math.cos(lon);
    const y = radius * Math.cos(lat);
    const z = radius * Math.sin(lat) * Math.sin(lon);

    const loc = {
      x: x + offset.x,
      y: y + offset.y,
      z: z + offset.z
    };

    const dir = {
      x: x,
      y: y,
      z: z
    };
    const magnitude = Math.sqrt(dir.x ** 2 + dir.y ** 2 + dir.z ** 2);
    dir.x /= magnitude;
    dir.y /= magnitude;
    dir.z /= magnitude;
    
    const c = colorFunc.getColor({x:x,y:y,z:z})

    const c2 = {
      red: c[0],
      green: c[1],
      blue: c[2],
      alpha: c[3]
    };

    try {
      const map = new MolangVariableMap();
      map.setVector3("offset", loc);
      map.setVector3("direction", dir);
      map.setFloat("size", sizeOfPlane);
      map.setColorRGBA("col", c2);
      map.setFloat("radius", radius);
      map.setFloat("life",life+0.01)

      nether.spawnParticle("hog:planet_plane_overlay", location, map);
      particleCount++;
    } catch (err) {
      nether.runCommand(`say Error: ${err.message}`);
    }
  }
}



export const clamp = function(value,min=0,max=1){
  if (value > max){
      return max
  }else if (value < min){
      return min
  }
  return value
}


export function lerpColor(color1, color2, t) {
  return [
      color1[0] + t * (color2[0] - color1[0]), // Red
      color1[1] + t * (color2[1] - color1[1]), // Green
      color1[2] + t * (color2[2] - color1[2]), // Blue
      color1[3] + t * (color2[3] - color1[3])  // Alpha
  ];
}