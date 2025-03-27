import { Math, Scene } from "phaser";
import { AssetsLoader } from "../utils/AssetsLoader";
import { GHOST, MAP } from "../utils/AssetsGlobals";
import { Character } from "../objects/Character";
import { CharacterControls } from "../controls/CharacterControls";
import { Ghost } from "../objects/Ghost";
import { UI } from "./UI";
import { GameNetManager } from "../managers/GameNetManager";

export class Game extends Scene {
    character: Character
    constructor() {
        super("Game");
    }

    preload() {
        this.load.setPath("assets");
        AssetsLoader.loadMap(this);
        AssetsLoader.loadGhost(this)
        AssetsLoader.loadBasicRod(this)
    }

    create() {
        this.generateMap();
        this.character = new Ghost(this, GHOST.ghostIdle, 100, 100, new Math.Vector2(0,1), true, false)

        this.cameras.main.zoom = 4;
        this.cameras.main.centerOn(this.character.x, this.character.y)
        this.cameras.main.startFollow(this.character)
        this.cameras.main.setBounds(0,0, 560, 240)

        CharacterControls.generateCharacterMoveControl(this.input, this.character)
        CharacterControls.generateKeys(this.input)
        this.game.scene.add("UI", new UI(), true);
    }

    update(time:number, delta:number){
        CharacterControls.update(this.character)
        this.character?.update(delta)
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
