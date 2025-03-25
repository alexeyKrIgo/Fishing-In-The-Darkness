import { Math, Scene} from "phaser";
import { CharacterAnimations } from "../interfaces/Animations";
import { Animator } from "../utils/Animator";

export class Character extends Phaser.GameObjects.Sprite{
    animations: CharacterAnimations;
    speed = 0.05; 
    direction: Math.Vector2;
    fishing: boolean;
    idle: boolean;
    PI = Math.PI2/2;

    constructor(scene: Scene, texture: string, x: number, y:number, animations: CharacterAnimations, direction: Math.Vector2, idle: boolean, fishing: boolean){
        super(scene, x, y, texture)
        this.animations = animations,
        this.direction = direction,
        this.idle = idle
        this.fishing = fishing

        Animator.generateCharacterAnimations(scene, this.animations.idle.front, texture, 0, 7, 8)
        Animator.generateCharacterAnimations(scene, this.animations.idle.right, texture, 8, 15, 8)
        Animator.generateCharacterAnimations(scene, this.animations.idle.left, texture, 16, 23, 8)
        Animator.generateCharacterAnimations(scene, this.animations.idle.back, texture, 24, 31, 8)
        
        this.alpha = 1

        scene.add.existing(this)
    }

    update(delta: number){
        if(!this.idle){
            this.x += this.speed*this.direction.x*delta
            this.y += this.speed*this.direction.y*delta
            // this.speed = 40;
            // this.x += this.speed*this.direction.x*delta/1000
            // this.y += this.speed*this.direction.y*delta/1000
        }
        this.updateAnimation([this.animations.idle.front, this.animations.idle.left, this.animations.idle.back, this.animations.idle.right], -1, 0)
    }

    updateAnimation(animations: Array<string>, repeat: number, startFrame: number){
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
}