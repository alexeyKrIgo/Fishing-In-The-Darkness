import { GameObjects } from "phaser"

export class HorizontalContainer{
    width: number
    elements: GameObjects.Image[] | GameObjects.Shader[]
    gap = 0
    x: number
    y: number
    
    constructor(x: number, y: number, gap: number = 0){
        this.gap = gap

        this.x = x
        this.y = y
    }

    placeElements(elements: GameObjects.Image[] | GameObjects.Shader[]){

        //Place the elements
        this.elements = elements
        for(let i = 0; i < this.elements.length; i++){
            this.elements[i].setPosition(this.x + this.elements[i].displayWidth*i + this.gap*i, this.y)
        }

        //Set the width of the container
        this.width = elements.length * elements[0].displayWidth + this.gap * this.elements.length
    }

    moveX(x: number){
        this. x = x
        this.placeElements(this.elements)
    }
}