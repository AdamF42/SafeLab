
export class AuthorizationGenerator {
    descriptionJson: string;

    constructor(authDescription: string, orgID: string, bucketID: string, bucketName: string){
        this.descriptionJson = 
            `{
                "description": \"`+authDescription+`\",
                "status": "active",
                "orgID": \"`+orgID+`\",
                "permissions": [{
                        "action": "read",
                        "resource": {
                            "type": "buckets",
                            "id": \"`+bucketID+`\",
                            "name": \"`+bucketName+`\"
                        }
                    },
                    {
                        "action": "write",
                        "resource": {
                            "type": "buckets",
                            "id": \"`+bucketID+`\",
                            "name": \"`+bucketName+`\"
                        }
                    }
                ]
            }`; 
    }

    create(address: string, authToken: string) {
        return {
            method: 'post',
            url: address+'/authorizations',
            headers: { 
                'Authorization': 'Token '+authToken, 
                'Content-Type': 'application/json'
            },
            data : this.descriptionJson
        };
    }
}


