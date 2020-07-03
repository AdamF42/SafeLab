var axios = require('axios');
import { AuthorizationGenerator } from './authorization/authorizationGenerator';
import { BucketGenerator } from './bucket/bucketGenerator';
import { OrganizationGenerator } from './organization/organizationGenerator';
import { UserGenerator } from './user/userGenerator';
import { AlertGenerator } from './alert/alertGenerator';


var Args = process.argv.slice(2);

const authToken = Args[0]; //"60nvdyNBIb5nMBmg3RVNTdanrjUksYh7fGjlXYJ6Rg8dP4lesVV80XjNmWFIkvu9_FpHe3vyL2V5YhqBbav2Kw=="
const address = Args[1]; //"http://localhost:9999/api/v2"
const orgName = Args[2]; //"SuperCiccii";
const userName = Args[3]; //"Ciccioneeee";
const bucketName = Args[4]; //"Ciccio";
const expireTime = parseInt(Args[5]); //55032940;
const authDescription = Args[6]; //"ciccioAuth";



class StructureGenerator {

    private orgID?: string;
    private userID?: string;
    private bucketID?: string;
    private authID?: string;
    private org: OrganizationGenerator;
    private user: UserGenerator;
    private bucket: BucketGenerator;
    private authorization: AuthorizationGenerator;

    private alert: AlertGenerator;

    constructor(address, authToken){
        this.org = new OrganizationGenerator(address, authToken);
        this.user = new UserGenerator(address, authToken);
        this.bucket = new BucketGenerator(address, authToken);
        this.authorization = new AuthorizationGenerator(address, authToken);

        this.alert = new AlertGenerator(address, authToken);
    }

    async exec(orgName: string, userName: string, bucketName: string, expireTime: number, authDescription: string){
        this.orgID = await this.org.create(orgName);
        this.userID = await this.user.create(userName);    
        this.org.addUser(this.userID, this.orgID);
        this.bucketID = await this.bucket.create(this.orgID, bucketName, expireTime);
        this.authID = await this.authorization.create(this.orgID, this.bucketID, authDescription);
//    getConfig("TaskCiccio", "Task di ciccio", "30s", <orgID>, <usrID>, <buckName>, "time", "20s");

        let query = "from(bucket: \"test\")\n  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)\n  |> filter(fn: (r) => r[\"_measurement\"] == \"temp\")\n  |> filter(fn: (r) => r[\"_field\"] == \"value\")\n  |> aggregateWindow(every: 15s, fn: mean)\n  |> yield(name: \"mean\")";
        let msg = "Check: ${ r.ProvaCheck } is: ${ r._level }";

        let alertID = await this.alert.create("TaskCiccio", "Task di ciccio", "30s", this.orgID, this.userID, bucketName, "time", "20s", query, msg);
    }


}

const init = new StructureGenerator(address, authToken);
init.exec(orgName, userName, bucketName, expireTime, authDescription);