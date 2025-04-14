import { Scene, Tweens } from "phaser";
import { ToLootFish } from "../interfaces/Fish";
import { GENERAL } from "../utils/AssetsGlobals";

export class Fish extends Phaser.GameObjects.Image{
    tween: Tweens.Tween
    constructor(scene: Scene, x:number, y:number, data:ToLootFish){
        super(scene, x, y + 50, GENERAL.loot, data.asset)
        this.scale = 0.1
        scene.add.existing(this);
    }

    GoUpTween(xf: number, yf: number){
        this.tween = this.scene.tweens.add({targets: this, props: {x: xf, y: this.y - 50, scale: 0.8}, duration: 350, onComplete: ()=>this.GoDownTween()})
        this.tween.play()
    }

    GoDownTween(){
        this.tween.destroy()
        this.tween = this.scene.tweens.add({targets: this, props:{y: this.y + 18, scale: 0.6}, duration: 350, onComplete: () => this.setIdle()})
        this.tween.play()
    }

    setIdle():void{
        this.tween.destroy()
        this.tween = this.scene.tweens.add({targets: this, repeat: -1, props:{y: this.y - 5}, duration: 700, yoyo: true})
        this.tween.play()
    }
}