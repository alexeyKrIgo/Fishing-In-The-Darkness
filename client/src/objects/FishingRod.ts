import { Scene } from "phaser";
import { IFishingRodAnimations } from "../interfaces/Animations";
import { Animator } from "../utils/Animator";
import { RodData } from "../interfaces/FishingRod";

export class FishingRod extends Phaser.GameObjects.Sprite{
    animations: IFishingRodAnimations
    animationSpeed = 10
    animationIdleSpeed = 8

    constructor(scene: Scene, texture: string, x: number, y:number, rodData: RodData){
        super(scene, x, y, texture)

        this.animations = {
            cast: rodData.cast,
            idle: rodData.idle,
            bait: rodData.bait,
            catch: rodData.catch
        }

        this.visible = false;

        Animator.generateFishingAnimations(scene, this.animations.cast, rodData.cast, 0, 8, this.animationSpeed)
        Animator.generateFishingAnimations(scene, this.animations.idle, rodData.idle, 0, 7, this.animationIdleSpeed)
        Animator.generateFishingAnimations(scene, this.animations.bait, rodData.bait, 0, 7, this.animationSpeed)
        Animator.generateFishingAnimations(scene, this.animations.catch, rodData.catch, 0, 8, this.animationSpeed)

        scene.add.existing(this)
    }
}