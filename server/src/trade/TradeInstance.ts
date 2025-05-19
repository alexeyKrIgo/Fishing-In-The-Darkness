import { DB } from "../db/DB";
import { Fish } from "../interfaces/Fish";
import { Character } from "../objects/Character";

export class TradeInstance{
    host: Character
    guest: Character
    hostItem: Fish
    guestItem: Fish

    constructor(host: Character, guest: Character){
        this.guest = guest
    }

    lockHost(fish:Fish){
        this.hostItem = fish
    }

    lockGuest(fish: Fish){
        this.guestItem = fish
    }

    async makeTrade(){
        if(this.hostItem && this.guestItem){
            DB.tradeFishes(this.hostItem, this.guestItem).then(()=>{
                this.host.inventory.tradeFish(this.hostItem, this.guestItem)
                this.guest.inventory.tradeFish(this.guestItem, this.hostItem)
            })
        }
    }
}