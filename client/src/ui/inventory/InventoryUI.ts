import { Scene } from "phaser";
import { InventoryRow } from "./InventoryRow";
import { InventorySlot } from "./InventorySlot";

export class InventoryUI{
    inventoryRows = new Map<number, InventoryRow>()

    constructor(size: number, scene: Scene, x: number, y: number){
        this.generateRows(size, scene, x, y)
    }

    generateRows(size:number, scene: Scene, x: number, y: number){
        for(let i = 0; i < size; i++){
            this.inventoryRows.set(i, new InventoryRow(scene, x, y + i*InventorySlot.slotWidth * InventorySlot.scale + InventoryRow.gap*i))
        }
    }

    moveX(x:number){
        this.inventoryRows.forEach(v=>v.moveX(x))
    }
}