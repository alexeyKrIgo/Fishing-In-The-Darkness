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

export class GameNetManager{
    static mainPlayer = new Player()
    static server = new Server()
    static room: Room<MyRoomState>
    static scene: Game
    static colyseusSDK = new Client("http://localhost:2567");

    static async connect(){
        this.room = await this.colyseusSDK.join<MyRoomState>("my_room")
        const $ = getStateCallbacks(this.room)

        //Adds a new character to the game scene
        $(this.room.state).characters.onAdd((character:SCharacter, sessionId:string)=>{
            let characterObject = new Ghost(this.scene, GHOST.ghostIdle, character.position.x, character.position.y,
                new Math.Vector2(character.direction.x, character.direction.y), character.states
            )
            //Creates main player
            if(sessionId == this.room.sessionId){
                this.mainPlayer = new Player()
                this.mainPlayer.character = characterObject
                this.scene.createPlayer(characterObject)
            }
            this.scene.characters.set(sessionId, characterObject)
        })

        //Destroys a character if player disconects
        $(this.room.state).characters.onRemove((character: SCharacter, sessionId)=>{
            this.scene.events.once(Scenes.Events.POST_UPDATE, ()=>{
                const character = this.scene.characters.get(sessionId);
                this.scene.characters.delete(sessionId),
                character?.destroyCharacter()
            })
        })
    }

    static sendFish(){
        this.server.fish()
    }

    static receivedBait(){
        this.mainPlayer.character.tryCatchFish()
    }

    static receivedFish(fish: IFish){
        const fishObject = new Fish(this.scene, this.mainPlayer.character.x, this.mainPlayer.character.y, fish)
        fishObject.setTween(this.mainPlayer.character.x, this.mainPlayer.character.y)
    }
}