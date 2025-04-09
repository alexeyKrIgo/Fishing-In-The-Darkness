import { GameObjects, Scene } from "phaser";
import { InventorySlot } from "./InventorySlot";

export class InventoryRow extends GameObjects.Container{
    inventorySlots: InventorySlot[] = []
    static size = 5
    static gap = 4

    constructor(scene:Scene, x:number, y: number){
        super(scene, x, y)
        scene.add.existing(this)
        this.generateSlots(scene)
    }

    generateSlots(scene:Scene){
        //Get the size of the row with the gaps
        const width = (InventorySlot.slotWidth * InventoryRow.size *  InventorySlot.scale)

        //Population of the slots
        for (let i = 0; i < InventoryRow.size; i++){
            this.inventorySlots.push(new InventorySlot(scene, (this.x - width/2) + width/InventoryRow.size*i, this.y))
            this.add(this.inventorySlots[i].slot)
        }
        console.log(this.x, this.y)
    }
}