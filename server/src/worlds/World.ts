import { Character } from "../objects/Character"

export class World{
    characters: Map<string, Character>

    constructor(){
        this.characters = new Map<string, Character>()
    }
}