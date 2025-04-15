import { Fish, ToLootFish } from "./Fish"

export interface InventoryDB{
    size: number,
    full: boolean
}

export interface Inventory extends InventoryDB{
    savedFishes: Fish[]
    toSaveFishes: Fish[]
}