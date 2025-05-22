import { GameObjects } from "phaser"
import { ItemsSlot } from "../ItemsSlot"
import { IFish } from "../../interfaces/Fish"
import { GENERAL } from "../../utils/AssetsGlobals"

export class TradeSlot extends ItemsSlot {
    setFish(fishData: IFish) {
        if (!this.fish) {
            this.addFish(fishData)
        }
        else {
            (this.icon! as GameObjects.Image).setTexture(GENERAL.loot, fishData.asset)
        }
    }
}