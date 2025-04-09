import { Client } from "colyseus";
import { Vector2 } from "../interfaces/Vector2";
import { MyRoom } from "../rooms/MyRoom";
import { World } from "../worlds/World";

export class GameNetManager {
    static room: MyRoom
    static world: World

    static setCommands(room: MyRoom, world: World) {
        this.room = room
        this.world = world
        //Receive walking event
        this.room.onMessage("wk", (client, direction: Vector2) => {
            world.characters.get(client.sessionId).move(direction)
        })

        //Receive stop walking event
        this.room.onMessage("swk", (client) => {
            world.characters.get(client.sessionId).stopMove()
        })

        //Receive player starts fishing
        this.room.onMessage("f", (client)=>{
            this.room.broadcast("f", client.sessionId)
            world.startFish(this.room, client)
        })

        //Receive player got fish   
        this.room.onMessage("gf", (client)=>{
            this.sendGotFish(client)
        })
    }

    static sendBait(client: Client){
        this.world.characters.get(client.sessionId)?.tryCatchFish(client.sessionId)
        this.room.broadcast("bf", client.sessionId)
    }

    static sendGotFish(client: Client){
        this.room.broadcast("gf", client.sessionId)
        this.world.characters.get(client.sessionId)?.catchFish(client.sessionId)
    }
}