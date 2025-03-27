import { Input, Math } from "phaser";
import { Character } from "../objects/Character";

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
                character.move(new Math.Vector2(input.mousePointer.worldX, input.mousePointer.worldY))
            }
        });

        input.on("pointermove",  (p:Input.Pointer) => {
            if(this.mouseLeft){
                character.move(new Math.Vector2(input.mousePointer.worldX, input.mousePointer.worldY))
            }
        })

        input.on("pointerup", ()=>{
            this.mouseLeft = false
            character.idle = true
        })
    }

    static update(character: Character){
        if(Input.Keyboard.JustDown(this.keys.F!)){
            if(!character.fishing)
                character.fish()
        }
    }
}