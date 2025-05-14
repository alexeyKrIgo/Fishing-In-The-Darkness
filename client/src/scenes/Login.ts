import { GameObjects, Scene } from "phaser";
import { FormButton } from "../ui/buttons/FormButton";

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

    constructor(){
        super("Login")
    }

    preload(){
        this.load.html("login", "login.html")
    }

    create(){
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
        //Generate button for login
        this.loginButton = new FormButton(this, ()=>{console.log("login")}, 1,  0x73442f, 0xb06948, 830, 620, 200, 60, 30, "LOGIN", this)

        //Generate button for swap to register
        this.swapToRegisterButton = new FormButton(this, this.swapToRegister, 1,  0x73442f, 0xb06948, 870, 730, 110, 60, 13, "REGISTER", this)

        //Generate button for register
        this.registerButton = new FormButton(this, ()=>{console.log("register")}, 1,  0x73442f, 0xb06948, 800, 750, 260, 60, 30, "REGISTER", this)
        this.registerButton.visible = false
        this.registerButton.text.visible = false

        //Generate button for swap to login
        this.swapToLoginButton = new FormButton(this, this.swapToLogin, 1,  0x73442f, 0xb06948, 870, 850, 110, 60, 13, "LOGIN", this)
        this.swapToLoginButton.visible = false;
        this.swapToLoginButton.text.visible = false

        this.add.existing(this.loginButton)
    }

    update(){
        this.validateRegisterForm()
        //console.log(this.registerButton.active)
        this.registerButton.update()
    }

    validateRegisterForm(){
        this.registerButton.active = !!this.registerGroup.nickname.value && this.registerGroup.email.checkValidity() && 
            (this.registerGroup.password.checkValidity() && this.registerGroup.password.value == this.registerGroup.confirmPassword.value)
    }

    swapToRegister(){
        this.makeSwap("none", "block", false, true)
    }

    swapToLogin(){
        this.makeSwap("block", "none", true, false)
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
    /*create(){
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
    }*/
}