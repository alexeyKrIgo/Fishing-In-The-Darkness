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

    static async saveFish(fish:IFish){
        try{
            let dbFish = new Fish({owner: fish.owner, row: fish.row, column: fish.column, asset: fish.asset})
            const returnFish = await dbFish.save()
            return returnFish._id
        }
        catch(error:any){
            throw new Error(error.message)
        }
    }

    static async deleteFish(fish: IFish){
        try{
            const result = await Fish.findOneAndDelete({owner: fish.owner, row: fish.row, column: fish.column, asset: fish.asset})
            if(result){
                return fish
            }
            else{
                return null
            }
        }
        catch(error: any){
            throw new Error("Error while deleting fish: " + error.message)
        }
        //ADD DELETE ALSO IN THE BACKEND INVENTORY OBJECT
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
                {_id: guestFish._id},
                {owner: hostFish.owner, row: hostFish.row, column: hostFish.column}
            )

            //Update guest fish
            await Fish.findOneAndUpdate(
                {_id: hostFish._id},
                {owner: guestFish.owner, row: guestFish.row, column: guestFish.column}
            )
        }
        catch(error:any){
            console.error(`Error while trading between ${hostFish.owner} and ${guestFish.owner}: ` + error.message)
            throw new Error()
        }
    }
}