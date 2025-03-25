import { Input, Math } from "phaser";
import { Character } from "../objects/Character";

export class CharacterControls{
    static mouseLeft = false;

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
}