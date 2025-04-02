import { MapSchema, Schema, type } from "@colyseus/schema";
import { SCharacter } from "./characters/SCharacter";

export class MyRoomState extends Schema {
    @type({map: SCharacter}) characters = new MapSchema<SCharacter, string>();
}
