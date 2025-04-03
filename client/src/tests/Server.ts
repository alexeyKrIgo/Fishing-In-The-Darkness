import { GameNetManager } from "../managers/GameNetManager";

export class Server{
    fishingInterval: number
    
    getRandomInt(min:number, max:number):number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    fish(){
        this.fishingInterval = setInterval(()=>{
            if(this.getRandomInt(1,100) <= 10){
                clearInterval(this.fishingInterval)
            }
        }, 350)
    }

    sendFish(){

    }
}