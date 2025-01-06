import { lerpColor } from "../maths";
import { Planet } from "../planet";

const radius = 25;

const colorFunc = {
    // Smoothly interpolate between top (red), middle (green), and bottom (blue), including alpha
    getColor: function(a) {
        return [1,0.4,0,0.2]
    }
};
const colorFunc2 = {
    // Smoothly interpolate between top (red), middle (green), and bottom (blue), including alpha
    getColor: function(a) {
        const normalizedY = (a.y + radius) / (2 * radius); // Normalize y to 0–1

        if (normalizedY <= 0.5) {
            // From top to middle
            const t = normalizedY * 2; // Scale 0–0.5 to 0–1
            return lerpColor([1, 0.6, 0, 1], [1, 0.8, 0, 1], t); // Red to Green with alpha
        } else {
            // From middle to bottom
            const t = (normalizedY - 0.5) * 2; // Scale 0.5–1 to 0–1
            return lerpColor([1, 0.8, 0, 1], [0.8, 0.6, 0, 1], t); // Green to Blue with alpha
        }
    }
};

export const Sun = new Planet("sun","Sun",colorFunc2,radius,{x:0,y:1360,z:0},colorFunc,0.5,"sun",10)