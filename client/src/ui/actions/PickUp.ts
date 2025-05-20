import { GameObjects, Math, Scene } from "phaser";
import { Fish } from "../../objects/Fish";
import { Character } from "../../objects/Character";
import { GameNetManager } from "../../managers/GameNetManager";
import { Game } from "../../scenes/Game";

export class PickUp extends GameObjects.Text{
    fish: Fish|null = null
    characterOffset = 10
    
    constructor(scene: Scene){
        super(scene, 0, 0, "PRESS SPACE", {
            fontFamily: 'InTheDarkness, "Goudy Bookletter 1911", Times, serif' ,
            color: "#fbf236",
            fontSize: 5, 
            resolution:10, 
        })
        this.visible = false;
        scene.add.existing(this)
    }

    update(character:Character, gameScene: Game){
        let fish: Fish|null = null

        gameScene.loot.forEach(l => {
            if(!fish && Math.Distance.Between(character.x, character.y + this.characterOffset, l.x, l.y) < 20){
                fish = l
            }
            else if(fish && Math.Distance.Between(character.x, character.y + this.characterOffset, l.x, l.y)
                < Math.Distance.Between(character.x, character.y + this.characterOffset, fish.x, fish.y)
            ){
                fish = l
            }
        })

        this.fish = fish
        if(this.fish){
            this.visible = true
        }
        else
            this.visible = false

        this.depth = character.depth + 1000
        this.setPosition(character.x - 25, character.y - 30)
    }

    pickFish(){
        console.log(this.fish!.fishData.owner, GameNetManager.mainPlayer.id)
        if(this.fish && this.fish.fishData.owner === GameNetManager.mainPlayer.id){
            GameNetManager.sendPickUpFish(this.fish.fishData)
        }
    }
}