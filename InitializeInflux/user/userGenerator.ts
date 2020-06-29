import { Config } from "../config/config";
var axios = require('axios');

export class UserGenerator {
    private address: string;
    private authToken: string;

    constructor(address: string, authToken: string){
        this.address = address;
        this.authToken = authToken;
    }

    async create(name: string){
        return axios(this.getConfig(name))
        .then(function(response){
            console.log("Usr Id: "+ response.data.id)
            return Promise.resolve(response.data.id);
        })
        .catch(function (error) {
            console.log("ERROR IN CREATING USER");
            console.log(error.message);
            console.log(error.response.data.message);
        });
    }

    private getConfig(name: string){
        let descriptionJson = 
                {
                    'name': name
                };

        let config = new Config('post', this.address+'/users', 'Token '+this.authToken, 'application/json', descriptionJson);
            
        return config.getObjConfig();
    }

}    
