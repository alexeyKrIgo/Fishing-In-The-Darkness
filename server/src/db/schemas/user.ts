import mongoose from "mongoose";

const inventoryScehma = new mongoose.Schema({size: {type: Number}, full: Boolean})
const userschema = new mongoose.Schema({nickname:{type:String, required:true}, email: {type:String, required: true}, password: {type: String, required: true}, inventory: inventoryScehma})

export const User = mongoose.model("User", userschema)