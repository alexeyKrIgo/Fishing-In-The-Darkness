import { Character } from "../objects/Character";

export class Player{
    id: string;
    name: string;
    character:Character
    static selectedPlayer: Character|null = null
}