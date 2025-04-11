import { GameObjects, Scene } from "phaser";
import { InventorySlot } from "./InventorySlot";

export class InventoryRow extends GameObjects.Container{
    inventorySlots: InventorySlot[] = []
    rowWidth: number
    static size = 5
    static gap = 10

    constructor(scene:Scene, x:number, y: number, scale:number){
        super(scene, x, y)
        this.scale = scale
        scene.add.existing(this)
        this.generateSlots(scene)
    }

    generateSlots(scene:Scene){
        this.rowWidth = InventoryRow.size * InventorySlot.slotWidth + InventoryRow.gap * (InventoryRow.size - 1)

        for (let i = 0; i < InventoryRow.size; i++){
            this.inventorySlots.push(new InventorySlot(scene))
            this.add(this.inventorySlots[i].slot)
            this.inventorySlots[i].slot.setPosition(0 + i*InventorySlot.slotWidth + i*InventoryRow.gap, 0)
        }
    }
}