import { Scene } from "phaser";
import { GHOST, MAP } from "./AssetsGlobals";

export class AssetsLoader {
    private static ghostURL = "characters/basic-ghost";
    private static mapURL = "map";

    static loadGhost(scene: Scene) {
        scene.load.spritesheet(
            GHOST.ghostIdle,
            `${this.ghostURL}/ghost-idle.png`,
            { frameWidth: 64, frameHeight: 64 }
        );
    }

    static loadMap(scene: Scene) {
        scene.load.image(
            MAP.beach.beachTileSet,
            `${this.mapURL}/tile-set-1.png`
        );
        scene.load.tilemapTiledJSON(
            MAP.beach.beachData,
            `${this.mapURL}/beach-graveyard.json`
        );
    }
}
