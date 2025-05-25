import { GameObjects, Input, Scene } from "phaser";
import { Character } from "../../objects/Character";
import { TradeSlot } from "./TradeSlot";
import { Button } from "../buttons/Button";
import { GameNetManager } from "../../managers/GameNetManager";
import { Vector2 } from "../../interfaces/Vector2";
import { WOOD_BUTTON } from "../../utils/Colors";
import { InventoryUI } from "../inventory/InventoryUI";

export class TradeWindow extends GameObjects.Container {
    host: Character
    hostLocked = false
    guest: Character
    guestLocked = false

    mainNickname: GameObjects.Text
    otherNickname: GameObjects.Text

    mainPlayerSlot: TradeSlot
    mainPlayerSlotPosition: Vector2 = { x: -30, y: 0 }
    otherPlayerSlot: TradeSlot
    otherPlayerSlotPosition: Vector2 = { x: 70, y: 0 }

    locked = false
    lockButton: Button
    lockButtonX = -55
    lockButtonY = 30

    acceptButton: Button
    accpetButtonX = this.lockButtonX
    acceptButtonY = 55


    constructor(scene: Scene, x: number, y: number, scale: number, host: Character, guest: Character) {
        super(scene, x, y)
        this.host = host
        this.guest = guest
        this.scale = scale
        scene.add.existing(this)

        //Items sots instantiation
        this.mainPlayerSlot = new TradeSlot(scene)
        this.mainPlayerSlot.slot.setPosition(this.mainPlayerSlotPosition.x, this.mainPlayerSlotPosition.y)
        this.mainPlayerSlot.slot.setOrigin(0.5, 0.5)
        this.otherPlayerSlot = new TradeSlot(scene)
        this.otherPlayerSlot.slot.setPosition(this.otherPlayerSlotPosition.x, this.otherPlayerSlotPosition.y)
        this.otherPlayerSlot.slot.setOrigin(0.5, 0.5)

        //Players nicknames instantiation
        this.mainNickname = new GameObjects.Text(scene, this.mainPlayerSlotPosition.x, this.mainPlayerSlotPosition.y - 30,
            GameNetManager.mainPlayer.character.nickname.text, { fontFamily: 'InTheDarkness', fontSize: 5, resolution: 10 })
        this.mainNickname.setOrigin(0.5, 0.5)
        this.otherNickname = new GameObjects.Text(scene, this.otherPlayerSlotPosition.x, this.otherPlayerSlotPosition.y - 30,
            host == GameNetManager.mainPlayer.character ? guest.nickname.text : host.nickname.text,
            { fontFamily: 'InTheDarkness', fontSize: 5, resolution: 10 }
        )
        this.otherNickname.setOrigin(0.5, 0.5);

        //(this.mainPlayerSlot.slot as GameObjects.Image).setTint(0x5a5a5a)

        //Buttons Generation
        this.lockButton = new Button(scene, (p: Input.Pointer, x: number, y: number, event: Phaser.Types.Input.EventData) => {
            if (!this.locked && InventoryUI.selectedSlot) {
                GameNetManager.lockFish(this.host, this.guest)

                //Enable accept button
                /*this.acceptButton.changeBrightness(1)
                this.acceptButton.text.clearTint()
                this.acceptButton.locked = false*/
            }
            event.stopPropagation()
        }, 1, WOOD_BUTTON.fill, WOOD_BUTTON.stroke, 1, this.lockButtonX, this.lockButtonY, 50, 10, 5, "LOCK", this, true)

        this.acceptButton = new Button(scene, (p: Input.Pointer, x: number, y: number, event: Phaser.Types.Input.EventData) => {
            if (this.locked) {
                this.acceptButton.click()
                GameNetManager.finishTrade(this.host, this.guest)
            }
            event.stopPropagation()
        }, 0.6, WOOD_BUTTON.fill, WOOD_BUTTON.stroke, 1, this.accpetButtonX, this.acceptButtonY, 53, 12, 7, "TRADE", this, true)
        this.acceptButton.text.setTint(0x5a5a5a)
        this.acceptButton.locked = true

        this.add([this.mainPlayerSlot.slot, this.otherPlayerSlot.slot,
        this.mainNickname, this.otherNickname, this.lockButton, this.lockButton.text, this.acceptButton, this.acceptButton.text])
    }

    lockLockButton() {
        this.locked = true
        this.lockButton.locked = true
        this.lockButton.changeBrightness(0.6);
        this.lockButton.text.setTint(0x5a5a5a);
    }

    lockSlot(sessionId: string) {
        if (sessionId == GameNetManager.room.sessionId) {
            (this.mainPlayerSlot.slot as GameObjects.Image).setTint(0x5a5a5a);
            (this.mainPlayerSlot.icon as GameObjects.Image).setTint(0x5a5a5a)
            this.locked = true
        }
        else {
            (this.otherPlayerSlot.slot as GameObjects.Image).setTint(0x5a5a5a);
            (this.otherPlayerSlot.icon as GameObjects.Image).setTint(0x5a5a5a)
        }

        if (this.host.sessionId == sessionId) {
            this.hostLocked = true
        }
        else if (this.guest.sessionId == sessionId) {
            this.guestLocked = true
        }

        //Activate the acceptButton button
        if (this.guestLocked && this.hostLocked) {
            this.acceptButton.changeBrightness(1)
            this.acceptButton.text.clearTint()
            this.acceptButton.locked = false
        }
    }
}