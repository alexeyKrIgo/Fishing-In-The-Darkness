import { GameObjects, Input, Scene } from "phaser";
import { GENERAL, UI } from "../../utils/AssetsGlobals";
import { IFish } from "../../interfaces/Fish";
import { InventoryUI } from "./InventoryUI";
import { UI as SUI } from "../../scenes/UI";
import { GameNetManager } from "../../managers/GameNetManager";
import { Button } from "../buttons/Button";
import { WOOD_BUTTON } from "../../utils/Colors";

export class InventorySlot {
    icon: GameObjects.Image | GameObjects.Shader | null;
    slot: GameObjects.Image | GameObjects.Shader;
    fish: IFish
    selected: GameObjects.Rectangle
    delete: Button | null
    static slotWidth = 32
    static slotHeight = 32

    constructor(scene: Scene) {

        this.slot = new GameObjects.Image(scene, 0, 0, UI.inventorySlot)
        this.slot.setOrigin(0, 0)
        this.slot.setInteractive()
        this.slot.on("pointerdown", (p: Input.Pointer) => {
            if (SUI.trading) {
                GameNetManager.selectFish(this.fish, SUI.tradeWindow.host, SUI.tradeWindow.guest)

                if (this.icon && !SUI.tradeWindow.locked) {

                    if (InventoryUI.selectedSlot)
                        InventoryUI.selectedSlot.selected.visible = false

                    InventoryUI.selectedSlot = this
                    //SUI.tradeWindow.mainPlayerSlot.setFish(this.fish)
                    this.selected.visible = true
                }
            }
            else {
                if (p.button == 2 && this.icon) {
                    if (InventoryUI.selectedSlot) {
                        InventoryUI.selectedSlot.selected.visible = false;
                        (InventoryUI.selectedSlot.delete as Button).destroyButton()
                    }

                    InventoryUI.selectedSlot = this
                    this.selected.visible = true
                    this.createDeleteOption()
                }
            }
        })

        this.selected = new GameObjects.Rectangle(scene, 0, 0, this.slot.width, this.slot.height, 0x000000, 0)
        this.selected.setOrigin(0, 0)
        this.selected.setStrokeStyle(1, 0xfff300)
        this.selected.visible = false

    }

    addFish(fishData: IFish) {
        this.fish = fishData
        this.icon?.destroy()
        this.icon = new GameObjects.Image(this.slot.scene, this.slot.x, this.slot.y, GENERAL.loot, fishData.asset)
        this.icon.setOrigin(0, 0)
        this.slot.parentContainer.add(this.icon)
    }

    createDeleteOption() {
        this.delete = new Button(this.slot.scene, (p: Input.Pointer, x: number, y: number, event: Phaser.Types.Input.EventData) => {
            if (p.button == 0) {
                this.delete?.click()
                GameNetManager.deleteFish(this.fish)
            }
        }, 1, WOOD_BUTTON.fill, WOOD_BUTTON.stroke, 1, 0, 0, 40, 10, 5, "DELETE", this, true)
        this.slot.parentContainer.add([this.delete, this.delete.text])
        this.delete.setOrigin(0.5, 0.5)
        this.delete.changePosition(this.icon!.x + 16, this.icon!.y + 16)
    }

    deleteFish() {
        this.icon?.destroy()
        this.selected.visible = false
        this.delete?.destroyButton()
    }
}