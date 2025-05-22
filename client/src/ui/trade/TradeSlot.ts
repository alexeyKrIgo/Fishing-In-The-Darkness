import { GameObjects, Scene } from "phaser"
import { ItemsSlot } from "../ItemsSlot"
import { IFish } from "../../interfaces/Fish"
import { GENERAL, UI } from "../../utils/AssetsGlobals"

export class TradeSlot extends ItemsSlot {
    constructor(scene: Scene){
        super()
        this.slot = new GameObjects.Image(scene, 0, 0, UI.inventorySlot)
        this.slot.setOrigin(0, 0)
    }
    setFish(fishData: IFish) {
        if (!this.fish) {
            this.addFish(fishData)
        }
        else {
            this.fish = fishData;
            (this.icon! as GameObjects.Image).setTexture(GENERAL.loot, fishData.asset)
        }
    }
}