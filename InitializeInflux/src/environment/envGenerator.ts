import { AuthorizationGenerator } from './authorization/authorizationGenerator';
import { BucketGenerator } from './bucket/bucketGenerator';
import { OrganizationGenerator } from './organization/organizationGenerator';
import { UserGenerator } from './user/userGenerator';

export class EnvGenerator {

    private orgID?: string;
    private userID?: string;
    private bucketID?: string;
    private authID?: string;
    private org: OrganizationGenerator;
    private user: UserGenerator;
    private bucket: BucketGenerator;
    private authorization: AuthorizationGenerator;

    constructor(address, authToken){
        this.org = new OrganizationGenerator(address, authToken);
        this.user = new UserGenerator(address, authToken);
        this.bucket = new BucketGenerator(address, authToken);
        this.authorization = new AuthorizationGenerator(address, authToken);
    }

    async createEnv(orgName: string, userName: string, bucketName: string, expireTime: number, authDescription: string){
        this.orgID = await this.org.create(orgName);
        this.userID = await this.user.create(userName);    
        this.org.addUser(this.userID, this.orgID);
        this.bucketID = await this.bucket.create(this.orgID, bucketName, expireTime);
        this.authID = await this.authorization.create(this.orgID, this.bucketID, authDescription);
    }

    get_orgID() { return this.orgID; }
    get_userID() { return this.userID; }

}