import { GameObjects, Scene } from "phaser";

export class Button extends GameObjects.Rectangle{

    action: Function
    text: GameObjects.Text
    brightness:number
    baseFillColor:number
    baseStrokeColor:number
    strokeWidth: number
    locked = false

    constructor(scene: Scene, action:Function, brightness:number, baseFillColor:number, baseStrokeColor: number, strokeWidth: number,
        x: number, y: number, width: number, height: number, fontSize: number, text:string, context: any, inContainer: boolean = false
    ){
        super(scene, x, y, width, height,  baseFillColor)
        this.strokeWidth = strokeWidth
        this.setOrigin(0,0)
        this.setStrokeStyle(strokeWidth, baseStrokeColor)
        this.setInteractive()

        this.brightness = brightness
        this.baseFillColor = baseFillColor
        this.baseStrokeColor = baseStrokeColor
        this.action = action

        this.on("pointerdown", action, context)
        this.on("pointerover", ()=>{
            if(!this.locked)
                this.changeBrightness(1.2)
        }, this)
        this.on("pointerout", ()=>
            {   
                if(!this.locked){
                    this.changeBrightness(1)
                }
            }, 
        this)

        this.text = new GameObjects.Text(this.scene, this.x + this.width/2, this.y + this.height/2, 
            "0", { fontFamily: 'InTheDarkness', fontSize: fontSize, resolution: 10});
        this.text.setOrigin(0.5, 0.5)
        this.text.setText(text)

        if(!inContainer){
            this.scene.add.existing(this)
            this.scene.add.existing(this.text)
        }

        this.changeBrightness(brightness)
    }

    addAction(){
        this.action()
    }

    click(){
        this.changeBrightness(0.8)
        this.scene.time.addEvent({
            delay: 100, callbackScope: this, callback: 
            ()=>{
                this.changeBrightness(1.2)
            },
        })
    }

    changeBrightness(brightness: number){
        this.setFillStyle(this.getBirghtenedColor(this.baseFillColor, brightness))
        this.setStrokeStyle(this.strokeWidth, this.getBirghtenedColor(this.baseStrokeColor, brightness))
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

    changePosition(x:number, y: number){
        this.setPosition(x,y)
        this.text.setPosition(x, y)
    }

    changeVisibility(visible: boolean){
        this.visible = visible,
        this.text.visible = visible
    }

    destroyButton(){
        this.text.destroy()
        this.destroy()
    }
}