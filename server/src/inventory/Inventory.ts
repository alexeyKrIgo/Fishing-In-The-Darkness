import { Fish } from "../interfaces/Fish"

export class Inventory{
    rowSize = 5
    size: number
    inventorySlots: (Fish | null)[][];

    constructor(size: number){
        this.size = size
        this.inventorySlots = Array(size).fill(null).map(() => Array(this.rowSize).fill(null));
    }
}