export interface DirectionsAnimations{
    front: string,
    right: string,
    left: string,
    back: string
}

export interface CharacterAnimations{
    idle: DirectionsAnimations
    cast: string
    fishingIdle: string,
    bait: string,
    catch: string
}

export interface FishingRodAnimations{
    cast: string,
    idle: string,
    bait: string,
    catch: string,
}