import { Character } from "../interfaces/Character";

export class World{
    characters: Map<string, Character>

    constructor(){
        this.characters = new Map<string, Character>()
    }
}