import { Room, Client } from "@colyseus/core";
import { MyRoomState } from "./schema/MyRoomState";
import { Player } from "../interfaces/Player";
import { World } from "../worlds/World";
import { Character } from "../objects/Character";
import { JWT } from "@colyseus/auth";
import { GameNetManager } from "../managers/GameNetManager";

export class MyRoom extends Room<MyRoomState> {
    maxClients = 4;
    state = new MyRoomState();
    players: Player[]
    world: World

    static async onAuth (client:any, options:any, context:any) {
        if(context.token == "mypassword"){
            return true
        }
        // validate the token
        const userdata = await JWT.verify(context.token);
 
        // return userdata
        return userdata;
    }

    onCreate(options: any) {
        this.autoDispose = false;
        this.patchRate = 50
        this.world = new World()
        GameNetManager.setCommands(this, this.world)

        this.setSimulationInterval((delta)=>{
            this.world.characters.forEach(c => c.update(delta, 176))
        })
    }

    onJoin(client: Client, options: any) {
        //this.generateCharacter(client.sessionId)
        const character = new Character(this, client.sessionId)
        this.world.characters.set(client.sessionId, character)
        this.state.characters.set(client.sessionId, character.schema)
        console.log(client.sessionId, "joined!");
    }

    onLeave(client: Client, consented: boolean) {

        //Delete character from room's state and world
        this.state.characters.delete(client.sessionId)
        this.world.characters.delete(client.sessionId)
        console.log(client.sessionId, "left!");
    }

    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }
}
