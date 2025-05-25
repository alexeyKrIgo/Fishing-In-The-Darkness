import { Scene } from "phaser";
import { AssetsLoader } from "../utils/AssetsLoader";
import { GHOST, MAP } from "../utils/AssetsGlobals";
import { Character } from "../objects/Character";
import { CharacterControls } from "../controls/CharacterControls";
import { Ghost } from "../objects/Ghost";
import { GameNetManager } from "../managers/GameNetManager";
import { Fish } from "../objects/Fish";

export class Game extends Scene {
    characters: Map<string, Character>
    seaLimit: number
    test = true
    testTween: Phaser.Tweens.Tween
    loot: Map<string, Fish>
    
    constructor() {
        super("Game");
    }

    preload() {
        this.load.setPath("assets");
        if(!AssetsLoader.loaded){
            AssetsLoader.loadInventoryUI(this)
            AssetsLoader.loadLoot(this)
            AssetsLoader.loadMap(this);
            AssetsLoader.loadGhost(this)
            AssetsLoader.loadBasicRod(this)
            AssetsLoader.loadUIShaders(this)
            AssetsLoader.loaded = true
        }
    }

    async create() {
        if(!Ghost.animationsCreated){
            Ghost.generateAnimations(this, GHOST.ghostIdle)
            Ghost.animationsCreated = true
        }
        this.generateMap();
        this.characters = new Map<string, Character>()
        this.loot = new Map<string, Fish>()
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
        this.cameras.main.startFollow(character)
        this.cameras.main.setBounds(0,0, 560, 240)

        const canvas = this.sys.game.canvas;

        canvas.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });

        CharacterControls.generateCharacterMoveControl(this.input, character)
        CharacterControls.generateKeys(this.input)
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
            MAP.beach.beachTileSet, 16, 16, 1, 2
        ) as Phaser.Tilemaps.Tileset;

        map.createLayer(MAP.beach.ground, tiles, 0, 0);
        map.createLayer(MAP.beach.decoration, tiles, 0, 0);
        this.seaLimit = map.tileWidth * 11
    }
}
