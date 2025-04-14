import mongoose, { Schema } from "mongoose";

const fishSchema = new mongoose.Schema({owner: {type: Schema.Types.ObjectId, ref: "User"}, row: {type: Number}, column: {type: Number}})

export const Fish = mongoose.model("Fish", fishSchema)