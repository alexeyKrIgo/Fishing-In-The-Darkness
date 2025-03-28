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
}