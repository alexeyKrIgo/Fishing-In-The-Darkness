import { Character } from "../objects/Character"
import { MyRoom } from "../rooms/MyRoom"
import { getRandomInt } from "../utils/Maths"

export class World{
    characters: Map<string, Character>

    constructor(){
        this.characters = new Map<string, Character>()
    }

    startFish(room: MyRoom, id:string){
        const fishingInterval = setInterval(()=>{
            if(getRandomInt(1,100) <= 10){
                room.broadcast("bf", id)
                clearInterval(fishingInterval)
            }
        }, 350)
    }
}