import { Scene } from "phaser";
import { InventoryRow } from "./InventoryRow";
import { InventorySlot } from "./InventorySlot";
import { IFish } from "../../interfaces/Fish";

export class InventoryUI{
    inventoryRows = new Map<number, InventoryRow>()
    scale = 2.5
    static selectedSlot: InventorySlot|null

    constructor(size: number, scene: Scene, x: number, y: number){
        this.generateRows(size, scene, x, y)
    }

    generateRows(size:number, scene: Scene, x: number, y: number){
        for(let i = 0; i < size; i++){
            this.inventoryRows.set(i, new InventoryRow(scene, x, 0, this.scale))
            this.inventoryRows.get(i)!.y = y + i * (this.scale * InventorySlot.slotWidth + InventoryRow.gap)
        }
    }

    moveRows(x:number, y:number){
        this.inventoryRows.forEach((r,k) => {
            r.x = x
            r.y = y + k*(InventorySlot.slotWidth*r.scale + InventoryRow.gap)
        })
    }

    addFish(fishData: IFish){
        this.inventoryRows.get(fishData.row)?.inventorySlots[fishData.column].addFish(fishData)
    }
}