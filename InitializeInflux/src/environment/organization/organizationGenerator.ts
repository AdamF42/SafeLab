var axios = require('axios');
import { Config } from '../config/config'

export class OrganizationGenerator {

    private address: string;
    private authToken: string;

    constructor(address: string, authToken: string){
        this.address = address;
        this.authToken = authToken;
    }

    async create(name: string){
        return axios(this.getConfig(name))
        .then(function(response){
            console.log("Org Id: "+ response.data.id);
            return Promise.resolve(response.data.id);
        })
        .catch(function (error) {
            console.log("ERROR IN CREATING ORG");
            console.log(error.message);
            console.log(error.response.data.message);
        });
    }

    private getConfig(name: string){
        let descriptionJson = 
            {
                name: name,
                status: "active"
            }; 

        let config = new Config('post', this.address+'/orgs', 'Token '+this.authToken, 'application/json', descriptionJson)
        return config.getObjConfig();        
    }

    addUser(userId: string, orgId: string){
        let config = new Config('post', this.address+'/orgs/'+orgId+'/members', 'Token '+this.authToken, 'application/json', {'id':userId} )
        axios(config.getObjConfig())
        // .then(
        //     console.log("User "+userId+"added to org "+orgId)
        // )
        .catch(function (error) {
            console.log("ERROR IN ADDING USR TO ORG");
            console.log(error.message);
            console.log(error.response.data.message);
        });
    }


}