import { Game, GameObjects, Scene } from "phaser";
import { GENERAL, UI } from "../../utils/AssetsGlobals";
import { IFish, ToLootFish } from "../../interfaces/Fish";

export class InventorySlot{
    icon: GameObjects.Image|GameObjects.Shader|null;
    slot: GameObjects.Image|GameObjects.Shader;
    static slotWidth = 32
    static slotHeight = 32

    constructor(scene: Scene){
        this.slot = new GameObjects.Image(scene, 0, 0, UI.inventorySlot)
        this.slot.setOrigin(0, 0)
    }

    addFish(fishData: IFish){
        this.icon = new GameObjects.Image(this.slot.scene, this.slot.x, this.slot.y, GENERAL.loot, fishData.asset)
        this.icon.setOrigin(0,0)
        this.slot.parentContainer.add(this.icon)
    }
}