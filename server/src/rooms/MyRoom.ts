import { Room, Client } from "@colyseus/core";
import { MyRoomState } from "./schema/MyRoomState";
import { Player } from "../interfaces/Player";
import { World } from "../worlds/World";
import { SCharacter } from "../schemas/characters/SCharacter";
import { getRandomInt } from "../utils/Maths";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;
  state = new MyRoomState();
  players: Player[]
  world: World

  onCreate (options: any) {
    this.autoDispose = false;
    this.world = new World()
    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });
  }

  onJoin (client: Client, options: any) {
    const characterSchema = new SCharacter();
    characterSchema.position.x = getRandomInt(100,200)
    characterSchema.position.y = getRandomInt(100,120)
    characterSchema.direction.x = 0
    characterSchema.direction.y = 1
    characterSchema.states.fishing=false;
    characterSchema.states.idle = true;
    characterSchema.states.tryingCatchFish = false
    this.state.characters.set(client.sessionId, characterSchema)
    console.log(client.sessionId, "joined!");
  }

  onLeave (client: Client, consented: boolean) {
    this.state.characters.delete(client.sessionId)
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
