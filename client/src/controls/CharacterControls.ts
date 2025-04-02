import { Input, Math } from "phaser";
import { Character } from "../objects/Character";
import { GameNetManager } from "../managers/GameNetManager";

export class CharacterControls{
    static mouseLeft = false;
    static keys: {
        F: Input.Keyboard.Key|null
    } = {
        F: null
    }

    static generateKeys(input: Input.InputPlugin){
        this.keys.F = input.keyboard!.addKey(Input.Keyboard.KeyCodes.F)
    }

    static generateCharacterMoveControl(input: Input.InputPlugin, character:Character){
        input.on("pointerdown", (p:Input.Pointer) => {
            if(p.button === 0){
                this.mouseLeft = true;
                GameNetManager.sendWalk({x: input.mousePointer.worldX, y: input.mousePointer.worldY})
                character.move(new Math.Vector2(input.mousePointer.worldX, input.mousePointer.worldY))
            }
        });

        input.on("pointermove",  (p:Input.Pointer) => {
            if(this.mouseLeft){
                GameNetManager.sendWalk({x: input.mousePointer.worldX, y: input.mousePointer.worldY})
                character.move(new Math.Vector2(input.mousePointer.worldX, input.mousePointer.worldY))
            }
        })

        input.on("pointerup", ()=>{
            this.mouseLeft = false
            GameNetManager.sendWalk({x: input.mousePointer.worldX, y: input.mousePointer.worldY})
            character.states.idle = true
        })
    }

    static update(character: Character){
        if(Input.Keyboard.JustDown(this.keys.F!)){
            if(!character.states.fishing){
                character.fish()
                GameNetManager.sendFish()
            }
            else if(character.states.tryingCatchFish){
                GameNetManager.server.sendFish()
                character.catchFish()
            }
        }
    }
}