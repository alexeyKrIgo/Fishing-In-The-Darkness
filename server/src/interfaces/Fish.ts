export interface Fish{
    owner: string,
    row: number,
    column: number
    asset: number
}

export interface ToLootFish{
    owner: string
    id: number
    asset: number
}

export interface StatsFish{
    asset: number
    name: string
    weight: number
}