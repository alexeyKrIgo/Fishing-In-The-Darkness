import { Math, Scene} from "phaser";
import { CharacterAnimations} from "../interfaces/Animations";
import { Animator } from "../utils/Animator";
import { FishingRod } from "./FishingRod";
import { RodData } from "../interfaces/FishingRod";
import { GHOST } from "../utils/AssetsGlobals";

export class Character extends Phaser.GameObjects.Sprite{
    animations: CharacterAnimations;
    speed = 0.035; 
    direction: Math.Vector2;
    fishing: boolean;
    idle: boolean;
    PI = Math.PI2/2;
    fishingRod: FishingRod

    constructor(scene: Scene, texture: string, x: number, y:number, direction: Math.Vector2, idle: boolean, fishing: boolean, animations: CharacterAnimations,
        rodData: RodData
    ){
        super(scene, x, y, texture)
        this.animations = animations
        this.direction = direction
        this.idle = idle
        this.fishing = fishing

        //Basic direction animations generation
        Animator.generateCharacterAnimations(scene, this.animations.idle.front, texture, 0, 7, 8)
        Animator.generateCharacterAnimations(scene, this.animations.idle.right, texture, 8, 15, 8)
        Animator.generateCharacterAnimations(scene, this.animations.idle.left, texture, 16, 23, 8)
        Animator.generateCharacterAnimations(scene, this.animations.idle.back, texture, 24, 31, 8)
        
        this.alpha = 1

        scene.add.existing(this)

        this.fishingRod = new FishingRod(scene, rodData.cast, x, y, rodData)

        //Fishing animations generation
        Animator.generateFishingAnimations(scene, this.animations.cast, GHOST.castRod, 0, 8, this.fishingRod.animationSpeed)
        Animator.generateFishingAnimations(scene, this.animations.fishingIdle, GHOST.fishingIdle, 0, 7, this.fishingRod.animationIdleSpeed)
        Animator.generateFishingAnimations(scene, this.animations.bait, GHOST.bait, 0, 7, this.fishingRod.animationSpeed)
        Animator.generateFishingAnimations(scene, this.animations.catch, GHOST.catchFish, 0, 8, this.fishingRod.animationSpeed)
    }

    update(delta: number){
        if(!this.idle && !this.fishing){
            this.x += this.speed*this.direction.x*delta
            this.y += this.speed*this.direction.y*delta
            this.fishingRod.x = this.x
            this.fishingRod.y = this.y
            // this.speed = 40;
            // this.x += this.speed*this.direction.x*delta/1000
            // this.y += this.speed*this.direction.y*delta/1000
        }
        if(!this.fishing)
            this.updateWalkingAnimation([this.animations.idle.front, this.animations.idle.left, this.animations.idle.back, this.animations.idle.right], -1, 0)
        else{
            this.updateFishingAnimation()
        }
    }

    updateWalkingAnimation(animations: Array<string>, repeat: number, startFrame: number){
        if(this.direction.angle() >= this.PI/4 && this.direction.angle() < 3*this.PI/4){
            // Checks if animation is different of which is being played or the animation of "attack" has finished
            // but the attack button is still being pressed
            if(this.anims.getName() != animations[0]){
                this.play({key: animations[0], repeat: repeat, startFrame: startFrame});
            }
        }
        if(this.direction.angle() >= 3*this.PI/4 && this.direction.angle() < 5*this.PI/4 ){
            if(this.anims.getName() != animations[1]){
                this.play({key: animations[1], repeat: repeat, startFrame: startFrame});
            }
        }

        if(this.direction.angle() >= 5*this.PI/4 && this.direction.angle() < 7*this.PI/4){
            if(this.anims.getName() != animations[2]){
                this.play({key: animations[2], repeat: repeat, startFrame: startFrame});
            }
        }

        if(this.direction.angle() >= 7*this.PI/4 || this.direction.angle() < this.PI/4){
            if(this.anims.getName() != animations[3]){
                this.play({key: animations[3], repeat: repeat, startFrame: startFrame});
            }
        }
    }

    move(vector: Math.Vector2){
        this.idle = false;
        const direction = new Math.Vector2(vector.x - this.getCenter().x, vector.y - this.getCenter().y);
        this.direction = direction.normalize();
    }

    updateFishingAnimation(){
        if(!this.anims.isPlaying){
            if(this.anims.getName() === this.animations.cast){
                this.play({key: this.animations.fishingIdle, repeat: -1})
                this.fishingRod.play({key: this.fishingRod.animations.idle, repeat: -1})
            }
        }
    }

    fish(){
        this.fishing = true
        this.play({key: this.animations.cast})
        this.fishingRod.play({key: this.fishingRod.animations.cast})
    }

    tryCatchFish(){
        this.play({key: this.animations.bait, repeat: -1})
        this.fishingRod.play({key: this.fishingRod.animations.bait, repeat: -1})
    }
}