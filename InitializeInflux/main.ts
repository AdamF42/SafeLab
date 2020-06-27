var axios = require('axios');
import { AuthorizationGenerator } from './authorization/authorizationGenerator';
import { BucketGenerator } from './bucket/bucketGenerator';
import { OrganizationGenerator } from './organization/organizationGenerator';
import { UserGenerator } from './user/userGenerator';


const authToken = "60nvdyNBIb5nMBmg3RVNTdanrjUksYh7fGjlXYJ6Rg8dP4lesVV80XjNmWFIkvu9_FpHe3vyL2V5YhqBbav2Kw=="
const address = "http://localhost:9999/api/v2"

const orgName = "SuperCiccii";
const orgDescription = "";
var orgID;

const userName = "Ciccioneeee";
var userID;

const bucketName = "Ciccio";
const bucketDescription = "";
const expireTime = 55032940;
var bucketID;
  
const authDescription = "ciccioAuth";
var authID;

const org = new OrganizationGenerator(orgName, orgDescription);
axios(org.create(address, authToken))
    .then(function(response){
        assignOrg(response);
        createUser(); 
        createBucket();
    })
    .catch(function (error) {
        console.log("ERROR IN CREATING ORG");
        console.log(error);
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
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });    
}

function createBucket(){
    const bucket = new BucketGenerator(bucketName, expireTime, orgID, bucketDescription);
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
    console.log("ORG RESPONSE");
    console.log(JSON.stringify(response.data));
    orgID = response.data.id;  
}

function assignUser(response){
    console.log("USER RESPONSE");
    console.log(JSON.stringify(response.data));
    userID = response.data.id;
}

function assignBucket(response){
    console.log("BUCKET RESPONSE");
    console.log(JSON.stringify(response.data));
    bucketID = response.data.id;  
}

function assignAuth(response){
    console.log("AUTHORIZATION RESPONSE");
    console.log(JSON.stringify(response.data));
    authID = response.data.id; 
}