import { Room, Client } from "@colyseus/core";
import { MyRoomState } from "./schema/MyRoomState";
import { Player } from "../interfaces/Player";
import { World } from "../worlds/World";
import { SCharacter } from "../schemas/characters/SCharacter";
import { getRandomInt } from "../utils/Maths";
import { Character } from "../objects/Character";

export class MyRoom extends Room<MyRoomState> {
    maxClients = 4;
    state = new MyRoomState();
    players: Player[]
    world: World

    onCreate(options: any) {
        this.autoDispose = false;
        this.world = new World()

        this.setSimulationInterval((delta)=>{
            this
        })
    }

    onJoin(client: Client, options: any) {
        //this.generateCharacter(client.sessionId)
        console.log(client.sessionId, "joined!");
        new Character(this, client.sessionId)
    }

    onLeave(client: Client, consented: boolean) {
        this.state.characters.delete(client.sessionId)
        console.log(client.sessionId, "left!");
    }

    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }
}
