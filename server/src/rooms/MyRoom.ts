import { Room, Client } from "@colyseus/core";
import { MyRoomState } from "./schema/MyRoomState";
import { Player } from "../interfaces/Player";
import { World } from "../worlds/World";
import { Character } from "../objects/Character";
import { JWT } from "@colyseus/auth";
import { GameNetManager } from "../managers/GameNetManager";
import { DB } from "../db/DB";
import { SInventory } from "../schemas/inventory/SInventory";
import { SFish } from "../schemas/inventory/SFish";
import { Fish } from "../interfaces/Fish";

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

    async onCreate(options: any) {
        this.autoDispose = false;
        this.patchRate = 50
        this.world = new World()
        GameNetManager.setCommands(this, this.world)
        await DB.connect()
        this.setSimulationInterval((delta)=>{
            this.world.characters.forEach(c => c.update(delta, 176))
        })
    }

    async onJoin(client: Client, options: any) {

        //Generates inventory
        const inventoryDB = client.auth.inventory
        
        //this.state.inventories.set(client.auth._id, inventory)

        //Populate inventory with fishes
        const fishes = await DB.getInventory(client.auth._id)
        const savedFishes: Fish[] = []
        fishes.forEach(f => {
            const sfish = new SFish()
            sfish.owner = f.owner.toString()
            sfish.row = f.row
            sfish.column = f.column
            savedFishes.push({owner: f.owner.toString(), row: f.row, column: f.column, asset: f.asset, saved: true})
        })

        //generates character
        const character = new Character(this, client.sessionId, inventoryDB, savedFishes)
        this.world.addCharacter(client, character)
        this.state.characters.set(client.sessionId, character.schema)

        console.log(client.sessionId, "joined!");

        GameNetManager.sendInventory(client, savedFishes)
    }

    onLeave(client: Client, consented: boolean) {

        //Save captured fishes in the database
        const character = this.world.characters.get(client.sessionId)
        DB.saveInventory(character.inventory.toSaveFishes)

        //Delete character from room's state and world
        this.state.characters.delete(client.sessionId)
        this.world.characters.delete(client.sessionId)
        console.log(client.sessionId, "left!");
    }

    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }
}
