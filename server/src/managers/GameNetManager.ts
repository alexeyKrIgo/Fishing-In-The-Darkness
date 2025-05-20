import { Client } from "colyseus";
import { Vector2 } from "../interfaces/Vector2";
import { MyRoom } from "../rooms/MyRoom";
import { World } from "../worlds/World";
import { Fish, ToLootFish } from "../interfaces/Fish";
import { getRandomInt } from "../utils/Maths";
import { WB_COMMANDS } from "../utils/WSCommands";
import { TradeInstance } from "../trade/TradeInstance";

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
        this.room.onMessage("gf", (client, fish:ToLootFish)=>{
            this.sendGotFish(client, fish)
        })

        this.room.onMessage("pf", (client, data: ToLootFish)=>{
            this.world.pickUpFish(client, data.id)
        })

        //Receive players message
        this.room.onMessage("msg", (client, message: string)=>{
            console.log(message)
            this.room.broadcast("msg", {id: client.sessionId, message: `${world.characters.get(client.sessionId)!.schema.nickName}: ${message}`})
        })

        this.room.onMessage(WB_COMMANDS.inviteTrade, (client, sessionId:string)=>{
            const hostCharacter = this.world.characters.get(client.sessionId)
            const guestCharacter = this.world.characters.get(sessionId)

            if(hostCharacter && !hostCharacter.trading && guestCharacter && !guestCharacter.trading){
                hostCharacter.trade = new TradeInstance(hostCharacter, guestCharacter)
                const guestClient = room.clients.find(c =>c.sessionId == sessionId)
                guestClient?.send(WB_COMMANDS.inviteTrade, client.sessionId)
            }
        })
    }

    static sendInventory(client: Client, fishes: Fish[]){
        client.send("ivy", fishes)
    }

    static sendBait(client: Client, fish:ToLootFish){
        this.world.characters.get(client.sessionId)?.tryCatchFish(client.sessionId)
        this.room.broadcast("bf", {id: client.sessionId, fish: fish})
    }

    static sendGotFish(client: Client, fish: ToLootFish){
        const character = this.world.characters.get(client.sessionId)
        this.room.broadcast("gf", {client:client.sessionId, fish: fish, xOffset: getRandomInt(-50, 50), yOffset: getRandomInt(50, 100)})
        character?.catchFish(client.sessionId)
    }

    static sendPickUpFish(toLootFish: ToLootFish, client:Client){
        this.room.broadcast("pf", {client:client.sessionId, toLootFish: toLootFish})
    }

    static sendPrivatePickUpFish(fish: Fish, client: Client){
        client.send("ppf", fish)
    }
}