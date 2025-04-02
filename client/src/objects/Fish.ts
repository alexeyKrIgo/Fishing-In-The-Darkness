import { Scene, Tweens } from "phaser";
import { IFish } from "../interfaces/Fish";
import { GENERAL } from "../utils/AssetsGlobals";

export class Fish extends Phaser.GameObjects.Image{
    tween: Tweens.Tween
    constructor(scene: Scene, x:number, y:number, data:IFish){
        super(scene, x, y + 50, GENERAL.loot, data.assetsId)
        this.scale = 0.1
        scene.add.existing(this);
    }

    setTween(xf: number, yf: number){
        this.tween = this.scene.tweens.add({targets: this, props: {x: xf, y: this.y - 32, scale: 0.6}, duration: 500, onComplete: ()=>this.setIdle()})
        this.tween.play()
    }

    setIdle():void{
        this.tween.destroy()
        console.log("hola")
        this.tween = this.scene.tweens.add({targets: this, repeat: -1, props:{y: this.y - 5}, duration: 700, yoyo: true})
        this.tween.play()
    }
}