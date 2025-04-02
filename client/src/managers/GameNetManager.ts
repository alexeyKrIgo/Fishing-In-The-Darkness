import { IFish } from "../interfaces/Fish";
import { Fish } from "../objects/Fish";
import { Game } from "../scenes/Game";
import { Server } from "../tests/Server";

export class GameNetManager{
    static server = new Server()
    static scene: Game

    static sendFish(){
        this.server.fish()
    }

    static receivedBait(){
        this.scene!.character.tryCatchFish()
    }

    static receivedFish(fish: IFish){
        const fishObject = new Fish(this.scene, this.scene.character.x, this.scene.character.y, fish)
        fishObject.setTween(this.scene.character.x, this.scene.character.y)
    }
}