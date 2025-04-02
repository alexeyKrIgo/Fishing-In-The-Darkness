import { Schema, type } from "@colyseus/schema"

export class SVector2 extends Schema{
    @type("number") x: number;
    @type("number") y: number;
}