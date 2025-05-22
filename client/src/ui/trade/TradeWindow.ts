import { GameObjects, Scene } from "phaser";
import { Character } from "../../objects/Character";
import { TradeSlot } from "./TradeSlot";

export class TradeWindow extends GameObjects.Container{
    player: Character
    nickname: GameObjects.Text
    tradeSlot: TradeSlot
    

    constructor(scene:Scene, x:number, y: number, scale:number){
        super(scene, x, y)
        scene.add.existing(this)

        this.tradeSlot = new TradeSlot()
    }
}