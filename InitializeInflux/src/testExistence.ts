var axios = require('axios');

var Args = process.argv.slice(2);

const token = Args[0]; 
const address = Args[1]; 

const orgName = Args[2]; 
const userName = Args[3];
const bucketName = Args[4]; 
const alertName = Args[5];


axios(getConfig('/orgs'))
.then(function (response) {
  response.data.orgs.forEach(element => checkUsage(element, orgName));
  console.log("Name for org is okay");
})
.catch(function (error) {
  if (error == "name used") {
    console.log("Cannot create org because org name is already in use")
  } else {
    throw(error)
  }
});


axios(getConfig('/users'))
.then(function (response) {
  response.data.users.forEach(element => checkUsage(element, userName));
  console.log("Name for usr is okay");
})
.catch(function (error) {
  if (error == "name used") {
    console.log("Cannot create usr because usr name is already in use")
  } else {
    throw(error)
  }
});


axios(getConfig('/buckets'))
.then(function (response) {
  response.data.buckets.forEach(element => checkUsage(element, bucketName));
  console.log("Name for bucket is okay");
})
.catch(function (error) {
  if (error == "name used") {
    console.log("Cannot create bucket because bucket name is already in use")
  } else {
    throw(error)
  }
});

axios(getConfig('/checks'))
.then(function (response) {
  response.data.checks.forEach(element => checkUsage(element, alertName));
  console.log("Name for alert is okay");
})
.catch(function (error) {
  if (error == "name used") {
    console.log("Cannot create alert because alert name is already in use")
  } else {
    throw(error)
  }
});

function checkUsage(element, name: string){
  if (!name.localeCompare(element.name)) {
    throw "name used";
  }
}


function getConfig(argument){
  return {
    method: 'get',
    url: address+argument,
    headers: { 
      'Authorization': 'Token '+token
    }
  }
}