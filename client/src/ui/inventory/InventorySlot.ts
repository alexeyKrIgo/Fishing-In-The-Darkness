import { GameObjects, Scene } from "phaser";
import { UI } from "../../utils/AssetsGlobals";

export class InventorySlot{
    icon: GameObjects.Image|GameObjects.Shader|null;
    slot: GameObjects.Image|GameObjects.Shader;
    static slotWidth = 32
    static slotHeight = 32

    constructor(scene: Scene){
        this.slot = new GameObjects.Image(scene, 0, 0, UI.inventorySlot)
        this.slot.setOrigin(0, 0)
    }
}