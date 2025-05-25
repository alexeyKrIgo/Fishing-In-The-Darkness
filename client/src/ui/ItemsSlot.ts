import { GameObjects } from "phaser";
import { IFish } from "../interfaces/Fish";
import { GENERAL } from "../utils/AssetsGlobals";

export class ItemsSlot {
    icon: GameObjects.Image | GameObjects.Shader | null;
    slot: GameObjects.Image | GameObjects.Shader;
    fish: IFish|null

    static slotWidth = 32
    static slotHeight = 32

    addFish(fishData: IFish) {
        this.fish = fishData
        this.icon = new GameObjects.Image(this.slot.scene, this.slot.x, this.slot.y, GENERAL.loot, fishData.asset)
        this.icon.setOrigin(0, 0)
        this.slot.parentContainer.add(this.icon)
    }
}