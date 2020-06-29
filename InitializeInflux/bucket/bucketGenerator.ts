import { Config } from "../config/config";
var axios = require('axios');


export class BucketGenerator {
    private address: string;
    private authToken: string;  
    
    constructor(address: string, authToken: string){
        this.address = address;
        this.authToken = authToken;
    }  
    
    async create(orgID: string, bucketName: string, expireTime: number){
        return axios(this.getConfig(orgID, bucketName, expireTime))
        .then(function(response){
            console.log("Buck Id: "+ response.data.id)
            return Promise.resolve(response.data.id);
        })
        .catch(function (error) {
            console.log("ERROR IN CREATING BUCKET");
            console.log(error.message);
            console.log(error.response.data.message);
        });
    }
    
    private getConfig(orgID: string, bucketName: string, expireTime: number){
        let descriptionJson = 
            {
                'name': bucketName,
                'orgID': orgID,
                'retentionRules': [{
                    'type': 'expire',
                    'everySeconds': expireTime
                }]
            };

        let config = new Config('post', this.address+'/buckets', 'Token '+this.authToken, 'application/json', descriptionJson);
            
        return config.getObjConfig();
    }    

}
