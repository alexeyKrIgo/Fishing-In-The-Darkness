import { Scene } from "phaser";
import { BASICROD, GENERAL, GHOST, MAP, UI } from "./AssetsGlobals";

export class AssetsLoader {
    private static uiInventoryURL = "ui/inventory"
    private static lootURL = "loot"
    private static ghostURL = "characters/basic-ghost";
    private static mapURL = "map";
    private static basicRodURL = "fishing-rods/basic-rod"
    private static shadersURL = "shaders/"
    public static loaded = false;

    static loadInventoryUI(scene: Scene){
        scene.load.image(UI.inventorySlot, `${this.uiInventoryURL}/slot.png`)
        scene.load.image(UI.inventoryIcon, `${this.uiInventoryURL}/inventory icon.png`)
    }

    static loadUIShaders(scene: Scene){
        scene.load.glsl(UI.brightness, `${this.shadersURL}/slotshine.fx`, "fragment")
    }

    static loadLoot(scene: Scene){
        scene.load.spritesheet(GENERAL.loot, `${this.lootURL}/loot.png`, {frameWidth: 32, frameHeight: 32})
    }

    static loadGhost(scene: Scene) {
        scene.load.spritesheet(
            GHOST.ghostIdle,
            `${this.ghostURL}/ghost-idle.png`,
            { frameWidth: 64, frameHeight: 64 }
        );

        scene.load.spritesheet(GHOST.castRod, `${this.ghostURL}/ghost cast fishing rod.png`,{frameWidth: 128, frameHeight: 128})
        scene.load.spritesheet(GHOST.fishingIdle, `${this.ghostURL}/ghost fishing idle.png`,{frameWidth: 128, frameHeight: 128})
        scene.load.spritesheet(GHOST.bait, `${this.ghostURL}/ghost trying catch fish.png`,{frameWidth: 128, frameHeight: 128})
        scene.load.spritesheet(GHOST.catchFish, `${this.ghostURL}/ghost catch fish.png`,{frameWidth: 128, frameHeight: 128})
    }

    static loadMap(scene: Scene) {
        scene.load.image(
            MAP.beach.beachTileSet,
            `${this.mapURL}/tile-set-1-extruded.png`
        );
        scene.load.tilemapTiledJSON(
            MAP.beach.beachData,
            `${this.mapURL}/beach-graveyard.json`
        );
    }

    static loadBasicRod(scene: Scene) {
        scene.load.spritesheet(BASICROD.cast, `${this.basicRodURL}/fishing rod cast.png`, {frameWidth: 128, frameHeight: 128})
        scene.load.spritesheet(BASICROD.idle, `${this.basicRodURL}/fishing rod idle.png`, {frameWidth: 128, frameHeight: 128})
        scene.load.spritesheet(BASICROD.bait, `${this.basicRodURL}/fishing rod baited fish.png`, {frameWidth: 128, frameHeight: 128})
        scene.load.spritesheet(BASICROD.catch, `${this.basicRodURL}/fishing rod catch fish.png`, {frameWidth: 128, frameHeight: 128})
    }
}
