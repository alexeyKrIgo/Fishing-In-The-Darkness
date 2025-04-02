import { Schema, type } from "@colyseus/schema"

export class SCharacterStates extends Schema{
    @type("string") idle: boolean
    @type("string") fishing: boolean
    @type("string") tryingCatchFish: boolean
}