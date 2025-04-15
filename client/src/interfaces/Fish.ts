export interface IFish{
    owner: string,
    row: number,
    column: number
    asset: number
}

export interface ToLootFish{
    owner: string
    id: string
    asset: number
}

export interface StatsFish{
    asset: number
    name: string
    weight: number
}