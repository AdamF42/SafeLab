import { Config } from "../config/config";
var axios = require('axios');

export class AlertGenerator {
    private address: string;
    private authToken: string;

    constructor(address: string, authToken: string){
        this.address = address;
        this.authToken = authToken;
    }

    async create(alert: AlertObject){
        return axios(this.getConfig(alert))
        .then(function(response){
            console.log(response.data.id)
            return Promise.resolve(response.data.id);
        })
        .catch(function (error) {
            console.log("ERROR IN CREATING ALERT");
            console.log(error.message);
            console.log(error.response.data.message);
        });
    }

    private getConfig(alert: AlertObject){
        let descriptionJson = {
            "description": alert.get_taskDescr(),
            "every": alert.get_timeInterval(),
            "name": alert.get_taskName(),
            "offset":"0s",
            "orgID": alert.get_orgID(),
            "ownerID": alert.get_ownerID(),
            "query":{
                "builderConfig":{
                    "buckets":[alert.get_bucketName()],
                    "tags":[
                        {
                            "key":"_measurement",
                            "values":[alert.get_valueToFilter()],
                            "aggregateFunctionType":"filter"
                        },
                        {
                            "key":"_field",
                            "values":["value"],
                            "aggregateFunctionType":"filter"
                        }
                    ],
                    "functions":[{"name":"median"}],
                    "aggregateWindow":{"period":alert.get_aggregateWindow()}
                },
                "editMode":"builder",
                "text":alert.get_query()
            },
            "status":"active",
            "statusMessageTemplate":alert.get_msg(),
            "tags":[],
            "type":"threshold",
            "thresholds": alert.get_thresholds(),
        }

        let config = new Config('post', this.address+'/checks', 'Token '+this.authToken, 'application/json', descriptionJson);
        
        return config.getObjConfig();
    }

}    


export class AlertObject{
    private taskName: string;
    private taskDescr: string; 
    private timeInterval: string; 
    private orgID: string; 
    private ownerID: string; 
    private bucketName: string; 
    private valueToFilter: string; 
    private aggregateWindow: string; 
    private query: string; 
    private msg: string; 
    private thresholds: object;


    constructor (
        taskName: string,
        taskDescr: string,
        timeInterval: string,
        orgID: string,
        ownerID: string,
        bucketName: string,
        valueToFilter: string,
        aggregateWindow: string,
        query: string,
        msg: string,
        thresholds: object
    ) 
    {
        this.taskName = taskName;
        this.taskDescr = taskDescr;
        this.timeInterval = timeInterval;  
        this.orgID = orgID;
        this.ownerID = ownerID;
        this.bucketName = bucketName;
        this.valueToFilter = valueToFilter;
        this.aggregateWindow = aggregateWindow;  
        this.query = query;
        this.msg = msg;
        this.thresholds = thresholds;
    }

    get_taskName() { return this.taskName}
    get_taskDescr() { return this.taskDescr}
    get_timeInterval() { return this.timeInterval}  
    get_orgID() { return this.orgID}
    get_ownerID() { return this.ownerID}
    get_bucketName() { return this.bucketName}
    get_valueToFilter() { return this.valueToFilter}
    get_aggregateWindow() { return this.aggregateWindow}  
    get_query() { return this.query}
    get_msg() { return this.msg}
    get_thresholds() { return this.thresholds}

}