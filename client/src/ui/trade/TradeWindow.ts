import { GameObjects, Scene } from "phaser";
import { Character } from "../../objects/Character";
import { TradeSlot } from "./TradeSlot";
import { Button } from "../buttons/Button";

export class TradeWindow extends GameObjects.Container{
    host: Character
    mainNickname: GameObjects.Text
    otherNickname: GameObjects.Text
    mainPlayerSlot: TradeSlot
    otherPlayerSlot: TradeSlot
    lockButton: Button
    acceptButton: Button

    constructor(scene:Scene, x:number, y: number, scale:number, host:Character){
        super(scene, x, y)
        this.host = host
        this.scale = scale
        scene.add.existing(this)

        this.mainPlayerSlot = new TradeSlot(scene)
        this.mainPlayerSlot.slot.setPosition(-50,0)
        this.otherPlayerSlot = new TradeSlot(scene)
        this.otherPlayerSlot.slot.setPosition(50, 0)

        this.add ([this.mainPlayerSlot.slot, this.otherPlayerSlot.slot])
    }
}