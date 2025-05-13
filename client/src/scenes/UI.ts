import { GameObjects, Scene, Math, Textures, Display, Input } from "phaser";
import {UI as UIGlobals} from "../utils/AssetsGlobals"
import { InventoryUI } from "../ui/inventory/InventoryUI";
import { Chat } from "../ui/Chat";
import { Button } from "../ui/Button";
import { GameNetManager } from "../managers/GameNetManager";
export class UI extends Scene{

    fps:GameObjects.Text
    miscScale = 2.5
    static inventoryUI: InventoryUI
    inventorySlot: GameObjects.Shader
    inventoryIcon: GameObjects.Shader
    logout: Button
    static chat:Chat 

    constructor(){
        super("UI")
    }

    preload(){
        this.load.html("chat", "chat.html")
    }

    create(){
        this.fps = new GameObjects.Text(this, 850, 20, "0", { fontFamily: 'InTheDarkness' });
        this.add.existing(this.fps);

        //Generate inventory ui
        UI.inventoryUI = new InventoryUI(3, this, 0, 0)
        UI.inventoryUI.inventoryRows.forEach(r => r.setVisible(false))
        UI.inventoryUI.moveRows(0, 200)
        this.cache.shader.add(
            UIGlobals.brightness, 
            new Display.BaseShader(UIGlobals.brightness, 
                this.cache.shader.get(UIGlobals.brightness).fragmentSrc, 
                undefined, { brightness: { type: "1f", value: 1.0 } }
            )
        )

        //Generate logout button
        this.logout = new Button(this, GameNetManager.disconnect);

        //Generate inventory open/close controls
        this.inventorySlot = this.makeShader(UIGlobals.brightness, UIGlobals.inventorySlot)
        this.inventoryIcon = this.makeShader(UIGlobals.brightness, UIGlobals.inventoryIcon)
        this.inventorySlot.setInteractive()
        this.setTint(this.inventorySlot)

        UI.chat = new Chat(this)
    }

    makeShader(shaderKey: string, texture: string):GameObjects.Shader{
        const loadedTexture = this.textures.get(texture)
        const shader = this.add.shader(
            shaderKey,
            40,
            140,
            32,
            32,
            [texture]
        )
        this.textures.get(texture).setFilter(Textures.FilterMode.NEAREST)
        shader.scale = this.miscScale
        return shader;
    }

    setTint(image: GameObjects.Shader){
        image.on("pointerover",() =>{
            image.setUniform("brightness.value", 1.2);
        }, this)

        image.on("pointerout",() =>{
            image.setUniform("brightness.value",1.0);
        }, this)

        image.on("pointerdown", (pointer:Input.Pointer)=>{
            if(pointer.button === 0){
                this.inventorySlot.setUniform("brightness.value", 0.6);
                this.inventoryIcon.setUniform("brightness.value", 0.6);
                this.inventoryIcon!.scene.time.addEvent({
                    delay: 100,
                    callbackScope: this,
                    callback: ()=>{
                        this.inventoryIcon.setUniform("brightness.value", 1);
                        UI.inventoryUI.inventoryRows.forEach(r => r.setVisible(!r.visible))
                    }
                })
                this.inventorySlot.scene.time.addEvent({
                    delay: 100,
                    callbackScope: this,
                    callback: ()=>this.inventorySlot.setUniform("brightness.value", 1)
                })
            }
        }, this)
    }

    update(time:number, delta: number){
        this.fps.setText("FPS:" + (Math.RoundTo(1000/delta)).toString())
    }
}