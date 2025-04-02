import { Math, Scene } from "phaser";
import { Character } from "./Character";
import { BASICROD, GHOST } from "../utils/AssetsGlobals";
import { ICharacterStates } from "../interfaces/Character";
import { Animator } from "../utils/Animator";
import { ICharacterAnimations } from "../interfaces/Animations";
import { FishingRod } from "./FishingRod";

export class Ghost extends Character{
    static animations:ICharacterAnimations = {
        idle: {
            front: "ghostIdleFront", 
            right: "ghostIdleRight",
            left: "ghostIdleLeft",
            back: "ghostIdleBack"
        },
        cast: GHOST.castRod, fishingIdle: GHOST.fishingIdle, bait: GHOST.bait, catch: GHOST.catchFish
    }
    constructor(scene: Scene, texture: string, x: number, y:number, direction: Math.Vector2, states: ICharacterStates){
        super(scene, texture, x, y, direction, states, {idle: {
            front: "ghostIdleFront", 
            right: "ghostIdleRight",
            left: "ghostIdleLeft",
            back: "ghostIdleBack"
        }, cast: GHOST.castRod, fishingIdle: GHOST.fishingIdle, bait: GHOST.bait, catch: GHOST.catchFish}, BASICROD)
    }

    static generateAnimations(scene: Scene, texture: string){
        //Basic direction animations generation
        Animator.generateCharacterAnimations(scene, Ghost.animations.idle.front, texture, 0, 7, 8)
        Animator.generateCharacterAnimations(scene, Ghost.animations.idle.right, texture, 8, 15, 8)
        Animator.generateCharacterAnimations(scene, Ghost.animations.idle.left, texture, 16, 23, 8)
        Animator.generateCharacterAnimations(scene, Ghost.animations.idle.back, texture, 24, 31, 8)

        //Fishing animations generation
        Animator.generateFishingAnimations(scene, this.animations.cast, GHOST.castRod, 0, 8, FishingRod.animationSpeed)
        Animator.generateFishingAnimations(scene, this.animations.fishingIdle, GHOST.fishingIdle, 0, 7, FishingRod.animationIdleSpeed)
        Animator.generateFishingAnimations(scene, this.animations.bait, GHOST.bait, 0, 7, FishingRod.animationSpeed)
        Animator.generateFishingAnimations(scene, this.animations.catch, GHOST.catchFish, 0, 8, FishingRod.animationSpeed)
    }
}