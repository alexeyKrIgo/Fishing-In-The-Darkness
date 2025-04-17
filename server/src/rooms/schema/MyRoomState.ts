import { MapSchema, Schema, type } from "@colyseus/schema";
import { SCharacter } from "../../schemas/characters/SCharacter";

export class MyRoomState extends Schema {
    @type({map: SCharacter}) characters = new MapSchema<SCharacter, string>();
}
