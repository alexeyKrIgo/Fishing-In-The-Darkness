import { GameObjects, Scene, Math } from "phaser";
import { InventoryUI } from "../ui/inventory/InventoryUI";
import { InventoryRow } from "../ui/inventory/InventoryRow";
import { InventorySlot } from "../ui/inventory/InventorySlot";

export class UI extends Scene{

    fps:GameObjects.Text

    constructor(){
        super("UI")
    }

    create(){
        this.fps = new GameObjects.Text(this, 850, 20, "0", { fontFamily: 'InTheDarkness' });
        this.add.existing(this.fps);
        const xInventory = this.scale.displaySize.width - (InventorySlot.slotWidth * InventoryRow.size + InventoryRow.gap * 4) * InventorySlot.scale
        const inventoryUI = new InventoryUI(1, this, xInventory, 300)
        console.log(this.scale.displaySize.width)
    }

    update(time:number, delta: number){
        this.fps.setText("FPS:" + (Math.RoundTo(1000/delta)).toString())
    }
}