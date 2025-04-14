import { MapSchema, Schema, type } from "@colyseus/schema";
import { SCharacter } from "../../schemas/characters/SCharacter";
import { SInventory } from "../../schemas/inventory/SInventory";

export class MyRoomState extends Schema {
    @type({map: SCharacter}) characters = new MapSchema<SCharacter, string>();
    @type({map: SInventory}) inventories = new MapSchema<SInventory,string>();
}
