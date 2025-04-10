import { GameObjects, Scene } from "phaser";
import { InventorySlot } from "./InventorySlot";
import { HorizontalContainer } from "../utils/HorizontalContainer";

export class InventoryRow extends HorizontalContainer{
    inventorySlots: InventorySlot[] = []
    static size = 5
    static gap = 10

    constructor(scene:Scene, x:number, y: number){
        super(x, y, InventoryRow.gap)
        this.generateSlots(scene)
    }

    generateSlots(scene:Scene){
        const inventorySlots: GameObjects.Image[] = []
        for (let i = 0; i < InventoryRow.size; i++){
            this.inventorySlots.push(new InventorySlot(scene, 0,0))
            inventorySlots.push(this.inventorySlots[i].slot as GameObjects.Image)
        }
        
        this.placeElements(inventorySlots)
    }
}