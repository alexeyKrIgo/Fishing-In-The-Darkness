import mongoose from "mongoose";
import { User } from "./schemas/user";

export class DB{
    static async connect(){
        await mongoose.connect(process.env.DB_URL)
        console.log("Connected to database")
    }

    static async regiser(email: string, password: string){
        const user = new User({email: email, password: password})
        await user.save()
    }

    static async login(email: string){
        const user = await User.findOne({email: email})
        return user
    }
}