var axios = require('axios');
import { AuthorizationGenerator } from './authorization/authorizationGenerator';
import { BucketGenerator } from './bucket/bucketGenerator';
import { OrganizationGenerator } from './organization/organizationGenerator';
import { UserGenerator } from './user/userGenerator';


var Args = process.argv.slice(2);

const authToken = Args[0]; //"60nvdyNBIb5nMBmg3RVNTdanrjUksYh7fGjlXYJ6Rg8dP4lesVV80XjNmWFIkvu9_FpHe3vyL2V5YhqBbav2Kw=="
const address = Args[1]; //"http://localhost:9999/api/v2"

const orgName = Args[2]; //"SuperCiccii";
var orgID;

const userName = Args[3]; //"Ciccioneeee";
var userID;

const bucketName = Args[4]; //"Ciccio";
const expireTime = parseInt(Args[5]); //55032940;
var bucketID;
  
const authDescription = Args[6]; //"ciccioAuth";
var authID;

const org = new OrganizationGenerator(orgName);
axios(org.create(address, authToken))
    .then(function(response){
        assignOrg(response);
        createUser(); 
        createBucket();
    })
    .catch(function (error) {
        console.log("ERROR IN CREATING ORG");
        console.log(error.message);
    });

function createUser(){
    const user = new UserGenerator(userName);
    axios(user.create(address, authToken))
        .then(function (response) {
            assignUser(response);
            addUserToOrg();
        })
        .catch(function (error) {
            console.log("ERROR IN CREATING USR");
            console.log(error);
        });      
}
    
function addUserToOrg() {
    axios(org.adduser(userID, orgID, address, authToken))
    console.log("User "+userID+"added to org"+orgID);
}

function createBucket(){
    const bucket = new BucketGenerator(bucketName, expireTime, orgID);
    axios(bucket.create(address, authToken))
        .then(function (response) {
            assignBucket(response);
            createAuthorization();
        })
        .catch(function (error) {
            console.log("ERROR IN CREATING BUCKET");
            console.log(error);
            throw error;
        });
}

function createAuthorization(){
     const authorization = new AuthorizationGenerator(authDescription, orgID, bucketID, bucketName);
     axios(authorization.create(address, authToken))
        .then(function(response) {
            assignAuth(response)            
        })
        .catch(function (error) {
            console.log("ERROR CREATING AUTHORIZATION");
            console.log(error);
            throw error;
        });
}

function assignOrg(response){
    console.log("Org Id: "+ response.data.id)
    orgID = response.data.id;  
}

function assignUser(response){
    console.log("Usr Id: "+ response.data.id)
    userID = response.data.id;
}

function assignBucket(response){
    console.log("Buck Id: "+ response.data.id)
    bucketID = response.data.id;  
}

function assignAuth(response){
    console.log("Auth Id: "+ response.data.id)
    authID = response.data.id; 
}