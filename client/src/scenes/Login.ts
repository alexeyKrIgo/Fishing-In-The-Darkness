import { Scene } from "phaser";
import { GameNetManager } from "../managers/GameNetManager";
import { Game } from "./Game";

export class Login extends Scene{
    
    state: "login"|"register" = "login"

    constructor(){
        super("Login")
    }

    preload(){
        this.load.html("login", "login.html")
    }

    create(){
        if(!localStorage.getItem("colyseus-auth-token")){
            const domElement = this.add.dom(1920/2, 1080/2).createFromCache("login")
            domElement.scale = 2
            const nickname = domElement.getChildByID("nickname") as HTMLInputElement
            const password = domElement.getChildByID("password") as HTMLInputElement
            document.getElementById("register")?.addEventListener("click", ()=>
                {
                    GameNetManager.register(nickname.value, password.value)
                }
            )
            domElement.getChildByID("login")?.addEventListener("click", ()=>
                {   
                    GameNetManager.login(nickname.value, password.value).then(()=>this.scene.start("Game", new Game()))
                }
            )
        }
        else{
            this.scene.start("Game", new Game())
        }
    }
}