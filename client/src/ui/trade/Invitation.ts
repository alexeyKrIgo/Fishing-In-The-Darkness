import { GameObjects, Input, Scene } from "phaser";
import { Button } from "../buttons/Button";
import { WOOD_BUTTON } from "../../utils/Colors";
import { Character } from "../../objects/Character";
import { UI } from "../../scenes/UI";
import { GameNetManager } from "../../managers/GameNetManager";

export class Invitation{
    title: GameObjects.Text
    host: GameObjects.Text
    hostCharacter: Character
    accept: Button
    cancel: Button

    constructor(scene:Scene, x: number, y: number){
        this.accept = new Button(scene, (p:Input.Pointer, x: number, y:number, event:Phaser.Types.Input.EventData)=>{
                    if(p.button === 0){
                        this.accept.click();
                        if(!UI.trading)
                            GameNetManager.acceptTrade(this.hostCharacter)
                            //(scene.scene.get("UI") as UI).startTrade(this.hostCharacter)
                        event.stopPropagation()
                    }}, 1, WOOD_BUTTON.fill, WOOD_BUTTON.stroke, 4, x, y, 100, 40, 12, "ACCEPT", this)

        this.cancel = new Button(scene, (p:Input.Pointer, x: number, y:number, event:Phaser.Types.Input.EventData)=>{
                    if(p.button === 0){
                        
                        //Reset the "selected" brightness
                        this.cancel.changeBrightness(1)
                        this.changeVisibility(false, null)
                        UI.trading = false
                        UI.destroyTrade()
                        event.stopPropagation()
                    }}, 1, WOOD_BUTTON.fill, WOOD_BUTTON.stroke, 4, x + 150, y, 100, 40, 12, "CANCEL", this)
        
        this.title = new GameObjects.Text(scene, x + 125, y - 50, "Trade with: ", { fontFamily: 'InTheDarkness', fontSize: 14, resolution: 10})
        this.title.setOrigin(0.5, 0.5)
        this.host = new GameObjects.Text(scene, x + 125, y - 25, "Host", { fontFamily: 'InTheDarkness', fontSize: 14, resolution: 10})
        this.host.setOrigin(0.5, 0.5)
        scene.add.existing(this.title)
        scene.add.existing(this.host)
    }

    changeVisibility(visible: boolean, host: Character|null = null){
        this.accept.changeVisibility(visible)
        this.cancel.changeVisibility(visible)
        this.title.visible = visible
        this.host.visible = visible
        if(host instanceof Character)
            this.host.text = host.nickname.text
    }
}