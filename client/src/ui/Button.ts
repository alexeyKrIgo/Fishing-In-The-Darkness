import { GameObjects, Scene } from "phaser";
import { GameNetManager } from "../managers/GameNetManager";

export class Button extends GameObjects.Rectangle{

    text: GameObjects.Text
    brightness = 1
    baseFillCoor = 0x73442f
    baseStrokeColor = 0xb06948

    constructor(scene: Scene, action:Function){
        super(scene, 4, 4, 150, 60,  0x73442f)
        this.setOrigin(0,0)
        this.setStrokeStyle(4, 0xb06948)
        this.scene.add.existing(this)
        this.setInteractive()

        this.on("pointerover", ()=>this.changeBrightness(1.2), this)
        this.on("pointerout", ()=>this.changeBrightness(1), this)
        this.on("pointerdown", ()=>action(), GameNetManager)

        this.text = new GameObjects.Text(this.scene, this.x + this.width/2, this.y + this.height/2, 
            "0", { fontFamily: 'InTheDarkness', fontSize: 20});
        this.text.setOrigin(0.5, 0.5)
        this.text.setText("Logout")
        this.scene.add.existing(this.text)
    }

    changeBrightness(brightness: number){
        this.setFillStyle(this.getBirghtenedColor(this.baseFillCoor, brightness))
        this.setStrokeStyle(4, this.getBirghtenedColor(this.baseStrokeColor, brightness))
    }

    getBirghtenedColor(color: number, brightness: number): number{
        let red = (color >> 16) & 0xFF;
        let green = (color >> 8) & 0xFF;
        let blue = color & 0xFF;

        red = Math.min(255, Math.max(0, Math.round(red * brightness)));
        green = Math.min(255, Math.max(0, Math.round(green * brightness)));
        blue = Math.min(255, Math.max(0, Math.round(blue * brightness)));

        return (red << 16) | (green << 8) | blue;
    }
}