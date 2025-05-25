import { Client } from "colyseus"
import { Character } from "../objects/Character"
import { MyRoom } from "../rooms/MyRoom"
import { getRandomInt } from "../utils/Maths"
import { GameNetManager } from "../managers/GameNetManager"
import { Fish, StatsFish, ToLootFish } from "../interfaces/Fish"
import { GVFishes } from "../fishes/GraveYardFishes"
import crypto from "node:crypto"

export class World{
    characters: Map<string, Character>
    charactersLoot: Map<string, Map<string, ToLootFish>>
    pool: StatsFish[]

    constructor(){
        this.characters = new Map<string, Character>()
        this.charactersLoot = new Map<string, Map<string, ToLootFish>>()
        this.generatePool()
    }

    addCharacter(client: Client, character:Character){
        this.characters.set(client.sessionId, character)
        this.charactersLoot.set(client.sessionId, new Map<string, ToLootFish>)
    }

    startFish(room: MyRoom, client:Client){
        const character = this.characters.get(client.sessionId)
        if(!character.states.fishing){
            character?.fish(client.sessionId)
            const fishingInterval = setInterval(()=>{
                if(getRandomInt(1,100) <= 10){
                    const fish:ToLootFish = this.generateFish(client, character)
                    console.log(`${client.auth._id} bited ${fish.id} with asset ${fish.asset}`)
                    this.charactersLoot.get(client.sessionId)?.set(fish.id, fish)
                    GameNetManager.sendBait(client, fish)
                    clearInterval(fishingInterval)
                }
            }, 350)
        }
    }

    //Generates a general weighted pool from witch pick a random fish
    generatePool(){
        this.pool = []
        GVFishes.forEach(f =>{
            for(let i = 1; i <= f.weight; i++){
                this.pool.push(f)
            }
        })
    }

    generateFish(client:Client, character: Character): ToLootFish{
        const statsFish = this.pool[getRandomInt(0, this.pool.length - 1)]
        const id = crypto.randomBytes(16).toString('base64');
        return {id: id, owner: client.auth._id, asset: statsFish.asset}
    }

    async pickUpFish(client: Client, fishId: string){
        const character = this.characters.get(client.sessionId)
        const fish = this.charactersLoot.get(client.sessionId).get(fishId)!
        if(fish){
            const pickedFish = await character.pickUpFish(client.auth._id, fish)
            if(pickedFish){
                console.log(`${client.sessionId} got ${pickedFish.asset} at row: ${pickedFish.row} and column: ${pickedFish.column}`)
                GameNetManager.sendPickUpFish(fish, client)
                GameNetManager.sendPrivatePickUpFish(pickedFish, client)
                this.charactersLoot.get(client.sessionId).delete(fishId)
            }
        }
    }
}