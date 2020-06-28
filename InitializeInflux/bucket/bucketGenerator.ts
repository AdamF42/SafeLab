
export class BucketGenerator {
    descriptionJson: string;
 
    constructor(bucketName: string, expireTime: number, orgID: string){
        this.descriptionJson = 
            `{
                "name": \"`+bucketName+`\",
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
}