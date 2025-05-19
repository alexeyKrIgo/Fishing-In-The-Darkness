import { IFish } from "../../interfaces/Fish";
import { InventorySlot } from "../inventory/InventorySlot";

export class TradeSlot extends InventorySlot{
    addFish(fishData:IFish){
        super.addFish(fishData)
    }
}