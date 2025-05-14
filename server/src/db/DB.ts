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

    static async saveInventory(fishes: IFish[]){
        fishes.forEach(f =>{
            let fish = new Fish({owner: f.owner, row: f.row, column: f.column, asset: f.asset})
            fish.save()
        })
    }
}