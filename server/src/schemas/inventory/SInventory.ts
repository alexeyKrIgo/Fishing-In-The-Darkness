import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema";
import { SFish } from "./SFish";

export class SInventory extends Schema {
    @type([SFish]) fishes = new ArraySchema<SFish>();
}