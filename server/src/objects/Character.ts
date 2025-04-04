import { ICharacterStates } from "../interfaces/Character";
import { Vector2 } from "../interfaces/Vector2";
import { MyRoom } from "../rooms/MyRoom";
import { SCharacter } from "../schemas/characters/SCharacter";
import { getRandomInt } from "../utils/Maths";

export class Character{
    schema: SCharacter
    x: number
    y: number
    direction: Vector2

    states: ICharacterStates
    speed = 0.035; 

    constructor(room: MyRoom, sessionId: string){

        //Sets position
        this.x = getRandomInt(100, 200)
        this.y = getRandomInt(100, 120)

        //Sets direction
        this.direction= {x: 0, y: 1}

        //Sets states
        this.states={idle: true, fishing: false, tryingCatchFish: false}

        //Generates schema
        this.generateSchema(sessionId, room)
    }

    generateSchema(sessionId: string, room: MyRoom){
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

        //Asigns schema to object and room
        this.schema = characterSchema
        room.state.characters.set(sessionId, characterSchema)
    }

    update(delta: number, seaLimit: number){
        if(!this.states.idle && !this.schema.states.fishing){
            if(this.schema.y + this.speed*this.direction.y*delta < seaLimit){
                this.schema.x += this.speed*this.direction.x*delta
                this.schema.y += this.speed*this.direction.y*delta
            }
            // this.speed = 40;
            // this.x += this.speed*this.direction.x*delta/1000
            // this.y += this.speed*this.direction.y*delta/1000
        }
    }

    move(direction: Vector2){

        //Change state
        this.states.idle = false;
        this.schema.states.idle = this.states.idle

        //Change direction
        this.direction = direction
        this.schema.direction.x = this.direction.x
        this.schema.direction.y = this.direction.y
    }

    stopMove(){
        this.states.idle = true;
        this.schema.states.idle = this.states.idle;
    }

    //Cast fish rod
    fish(){
        this.states.idle = false
        this.schema.states.idle = false
        this.schema.states.fishing = true
        console.log("started fishing")
    }

    //Try to catch fish state start
    tryCatchFish(){
        this.schema.states.tryingCatchFish = true
    }


    catchFish(){
        this.states.idle = true
        this.schema.states.idle = true
        this.schema.states.tryingCatchFish = false
    }
}