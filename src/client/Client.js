const EventEmitter = require('events');
const Store = require('../util/Store');
const RESTHandler = require("../util/Requests/RESTHandler.js");

module.exports = class Client extends EventEmitter {
    constructor(token, ...options) {
        super();

        this.guilds = new Store();
        this.users = new Store();
        this.channels = new Store();
        
        this.ws = {
            socket: null,
            connected: false,
            gateway: {
                url: null,
                obtainedAt: null,
                heartbeat: {
                    interval: null,
                    last: null,
                    recieved: false,
                    seq: null,
                }
            }
        };

        this.token = token;
        this.readyAt = 0;
        this.user = null;
        this.sessionID = null;
        this.rest = new RESTHandler(this);

        if (options && options.connect == false) {
            return this;
        } else {
            return this.connect();
        }
    }

    static get MessageEmbed() {
        return require('../util/Message/MessageEmbed');
    }

    static get VERSION() { return '1.0.1'; }

    connect() {
        const attemptLogin = require('../gateway/websocket');
        if (this.ws.connected) throw new Error(`The client is already connected to the gateway`);

        attemptLogin(this);
    }
}