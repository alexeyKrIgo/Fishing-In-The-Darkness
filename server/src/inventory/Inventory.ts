import { Fish } from "../interfaces/Fish"

export class Inventory{
    rowSize = 5
    size: number
    inventorySlots: (Fish | null)[][];
    savedFishes: Fish[]
    toSaveFishes: Fish[]

    constructor(size: number, savedFishes: Fish[]){
        this.size = size
        this.inventorySlots = Array(size).fill(null).map(() => Array(this.rowSize).fill(null));
        this.savedFishes = savedFishes

        savedFishes.forEach(f=>{
            this.inventorySlots[f.row][f.column] = f
            this.savedFishes.push(f)
        })

        this.toSaveFishes = []
    }
}