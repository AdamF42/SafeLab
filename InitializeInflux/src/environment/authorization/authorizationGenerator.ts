import { Config } from "../config/config";
var axios = require('axios');

export class AuthorizationGenerator {
    private address: string;
    private authToken: string;  
    
    constructor(address: string, authToken: string){
        this.address = address;
        this.authToken = authToken;
    }

    async create(orgID: string, bucketID: string, authDescription: string){
        return axios(this.getConfig(orgID, bucketID, authDescription))
        .then(function(response){
            console.log("Auth Id: "+ response.data.id)
            return Promise.resolve(response.data.id);
        })
        .catch(function (error) {
            console.log("ERROR IN CREATING AUTHORIZATION");
            console.log(error.message);
            console.log(error.response.data.message);
        });
    }

    private getConfig(orgID: string, bucketID: string, authDescription: string){
        let descriptionJson = 
            {
                "description": authDescription,
                "status": "active",
                "orgID": orgID,
                "permissions": [{
                        "action": "read",
                        "resource": {
                            "type": "buckets",
                            "id": bucketID,
                        }
                    },
                    {
                        "action": "write",
                        "resource": {
                            "type": "buckets",
                            "id": bucketID,
                        }
                    }
                ]
            }; 

        let config = new Config('post', this.address+'/authorizations', 'Token '+this.authToken, 'application/json', descriptionJson);
            
        return config.getObjConfig();
    }  
}