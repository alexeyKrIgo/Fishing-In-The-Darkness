import { RodData } from "../interfaces/FishingRod";

export const GHOST = {
    ghostIdle: "ghostIdle",
    castRod: "ghost cast rod",
    fishingIdle: "ghost fishing idle",
    bait: "ghost fishing bait",
    catchFish: "ghost catch fish"
};

export const MAP = {
    beach: {
        beachTileSet: "beach-tile-set",
        beachData: "beach-json",
        ground: "ground",
        decoration: "decoration",
        tileset: "mapset",
    },
};

export const BASICROD:RodData = {
    cast: "basic rod cast",
    idle: "basic rod idle",
    bait: "basic rod bait",
    catch: "basic rod catch"
}
