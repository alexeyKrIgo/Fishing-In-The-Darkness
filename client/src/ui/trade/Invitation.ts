import { GameObjects, Input, Scene } from "phaser";
import { Button } from "../buttons/Button";
import { WOOD_BUTTON } from "../../utils/Colors";

export class Invitation{
    title: GameObjects.Text
    host: GameObjects.Text
    accept: Button
    cancel: Button

    constructor(scene:Scene, x: number, y: number){
        this.accept = new Button(scene, (p:Input.Pointer, x: number, y:number, event:Phaser.Types.Input.EventData)=>{
                    if(p.button === 0){
                        this.accept.click()
                        event.stopPropagation()
                    }}, 1, WOOD_BUTTON.fill, WOOD_BUTTON.stroke, x, y, 100, 40, 12, "ACCEPT", this)

        this.cancel = new Button(scene, (p:Input.Pointer, x: number, y:number, event:Phaser.Types.Input.EventData)=>{
                    if(p.button === 0){
                        this.cancel.click()
                        event.stopPropagation()
                    }}, 1, WOOD_BUTTON.fill, WOOD_BUTTON.stroke, x + 150, y, 100, 40, 12, "CANCEL", this)
        
        this.title = new GameObjects.Text(scene, x + 125, y - 50, "Trade with: ", { fontFamily: 'InTheDarkness', fontSize: 14, resolution: 10})
        this.title.setOrigin(0.5, 0.5)
        this.host = new GameObjects.Text(scene, x + 125, y - 25, "Host", { fontFamily: 'InTheDarkness', fontSize: 14, resolution: 10})
        this.host.setOrigin(0.5, 0.5)
        scene.add.existing(this.title)
        scene.add.existing(this.host)
    }

    changeVisibility(visible: boolean, host: string){
        this.accept.changeVisibility(visible)
        this.cancel.changeVisibility(visible)
        this.title.visible = visible
        this.host.visible = visible
        this.host.text = host
    }
}