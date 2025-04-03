import { Client, Room, getStateCallbacks } from "colyseus.js";
import { IFish } from "../interfaces/Fish";
import { Fish } from "../objects/Fish";
import { Game } from "../scenes/Game";
import { Server } from "../tests/Server";
import { MyRoomState } from "../schemas/MyRoomState";
import { SCharacter } from "../schemas/characters/SCharacter";
import { Player } from "../classes/Player";
import { GHOST } from "../utils/AssetsGlobals";
import { Math, Scenes } from "phaser";
import { Ghost } from "../objects/Ghost";
import { Vector2 } from "../interfaces/Vector2";

export class GameNetManager{
    static mainPlayer = new Player()
    static server = new Server()
    static room: Room<MyRoomState>
    static scene: Game
    static colyseusSDK = new Client("http://localhost:2567");
    static blocked = false

    static async connect(){
        this.room = await this.colyseusSDK.join<MyRoomState>("my_room")
        const $ = getStateCallbacks(this.room)

        //Adds a new character to the game scene
        $(this.room.state).characters.onAdd((character:SCharacter, sessionId:string)=>{
            let characterObject = new Ghost(this.scene, GHOST.ghostIdle, character.x, character.y,
                new Math.Vector2(character.direction.x, character.direction.y), character.states
            )
            //Creates main player
            if(sessionId == this.room.sessionId){
                this.mainPlayer = new Player()
                this.mainPlayer.character = characterObject
                this.scene.createPlayer(characterObject)
            }
            this.scene.characters.set(sessionId, characterObject)

            //Position sync
            $(character).onChange(()=>{
                if(sessionId != this.room.sessionId){
                    characterObject.x = character.x
                    characterObject.y = character.y
                    characterObject.direction = new Math.Vector2(character.direction.x, character.direction.y)
                }
                else{
                    const distance = new Math.Vector2(characterObject.x, characterObject.y).distance({x: character.x, y: character.y})
                    if(distance > 50){
                        characterObject.x = character.x
                        characterObject.y = character.y
                    }
                }
            })
        })

        //Destroys a character if player disconects
        $(this.room.state).characters.onRemove((character: SCharacter, sessionId)=>{
            this.scene.events.once(Scenes.Events.POST_UPDATE, ()=>{
                const character = this.scene.characters.get(sessionId);
                this.scene.characters.delete(sessionId),
                character?.destroyCharacter()
            })
        })
        
        //this.setCommands()
    }

    /*private static setCommands(){
        this.room.onMessage("wk", (data: {id:string, direction: Vector2})=>{
            this.receiveWalk(data.id, data.direction)
        })
    }*/

    /*private static receiveWalk(id: string, direction: Vector2){
        this.scene.characters.get(id)!.direction = new Math.Vector2(direction.x, direction.y)
    }*/

    static sendWalk(direction: Vector2){
        if(!this.blocked){
            this.room.send("wk", direction);
            this.blocked = true;
            this.scene.time.delayedCall(33, ()=>this.blocked=false)
        }
    }

    static sendStopWalk(){
        this.room.send("swk")
    }

    static sendFish(){
        this.server.fish()
    }

    static receivedBait(){
        this.mainPlayer.character.tryCatchFish()
    }

    static receivedFish(fish: IFish){
        const fishObject = new Fish(this.scene, this.mainPlayer.character.x, this.mainPlayer.character.y, fish)
        fishObject.GoUpTween(this.mainPlayer.character.x, this.mainPlayer.character.y)
    }
}