import { GameObjects, Scene, Math } from "phaser";

export class UI extends Scene{

    fps:GameObjects.Text

    constructor(){
        super("UI")
    }

    create(){
        console.log("hello")
        this.fps = new GameObjects.Text(this, 850, 20, "0", { fontFamily: 'InTheDarkness' });
        this.add.existing(this.fps);
    }

    update(time:number, delta: number){
        this.fps.setText("FPS:" + (Math.RoundTo(1000/delta)).toString())
    }
}