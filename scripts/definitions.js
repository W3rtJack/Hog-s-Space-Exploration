import { EarthPlanet } from "./planets/earth";
import { Krystallos, KrystallosPlanet } from "./planets/krystallos";
import { Rudra, RudraPlanet } from "./planets/rudra";
import { SpaceStationPlanet } from "./planets/space_station";
import { Sun } from "./planets/sun";
import { The_Moon, TheMoonPlanet } from "./planets/the_moon";
//import { Toxicar, ToxicarPlanet } from "./planets/toxicar";
import { Vermiscar, VermiscarPlanet } from "./planets/vermiscar";

export const planetsEnum = new Map();

planetsEnum.set(Vermiscar.id,Vermiscar);
planetsEnum.set(Rudra.id,Rudra);
planetsEnum.set(The_Moon.id,The_Moon);
planetsEnum.set(Krystallos.id,Krystallos)
//planetsEnum.set(Toxicar.id,Toxicar)



export const PlanetEntities = [
    TheMoonPlanet,
    VermiscarPlanet,
    EarthPlanet,
    Sun,
    RudraPlanet,
    KrystallosPlanet,
    SpaceStationPlanet
    //ToxicarPlanet
]