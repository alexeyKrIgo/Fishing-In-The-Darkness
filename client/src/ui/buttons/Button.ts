import { GameObjects, Scene } from "phaser";
import { GameNetManager } from "../../managers/GameNetManager";

export class Button extends GameObjects.Rectangle{

    action: Function
    text: GameObjects.Text
    brightness:number
    baseFillColor:number
    baseStrokeColor:number

    constructor(scene: Scene, action:Function, brightness:number, baseFillColor:number, baseStrokeColor: number,
        x: number, y: number, width: number, height: number, fontSize: number, text:string, context: any
    ){
        super(scene, x, y, width, height,  baseFillColor)
        this.setOrigin(0,0)
        this.setStrokeStyle(4, baseStrokeColor)
        this.scene.add.existing(this)
        this.setInteractive()

        this.brightness = brightness
        this.baseFillColor = baseFillColor
        this.baseStrokeColor = baseStrokeColor
        this.action = action

        this.on("pointerover", ()=>this.changeBrightness(1.2), this)
        this.on("pointerout", ()=>this.changeBrightness(1), this)
        this.on("pointerdown", action, context)

        this.text = new GameObjects.Text(this.scene, this.x + this.width/2, this.y + this.height/2, 
            "0", { fontFamily: 'InTheDarkness', fontSize: fontSize});
        this.text.setOrigin(0.5, 0.5)
        this.text.setText(text)
        this.scene.add.existing(this.text)
    }

    addAction(){
        this.action()
    }

    changeBrightness(brightness: number){
        this.setFillStyle(this.getBirghtenedColor(this.baseFillColor, brightness))
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