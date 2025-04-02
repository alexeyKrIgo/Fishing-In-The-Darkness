export interface IDirectionsAnimations{
    front: string,
    right: string,
    left: string,
    back: string
}

export interface ICharacterAnimations{
    idle: IDirectionsAnimations
    cast: string
    fishingIdle: string,
    bait: string,
    catch: string
}

export interface IFishingRodAnimations{
    cast: string,
    idle: string,
    bait: string,
    catch: string,
}