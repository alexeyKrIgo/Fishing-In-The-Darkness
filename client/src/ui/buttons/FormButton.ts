import { Button } from "./Button";

export class FormButton extends Button{
    active = false

    update(){
        if(!this.active){
            super.changeBrightness(0.5)
        }
        else{
            super.changeBrightness(1)
        }
    }

    addAction(): void {
        console.log("hello")
        if(this.active){
            this.action()
        }
    }

    changeBrightness(brightness: number){
        if(this.active){
            super.changeBrightness(brightness)
        }
    }
}