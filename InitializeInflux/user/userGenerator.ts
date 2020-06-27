
export class UserGenerator {
    descriptionJson: string;
 
    constructor(userName: string){
        this.descriptionJson = 
            `{
                "name": \"`+userName+`\"
            }`;
    }

    create(address: string, authToken: string) {
        return {
            method: 'post',
            url: address+'/users',
            headers: { 
                'Authorization': 'Token '+authToken, 
                'Content-Type': 'application/json'
            },
            data : this.descriptionJson
        };
    }
}