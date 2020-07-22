var axios = require('axios');
import { EnvGenerator } from './environment/envGenerator'

var Args = process.argv.slice(2);

const authToken = Args[0];
const address = Args[1]; 
const orgName = Args[2]; 
const userName = Args[3]; 
const bucketName = Args[4]; 
const expireTime = parseInt(Args[5]); 
const authDescription = Args[6]; 

const env = new EnvGenerator(address, authToken);
env.createEnv(orgName, userName, bucketName, expireTime, authDescription);