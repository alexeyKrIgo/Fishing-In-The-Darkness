import mongoose from "mongoose";
import { User } from "./schemas/user";
import { Fish } from "./schemas/fish";
import { Fish as IFish} from "../interfaces/Fish";

export class DB{
    static async connect(){
        await mongoose.connect(process.env.DB_URL)
        console.log("Connected to database")
    }

    static async regiser(nickname: string, email: string, password: string){
        const user = new User({nickname: nickname, email: email, password: password, inventory: {size:3, full: false}})
        await user.save()
    }

    static async login(email: string){
        const user = await User.findOne({email: email})
        return user
    }

    static async getInventory(id: string){
        const fishes = await Fish.find({owner: id})
        return fishes
    }

    static async saveUnsavedFishes(fishes: IFish[]){
        const dbFishes: mongoose.Document<unknown, any, any>[] = []
        let owner = fishes[0].owner
        fishes.forEach(f =>{
            let fish = new Fish({owner: f.owner, row: f.row, column: f.column, asset: f.asset})
            dbFishes.push(fish)
        })
        try{
            await Fish.bulkSave(dbFishes)
        }
        catch(error: any){
            console.error(`Error while saving fishes for ${owner}: ` + error.message)
        }
    }

    static async tradeFishes(hostFish:IFish, guestFish:IFish){

        try{
            //Update host fish
            await Fish.findOneAndUpdate(
                {owner: guestFish.owner, row: guestFish.row, column: guestFish.column},
                {owner: hostFish.owner, row: hostFish.row, column: hostFish.column}
            )

            //Update guest fish
            await Fish.findOneAndUpdate(
                {owner: hostFish.owner, row: hostFish.row, column: hostFish.column},
                {owner: guestFish.owner, row: guestFish.row, column: guestFish.column}
            )
        }
        catch(error:any){
            console.error(`Error while trading between ${hostFish.owner} and ${guestFish.owner}: ` + error.message)
        }
    }
}