import { Schema, type } from "@colyseus/schema"

export class SCharacterStates extends Schema{
    @type("boolean") idle: boolean
    @type("boolean") fishing: boolean
    @type("boolean") tryingCatchFish: boolean
}