import { Scene } from "phaser";
import { GameNetManager } from "../managers/GameNetManager";

export class Chat{
    dom: Phaser.GameObjects.DOMElement
    displayChat: HTMLDivElement
    input: HTMLInputElement

    constructor(scene: Scene){
        this.dom = scene.add.dom(1400, 800).createFromCache("chat")
        this.displayChat = this.dom.getChildByID("chatbox") as HTMLDivElement
        this.input = this.dom.getChildByID("message") as HTMLInputElement

        this.input.addEventListener("focusin", ()=>{
            GameNetManager.scene.input.keyboard?.disableGlobalCapture()
        })

        this.input.addEventListener("keydown", (e)=>{
            if(e.key === "Enter"){
                this.writePlayersMessage()
                //this.input.blur()
            }
        })
    }

    writePlayersMessage(){
        GameNetManager.sendMessage(this.input.value)
        this.input.value = ""
    }

    writeMessage(message: string){
        this.displayChat.innerText = this.displayChat.innerText + `\n ${message} \n`
        this.displayChat.scrollBy(0, this.displayChat.scrollHeight)
    }
}