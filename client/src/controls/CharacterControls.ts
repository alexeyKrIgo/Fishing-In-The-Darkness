import { Input, Math } from "phaser";
import { Character } from "../objects/Character";
import { GameNetManager } from "../managers/GameNetManager";
import { UI } from "../scenes/UI";
import { Player } from "../classes/Player";

export class CharacterControls{
    static mouseLeft = false;
    static keys: {
        F: Input.Keyboard.Key|null
        Space: Input.Keyboard.Key|null
    } = {
        F: null,
        Space: null
    }

    static generateKeys(input: Input.InputPlugin){
        this.keys.F = input.keyboard!.addKey(Input.Keyboard.KeyCodes.F)
        this.keys.Space = input.keyboard!.addKey(Input.Keyboard.KeyCodes.SPACE)
    }

    static generateCharacterMoveControl(input: Input.InputPlugin, character:Character){
        input.on("pointerdown", (p:Input.Pointer) => {
            if(p.button === 0){
                Player.selectedPlayer?.tradeOption.changeVisibility(false)
                Player.selectedPlayer = null
                UI.chat.input.blur()
                UI.chat.displayChat.style.overflow = "hidden"
                this.mouseLeft = true;
                character.move(new Math.Vector2(input.mousePointer.worldX, input.mousePointer.worldY))
                GameNetManager.sendWalk({x: character.direction.x, y: character.direction.y})
            }
        });

        input.on("pointermove",  (p:Input.Pointer) => {
            if(this.mouseLeft){
                character.move(new Math.Vector2(input.mousePointer.worldX, input.mousePointer.worldY))
                GameNetManager.sendWalk({x: character.direction.x, y: character.direction.y})
            }
        })

        input.on("pointerup", ()=>{
            this.mouseLeft = false
            GameNetManager.sendStopWalk()
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
                GameNetManager.sendGotFish(character.fishToCatch)
                character.catchFish()
            }
        }

        if(Input.Keyboard.JustDown(this.keys.Space!)){
            
            if(character.pickUp!.fish)
                character.pickUp?.pickFish()
        }
    }
}