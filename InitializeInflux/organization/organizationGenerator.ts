
export class OrganizationGenerator {
    descriptionJson: string;
 
    constructor(orgName: string){
        this.descriptionJson = 
            `{
                "name": \"`+orgName+`\",
                "status": "active"
            }`;
    }

    create(address: string, authToken: string) {
        return {
            method: 'post',
            url: address+'/orgs',
            headers: { 
                'Authorization': 'Token '+authToken, 
                'Content-Type': 'application/json'
            },
            data : this.descriptionJson
        };
    }

    adduser(userId: string, orgId: string, address: string, authToken: string){
        var userJson = JSON.stringify({"id":userId});
        return {
          method: 'post',
          url: address+'/orgs/'+orgId+'/members',
          headers: { 
            'Authorization': 'Token '+authToken, 
            'Content-Type': 'application/json', 
          },
          data : userJson
        };    

    }
}