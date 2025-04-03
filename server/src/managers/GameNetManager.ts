import { Vector2 } from "../interfaces/Vector2";
import { MyRoom } from "../rooms/MyRoom";
import { World } from "../worlds/World";

export class GameNetManager {
    static room: MyRoom

    static setCommands(room: MyRoom, world: World) {
        this.room = room
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
            world.startFish(this.room, client.sessionId)
        })
    }

    static sendBait(id:string){

    }
}