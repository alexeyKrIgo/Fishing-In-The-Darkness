import { DB } from "../db/DB";
import { Fish } from "../interfaces/Fish";
import { Character } from "../objects/Character";

export class TradeInstance {
    host: Character
    guest: Character
    hostItem: Fish
    hostAccepted = false
    guestItem: Fish
    guestAccepted = false

    constructor(host: Character, guest: Character) {
        this.guest = guest
    }

    lockHost(fish: Fish) {
        this.hostItem = fish
    }

    lockGuest(fish: Fish) {
        this.guestItem = fish
    }

    async makeTrade() {
        if (this.hostItem && this.hostAccepted && this.guestItem && this.guestAccepted) {
            try {
                await DB.tradeFishes(this.hostItem, this.guestItem)
                this.host.inventory.tradeFish(this.hostItem, this.guestItem)
                this.guest.inventory.tradeFish(this.guestItem, this.hostItem)
                return true
            }
            catch(error: any){
                throw new Error()
            }
        }
        else{
            return false
        }
    }
}