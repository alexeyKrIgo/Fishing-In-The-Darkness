import { Math, Scene } from "phaser";
import { Character } from "./Character";
import { BASICROD, GHOST } from "../utils/AssetsGlobals";

export class Ghost extends Character{
    constructor(scene: Scene, texture: string, x: number, y:number, direction: Math.Vector2, idle: boolean, fishing: boolean){
        super(scene, texture, x, y, direction, idle, fishing, {idle: {
            front: "ghostIdleFront", 
            right: "ghostIdleRight",
            left: "ghostIdleLeft",
            back: "ghostIdleBack"
        }, cast: GHOST.castRod, fishingIdle: GHOST.fishingIdle, bait: GHOST.bait, catch: GHOST.catchFish}, BASICROD)
    }
}