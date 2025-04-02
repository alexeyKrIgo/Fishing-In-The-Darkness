import { Schema, type } from "@colyseus/schema"
import { SVector2 } from "../SVector2"
import { SCharacterStates } from "./SCharacterStates";

export class SCharacter extends Schema{
    @type(SVector2) position = new SVector2();
    @type(SVector2) direction = new SVector2()
    @type(SCharacterStates) states = new SCharacterStates();
}