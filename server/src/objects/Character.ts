import { ICharacterStates } from "../interfaces/Character";
import { Fish, ToLootFish } from "../interfaces/Fish";
import { Vector2 } from "../interfaces/Vector2";
import { Inventory } from "../inventory/Inventory";
import { MyRoom } from "../rooms/MyRoom";
import { SCharacter } from "../schemas/characters/SCharacter";
import { getRandomInt } from "../utils/Maths";
import { InventoryDB } from "../interfaces/Inventory";
import { TradeInstance } from "../trade/TradeInstance";
import { DB } from "../db/DB";

export class Character {
    dbId: string
    schema: SCharacter
    x: number
    y: number
    direction: Vector2

    states: ICharacterStates
    speed = 0.035;

    //Counts fishes baited to generate and unique id for them
    fishesCounter = 0
    inventory: Inventory

    trade: TradeInstance | null
    trading = false

    constructor(room: MyRoom, dbId: string, sessionId: string, inventoryDB: InventoryDB, fishes: Fish[], nickName: string) {

        //Sets position
        this.x = getRandomInt(100, 200)
        this.y = getRandomInt(100, 120)

        //Sets direction
        this.direction = { x: 0, y: 1 }

        //Sets states
        this.states = { idle: true, fishing: false, tryingCatchFish: false }

        this.inventory = new Inventory(inventoryDB.size, fishes)

        //Generates schema
        this.generateSchema(sessionId, nickName, room)
        this.dbId = dbId

        this.trade = null
    }

    generateSchema(sessionId: string, nickName: string, room: MyRoom) {
        const characterSchema = new SCharacter();

        //Sets schema position
        characterSchema.x = this.x
        characterSchema.y = this.y

        //Sets schema direction
        characterSchema.direction.x = this.direction.x
        characterSchema.direction.y = this.direction.y

        //Sets schema state
        characterSchema.states.fishing = false;
        characterSchema.states.idle = true;
        characterSchema.states.tryingCatchFish = false

        //Sets schema nickname
        characterSchema.nickName = nickName

        //Asigns schema to object and room
        this.schema = characterSchema
        room.state.characters.set(sessionId, characterSchema)
    }

    update(delta: number, seaLimit: number) {
        if (!this.states.idle && !this.schema.states.fishing) {
            if (this.schema.y + this.speed * this.direction.y * delta < seaLimit) {
                this.schema.x += this.speed * this.direction.x * delta
                this.schema.y += this.speed * this.direction.y * delta
            }
            // this.speed = 40;
            // this.x += this.speed*this.direction.x*delta/1000
            // this.y += this.speed*this.direction.y*delta/1000
        }
    }

    move(direction: Vector2) {

        //Change state
        this.states.idle = false;
        this.schema.states.idle = this.states.idle

        //Change direction
        this.direction = direction
        this.schema.direction.x = this.direction.x
        this.schema.direction.y = this.direction.y
    }

    stopMove() {
        this.states.idle = true;
        this.schema.states.idle = this.states.idle;
    }

    //Cast fish rod
    fish(id: string) {
        this.states.idle = false
        this.schema.states.idle = false

        this.states.fishing = true
        this.schema.states.fishing = true
        console.log(`${id} started fishing`)
    }

    //Try to catch fish state start
    tryCatchFish(id: string) {
        this.states.tryingCatchFish = true
        this.schema.states.tryingCatchFish = true
        console.log(`${id} trying to catch the fish`)
    }

    catchFish(id: string) {
        this.states.idle = true
        this.schema.states.idle = true

        this.states.tryingCatchFish = false
        this.schema.states.tryingCatchFish = false

        this.states.fishing = false
        this.schema.states.fishing = false
    }

    async pickUpFish(owner: string, toSaveFish: ToLootFish) {
        let fish: Fish | null = null
        try {
            for (let row = 0; row < this.inventory.size; row++) {
                let slotIndex = this.inventory.inventorySlots[row].findIndex(slot => !slot)
                if (slotIndex !== -1) {
                    fish = {_id:undefined, owner: owner, row: row, column: slotIndex, asset: toSaveFish.asset, saved: true }
                    const id = await DB.saveFish(fish)
                    fish._id = id.toString()
                    this.inventory.inventorySlots[row][slotIndex] = fish
                    this.inventory.toSaveFishes.push(fish)
                    return fish
                }
            }
            return null
        }
        catch(error:any){
            console.log("Error while saving picked fish: " + error.message)
            return null
        }
    }
}