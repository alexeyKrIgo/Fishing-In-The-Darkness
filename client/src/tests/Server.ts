import { Character } from "../objects/Character";

export class Server{
    fishingInterval: number
    
    getRandomInt(min:number, max:number):number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    fish(character: Character){
        this.fishingInterval = setInterval(()=>{
            if(this.getRandomInt(1,100) <= 20){
                character.tryCatchFish()
                clearInterval(this.fishingInterval)
            }
        })
    }
}