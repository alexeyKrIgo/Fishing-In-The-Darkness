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
        const xInventory = 0
        const inventoryUI = new InventoryUI(3, this, 0, 0)
        inventoryUI.moveRows(+this.game.config.width - inventoryUI.inventoryRows.get(0)!.rowWidth*inventoryUI.scale, 200)
        console.log(this.scale.displaySize.width)
    }

    update(time:number, delta: number){
        this.fps.setText("FPS:" + (Math.RoundTo(1000/delta)).toString())
    }
}