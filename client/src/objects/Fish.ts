import { Math, Scene, Tweens } from "phaser";
import { ToLootFish } from "../interfaces/Fish";
import { GENERAL } from "../utils/AssetsGlobals";

export class Fish extends Phaser.GameObjects.Image{
    tween: Tweens.Tween
    fishData: ToLootFish
    xOffset: number
    yOffset: number

    constructor(scene: Scene, x:number, y:number, data:ToLootFish, xOffset:number, yOffset: number){
        super(scene, x, y + 50, GENERAL.loot, data.asset)
        this.fishData = data
        this.scale = 0.1
        this.depth = 1
        this.xOffset = xOffset
        this.yOffset = yOffset
        scene.add.existing(this);
    }

    GoUpTween(xf: number, yf: number){
        const newY = Math.RND.integerInRange(50, 100)
        const newX = Math.RND.integerInRange(-50, 50)
        this.tween = this.scene?.tweens.add({targets: this, props: {x: xf - this.xOffset, y: this.y - this.yOffset, scale: 0.8}, duration: 400, onComplete: ()=>this.GoDownTween()})
        this.tween?.play()
    }

    GoDownTween(){
        this.tween.destroy()
        this.tween = this.scene?.tweens.add({targets: this, props:{y: this.y + 18, scale: 0.6}, duration: 350, onComplete: () => this.setIdle()})
        this.tween?.play()
    }

    setIdle():void{
        this.tween.destroy()
        this.tween = this.scene?.tweens.add({targets: this, repeat: -1, props:{y: this.y - 5}, duration: 700, yoyo: true})
        this.tween?.play()
    }
}