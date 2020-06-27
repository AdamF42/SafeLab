
export class BucketGenerator {
    descriptionJson: string;
 
    constructor(bucketName: string, expireTime: number, orgID: string, bucketDescription: string = ""){
        this.descriptionJson = 
            `{
                "name": \"`+bucketName+`\",
                "description": \"`+bucketDescription+`\",
                "orgID": \"`+orgID+`\",
                "retentionRules": [{
                    "type": "expire",
                    "everySeconds": `+expireTime+`
                }]
            }`;
    }

    create(address: string, authToken: string) {
        return {
            method: 'post',
            url: address+'/buckets',
            headers: { 
                'Authorization': 'Token '+authToken, 
                'Content-Type': 'application/json'
            },
            data : this.descriptionJson
        };
    }

    // delete(address: string, bucketID: string) {
    //     return {
    //         method: 'delete',
    //         url: address+'/buckets/'+bucketID,
    //         headers: { 
    //           'Zap-Trace-Span': '<string>'
    //         }
    //     };
    // }
}