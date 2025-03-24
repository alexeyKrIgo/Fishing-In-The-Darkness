import { Game as MainGame } from "./scenes/Game";
import { Game, Scale, Types } from "phaser";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
(async () => {
    const config: Types.Core.GameConfig = {
        type: Phaser.WEBGL,
        width: 1920,
        height: 1080,
        dom: {
            createContainer: true,
        },
        fps: {
            target: 60,
        },
        parent: "game-container",
        scale: {
            mode: Scale.FIT,
            autoCenter: Scale.CENTER_BOTH,
            autoRound: true,
        },
        scene: [MainGame],
        pixelArt: true,
        //backgroundColor: 0x05358e,
        transparent: true,
    };
    new Game(config);
})();
