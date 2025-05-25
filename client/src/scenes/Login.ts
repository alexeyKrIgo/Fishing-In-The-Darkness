import { GameObjects, Scene } from "phaser";
import { FormButton } from "../ui/buttons/FormButton";
import { GameNetManager } from "../managers/GameNetManager";
import { Game } from "./Game";

export class Login extends Scene{
    
    state: "login"|"register" = "login"

    loginButton: FormButton
    swapToRegisterButton: FormButton

    registerButton: FormButton
    swapToLoginButton: FormButton

    domElement: GameObjects.DOMElement

    registerGroup:{
        nickname: HTMLInputElement
        email: HTMLInputElement
        password: HTMLInputElement
        confirmPassword: HTMLInputElement
    }

    loginGroup:{
        email: HTMLInputElement
        password: HTMLInputElement
    }

    constructor(){
        super("Login")
    }

    preload(){
        this.load.html("login", "login.html")
    }

    create(){
        if(!localStorage.getItem("colyseus-auth-token")){
            //Add html
            this.domElement = this.add.dom(1920/2, 1080/2 - 100).createFromCache("login")
            this.domElement.scale = 2

            //Get register form inputs
            this.registerGroup = {
                nickname: this.domElement.getChildByID("nickname") as HTMLInputElement,
                email : this.domElement.getChildByID("emailRegister") as HTMLInputElement,
                password : this.domElement.getChildByID("passwordRegister") as HTMLInputElement,
                confirmPassword : this.domElement.getChildByID("confirmPassword") as HTMLInputElement
            }

            //Get login form inputs
            this.loginGroup = {
                email: this.domElement.getChildByID("emailLogin") as HTMLInputElement,
                password: this.domElement.getChildByID("passwordLogin") as HTMLInputElement
            }

            //Generate button for login
            this.loginButton = new FormButton(this, this.login, 1,  0x73442f, 0xb06948, 4, 830, 620, 200, 60, 30, "LOGIN", this)

            //Generate button for swap to register
            this.swapToRegisterButton = new FormButton(this, this.swapToRegister, 1,  0x73442f, 0xb06948, 4, 870, 730, 110, 60, 13, "REGISTER", this)

            //Generate button for register
            this.registerButton = new FormButton(this, this.register, 1,  0x73442f, 0xb06948, 4, 800, 750, 260, 60, 30, "REGISTER", this)
            this.registerButton.visible = false
            this.registerButton.text.visible = false

            //Generate button for swap to login
            this.swapToLoginButton = new FormButton(this, this.swapToLogin, 1,  0x73442f, 0xb06948, 4, 870, 850, 110, 60, 13, "LOGIN", this)
            this.swapToLoginButton.visible = false;
            this.swapToLoginButton.text.visible = false
        }
        else{
            this.scene.start("Game", new Game())
        }
        //this.add.existing(this.loginButton)
    }

    update(){
        this.validateRegisterForm()
        this.validateLoginForm()
        
        this.loginButton.update()
        this.registerButton.update()
    }

    validateRegisterForm(){
        this.registerButton.active = !!this.registerGroup.nickname.value && this.registerGroup.email.checkValidity() && 
            (this.registerGroup.password.checkValidity() && this.registerGroup.password.value == this.registerGroup.confirmPassword.value)
    }

    validateLoginForm(){
        this.loginButton.active = this.loginGroup.email.checkValidity() && this.loginGroup.password.checkValidity()
            && !!this.loginGroup.email.value && !!this.loginGroup.password.value
    }

    swapToRegister(){
        this.makeSwap("none", "block", false, true)
    }

    swapToLogin(){
        this.makeSwap("block", "none", true, false)
    }

    login(){
        if(this.loginButton.active){
            GameNetManager.login(this.loginGroup.email.value, this.loginGroup.password.value)
            .then(()=>this.scene.start("Game", new Game()))
            .catch(()=>{
                this.cameras.main.scrollX = -20;

                // Create the tween
                const test = this.tweens.add({
                targets: this.cameras.main,
                scrollX: 20,
                ease: 'Sine.easeInOut', 
                duration: 100, 
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                    this.cameras.main.scrollX = 0
                    test.stop()
                }
                });
            })
        }
    }

    register(){
        if(this.registerButton.active){
            GameNetManager.register(this.registerGroup.nickname.value, this.registerGroup.email.value, this.registerGroup.password.value)
            .then(()=>this.swapToLogin())
        }
    }

    makeSwap(loginDisplay:string, registerDisplay: string, login: boolean, register: boolean){
        const loginPanel = this.domElement.getChildByID("loginPanel") as HTMLDivElement
        loginPanel.style.display = loginDisplay
        const registerPanel = this.domElement.getChildByID("registerPanel") as HTMLDivElement
        registerPanel.style.display = registerDisplay
        
        this.loginButton.visible = login
        this.loginButton.text.visible = login

        this.swapToRegisterButton.visible = login
        this.swapToRegisterButton.text.visible = login

        this.registerButton.visible = register
        this.registerButton.text.visible = register

        this.swapToLoginButton.visible = register;
        this.swapToLoginButton.text.visible = register
    }
}