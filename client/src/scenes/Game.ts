import { Scene } from "phaser";
import { AssetsLoader } from "../utils/AssetsLoader";
import { MAP } from "../utils/AssetsGlobals";

export class Game extends Scene {
    constructor() {
        super("Game");
    }

    preload() {
        this.load.setPath("assets");
        AssetsLoader.loadMap(this);
    }

    create() {
        this.generateMap();
    }

    generateMap() {
        const map = this.make.tilemap({ key: MAP.beach.beachData });
        const tiles = map.addTilesetImage(
            MAP.beach.tileset,
            MAP.beach.beachTileSet
        ) as Phaser.Tilemaps.Tileset;

        map.createLayer(MAP.beach.ground, tiles, 0, 0);
        map.createLayer(MAP.beach.decoration, tiles, 0, 0);
    }
}
