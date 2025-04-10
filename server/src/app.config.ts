import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import { auth } from "@colyseus/auth";

/**
 * Import your Room files
 */
import { MyRoom } from "./rooms/MyRoom";
import { matchMaker } from "colyseus";

const fakeDatabase:any[] = [];

auth.settings.onFindUserByEmail = async function (email) {
    return fakeDatabase.find((entry) => entry.email === email);
}

auth.settings.onRegisterWithEmailAndPassword = async function (email, password, options) {
    const entry = { email, password, ...options };
    fakeDatabase.push(entry);
    return entry;
}

export default config({

    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        gameServer.define('my_room', MyRoom);
		gameServer.simulateLatency(60);
		matchMaker.controller.exposedMethods = ["join"]
		matchMaker.create("my_room", {}, {
            token: "mypassword",
            headers: undefined,
            ip: ""
        })
    },

    initializeExpress: (app) => {
        app.use(auth.prefix, auth.routes());
        /**
         * Bind your custom express routes here:
         * Read more: https://expressjs.com/en/starter/basic-routing.html
         */
        /*app.get("/hello_world", (req, res) => {
            res.send("It's time to kick ass and chew bubblegum!");
        });*/

        /**
         * Use @colyseus/playground
         * (It is not recommended to expose this route in a production environment)
         */
        /*if (process.env.NODE_ENV !== "production") {
            app.use("/", playground());
        }*/

        /**
         * Use @colyseus/monitor
         * It is recommended to protect this route with a password
         * Read more: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
         */
        //app.use("/monitor", monitor());
    },


    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }
});
