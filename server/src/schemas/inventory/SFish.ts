import { Schema, type } from "@colyseus/schema"

export class SFish extends Schema{
    @type("string") owner: string
    @type("number") row: number
    @type("number") column: number
}