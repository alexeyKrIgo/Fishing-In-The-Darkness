import { Schema, type } from "@colyseus/schema"
import { SVector2 } from "../SVector2"
import { SCharacterStates } from "./SCharacterStates";

export class SCharacter extends Schema{
    @type("number") x: number;
    @type("number") y: number
    @type(SVector2) direction = new SVector2()
    @type(SCharacterStates) states = new SCharacterStates();
    @type("string") nickName: string
}