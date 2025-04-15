import { Client, Room, getStateCallbacks } from "colyseus.js";
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
import { IFish, ToLootFish } from "../interfaces/Fish";
import { PickUp } from "../ui/actions/PickUp";
import { UI } from "../scenes/UI";

export class GameNetManager{
    static mainPlayer = new Player()
    static server = new Server()
    static room: Room<MyRoomState>
    static scene: Game
    static colyseusSDK = new Client("ws://localhost:2567");
    static blocked = false
    
    static async register(nickname: string, password: string){
        try {
            const userdata = await this.colyseusSDK.auth.registerWithEmailAndPassword(nickname, password);
            console.log(userdata);
         
        } catch (e:any) {
            console.error(e.message);
        }
    }

    static async login(nickname: string, password: string){
        try{
            const test = await this.colyseusSDK.auth.signInWithEmailAndPassword(nickname, password)
            console.log(test)
        }
        catch(e){
            return Promise.reject()
        }
    }

    static async connect(){
        console.log(this.colyseusSDK.auth.token)
        this.room = await this.colyseusSDK.join<MyRoomState>("my_room")
        const userData = await this.colyseusSDK.auth.getUserData()
        const $ = getStateCallbacks(this.room)

        //Adds a new character to the game scene
        $(this.room.state).characters.onAdd((character:SCharacter, sessionId:string)=>{
            let characterObject = new Ghost(this.scene, GHOST.ghostIdle, character.x, character.y,
                new Math.Vector2(character.direction.x, character.direction.y), character.states
            )
            //Creates main player
            if(sessionId == this.room.sessionId){
                this.mainPlayer = new Player()
                this.mainPlayer.id = userData.user._id
                this.mainPlayer.character = characterObject
                this.mainPlayer.character.pickUp = new PickUp(this.scene)
                this.scene.createPlayer(characterObject)
            }

            //Syn on join current states
            if(character.states.fishing){
                characterObject.states.idle=false
                characterObject.states.fishing = true
                characterObject.play({key: characterObject.animations.fishingIdle, repeat: -1})
                characterObject.fishingRod.play({key: characterObject.fishingRod.animations.idle, repeat: -1})
            }
            if(character.states.tryingCatchFish){
                characterObject.states.idle = false
                characterObject.states.fishing = true
                characterObject.states.tryingCatchFish = true
                characterObject.play({key: characterObject.animations.bait, repeat: -1})
                characterObject.fishingRod.play({key: characterObject.fishingRod.animations.bait, repeat: -1})
            }

            this.scene.characters.set(sessionId, characterObject)

            //Sync
            $(character).onChange(()=>{
                if(sessionId != this.room.sessionId){
                    let interpolationFactor = 0.7
                    //Position sync
                    characterObject.x = Math.Linear(characterObject.x, character.x, interpolationFactor)
                    characterObject.y = Math.Linear(characterObject.y, character.y, interpolationFactor)
                    characterObject.fishingRod.x = characterObject.x
                    characterObject.fishingRod.y = characterObject.y

                    //Direction sync
                    characterObject.direction = new Math.Vector2(character.direction.x, character.direction.y)

                    //Sync states
                    characterObject.states.idle = character.states.idle
                    characterObject.states.fishing = character.states.fishing;
                    characterObject.states.tryingCatchFish = character.states.tryingCatchFish
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
        
        this.setCommands()
    }

    private static setCommands(){

        //Receive player fish
        this.room.onMessage("f", (id: string)=>{
            this.scene.characters.get(id)!.fish()
            console.log("fishing: " + id)
        })

        //Receive player fish got bait
        this.room.onMessage("bf", (data:{id: string, fish: ToLootFish})=>{
            this.scene.characters.get(data.id)!.tryCatchFish(data.fish)
        })

        //Receive player caught fish
        this.room.onMessage("gf", (data:{client:string, fish: ToLootFish})=>{
            const character = this.scene.characters.get(data.client)!
            const fishObject = new Fish(this.scene, character.x, character.y, data.fish)
            Game.loot.set(fishObject.fishData.id, fishObject)
            fishObject.GoUpTween(character.x, character.y)
            this.scene.characters.get(data.client)!.catchFish()
        })

        this.room.onMessage("pf", (data: {client: string, toLootFish:ToLootFish})=>{
            this.scene.events.once(Scenes.Events.POST_UPDATE, ()=>{
                Game.loot.get(data.toLootFish.id)?.destroy()
                Game.loot.delete(data.toLootFish.id)
                if(data.client === this.room.sessionId){
                    this.mainPlayer.character.pickUp!.fish = null
                }
            })
        })
        
        this.room.onMessage("ppf", (fish:IFish)=>{
            UI.inventoryUI.addFish(fish)
        })
    }

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
        this.room.send("f")
    }

    static sendGotFish(fish: ToLootFish){
        this.room.send("gf", fish)
    }

    static sendPickUpFish(fish: ToLootFish){
        this.room.send("pf", fish)
    }

    /*static receivedFish(fish: IFish){
        const fishObject = new Fish(this.scene, this.mainPlayer.character.x, this.mainPlayer.character.y, fish)
        fishObject.GoUpTween(this.mainPlayer.character.x, this.mainPlayer.character.y)
    }*/
}