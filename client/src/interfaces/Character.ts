import { Vector2 } from "./Vector2"

export interface ICharacterStates{
    idle: boolean
    fishing: boolean
    tryingCatchFish: boolean
}

export interface Character{
    position: Vector2,
    direction: Vector2
    states: ICharacterStates
}