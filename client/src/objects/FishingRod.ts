import { Scene } from "phaser";
import { CharacterAnimations } from "../interfaces/Animations";

export class FishingRod extends Phaser.GameObjects.Sprite{
    animations: CharacterAnimations;

    constructor(scene: Scene, texture: string, x: number, y:number,){
        super(scene, x, y, texture)
    }
}