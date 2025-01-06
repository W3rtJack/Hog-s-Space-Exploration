import { dimension } from "../main";
import { lerpColor } from "../maths";
import { Planet } from "../planet"

const radius = 2.5;

const colorFunc = {
    // Smoothly interpolate between top (red), middle (green), and bottom (blue), including alpha
    getColor: function(a) {
        return [0.8,1,0.8,0.2]
    }
};
const colorFunc2 = {
    // The earth color
    getColor: function(a) {
        let c = [0,1,0,1]

        const rand = Math.random();
        if (rand > 0.5){
            c = [0,0,1,1]
        }

        return c
    }
};

export const EarthPlanet = new Planet("earth","Earth",colorFunc2,radius,{x:-90,y:1350,z:-23},colorFunc,0.1,"overworld",3.5)