import { GameObjects, Scene } from "phaser";
import { UI } from "../../utils/AssetsGlobals";

export class InventorySlot{
    icon: GameObjects.Image|GameObjects.Shader|null;
    slot: GameObjects.Image|GameObjects.Shader;
    static slotWidth = 32
    static slotHeight = 32
    static scale = 3

    constructor(scene: Scene, x:number, y:number){
        this.slot = new GameObjects.Image(scene, x, y, UI.inventorySlot)
        this.slot.scale = InventorySlot.scale
        this.slot.setOrigin(0, 0.5)
        scene.add.existing(this.slot)
    }
}