export interface Fish{
    owner: string,
    row: number,
    column: number
    asset: number
    saved: boolean
}

export interface ToLootFish{
    id: string
    owner: string
    asset: number
}

export interface StatsFish{
    asset: number
    name: string
    weight: number
}