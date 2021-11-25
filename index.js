// base file to be called when package is required (entry point)

const { prepSignature } = require('./signature');
const api = require('./endpoint');

// methods enum
const methods = {
    GET: 'GET',
    POST: 'POST',
    DELETE: 'DELETE'
}

module.exports = class SpreadCityAPI {

    // private attributes
    #key;
    #secret;

    // initialize api with my key and secret (downloaded from website)
    constructor(key, secret) {
 
        if (!(key && secret)) {
            throw new Error("SpreadCityAPI must be initialized with an Executor API key and secret, these can be generated from https://mrspreader.com/config");
        }

        this.#key = key;
        this.#secret = secret;
    }

    async #setHeaders(path, method, payload = "") {

        // get request timestamp
        const ts = Date.now().toString();

        if (payload) {
            payload = JSON.stringify(payload);
        }

        //console.log(this.#secret + method + path + ts + payload);

        // create signature
        const sig = prepSignature(this.#secret, method, path, ts, payload);

        //console.log(sig);

        const headers = {
            'sc-key': this.#key,
            'sc-time': ts,
            'sc-signature': sig,
        }

        return headers;

    }

    // executors

    async getOptions() {
        const path = '/executor/config'
        const headers = await this.#setHeaders(path, methods.GET);

        const response = await api.get(path, {headers: headers});

        return response.data;

    }

    // get my active instances (not destroyed)
    async getActiveInstances() {
        const path = '/executor/all'
        const headers = await this.#setHeaders(path, methods.GET);

        const response = await api.get(path, {headers: headers});

        return response.data;

    }

    async createInstance(config, maker, taker, fav = null) {
        const path = '/executor'

        if (!(config && maker && taker)) {
            throw new Error('Missing required parameters');
        }

        const data = {
            config: config,
            maker: maker,
            taker: taker,
            fav: fav
        }

        const headers = await this.#setHeaders(path, methods.POST, data);

        console.log(data);

        const response = await api.post(path, data, {headers: headers});

        return response.data;

    }
    
    async startInstance(id) {
        const path = '/executor/start'

        if (!id) {
            throw new Error("Missing required 'id' parameter");
        }

        const data = {
            id: id
        }

        const headers = await this.#setHeaders(path, methods.POST, data);

        const response = await api.post(path, data, {headers: headers});

        return response.data;

    }
    
    async stopInstance(id) {
        const path = '/executor/stop'

        if (!id) {
            throw new Error("Missing required 'id' parameter");
        }

        const data = {
            id: id
        }

        const headers = await this.#setHeaders(path, methods.POST, data);

        const response = await api.post(path, data, {headers: headers});

        return response.data;

    }
    
    async getActiveInstance(id) {
        const path = '/executor/one'

        if (!id) {
            throw new Error("Missing required 'id' parameter");
        }

        const data = {
            id: id
        }

        const headers = await this.#setHeaders(path, methods.POST, data);

        const response = await api.post(path, data, {headers: headers});

        return response.data;

    }

    // configs

    async history() {
        const path = '/executor/history'

        const headers = await this.#setHeaders(path, methods.GET);

        const response = await api.get(path, {headers: headers});

        return response.data;

    }

    
    async favoriteConfigs() {
        const path = '/executor/favs'

        const headers = await this.#setHeaders(path, methods.GET);

        const response = await api.get(path, {headers: headers});

        return response.data;

    }
    

    async setFavorite(id, name) {
        const path = '/executor/set-fav'

        if (!id) {
            throw new Error("Missing required 'id' parameter");
        }

        const data = {
            id: id,
            fav: name || null // de-favorite
        }

        const headers = await this.#setHeaders(path, methods.POST, data);

        const response = await api.post(path, data, {headers: headers});

        return response.data;

    }

}