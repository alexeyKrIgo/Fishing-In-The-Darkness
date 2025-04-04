import { Client } from "colyseus"
import { Character } from "../objects/Character"
import { MyRoom } from "../rooms/MyRoom"
import { getRandomInt } from "../utils/Maths"
import { GameNetManager } from "../managers/GameNetManager"

export class World{
    characters: Map<string, Character>

    constructor(){
        this.characters = new Map<string, Character>()
    }

    startFish(room: MyRoom, client:Client){
        this.characters.get(client.sessionId)?.fish()
        const fishingInterval = setInterval(()=>{
            if(getRandomInt(1,100) <= 1){
                GameNetManager.sendBait(client)
                clearInterval(fishingInterval)
            }
        }, 350)
    }
}