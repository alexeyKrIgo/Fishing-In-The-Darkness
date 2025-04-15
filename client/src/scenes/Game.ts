import { Math, Scene } from "phaser";
import { AssetsLoader } from "../utils/AssetsLoader";
import { GHOST, MAP } from "../utils/AssetsGlobals";
import { Character } from "../objects/Character";
import { CharacterControls } from "../controls/CharacterControls";
import { Ghost } from "../objects/Ghost";
import { UI } from "./UI";
import { GameNetManager } from "../managers/GameNetManager";

export class Game extends Scene {
    characters: Map<string, Character>
    seaLimit: number
    test = true
    testTween: Phaser.Tweens.Tween
    
    constructor() {
        super("Game");
    }

    preload() {
        this.load.setPath("assets");
        AssetsLoader.loadInventoryUI(this)
        AssetsLoader.loadLoot(this)
        AssetsLoader.loadMap(this);
        AssetsLoader.loadGhost(this)
        AssetsLoader.loadBasicRod(this)
        AssetsLoader.loadUIShaders(this)
    }

    async create() {
        Ghost.generateAnimations(this, GHOST.ghostIdle)
        this.generateMap();
        this.characters = new Map<string, Character>()
        GameNetManager.scene = this
        await GameNetManager.connect()
        console.log(this.cameras.main.width)
        /*this.testTween = this.tweens.add({targets: this.character, props: {
            scale: {value: 2, duration: 3000}
        }})*/
        
    }

    createPlayer(character: Character){
        this.cameras.main.zoom = 4;
        this.cameras.main.centerOn(character.x, character.y)
        this.cameras.main.startFollow(character, true)
        this.cameras.main.setBounds(0,0, 560, 240)

        CharacterControls.generateCharacterMoveControl(this.input, character)
        CharacterControls.generateKeys(this.input)
        this.game.scene.add("UI", new UI(), true);
    }

    update(time:number, delta:number){
        if(GameNetManager.mainPlayer.character)
            CharacterControls.update(GameNetManager.mainPlayer.character)
        this.characters.forEach(c => c.update(delta, this.seaLimit))
    }

    generateMap() {
        const map = this.make.tilemap({ key: MAP.beach.beachData });
        const tiles = map.addTilesetImage(
            MAP.beach.tileset,
            MAP.beach.beachTileSet
        ) as Phaser.Tilemaps.Tileset;

        map.createLayer(MAP.beach.ground, tiles, 0, 0);
        map.createLayer(MAP.beach.decoration, tiles, 0, 0);
        this.seaLimit = map.tileWidth * 11
    }
}
