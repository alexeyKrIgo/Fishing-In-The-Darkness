import { MapSchema, Schema, type } from "@colyseus/schema";
import { SFish } from "./SFish";

export class SInventory extends Schema {
    @type({map: SFish}) fishes = new MapSchema<SFish, string>();
}