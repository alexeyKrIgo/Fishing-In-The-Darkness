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

        //Receive invitation to trade
        this.room.onMessage(WB_COMMANDS.inviteTrade, (client, sessionId:string)=>{
            const hostCharacter = this.world.characters.get(client.sessionId)
            const guestCharacter = this.world.characters.get(sessionId)

            if(hostCharacter && !hostCharacter.trading && guestCharacter && !guestCharacter.trading){
                hostCharacter.trade = new TradeInstance(hostCharacter, guestCharacter)
                const guestClient = room.clients.find(c =>c.sessionId == sessionId)
                guestClient?.send(WB_COMMANDS.inviteTrade, client.sessionId)
            }
        })

        //Invitation accepted
        this.room.onMessage(WB_COMMANDS.acceptTrade, (client, sessionId: string)=>{
            const host = this.world.characters.get(sessionId)
            const guest = this.world.characters.get(client.sessionId)
            if(guest == host.trade.guest){
                host.trading = true
                guest.trading = true
                const hostClient = room.clients.find(c =>c.sessionId == sessionId)
                hostClient?.send(WB_COMMANDS.acceptTrade, {host: sessionId, guest: client.sessionId})
                client.send(WB_COMMANDS.acceptTrade, {host: sessionId, guest: client.sessionId})
            }
        })

        //SelectFish
        this.room.onMessage(WB_COMMANDS.selectFish, (client, data:{fish:Fish, hostId:string, clientId:string})=>{
            const host = this.world.characters.get(data.hostId)
            const character = this.world.characters.get(client.sessionId)
            console.log(data.hostId)
            if(host){
                //For host
                if(character == host.trade.host){
                    host.trade.hostItem = data.fish
                    const guestClient = room.clients.find(c =>c.sessionId == data.clientId)
                    client.send(WB_COMMANDS.selectFish, {fish: data.fish, sessionId: data.hostId})
                    guestClient.send(WB_COMMANDS.selectFish, {fish: data.fish, sessionId: data.hostId})
                }
                //For guest
                else if(character == host.trade.guest){
                    host.trade.guestItem = data.fish
                    const hostClient = room.clients.find(c =>c.sessionId == data.hostId)
                    client.send(WB_COMMANDS.selectFish, {fish: data.fish, sessionId: data.clientId})
                    hostClient.send(WB_COMMANDS.selectFish, {fish: data.fish, sessionId: data.clientId})
                }
            }
        })

        //LockFish
        this.room.onMessage(WB_COMMANDS.lockFish, (client, data:{guest: string, host:string})=>{
            const guest = this.world.characters.get(data.guest)
            const host = this.world.characters.get(data.host)
            const hostClient = room.clients.find(c =>c.sessionId == data.host)
            const guestClient = room.clients.find(c=> c.sessionId == data.guest)

            if(client.sessionId = data.host){
                host.trade.hostLocked = true
                hostClient.send(WB_COMMANDS.lockFish, data.host)
                guestClient.send(WB_COMMANDS.lockFish, data.host)
            }
            else if (client.sessionId = data.guest){
                host.trade.guestLocked = true
                 hostClient.send(WB_COMMANDS.lockFish, data.guest)
                guestClient.send(WB_COMMANDS.lockFish, data.guest)
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