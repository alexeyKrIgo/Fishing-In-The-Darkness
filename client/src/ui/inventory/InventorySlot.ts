import { Game, GameObjects, Scene } from "phaser";
import { GENERAL, UI } from "../../utils/AssetsGlobals";
import { IFish, ToLootFish } from "../../interfaces/Fish";
import { InventoryUI } from "./InventoryUI";
import { UI as SUI } from "../../scenes/UI";

export class InventorySlot{
    icon: GameObjects.Image|GameObjects.Shader|null;
    slot: GameObjects.Image|GameObjects.Shader;
    fish: IFish
    selected: GameObjects.Rectangle
    static slotWidth = 32
    static slotHeight = 32

    constructor(scene: Scene){
        this.slot = new GameObjects.Image(scene, 0, 0, UI.inventorySlot)
        this.slot.setOrigin(0, 0)
        this.slot.setInteractive()
        this.slot.on("pointerdown", ()=>{
            if(SUI.trading){
                if(InventoryUI.selectedSlot)
                    InventoryUI.selectedSlot.selected.visible = false
                
                InventoryUI.selectedSlot = this
                this.selected.visible = true
            }
        })

        this.selected = new GameObjects.Rectangle(scene, 0,0, this.slot.width, this.slot.height, 0x000000, 0)
        this.selected.setOrigin(0,0)
        this.selected.setStrokeStyle(1, 0xfff300)
        this.selected.visible = false

    }

    addFish(fishData: IFish){
        this.fish = fishData
        this.icon = new GameObjects.Image(this.slot.scene, this.slot.x, this.slot.y, GENERAL.loot, fishData.asset)
        this.icon.setOrigin(0,0)
        this.slot.parentContainer.add(this.icon)
    }
}