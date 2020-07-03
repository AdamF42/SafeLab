import { Config } from "../config/config";
var axios = require('axios');

export class AlertGenerator {
    private address: string;
    private authToken: string;

    constructor(address: string, authToken: string){
        this.address = address;
        this.authToken = authToken;
    }

    async create(taskName: string, taskDescr: string, timeInterval: string, orgID: string, ownerID: string, bucketName: string, valueToFilter: string, aggregateWindow: string, query: string, msg: string){
        return axios(this.getConfig(taskName, taskDescr, timeInterval, orgID, ownerID, bucketName, valueToFilter, aggregateWindow, query, msg))
        .then(function(response){
            console.log("Alert Id: "+ response.data.id)
            return Promise.resolve(response.data.id);
        })
        .catch(function (error) {
            console.log("ERROR IN CREATING ALERT");
            console.log(error.message);
            console.log(error.response.data.message);
        });
    }

//    getConfig("TaskCiccio", "Task di ciccio", "30s", <orgID>, <usrID>, <buckName>, "time", "20s");
    private getConfig(taskName: string, taskDescr: string, timeInterval: string, orgID: string, ownerID: string, bucketName: string, valueToFilter: string, aggregateWindow: string, query: string, msg: string){
        let descriptionJson = {
            "description": taskDescr,
            "every": timeInterval,
            "name": taskName,
            "offset":"0s",
            "orgID": orgID,
            "ownerID": ownerID,
            "query":{
                "builderConfig":{
                    "buckets":[bucketName],
                    "tags":[
                        {
                            "key":"_measurement",
                            "values":[valueToFilter],
                            "aggregateFunctionType":"filter"
                        },
                        {
                            "key":"_field",
                            "values":["value"],
                            "aggregateFunctionType":"filter"
                        }
                    ],
                    "functions":[{"name":"mean"}],
                    "aggregateWindow":{"period":timeInterval}
                },
                "editMode":"builder",
                "text":query
            },
            "status":"active",
            "statusMessageTemplate":msg,
            "tags":[],
            "type":"threshold"
        }

        let config = new Config('post', this.address+'/checks', 'Token '+this.authToken, 'application/json', descriptionJson);
            
        return config.getObjConfig();
    }

}    