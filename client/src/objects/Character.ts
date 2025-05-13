import { Math, Scene} from "phaser";
import { ICharacterAnimations} from "../interfaces/Animations";
import { ICharacterStates } from "../interfaces/Character";
import { FishingRod } from "./FishingRod";
import { RodData } from "../interfaces/FishingRod";
import { GameNetManager } from "../managers/GameNetManager";
import { ToLootFish } from "../interfaces/Fish";
import { PickUp } from "../ui/actions/PickUp";
import { Game } from "../scenes/Game";

export class Character extends Phaser.GameObjects.Sprite{
    animations: ICharacterAnimations;
    speed = 0.035; 
    direction: Math.Vector2;
    states: ICharacterStates
    PI = Math.PI2/2;
    fishingRod: FishingRod
    fishToCatch: ToLootFish
    pickUp: PickUp|null = null

    constructor(scene: Scene, texture: string, x: number, y:number, direction: Math.Vector2, states: ICharacterStates, animations: ICharacterAnimations,
        rodData: RodData
    ){
        super(scene, x, y, texture)
        this.animations = animations
        this.direction = direction
        this.states = states
        
        this.alpha = 1

        scene.add.existing(this)

        this.fishingRod = new FishingRod(scene, rodData.cast, x, y, rodData)
    }

    update(delta: number, seaLimit: number){
        this.depth = this.y
        this.fishingRod.depth = this.y
        if(this.pickUp){
            this.pickUp.update(this, this.scene as Game)
        }
        if(!this.states.idle && !this.states.fishing){

            //Update walking of players character only
            if(this == GameNetManager.mainPlayer.character){
                if(this.y + this.speed*this.direction.y*delta < seaLimit){
                    this.x += this.speed*this.direction.x*delta
                    this.y += this.speed*this.direction.y*delta
                    this.fishingRod.x = this.x
                    this.fishingRod.y = this.y
                }
            }
            // this.speed = 40;
            // this.x += this.speed*this.direction.x*delta/1000
            // this.y += this.speed*this.direction.y*delta/1000
        }
        if(!this.states.fishing)
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
        this.states.idle = false;
        const direction = new Math.Vector2(vector.x - this.getCenter().x, vector.y - this.getCenter().y);
        this.direction = direction.normalize();
    }

    updateFishingAnimation(){
        if(!this.anims.isPlaying){
            if(this.anims.getName() === this.animations.cast){
                this.play({key: this.animations.fishingIdle, repeat: -1})
                this.fishingRod.play({key: this.fishingRod.animations.idle, repeat: -1})
            }
            if(this.anims.getName() === this.animations.catch){
                this.states.fishing = false
                this.states.idle = true
                this.visible = true
            }
        }
    }

    fish(){
        this.states.fishing = true
        this.play({key: this.animations.cast})
        this.fishingRod.play({key: this.fishingRod.animations.cast})
    }

    tryCatchFish(fish:ToLootFish){
        this.fishToCatch = fish
        this.states.tryingCatchFish = true
        this.play({key: this.animations.bait, repeat: -1})
        this.fishingRod.play({key: this.fishingRod.animations.bait, repeat: -1})
    }

    catchFish(){
        this.states.tryingCatchFish = false
        this.play({key: this.animations.catch})
        this.fishingRod.play({key: this.fishingRod.animations.catch})
    }

    destroyCharacter(){
        this.fishingRod.destroy()
        this.destroy()
    }
}